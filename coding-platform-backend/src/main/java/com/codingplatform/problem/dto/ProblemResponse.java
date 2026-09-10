package com.codingplatform.problem.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.testcase.dto.TestCaseDto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProblemResponse {

    private Long id;

    private String title;

    private String description;

    private String constraints;

    private String examples;

    private Difficulty difficulty;

    private String topic;

    private String tags;

    private List<TestCaseDto> testCases;

    private LocalDateTime createdAt;

    private String starterCodeJava;

    private String starterCodePython;

    private String starterCodeCpp;

    private String starterCodeJavascript;

    private String editorial;

    private String hints;

    private Integer editorialUnlockAttempts;
}