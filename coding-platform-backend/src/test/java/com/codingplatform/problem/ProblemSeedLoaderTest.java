package com.codingplatform.problem;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.codingplatform.common.Role;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.problem.seed.ProblemSeedLoader;
import com.codingplatform.testcase.repository.TestCaseRepository;
import com.codingplatform.user.entity.AppUser;
import com.codingplatform.user.repository.UserRepository;

class ProblemSeedLoaderTest {

    @Test
    void shouldSeedAdminWithKnownPassword() {
        ProblemRepository problemRepository = mock(ProblemRepository.class);
        TestCaseRepository testCaseRepository = mock(TestCaseRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        when(userRepository.findByUsername("admin")).thenReturn(Optional.empty());
        when(problemRepository.count()).thenReturn(0L);
        when(testCaseRepository.count()).thenReturn(0L);
        when(problemRepository.findByTitleContainingIgnoreCase(any())).thenReturn(Collections.emptyList());

        ProblemSeedLoader loader = new ProblemSeedLoader(problemRepository, testCaseRepository, userRepository, passwordEncoder);

        loader.run();

        var captor = org.mockito.ArgumentCaptor.forClass(AppUser.class);
        verify(userRepository).save(captor.capture());

        AppUser saved = captor.getValue();
        assertEquals("admin", saved.getUsername());
        assertEquals("admin@algoforge.local", saved.getEmail());
        assertEquals(Role.ADMIN, saved.getRole());
        assertTrue(passwordEncoder.matches("Admin@123", saved.getPassword()));
    }
}
