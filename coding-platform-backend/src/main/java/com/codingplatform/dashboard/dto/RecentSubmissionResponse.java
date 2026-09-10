package com.codingplatform.dashboard.dto;

import java.time.LocalDateTime;

import com.codingplatform.submission.entity.SubmissionStatus;

public record RecentSubmissionResponse(
        Long submissionId,
        Long problemId,
        String problemTitle,
        String language,
        SubmissionStatus status,
        Long executionTimeMs,
        LocalDateTime submittedAt
) {}
