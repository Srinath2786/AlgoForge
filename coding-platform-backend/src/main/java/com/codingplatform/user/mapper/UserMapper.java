package com.codingplatform.user.mapper;

import org.springframework.stereotype.Component;

import com.codingplatform.user.dto.UserDto;
import com.codingplatform.user.entity.AppUser;

@Component
public class UserMapper {

    public UserDto toDto(AppUser user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getFullName(),
                user.getBio(),
                user.getAvatarUrl(),
                user.getWebsite(),
                user.getLinkedIn(),
                user.getGithub(),
                user.getLocation()
        );
    }
}
