package com.codingplatform.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private Long id;

    private String token;

    private String tokenType;

    private String username;

    private String role;

    public static LoginResponse of(String token, Long userId, String username, String role) {
        return new LoginResponse(userId, token, "Bearer", username, role);
    }
}