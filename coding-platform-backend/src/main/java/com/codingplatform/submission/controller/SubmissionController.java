package com.codingplatform.submission.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.codingplatform.common.ApiResponse;
import com.codingplatform.submission.dto.SubmissionRequest;
import com.codingplatform.submission.dto.SubmissionResponse;
import com.codingplatform.submission.service.SubmissionService;
import com.codingplatform.submissionresult.dto.SubmissionResultResponse;
import com.codingplatform.submissionresult.service.SubmissionResultService;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Tag(name = "Submissions", description = "Run and submit code against a problem's test cases")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final SubmissionResultService submissionResultService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SubmissionResponse> submit(@Valid @RequestBody SubmissionRequest request,
                                                    @AuthenticationPrincipal UserDetails principal) {
        return ApiResponse.ok("Submission evaluated", submissionService.submit(request, principal.getUsername()));
    }

    @GetMapping("/{id}")
    public ApiResponse<SubmissionResponse> getById(@PathVariable Long id,
                                                     @AuthenticationPrincipal UserDetails principal) {
        return ApiResponse.ok(submissionService.getById(id, principal.getUsername()));
    }

    @GetMapping("/{id}/results")
    public ApiResponse<List<SubmissionResultResponse>> getResults(@PathVariable Long id,
                                                                    @AuthenticationPrincipal UserDetails principal) {
        submissionService.getById(id, principal.getUsername());
        return ApiResponse.ok(submissionResultService.getResultsBySubmissionId(id));
    }

    @GetMapping("/me")
    public ApiResponse<Page<SubmissionResponse>> getMySubmissions(
            @AuthenticationPrincipal UserDetails principal,
            @PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.ok(submissionService.getMySubmissions(principal.getUsername(), pageable));
    }

    @GetMapping("/me/solved-problems")
    public ApiResponse<List<Long>> getSolvedProblems(@AuthenticationPrincipal UserDetails principal) {
        return ApiResponse.ok("Solved problems loaded", submissionService.getSolvedProblemIds(principal.getUsername()));
    }
}
