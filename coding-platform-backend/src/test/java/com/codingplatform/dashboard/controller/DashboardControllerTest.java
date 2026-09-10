package com.codingplatform.dashboard.controller;

import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.codingplatform.dashboard.dto.DashboardResponse;
import com.codingplatform.dashboard.dto.DashboardSummaryResponse;
import com.codingplatform.dashboard.service.DashboardService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @Test
    @WithMockUser(username = "demo-user")
    void shouldReturnDashboardForAuthenticatedUser() throws Exception {
        DashboardResponse response = new DashboardResponse(
                new DashboardSummaryResponse(3, 1, 1, 1, 10, 4, 40.0),
                java.util.List.of(),
                java.util.List.of(),
                java.util.List.of(),
                12);

        org.mockito.Mockito.when(dashboardService.getDashboard()).thenReturn(response);

        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isOk());

        verify(dashboardService).getDashboard();
    }

    @Test
    @WithMockUser(username = "demo-user")
    void shouldReturnUserCodingActivityAnalytics() throws Exception {
        mockMvc.perform(get("/api/dashboard/activity"))
                .andExpect(status().isOk());
    }
}
