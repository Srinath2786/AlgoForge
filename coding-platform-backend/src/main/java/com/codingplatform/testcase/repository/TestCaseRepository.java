package com.codingplatform.testcase.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codingplatform.testcase.entity.TestCase;

@Repository
public interface TestCaseRepository
        extends JpaRepository<TestCase, Long> {

    List<TestCase> findByProblemId(Long problemId);

    List<TestCase> findByProblemIdAndHidden(
            Long problemId,
            boolean hidden
    );

    List<TestCase> findByProblemIdAndHiddenFalse(Long problemId);
}
