package com.codingplatform.testcase;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.testcase.entity.TestCase;
import com.codingplatform.testcase.repository.TestCaseRepository;

@SpringBootTest
@ActiveProfiles("test")
class TestCaseSeedDataTest {

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Test
    void shouldSeedTestCasesForEveryDemoProblem() {
        Map<String, Integer> expectedCounts = Map.of(
            "Two Sum", 2,
            "Valid Parentheses", 1,
            "Longest Substring Without Repeating Characters", 1,
            "Merge Intervals", 1,
            "Median of Two Sorted Arrays", 1
        );

        expectedCounts.forEach((title, expectedCount) -> {
            Problem problem = problemRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .findFirst()
                .orElseThrow();

            List<TestCase> testCases = testCaseRepository.findByProblemId(problem.getId());

            assertThat(testCases).hasSize(expectedCount);
        });
    }
}
