package com.codingplatform.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    private String fullName;

    private String bio;

    private String avatarUrl;

    private String website;

    private String linkedIn;

    private String github;

    private String email;

    private String location;
}
