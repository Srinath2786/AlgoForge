package com.codingplatform.problem.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.codingplatform.problem.dto.ProblemRequest;
import com.codingplatform.problem.dto.ProblemResponse;
import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.mapper.ProblemMapper;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.testcase.dto.TestCaseDto;
import com.codingplatform.testcase.mapper.TestCaseMapper;
import com.codingplatform.testcase.repository.TestCaseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final ProblemMapper problemMapper;
    private final TestCaseMapper testCaseMapper;

    @Override
    public ProblemResponse createProblem(ProblemRequest request) {
        Problem problem = new Problem();
        applyProblemFields(problem, request);
        Problem savedProblem = problemRepository.save(problem);
        return convertToResponse(savedProblem);
    }

    @Override
    public List<ProblemResponse> getAllProblems() {
        return problemRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public Page<ProblemResponse> searchProblems(String search, Difficulty difficulty, Pageable pageable) {
        Page<Problem> page;

        String normalized = search == null ? "" : search.trim();
        boolean hasSearch = !normalized.isEmpty();
        boolean hasDifficulty = difficulty != null;

        if (hasSearch && hasDifficulty) {
            page = problemRepository.findByTitleContainingIgnoreCaseAndDifficulty(normalized, difficulty, pageable);
        } else if (hasSearch) {
            page = problemRepository.findByTitleContainingIgnoreCase(normalized, pageable);
        } else if (hasDifficulty) {
            page = problemRepository.findByDifficulty(difficulty, pageable);
        } else {
            page = problemRepository.findAll(pageable);
        }

        return page.map(this::convertToResponse);
    }

    @Override
    public ProblemResponse getProblemById(Long id) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + id));
        return convertToResponse(problem);
    }

    @Override
    public ProblemResponse updateProblem(Long id, ProblemRequest request) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + id));
        applyProblemFields(problem, request);
        Problem updatedProblem = problemRepository.save(problem);
        return convertToResponse(updatedProblem);
    }

    @Override
    public void deleteProblem(Long id) {
        if (!problemRepository.existsById(id)) {
            throw new RuntimeException("Problem not found with id: " + id);
        }
        problemRepository.deleteById(id);
    }

    private void applyProblemFields(Problem problem, ProblemRequest request) {
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setTopic(request.getTopic());
        problem.setConstraints(request.getConstraints());
        problem.setExamples(request.getExamples());
        problem.setTags(request.getTags());
        problem.setStarterCodeJava(request.getStarterCodeJava());
        problem.setStarterCodePython(request.getStarterCodePython());
        problem.setStarterCodeCpp(request.getStarterCodeCpp());
        problem.setStarterCodeJavascript(request.getStarterCodeJavascript());
        problem.setEditorial(request.getEditorial());
        problem.setHints(request.getHints());
        problem.setEditorialUnlockAttempts(
                request.getEditorialUnlockAttempts() != null ? request.getEditorialUnlockAttempts() : 3
        );
    }

    private ProblemResponse convertToResponse(Problem problem) {
        // Public problem responses must never expose judge-only hidden test cases.
        List<TestCaseDto> testCases = testCaseRepository.findByProblemIdAndHiddenFalse(problem.getId()).stream()
                .map(testCaseMapper::toDto)
                .toList();

        return problemMapper.toResponse(problem, testCases);
    }
}
