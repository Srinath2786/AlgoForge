package com.codingplatform.leaderboard.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.codingplatform.leaderboard.entity.LeaderboardEntry;

public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {

    @EntityGraph(attributePaths = "user")
    Optional<LeaderboardEntry> findByUserId(Long userId);

    @EntityGraph(attributePaths = "user")
    Page<LeaderboardEntry> findAllByOrderByScoreDesc(Pageable pageable);
}
