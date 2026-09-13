package com.codingplatform.challenge.service;

import java.util.List;

import com.codingplatform.challenge.dto.WeeklyChallengeResponse;

public interface WeeklyChallengeService {
    List<WeeklyChallengeResponse> getSchedule();
    WeeklyChallengeResponse assign(int dayOfWeek, Long problemId);
    void clear(int dayOfWeek);
}
