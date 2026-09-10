package com.codingplatform;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class CodingPlatformApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the full Spring context (security, JPA, Flyway-off/H2) wires up cleanly.
    }
}
