package com.codingplatform.dashboard.dto;

import java.util.List;

public record CodingActivityResponse(
        List<ActivityMonthSummary> months
) {}
