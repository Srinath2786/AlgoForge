package com.codingplatform.user.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.codingplatform.common.Role;
import com.codingplatform.user.dto.DashboardStats;
import com.codingplatform.user.dto.UserDto;
import com.codingplatform.user.service.UserService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser(username = "demo-user")
    void shouldReturnCurrentUserForAuthenticatedUser() throws Exception {
        UserDto response = new UserDto(7L, "demo-user", "demo@example.com", Role.USER, true, LocalDateTime.now());

        when(userService.getCurrentUser("demo-user")).thenReturn(response);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk());

        verify(userService).getCurrentUser("demo-user");
    }

    @Test
    @WithMockUser(username = "demo-user")
    void shouldReturnDashboardStatsForAuthenticatedUser() throws Exception {
        DashboardStats response = new DashboardStats(3, 10, 40.0, 1, 1, 1, 12, 20.0);

        when(userService.getDashboardStats("demo-user")).thenReturn(response);

        mockMvc.perform(get("/api/users/me/dashboard"))
                .andExpect(status().isOk());

        verify(userService).getDashboardStats("demo-user");
    }

    @Test
    @WithMockUser(username = "demo-user")
    void shouldUpdateCurrentUserProfile() throws Exception {
        UserDto response = new UserDto(7L, "demo-user", "demo@example.com", Role.USER, true, LocalDateTime.now(),
                "Demo User", "Building systems and learning daily.", "https://example.com/avatar.png",
                "https://example.com", "https://linkedin.com/in/demo", "https://github.com/demo", "Bengaluru");

        when(userService.updateProfile("demo-user", new com.codingplatform.user.dto.UpdateProfileRequest(
                "Demo User", "Building systems and learning daily.", "https://example.com/avatar.png",
                "https://example.com", "https://linkedin.com/in/demo", "https://github.com/demo",
                "demo@example.com", "Bengaluru"))).thenReturn(response);

        mockMvc.perform(put("/api/users/me/profile")
                .contentType("application/json")
                .content("{\"fullName\":\"Demo User\",\"bio\":\"Building systems and learning daily.\",\"avatarUrl\":\"https://example.com/avatar.png\",\"website\":\"https://example.com\",\"linkedIn\":\"https://linkedin.com/in/demo\",\"github\":\"https://github.com/demo\",\"email\":\"demo@example.com\",\"location\":\"Bengaluru\"}"))
                .andExpect(status().isOk());

        verify(userService).updateProfile("demo-user", new com.codingplatform.user.dto.UpdateProfileRequest(
                "Demo User", "Building systems and learning daily.", "https://example.com/avatar.png",
                "https://example.com", "https://linkedin.com/in/demo", "https://github.com/demo",
                "demo@example.com", "Bengaluru"));
    }
}
