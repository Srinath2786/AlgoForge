package com.codingplatform.submissionresult.dto;

import com.codingplatform.submissionresult.entity.TestCaseStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SubmissionResultResponse {

    private Long id;

    private Long testCaseId;

    private TestCaseStatus status;

    private String actualOutput;

    private Long executionTimeMs;

    private Long memoryUsedKb;

    private String errorMessage;
}