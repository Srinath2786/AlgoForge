package com.codingplatform.challenge.dto;

import com.codingplatform.problem.dto.ProblemResponse;

public record WeeklyChallengeResponse(int dayOfWeek, ProblemResponse problem) {}
