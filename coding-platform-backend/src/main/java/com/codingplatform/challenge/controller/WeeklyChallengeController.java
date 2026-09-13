package com.codingplatform.challenge.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codingplatform.challenge.dto.WeeklyChallengeResponse;
import com.codingplatform.challenge.service.WeeklyChallengeService;
import com.codingplatform.common.ApiResponse;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/challenges/weekly")
@RequiredArgsConstructor
public class WeeklyChallengeController {
    private final WeeklyChallengeService challengeService;

    @GetMapping
    public ApiResponse<List<WeeklyChallengeResponse>> getSchedule() {
        return ApiResponse.ok(challengeService.getSchedule());
    }

    @PutMapping("/{dayOfWeek}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<WeeklyChallengeResponse> assign(@PathVariable int dayOfWeek,
            @RequestBody @NotNull AssignChallengeRequest request) {
        return ResponseEntity.ok(challengeService.assign(dayOfWeek, request.problemId()));
    }

    @DeleteMapping("/{dayOfWeek}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> clear(@PathVariable int dayOfWeek) {
        challengeService.clear(dayOfWeek);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    public record AssignChallengeRequest(@NotNull Long problemId) {}
}
