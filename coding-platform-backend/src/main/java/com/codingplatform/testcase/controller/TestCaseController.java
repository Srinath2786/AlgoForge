package com.codingplatform.testcase.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.codingplatform.common.ApiResponse;
import com.codingplatform.testcase.dto.TestCaseDto;
import com.codingplatform.testcase.dto.TestCaseRequest;
import com.codingplatform.testcase.service.TestCaseService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/problems/{problemId}/testcases")
@RequiredArgsConstructor
@Tag(name = "Test Cases", description = "Visible (sample) test cases for a problem")
public class TestCaseController {

    private final TestCaseService testCaseService;

    @GetMapping
    public ApiResponse<List<TestCaseDto>> getVisibleTestCases(@PathVariable Long problemId) {
        return ApiResponse.ok(testCaseService.getVisibleByProblem(problemId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<TestCaseDto>> getAllTestCases(@PathVariable Long problemId) {
        return ApiResponse.ok(testCaseService.getAllByProblem(problemId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestCaseDto> createTestCase(@PathVariable Long problemId,
            @Valid @RequestBody TestCaseRequest request) {
        request.setProblemId(problemId);
        return ResponseEntity.status(HttpStatus.CREATED).body(testCaseService.create(request));
    }

    @PutMapping("/{testCaseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public TestCaseDto updateTestCase(@PathVariable Long problemId, @PathVariable Long testCaseId,
            @Valid @RequestBody TestCaseRequest request) {
        request.setProblemId(problemId);
        return testCaseService.update(problemId, testCaseId, request);
    }

    @DeleteMapping("/{testCaseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTestCase(@PathVariable Long problemId, @PathVariable Long testCaseId) {
        testCaseService.delete(problemId, testCaseId);
        return ResponseEntity.noContent().build();
    }
}
