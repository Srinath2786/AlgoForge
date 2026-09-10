package com.codingplatform.dashboard.dto;

import java.util.List;

public record ActivityMonthSummary(
        String monthKey,
        String label,
        long totalSubmissions,
        long acceptedSubmissions,
        long problemsSolved,
        long activeDays,
        List<ActivityWeekSummary> weeks
) {}
