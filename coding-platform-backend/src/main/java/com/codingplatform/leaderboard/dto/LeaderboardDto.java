package com.codingplatform.leaderboard.dto;

public record LeaderboardDto(
        Long userId,
        String username,
        int solvedCount,
        int totalSubmissions,
        double acceptanceRate,
        double score,
        Integer rank
) {}
