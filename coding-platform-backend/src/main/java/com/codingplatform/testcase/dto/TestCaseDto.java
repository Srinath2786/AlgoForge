package com.codingplatform.testcase.dto;

import jakarta.validation.constraints.NotBlank;

public record TestCaseDto(
        Long id,
        @NotBlank String input,
        @NotBlank String expectedOutput,
        boolean hidden,
        String description,
        Integer timeLimitMs
) {}
