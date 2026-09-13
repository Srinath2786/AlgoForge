package com.codingplatform.challenge.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codingplatform.challenge.entity.WeeklyChallenge;

public interface WeeklyChallengeRepository extends JpaRepository<WeeklyChallenge, Long> {
    List<WeeklyChallenge> findAllByOrderByDayOfWeekAsc();
    Optional<WeeklyChallenge> findByDayOfWeek(Integer dayOfWeek);
}
