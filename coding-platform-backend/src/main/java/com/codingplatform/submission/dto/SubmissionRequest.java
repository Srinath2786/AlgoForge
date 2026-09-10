package com.codingplatform.submission.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubmissionRequest(
        @NotNull(message = "Problem ID is required") Long problemId,
        @NotBlank(message = "Programming language is required") String language,
        @NotBlank(message = "Source code is required") String sourceCode,
        boolean sampleRunOnly
) {}
