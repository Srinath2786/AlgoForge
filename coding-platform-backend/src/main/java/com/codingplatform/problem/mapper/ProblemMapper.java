package com.codingplatform.problem.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.codingplatform.problem.dto.ProblemResponse;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.testcase.dto.TestCaseDto;

@Component
public class ProblemMapper {

    public ProblemResponse toResponse(Problem problem, List<TestCaseDto> visibleTestCases) {
        return new ProblemResponse(
                problem.getId(),
                problem.getTitle(),
                problem.getDescription(),
                problem.getConstraints(),
                problem.getExamples(),
                problem.getDifficulty(),
                problem.getTopic(),
                problem.getTags(),
                visibleTestCases,
                problem.getCreatedAt(),
                problem.getStarterCodeJava(),
                problem.getStarterCodePython(),
                problem.getStarterCodeCpp(),
                problem.getStarterCodeJavascript(),
                problem.getEditorial(),
                problem.getHints(),
                problem.getEditorialUnlockAttempts()
        );
    }
}
