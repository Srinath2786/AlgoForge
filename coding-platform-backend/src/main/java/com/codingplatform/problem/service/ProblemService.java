package com.codingplatform.problem.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.codingplatform.problem.dto.ProblemRequest;
import com.codingplatform.problem.dto.ProblemResponse;
import com.codingplatform.problem.entity.Difficulty;

public interface ProblemService {

    ProblemResponse createProblem(ProblemRequest request);

    List<ProblemResponse> getAllProblems();

    Page<ProblemResponse> searchProblems(String search, Difficulty difficulty, Pageable pageable);

    ProblemResponse getProblemById(Long id);

    ProblemResponse updateProblem(Long id, ProblemRequest request);

    void deleteProblem(Long id);
}
