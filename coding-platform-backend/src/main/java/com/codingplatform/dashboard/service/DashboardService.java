package com.codingplatform.dashboard.service;

import com.codingplatform.dashboard.dto.CodingActivityResponse;
import com.codingplatform.dashboard.dto.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboard();

    CodingActivityResponse getCodingActivity();
}
