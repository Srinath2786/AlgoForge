package com.codingplatform.testcase.service;

import java.util.List;

import com.codingplatform.testcase.dto.TestCaseDto;
import com.codingplatform.testcase.dto.TestCaseRequest;

public interface TestCaseService {

    List<TestCaseDto> getVisibleByProblem(Long problemId);

    List<TestCaseDto> getAllByProblem(Long problemId);

    TestCaseDto create(TestCaseRequest request);

    TestCaseDto update(Long problemId, Long id, TestCaseRequest request);

    void delete(Long problemId, Long id);
}
