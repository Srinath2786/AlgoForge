package com.codingplatform.dashboard.dto;

public record DashboardSummaryResponse(
        long totalProblemsSolved,
        long easyProblemsSolved,
        long mediumProblemsSolved,
        long hardProblemsSolved,
        long totalSubmissions,
        long acceptedSubmissions,
        double successRate
) {}
