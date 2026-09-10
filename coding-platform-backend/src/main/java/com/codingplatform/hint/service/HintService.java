package com.codingplatform.hint.service;

import org.springframework.stereotype.Service;

import com.codingplatform.exception.ResourceNotFoundException;
import com.codingplatform.hint.dto.EditorialResponse;
import com.codingplatform.hint.dto.HintResponse;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.submission.entity.SubmissionStatus;
import com.codingplatform.submission.repository.SubmissionRepository;
import com.codingplatform.user.entity.AppUser;
import com.codingplatform.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HintService {

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public HintResponse getHints(Long problemId) {
        Problem problem = findProblem(problemId);
        return new HintResponse(problem.getId(), problem.getHints());
    }

    public EditorialResponse getEditorial(Long problemId, String username) {
        Problem problem = findProblem(problemId);
        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        int attemptsRequired = problem.getEditorialUnlockAttempts() != null
                ? problem.getEditorialUnlockAttempts()
                : 3;
        int attemptsUsed = Math.toIntExact(submissionRepository.countByUserIdAndProblemId(user.getId(), problemId));
        boolean solved = submissionRepository.existsByUserIdAndProblemIdAndStatus(
                user.getId(), problemId, SubmissionStatus.ACCEPTED);
        boolean unlocked = solved || attemptsUsed >= attemptsRequired;

        return new EditorialResponse(
                problem.getId(),
                unlocked,
                attemptsUsed,
                attemptsRequired,
                unlocked ? problem.getEditorial() : null);
    }

    private Problem findProblem(Long problemId) {
        return problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
    }
}
