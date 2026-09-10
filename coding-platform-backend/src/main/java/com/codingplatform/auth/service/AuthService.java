package com.codingplatform.auth.service;

import com.codingplatform.auth.dto.LoginRequest;
import com.codingplatform.auth.dto.LoginResponse;
import com.codingplatform.auth.dto.RegisterRequest;
import com.codingplatform.auth.dto.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}
