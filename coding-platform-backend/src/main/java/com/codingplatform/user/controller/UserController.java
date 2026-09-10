package com.codingplatform.user.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codingplatform.common.ApiResponse;
import com.codingplatform.user.dto.DashboardStats;
import com.codingplatform.user.dto.UpdateProfileRequest;
import com.codingplatform.user.dto.UserDto;
import com.codingplatform.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserDetails principal) {
        UserDto user = userService.getCurrentUser(principal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Current user loaded", user));
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats(@AuthenticationPrincipal UserDetails principal) {
        DashboardStats stats = userService.getDashboardStats(principal.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("Dashboard stats loaded", stats));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateCurrentUserProfile(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody UpdateProfileRequest request) {
        UserDto user = userService.updateProfile(principal.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", user));
    }

}
