package com.codingplatform.leaderboard.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codingplatform.leaderboard.dto.LeaderboardDto;
import com.codingplatform.leaderboard.entity.LeaderboardEntry;
import com.codingplatform.leaderboard.repository.LeaderboardRepository;
import com.codingplatform.submission.repository.SubmissionRepository;
import com.codingplatform.user.entity.AppUser;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl implements LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final SubmissionRepository submissionRepository;

    @Override
    public Page<LeaderboardDto> getLeaderboard(Pageable pageable) {
        return leaderboardRepository.findAllByOrderByScoreDesc(pageable).map(this::toDto);
    }

    @Override
    @Transactional
    public void refreshEntry(AppUser user, boolean accepted) {
        LeaderboardEntry entry = leaderboardRepository.findByUserId(user.getId())
                .orElseGet(() -> LeaderboardEntry.builder().user(user).build());

        long totalSubmissions = submissionRepository.countByUserId(user.getId());
        long solvedCount = submissionRepository.countDistinctSolved(user.getId());

        entry.setTotalSubmissions((int) totalSubmissions);
        entry.setSolvedCount((int) solvedCount);
        if (accepted) {
            entry.setAcceptedSubmissions(entry.getAcceptedSubmissions() + 1);
        }

        // Score weights harder problems more heavily and rewards accuracy.
        double score = (solvedCount * 10.0);
        double accuracy = totalSubmissions == 0 ? 0 : (entry.getAcceptedSubmissions() * 100.0) / totalSubmissions;
        score += accuracy * 0.1;

        entry.setScore(score);
        entry.setUpdatedAt(LocalDateTime.now());

        leaderboardRepository.save(entry);
        recalculateRanks();
    }

    @Override
    @Transactional
    public void recalculateRanks() {
        List<LeaderboardEntry> all = leaderboardRepository.findAll();
        all.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        for (int i = 0; i < all.size(); i++) {
            all.get(i).setRank(i + 1);
        }
        leaderboardRepository.saveAll(all);
    }

    private LeaderboardDto toDto(LeaderboardEntry entry) {
        double acceptanceRate = entry.getTotalSubmissions() == 0 ? 0.0
                : (entry.getAcceptedSubmissions() * 100.0) / entry.getTotalSubmissions();
        return new LeaderboardDto(entry.getUser().getId(), entry.getUser().getUsername(),
                entry.getSolvedCount(), entry.getTotalSubmissions(), acceptanceRate,
                entry.getScore(), entry.getRank());
    }
}
