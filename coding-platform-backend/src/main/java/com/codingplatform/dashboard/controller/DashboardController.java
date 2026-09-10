package com.codingplatform.dashboard.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codingplatform.dashboard.dto.CodingActivityResponse;
import com.codingplatform.dashboard.dto.DashboardResponse;
import com.codingplatform.dashboard.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboard());
    }

    @GetMapping("/activity")
    public ResponseEntity<CodingActivityResponse> getCodingActivity() {
        return ResponseEntity.ok(dashboardService.getCodingActivity());
    }
}
