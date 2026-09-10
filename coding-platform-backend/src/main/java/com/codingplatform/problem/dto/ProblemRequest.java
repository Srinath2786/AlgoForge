package com.codingplatform.problem.dto;

import com.codingplatform.problem.entity.Difficulty;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    @NotBlank(message = "Topic is required")
    private String topic;

    private String constraints;

    private String examples;

    private String tags;

    private String starterCodeJava;

    private String starterCodePython;

    private String starterCodeCpp;

    private String starterCodeJavascript;

    private String editorial;

    private String hints;

    @Min(value = 1, message = "Attempts must be at least 1")
    private Integer editorialUnlockAttempts = 3;
}