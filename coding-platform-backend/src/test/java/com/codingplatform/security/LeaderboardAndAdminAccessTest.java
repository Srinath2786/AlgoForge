package com.codingplatform.security;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.codingplatform.leaderboard.dto.LeaderboardDto;
import com.codingplatform.leaderboard.service.LeaderboardService;
import com.codingplatform.testcase.dto.TestCaseDto;
import com.codingplatform.testcase.service.TestCaseService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class LeaderboardAndAdminAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LeaderboardService leaderboardService;

    @MockBean
    private TestCaseService testCaseService;

    @Test
    void shouldExposeGlobalLeaderboardPublicly() throws Exception {
        Page<LeaderboardDto> page = new PageImpl<>(List.of(), org.springframework.data.domain.PageRequest.of(0, 10), 0);
        when(leaderboardService.getLeaderboard(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/leaderboard").param("page", "0").param("size", "10"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "user", roles = "USER")
    void shouldDenyNonAdminAccessToAllTestCases() throws Exception {
        mockMvc.perform(get("/api/problems/1/testcases/all"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void shouldAllowAdminAccessToAllTestCases() throws Exception {
        when(testCaseService.getAllByProblem(1L)).thenReturn(List.of(
                new TestCaseDto(1L, "1", "1", false, null, 1000)
        ));

        mockMvc.perform(get("/api/problems/1/testcases/all"))
                .andExpect(status().isOk());
    }
}
