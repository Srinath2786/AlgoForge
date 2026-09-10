package com.codingplatform.dashboard.dto;

public record LanguageUsageResponse(
        String language,
        Long submissionCount
) {}
