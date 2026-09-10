package com.codingplatform.dashboard.dto;

import java.util.List;

public record DashboardResponse(
        DashboardSummaryResponse summary,
        List<LanguageUsageResponse> languageUsage,
        List<RecentSubmissionResponse> recentSubmissions,
        List<SubmissionHeatmapResponse> submissionHeatmap,
        Integer currentRank
) {}
