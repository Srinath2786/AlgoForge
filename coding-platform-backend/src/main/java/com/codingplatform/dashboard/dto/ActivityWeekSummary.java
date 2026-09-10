package com.codingplatform.dashboard.dto;

import java.util.List;

public record ActivityWeekSummary(
        int weekNumber,
        String label,
        long totalSubmissions,
        long acceptedSubmissions,
        long problemsSolved,
        long activeDays,
        List<ActivityDaySummary> days
) {}
