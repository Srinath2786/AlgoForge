package com.codingplatform.leaderboard.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codingplatform.common.ApiResponse;
import com.codingplatform.leaderboard.dto.LeaderboardDto;
import com.codingplatform.leaderboard.service.LeaderboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@Tag(name = "Leaderboard", description = "Platform-wide user rankings")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    @Operation(
        summary = "Get global leaderboard",
        description = "Returns the global platform leaderboard ranked by solved problems and score. Public endpoint for the leaderboard page."
    )
    public ApiResponse<Page<LeaderboardDto>> getLeaderboard(@PageableDefault(size = 50) Pageable pageable) {
        return ApiResponse.ok(leaderboardService.getLeaderboard(pageable));
    }
}
