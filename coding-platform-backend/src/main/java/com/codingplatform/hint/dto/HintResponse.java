package com.codingplatform.hint.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HintResponse {

    private Long problemId;

    private String hints;
}
