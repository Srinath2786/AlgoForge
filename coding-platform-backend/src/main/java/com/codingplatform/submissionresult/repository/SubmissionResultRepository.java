package com.codingplatform.submissionresult.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codingplatform.submissionresult.entity.SubmissionResult;

@Repository
public interface SubmissionResultRepository
        extends JpaRepository<SubmissionResult, Long> {

    List<SubmissionResult> findBySubmissionIdOrderByIdAsc(
            Long submissionId
    );

    void deleteBySubmissionId(Long submissionId);
}