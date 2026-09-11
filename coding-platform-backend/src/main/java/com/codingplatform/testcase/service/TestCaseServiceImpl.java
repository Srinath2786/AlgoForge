package com.codingplatform.testcase.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.codingplatform.exception.ResourceNotFoundException;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.testcase.dto.TestCaseDto;
import com.codingplatform.testcase.dto.TestCaseRequest;
import com.codingplatform.testcase.entity.TestCase;
import com.codingplatform.testcase.mapper.TestCaseMapper;
import com.codingplatform.testcase.repository.TestCaseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestCaseServiceImpl implements TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseMapper testCaseMapper;

    @Override
    public List<TestCaseDto> getVisibleByProblem(Long problemId) {
        return testCaseRepository.findByProblemIdAndHiddenFalse(problemId).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public List<TestCaseDto> getAllByProblem(Long problemId) {
        return testCaseRepository.findByProblemId(problemId).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public TestCaseDto create(TestCaseRequest request) {
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + request.getProblemId()));
        TestCase testCase = new TestCase();
        testCase.setProblem(problem);
        applyFields(testCase, request);
        return toDto(testCaseRepository.save(testCase));
    }

    @Override
    public TestCaseDto update(Long problemId, Long id, TestCaseRequest request) {
        TestCase testCase = testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with id: " + id));
        if (!testCase.getProblem().getId().equals(problemId)) {
            throw new ResourceNotFoundException(
                    "Test case not found with id: " + id + " for problem id: " + problemId);
        }
        applyFields(testCase, request);
        return toDto(testCaseRepository.save(testCase));
    }

    @Override
    public void delete(Long problemId, Long id) {
        TestCase testCase = testCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test case not found with id: " + id));
        if (!testCase.getProblem().getId().equals(problemId)) {
            throw new ResourceNotFoundException(
                    "Test case not found with id: " + id + " for problem id: " + problemId);
        }
        testCaseRepository.delete(testCase);
    }

    private void applyFields(TestCase testCase, TestCaseRequest request) {
        testCase.setInput(request.getInput());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setDescription(request.getDescription());
        testCase.setHidden(request.isHidden());
        testCase.setTimeLimitMs(request.getTimeLimitMs() != null ? request.getTimeLimitMs() : 5000);
    }

    private TestCaseDto toDto(TestCase tc) {
        return testCaseMapper.toDto(tc);
    }
}
