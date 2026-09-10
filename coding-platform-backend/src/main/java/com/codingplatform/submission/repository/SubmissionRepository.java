package com.codingplatform.submission.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.submission.entity.Submission;
import com.codingplatform.submission.entity.SubmissionStatus;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    Page<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = {"problem"})
    List<Submission> findByUserIdOrderBySubmittedAtAsc(Long userId);

    @EntityGraph(attributePaths = {"problem"})
    List<Submission> findTop10ByUserIdOrderBySubmittedAtDesc(Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, SubmissionStatus status);

    long countByUserIdAndProblemId(Long userId, Long problemId);

    boolean existsByUserIdAndProblemIdAndStatus(Long userId, Long problemId, SubmissionStatus status);

    @Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    List<Long> findDistinctSolvedProblemIdsByUserId(@Param("userId") Long userId);

    long countByUserIdAndProblemIdAndSubmittedAtAfter(Long userId, Long problemId, LocalDateTime after);

    @Query("""
           SELECT COUNT(DISTINCT s.problem.id) FROM Submission s
           WHERE s.user.id = :userId AND s.status = 'ACCEPTED' AND s.problem.difficulty = :difficulty
           """)
    long countDistinctSolvedByDifficulty(@Param("userId") Long userId, @Param("difficulty") Difficulty difficulty);

    @Query("""
           SELECT COUNT(DISTINCT s.problem.id) FROM Submission s
           WHERE s.user.id = :userId AND s.status = 'ACCEPTED'
           """)
    long countDistinctSolved(@Param("userId") Long userId);

    @Query(value = """
            SELECT s.language AS language, COUNT(*) AS count
            FROM submissions s
            WHERE s.user_id = :userId
            GROUP BY s.language
            ORDER BY count DESC, s.language ASC
            """, nativeQuery = true)
    List<Object[]> countLanguagesByUserId(@Param("userId") Long userId);

    @Query(value = """
            SELECT CAST(s.submitted_at AS date) AS submission_date, COUNT(*) AS count
            FROM submissions s
            WHERE s.user_id = :userId
            GROUP BY CAST(s.submitted_at AS date)
            ORDER BY submission_date ASC
            """, nativeQuery = true)
    List<Object[]> countSubmissionsByUserIdAndDate(@Param("userId") Long userId);
}
