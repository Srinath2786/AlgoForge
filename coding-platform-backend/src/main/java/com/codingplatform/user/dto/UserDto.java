package com.codingplatform.user.dto;

import java.time.LocalDateTime;

import com.codingplatform.common.Role;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDto {

    private Long id;

    private String username;

    private String email;

    private Role role;

    private boolean enabled;

    private LocalDateTime createdAt;

    private String fullName;

    private String bio;

    private String avatarUrl;

    private String website;

    private String linkedIn;

    private String github;

    private String location;

    public UserDto(Long id, String username, String email, Role role, boolean enabled, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }

    public UserDto(Long id, String username, String email, Role role, boolean enabled, LocalDateTime createdAt,
            String fullName, String bio, String avatarUrl, String website, String linkedIn, String github,
            String location) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.fullName = fullName;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.website = website;
        this.linkedIn = linkedIn;
        this.github = github;
        this.location = location;
    }
}