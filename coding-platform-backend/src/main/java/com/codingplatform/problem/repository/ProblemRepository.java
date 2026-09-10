package com.codingplatform.problem.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.problem.entity.Problem;

@Repository
public interface ProblemRepository
        extends JpaRepository<Problem, Long> {

    List<Problem> findByDifficulty(Difficulty difficulty);

    List<Problem> findByTopicIgnoreCase(String topic);

    List<Problem> findByTitleContainingIgnoreCase(String title);

    Page<Problem> findByDifficulty(Difficulty difficulty, Pageable pageable);

    Page<Problem> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Problem> findByTitleContainingIgnoreCaseAndDifficulty(String title, Difficulty difficulty, Pageable pageable);
}