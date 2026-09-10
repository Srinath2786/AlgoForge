package com.codingplatform.submission.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

import com.codingplatform.submission.dto.SubmissionRequest;
import com.codingplatform.submission.dto.SubmissionResponse;

public interface SubmissionService {

    SubmissionResponse submit(SubmissionRequest request, String username);

    SubmissionResponse getById(Long submissionId, String username);

    Page<SubmissionResponse> getMySubmissions(String username, Pageable pageable);

    List<Long> getSolvedProblemIds(String username);
}
