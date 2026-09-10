package com.codingplatform.problem;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.codingplatform.problem.repository.ProblemRepository;

@SpringBootTest
@ActiveProfiles("test")
class ProblemSeedDataTest {

    @Autowired
    private ProblemRepository problemRepository;

    @Test
    void shouldSeedDemoProblemsForSwaggerDemo() {
        assertThat(problemRepository.count()).isGreaterThan(0);
    }
}
