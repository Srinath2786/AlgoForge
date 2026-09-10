package com.codingplatform.hint.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codingplatform.common.ApiResponse;
import com.codingplatform.hint.dto.EditorialResponse;
import com.codingplatform.hint.dto.HintResponse;
import com.codingplatform.hint.service.HintService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/problems/{problemId}")
@RequiredArgsConstructor
@Tag(name = "Hints", description = "Problem hints and editorial unlocks")
public class HintController {

    private final HintService hintService;

    @GetMapping("/hints")
    public ApiResponse<HintResponse> getHints(@PathVariable Long problemId) {
        return ApiResponse.ok(hintService.getHints(problemId));
    }

    @GetMapping("/editorial")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<EditorialResponse> getEditorial(
            @PathVariable Long problemId,
            @AuthenticationPrincipal UserDetails principal) {
        return ApiResponse.ok(hintService.getEditorial(problemId, principal.getUsername()));
    }
}
