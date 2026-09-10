package com.codingplatform.hint.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EditorialResponse {

    private Long problemId;

    private boolean unlocked;

    private int attemptsUsed;

    private int attemptsRequired;

    private String editorial;
}
