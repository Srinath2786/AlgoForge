package com.codingplatform.submission.service;

import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingplatform.exception.BadRequestException;
import com.codingplatform.exception.RateLimitExceededException;
import com.codingplatform.exception.ResourceNotFoundException;
import com.codingplatform.execution.CodeExecutionService;
import com.codingplatform.execution.CompilationResult;
import com.codingplatform.execution.ExecutionResult;
import com.codingplatform.execution.OutputComparator;
import com.codingplatform.leaderboard.service.LeaderboardService;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.submission.dto.SubmissionRequest;
import com.codingplatform.submission.dto.SubmissionResponse;
import com.codingplatform.submission.entity.Submission;
import com.codingplatform.submission.entity.ProgrammingLanguage;
import com.codingplatform.submissionresult.entity.TestCaseStatus;
import com.codingplatform.submissionresult.service.SubmissionResultService;
import com.codingplatform.submission.entity.SubmissionStatus;
import com.codingplatform.submission.repository.SubmissionRepository;
import com.codingplatform.submissionresult.repository.SubmissionResultRepository;
import com.codingplatform.testcase.entity.TestCase;
import com.codingplatform.testcase.repository.TestCaseRepository;
import com.codingplatform.user.entity.AppUser;
import com.codingplatform.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionResultRepository submissionResultRepository;
    private final SubmissionResultService submissionResultService;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final CodeExecutionService codeExecutionService;
    private final OutputComparator outputComparator;
    private final LeaderboardService leaderboardService;

    @Value("${execution.rate-limit.max-submissions-per-minute:5}")
    private int maxSubmissionsPerMinute;

    private static final List<String> SUPPORTED_LANGUAGES = List.of("java", "python", "cpp", "javascript");

    @Override
    @Transactional
    public SubmissionResponse submit(SubmissionRequest request, String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Problem problem = problemRepository.findById(request.problemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found: " + request.problemId()));

        String language = request.language().toLowerCase();
        if (!SUPPORTED_LANGUAGES.contains(language)) {
            throw new BadRequestException("Unsupported language: " + request.language());
        }

        if (!request.sampleRunOnly()) {
            enforceRateLimit(user.getId(), problem.getId());
        }

        List<TestCase> testCases = request.sampleRunOnly()
                ? testCaseRepository.findByProblemIdAndHiddenFalse(problem.getId())
                : testCaseRepository.findByProblemId(problem.getId());

        if (testCases.isEmpty()) {
            throw new BadRequestException("This problem has no test cases configured yet");
        }

        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .language(ProgrammingLanguage.valueOf(language.toUpperCase()))
                .sourceCode(request.sourceCode())
                .status(SubmissionStatus.RUNNING)
                .submittedAt(LocalDateTime.now())
                .build();

        if (!request.sampleRunOnly()) {
            submission = submissionRepository.save(submission);
        }

        EvaluationOutcome outcome = evaluateSubmission(language, request.sourceCode(), testCases);

        submission.setStatus(outcome.overallStatus());
        submission.setCompilerOutput(outcome.compilationError());
        submission.setExecutionTimeMs(Math.round(outcome.totalTimeMs()));

        List<SubmissionResponse.TestCaseResultDto> resultDtos = new ArrayList<>();

        if (!request.sampleRunOnly()) {
            final Submission savedSubmission = submissionRepository.save(submission);
            for (EvaluationOutcome.CaseResult cr : outcome.caseResults()) {
                submissionResultService.saveResult(
                        savedSubmission,
                        cr.testCase(),
                        toTestCaseStatus(cr.status()),
                        cr.actualOutput(),
                        cr.executionTimeMs(),
                        null,
                        cr.error());
                resultDtos.add(toResultDto(cr));
            }

            leaderboardService.refreshEntry(user, outcome.overallStatus() == SubmissionStatus.ACCEPTED);

            return toResponse(savedSubmission, resultDtos);
        } else {
            for (EvaluationOutcome.CaseResult cr : outcome.caseResults()) {
                resultDtos.add(toResultDto(cr));
            }
            return toResponse(submission, resultDtos);
        }
    }

    @Override
    public SubmissionResponse getById(Long submissionId, String username) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found: " + submissionId));

        if (!submission.getUser().getUsername().equals(username)) {
            throw new BadRequestException("You do not have access to this submission");
        }

        List<SubmissionResponse.TestCaseResultDto> results = submissionResultRepository
                .findBySubmissionIdOrderByIdAsc(submissionId).stream()
                .map(sr -> new SubmissionResponse.TestCaseResultDto(
                        sr.getTestCase().getId(), sr.getTestCase().isHidden(), sr.getStatus().name(),
                        sr.getTestCase().isHidden() ? null : sr.getTestCase().getExpectedOutput(),
                        sr.getActualOutput(), sr.getErrorMessage(), sr.getExecutionTimeMs()))
                .toList();

        return toResponse(submission, results);
    }

    @Override
    public Page<SubmissionResponse> getMySubmissions(String username, Pageable pageable) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        return submissionRepository.findByUserIdOrderBySubmittedAtDesc(user.getId(), pageable)
                .map(s -> toResponse(s, null));
    }

    @Override
    public List<Long> getSolvedProblemIds(String username) {
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return submissionRepository.findDistinctSolvedProblemIdsByUserId(user.getId());
    }

    private void enforceRateLimit(Long userId, Long problemId) {
        long recentCount = submissionRepository.countByUserIdAndProblemIdAndSubmittedAtAfter(
                userId, problemId, LocalDateTime.now().minusMinutes(1));
        if (recentCount >= maxSubmissionsPerMinute) {
            throw new RateLimitExceededException(
                    "Submission rate limit exceeded: max " + maxSubmissionsPerMinute + " per problem per minute");
        }
    }

    /**
     * Compiles once, then runs the compiled program against every test case,
     * short-circuiting the "first failing case decides the final verdict"
     * behaviour typical of online judges while still recording every case.
     */
    private EvaluationOutcome evaluateSubmission(String language, String sourceCode, List<TestCase> testCases) {
        Path workDir = null;
        try {
            workDir = codeExecutionService.prepareSandbox();
            CompilationResult compilationResult = codeExecutionService.compile(language, sourceCode, workDir);

            if (!compilationResult.success()) {
                return EvaluationOutcome.compilationFailure(compilationResult.errorOutput());
            }

            List<EvaluationOutcome.CaseResult> caseResults = new ArrayList<>();
            SubmissionStatus overall = SubmissionStatus.ACCEPTED;
            double totalTime = 0;

            for (TestCase tc : testCases) {
                ExecutionResult exec = codeExecutionService.execute(language, workDir, tc.getInput());
                totalTime += exec.executionTimeMs();

                SubmissionStatus caseStatus;
                String error = null;

                if (exec.timedOut()) {
                    caseStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
                } else if (exec.memoryExceeded()) {
                    caseStatus = SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
                } else if (exec.exitCode() != 0) {
                    caseStatus = SubmissionStatus.RUNTIME_ERROR;
                    error = exec.stderr();
                } else if (outputComparator.matches(exec.stdout(), tc.getExpectedOutput())) {
                    caseStatus = SubmissionStatus.ACCEPTED;
                } else {
                    caseStatus = SubmissionStatus.WRONG_ANSWER;
                }

                if (caseStatus != SubmissionStatus.ACCEPTED && overall == SubmissionStatus.ACCEPTED) {
                    overall = caseStatus;
                }

                caseResults.add(new EvaluationOutcome.CaseResult(
                        tc, exec.stdout(), caseStatus, error, exec.executionTimeMs()));
            }

            return new EvaluationOutcome(overall, null, caseResults, totalTime);

        } catch (Exception e) {
            log.error("Evaluation pipeline failed", e);
            return EvaluationOutcome.compilationFailure("Internal sandbox error: " + e.getMessage());
        } finally {
            codeExecutionService.teardownSandbox(workDir);
        }
    }

    private SubmissionResponse.TestCaseResultDto toResultDto(EvaluationOutcome.CaseResult cr) {
        return new SubmissionResponse.TestCaseResultDto(
                cr.testCase().getId(), cr.testCase().isHidden(), cr.status().name(),
                cr.testCase().isHidden() ? null : cr.testCase().getExpectedOutput(),
                cr.actualOutput(), cr.error(), cr.executionTimeMs());
    }

    private TestCaseStatus toTestCaseStatus(SubmissionStatus status) {
        return switch (status) {
            case ACCEPTED -> TestCaseStatus.PASSED;
            case WRONG_ANSWER, COMPILATION_ERROR -> TestCaseStatus.FAILED;
            case TIME_LIMIT_EXCEEDED -> TestCaseStatus.TIME_LIMIT_EXCEEDED;
            case MEMORY_LIMIT_EXCEEDED -> TestCaseStatus.MEMORY_LIMIT_EXCEEDED;
            case RUNTIME_ERROR -> TestCaseStatus.RUNTIME_ERROR;
            default -> TestCaseStatus.FAILED;
        };
    }

    private SubmissionResponse toResponse(Submission s, List<SubmissionResponse.TestCaseResultDto> results) {
        return new SubmissionResponse(s.getId(), s.getProblem().getId(), s.getLanguage().name().toLowerCase(),
                s.getStatus().name(), s.getExecutionTimeMs(), s.getMemoryUsedKb(), s.getCompilerOutput(),
                results, s.getSubmittedAt());
    }

    /** Internal aggregate of one evaluation run; not exposed outside this service. */
    private record EvaluationOutcome(
            SubmissionStatus overallStatus,
            String compilationError,
            List<CaseResult> caseResults,
            double totalTimeMs
    ) {
        static EvaluationOutcome compilationFailure(String error) {
            return new EvaluationOutcome(SubmissionStatus.COMPILATION_ERROR, error, List.of(), 0);
        }

        record CaseResult(TestCase testCase, String actualOutput, SubmissionStatus status,
                           String error, long executionTimeMs) {}
    }
}
