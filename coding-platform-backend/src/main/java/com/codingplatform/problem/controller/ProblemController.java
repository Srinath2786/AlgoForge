package com.codingplatform.problem.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codingplatform.common.ApiResponse;
import com.codingplatform.problem.dto.ProblemRequest;
import com.codingplatform.problem.dto.ProblemResponse;
import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.problem.service.ProblemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
@Tag(name = "Problems", description = "Problem catalog and admin management")
public class ProblemController {

    private final ProblemService problemService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Create a problem",
        description = "Admin-only endpoint to create a new coding problem.",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<ProblemResponse> createProblem(
            @Valid @RequestBody ProblemRequest request) {

        ProblemResponse response = problemService.createProblem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(
        summary = "Get all problems",
        description = "Public demo endpoint for viewing the available coding problems.",
        security = {}
    )
    public ResponseEntity<ApiResponse<Page<ProblemResponse>>> getAllProblems(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Difficulty difficulty,
            @PageableDefault(size = 12) Pageable pageable) {

        return ResponseEntity.ok(ApiResponse.ok(problemService.searchProblems(search, difficulty, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get a problem by id",
        description = "Public demo endpoint for viewing a single coding problem.",
        security = {}
    )
    public ResponseEntity<ProblemResponse> getProblemById(@PathVariable Long id) {
        return ResponseEntity.ok(problemService.getProblemById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Update a problem",
        description = "Admin-only endpoint to update an existing coding problem.",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<ProblemResponse> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody ProblemRequest request) {

        return ResponseEntity.ok(problemService.updateProblem(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Delete a problem",
        description = "Admin-only endpoint to remove an existing coding problem.",
        security = { @SecurityRequirement(name = "bearerAuth") }
    )
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }
}