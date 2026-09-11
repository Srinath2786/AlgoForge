package com.codingplatform.testcase.mapper;

import org.springframework.stereotype.Component;

import com.codingplatform.testcase.dto.TestCaseDto;
import com.codingplatform.testcase.entity.TestCase;

@Component
public class TestCaseMapper {

    public TestCaseDto toDto(TestCase testCase) {
        return new TestCaseDto(
                testCase.getId(),
                testCase.getInput(),
                testCase.getExpectedOutput(),
                testCase.isHidden(),
                testCase.getDescription(),
                testCase.getTimeLimitMs()
        );
    }
}
