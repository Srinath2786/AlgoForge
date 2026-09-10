package com.codingplatform.dashboard.dto;

import java.time.LocalDate;

public record ActivityDaySummary(
        LocalDate date,
        String label,
        long totalSubmissions,
        long acceptedSubmissions,
        long problemsSolved,
        long totalCodingActivity
) {}
