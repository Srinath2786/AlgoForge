package com.codingplatform.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {

    private long solvedProblems;

    private long totalSubmissions;

    private double acceptanceRate;

    private long easySolved;

    private long mediumSolved;

    private long hardSolved;

    private Integer rank;

    private double score;
}
