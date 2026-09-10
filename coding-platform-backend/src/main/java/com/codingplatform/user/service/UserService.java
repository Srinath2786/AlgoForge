package com.codingplatform.user.service;

import java.util.List;

import com.codingplatform.user.dto.DashboardStats;
import com.codingplatform.user.dto.UpdateProfileRequest;
import com.codingplatform.user.dto.UserDto;

public interface UserService {

    List<UserDto> getAllUsers();

    UserDto getCurrentUser(String username);

    UserDto getById(Long id);

    UserDto updateProfile(String username, UpdateProfileRequest request);

    DashboardStats getDashboardStats(String username);
}