package com.codingplatform.submissionresult.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.codingplatform.submission.entity.Submission;
import com.codingplatform.submissionresult.dto.SubmissionResultResponse;
import com.codingplatform.submissionresult.entity.SubmissionResult;
import com.codingplatform.submissionresult.entity.TestCaseStatus;
import com.codingplatform.submissionresult.repository.SubmissionResultRepository;
import com.codingplatform.testcase.entity.TestCase;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubmissionResultService {

    private final SubmissionResultRepository submissionResultRepository;

    public SubmissionResult saveResult(Submission submission, TestCase testCase, TestCaseStatus status,
            String actualOutput, Long executionTimeMs, Long memoryUsedKb, String errorMessage) {
        SubmissionResult result = new SubmissionResult();
        result.setSubmission(submission);
        result.setTestCase(testCase);
        result.setStatus(status);
        result.setActualOutput(actualOutput);
        result.setExecutionTimeMs(executionTimeMs);
        result.setMemoryUsedKb(memoryUsedKb);
        result.setErrorMessage(errorMessage);
        return submissionResultRepository.save(result);
    }

    public List<SubmissionResultResponse> getResultsBySubmissionId(Long submissionId) {
        return submissionResultRepository.findBySubmissionIdOrderByIdAsc(submissionId).stream()
                .map(this::convertToResponse)
                .toList();
    }

    private SubmissionResultResponse convertToResponse(SubmissionResult result) {
        return new SubmissionResultResponse(result.getId(), result.getTestCase().getId(), result.getStatus(),
                result.getActualOutput(), result.getExecutionTimeMs(), result.getMemoryUsedKb(),
                result.getErrorMessage());
    }
}
