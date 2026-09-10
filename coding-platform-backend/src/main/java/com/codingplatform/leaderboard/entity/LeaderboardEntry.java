package com.codingplatform.leaderboard.entity;

import java.time.LocalDateTime;

import com.codingplatform.user.entity.AppUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "leaderboard_entries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private AppUser user;

    @Column(name = "solved_count", nullable = false)
    @Builder.Default
    private Integer solvedCount = 0;

    @Column(name = "total_submissions", nullable = false)
    @Builder.Default
    private Integer totalSubmissions = 0;

    @Column(name = "accepted_submissions", nullable = false)
    @Builder.Default
    private Integer acceptedSubmissions = 0;

    @Column(nullable = false)
    @Builder.Default
    private Double score = 0.0;

    private Integer rank;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
