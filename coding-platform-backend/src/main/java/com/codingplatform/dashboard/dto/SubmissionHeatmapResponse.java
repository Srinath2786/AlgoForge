package com.codingplatform.dashboard.dto;

import java.time.LocalDate;

public record SubmissionHeatmapResponse(
        LocalDate date,
        long count
) {}
