package com.codingplatform.leaderboard.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.codingplatform.leaderboard.dto.LeaderboardDto;
import com.codingplatform.user.entity.AppUser;

public interface LeaderboardService {

    Page<LeaderboardDto> getLeaderboard(Pageable pageable);

    /** Recomputes a single user's leaderboard row after a submission verdict lands. */
    void refreshEntry(AppUser user, boolean accepted);

    /** Recalculates the 1..N rank column across all entries by score desc. */
    void recalculateRanks();
}
