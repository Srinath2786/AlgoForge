package com.codingplatform.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import com.codingplatform.auth.dto.LoginResponse;

class LoginResponseTest {

    @Test
    void loginResponseIncludesUserIdAndRole() {
        LoginResponse response = LoginResponse.of("token-123", 7L, "admin", "ADMIN");

        assertEquals(7L, response.getId());
        assertEquals("admin", response.getUsername());
        assertEquals("ADMIN", response.getRole());
    }
}
