package com.codingplatform.challenge.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingplatform.challenge.dto.WeeklyChallengeResponse;
import com.codingplatform.challenge.entity.WeeklyChallenge;
import com.codingplatform.challenge.repository.WeeklyChallengeRepository;
import com.codingplatform.exception.ResourceNotFoundException;
import com.codingplatform.problem.dto.ProblemResponse;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.mapper.ProblemMapper;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.testcase.repository.TestCaseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WeeklyChallengeServiceImpl implements WeeklyChallengeService {
    private final WeeklyChallengeRepository challengeRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final ProblemMapper problemMapper;

    @Override
    public List<WeeklyChallengeResponse> getSchedule() {
        return challengeRepository.findAllByOrderByDayOfWeekAsc().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public WeeklyChallengeResponse assign(int dayOfWeek, Long problemId) {
        validateDay(dayOfWeek);
        Problem problem = problemRepository.findById(problemId)
            .orElseThrow(() -> new ResourceNotFoundException("Problem not found: " + problemId));
        WeeklyChallenge challenge = challengeRepository.findByDayOfWeek(dayOfWeek).orElseGet(WeeklyChallenge::new);
        challenge.setDayOfWeek(dayOfWeek);
        challenge.setProblem(problem);
        return toResponse(challengeRepository.save(challenge));
    }

    @Override
    @Transactional
    public void clear(int dayOfWeek) {
        validateDay(dayOfWeek);
        challengeRepository.findByDayOfWeek(dayOfWeek).ifPresent(challengeRepository::delete);
    }

    private WeeklyChallengeResponse toResponse(WeeklyChallenge challenge) {
        ProblemResponse problem = problemMapper.toResponse(challenge.getProblem(),
            testCaseRepository.findByProblemIdAndHiddenFalse(challenge.getProblem().getId()).stream()
                .map(testCase -> new com.codingplatform.testcase.dto.TestCaseDto(testCase.getId(), testCase.getInput(),
                    testCase.getExpectedOutput(), testCase.isHidden(), testCase.getDescription(), testCase.getTimeLimitMs()))
                .toList());
        return new WeeklyChallengeResponse(challenge.getDayOfWeek(), problem);
    }

    private void validateDay(int dayOfWeek) {
        if (dayOfWeek < 0 || dayOfWeek > 6) throw new IllegalArgumentException("dayOfWeek must be between 0 and 6");
    }
}
