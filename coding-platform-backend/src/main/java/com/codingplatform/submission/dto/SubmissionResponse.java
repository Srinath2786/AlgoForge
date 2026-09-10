package com.codingplatform.submission.dto;

import java.time.LocalDateTime;
import java.util.List;

public record SubmissionResponse(
        Long id,
        Long problemId,
        String language,
        String status,
        Long executionTimeMs,
        Long memoryUsedKb,
        String compilerOutput,
        List<TestCaseResultDto> testCaseResults,
        LocalDateTime submittedAt
) {
    public record TestCaseResultDto(
            Long testCaseId,
            boolean hidden,
            String status,
            String expectedOutput,
            String actualOutput,
            String error,
            Long executionTimeMs
    ) {}
}
