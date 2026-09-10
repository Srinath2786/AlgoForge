package com.codingplatform.dashboard.service;

import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.codingplatform.dashboard.dto.ActivityDaySummary;
import com.codingplatform.dashboard.dto.ActivityMonthSummary;
import com.codingplatform.dashboard.dto.ActivityWeekSummary;
import com.codingplatform.dashboard.dto.CodingActivityResponse;
import com.codingplatform.dashboard.dto.DashboardResponse;
import com.codingplatform.dashboard.dto.DashboardSummaryResponse;
import com.codingplatform.dashboard.dto.LanguageUsageResponse;
import com.codingplatform.dashboard.dto.RecentSubmissionResponse;
import com.codingplatform.dashboard.dto.SubmissionHeatmapResponse;
import com.codingplatform.exception.ResourceNotFoundException;
import com.codingplatform.leaderboard.repository.LeaderboardRepository;
import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.submission.entity.Submission;
import com.codingplatform.submission.entity.SubmissionStatus;
import com.codingplatform.submission.repository.SubmissionRepository;
import com.codingplatform.user.entity.AppUser;
import com.codingplatform.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final LeaderboardRepository leaderboardRepository;

    @Override
    public DashboardResponse getDashboard() {
        AppUser user = getCurrentUser();
        Long userId = user.getId();

        long totalSubmissions = submissionRepository.countByUserId(userId);
        long acceptedSubmissions = submissionRepository.countByUserIdAndStatus(userId, SubmissionStatus.ACCEPTED);
        long easySolved = submissionRepository.countDistinctSolvedByDifficulty(userId, Difficulty.EASY);
        long mediumSolved = submissionRepository.countDistinctSolvedByDifficulty(userId, Difficulty.MEDIUM);
        long hardSolved = submissionRepository.countDistinctSolvedByDifficulty(userId, Difficulty.HARD);

        double successRate = totalSubmissions == 0 ? 0.0 : (acceptedSubmissions * 100.0) / totalSubmissions;

        List<LanguageUsageResponse> languageUsage = submissionRepository.countLanguagesByUserId(userId)
                .stream()
                .map(row -> new LanguageUsageResponse(
                        row[0].toString(),
                        ((Number) row[1]).longValue()))
                .toList();

        List<RecentSubmissionResponse> recentSubmissions = submissionRepository
                .findTop10ByUserIdOrderBySubmittedAtDesc(userId)
                .stream()
                .map(this::toRecentSubmission)
                .toList();

        Map<LocalDate, Long> submissionCounts = new HashMap<>();
        submissionRepository
                .countSubmissionsByUserIdAndDate(userId)
                .forEach(row -> submissionCounts.put(toLocalDate(row[0]), ((Number) row[1]).longValue()));

        LocalDate today = LocalDate.now();
        LocalDate firstDay = today.minusDays(364);
        List<SubmissionHeatmapResponse> submissionHeatmap = new ArrayList<>();
        for (LocalDate date = firstDay; !date.isAfter(today); date = date.plusDays(1)) {
            submissionHeatmap.add(new SubmissionHeatmapResponse(date, submissionCounts.getOrDefault(date, 0L)));
        }

        Integer currentRank = leaderboardRepository.findByUserId(userId)
                .map(entry -> entry.getRank())
                .orElse(null);

        return new DashboardResponse(
                new DashboardSummaryResponse(
                        easySolved + mediumSolved + hardSolved,
                        easySolved,
                        mediumSolved,
                        hardSolved,
                        totalSubmissions,
                        acceptedSubmissions,
                        successRate),
                languageUsage,
                recentSubmissions,
                submissionHeatmap,
                currentRank);
    }

    @Override
    public CodingActivityResponse getCodingActivity() {
        AppUser user = getCurrentUser();
        Long userId = user.getId();

        List<Submission> submissions = submissionRepository.findByUserIdOrderBySubmittedAtAsc(userId);
        Map<String, MonthAccumulator> months = new LinkedHashMap<>();

        for (Submission submission : submissions) {
            LocalDateTime submittedAt = submission.getSubmittedAt() == null ? LocalDateTime.now() : submission.getSubmittedAt();
            LocalDate date = submittedAt.toLocalDate();
            String monthKey = YearMonth.from(date).toString();
            MonthAccumulator month = months.computeIfAbsent(monthKey, key -> new MonthAccumulator(date));

            month.totalSubmissions++;
            if (submission.getStatus() == SubmissionStatus.ACCEPTED) {
                month.acceptedSubmissions++;
                month.problemIds.add(submission.getProblem().getId());
            }

            DayAccumulator day = month.days.computeIfAbsent(date, key -> new DayAccumulator(date));
            day.totalSubmissions++;
            if (submission.getStatus() == SubmissionStatus.ACCEPTED) {
                day.acceptedSubmissions++;
                day.problemIds.add(submission.getProblem().getId());
            }
        }

        List<ActivityMonthSummary> monthSummaries = new ArrayList<>();
        for (MonthAccumulator month : months.values()) {
            List<ActivityWeekSummary> weekSummaries = new ArrayList<>();
            Map<Integer, WeekAccumulator> weeks = new LinkedHashMap<>();

            for (DayAccumulator day : month.days.values()) {
                int weekNumber = day.date.get(WeekFields.of(Locale.US).weekOfMonth());
                WeekAccumulator week = weeks.computeIfAbsent(weekNumber,
                        key -> new WeekAccumulator(weekNumber, month.date.getYear(), month.date.getMonthValue()));
                week.totalSubmissions += day.totalSubmissions;
                week.acceptedSubmissions += day.acceptedSubmissions;
                week.problemIds.addAll(day.problemIds);
                week.days.add(new ActivityDaySummary(
                        day.date,
                        day.date.format(DateTimeFormatter.ofPattern("MMM d")),
                        day.totalSubmissions,
                        day.acceptedSubmissions,
                        day.problemIds.size(),
                        day.totalSubmissions));
            }

            for (WeekAccumulator week : weeks.values()) {
                List<ActivityDaySummary> sortedDays = week.days.stream()
                        .sorted(Comparator.comparing(ActivityDaySummary::date))
                        .toList();
                weekSummaries.add(new ActivityWeekSummary(
                        week.weekNumber,
                        "Week " + week.weekNumber,
                        sortedDays.stream().mapToLong(ActivityDaySummary::totalSubmissions).sum(),
                        sortedDays.stream().mapToLong(ActivityDaySummary::acceptedSubmissions).sum(),
                        sortedDays.stream().mapToLong(ActivityDaySummary::problemsSolved).sum(),
                        sortedDays.stream().filter(day -> day.totalSubmissions() > 0).count(),
                        sortedDays));
            }

            weekSummaries.sort(Comparator.comparing(ActivityWeekSummary::weekNumber));
            monthSummaries.add(new ActivityMonthSummary(
                    month.monthKey,
                    month.date.format(DateTimeFormatter.ofPattern("MMM yyyy")),
                    month.totalSubmissions,
                    month.acceptedSubmissions,
                    month.problemIds.size(),
                    month.days.values().stream().filter(day -> day.totalSubmissions > 0).count(),
                    weekSummaries));
        }

        return new CodingActivityResponse(monthSummaries);
    }

    private RecentSubmissionResponse toRecentSubmission(Submission submission) {
        return new RecentSubmissionResponse(
                submission.getId(),
                submission.getProblem().getId(),
                submission.getProblem().getTitle(),
                submission.getLanguage().name(),
                submission.getStatus(),
                submission.getExecutionTimeMs(),
                submission.getSubmittedAt());
    }

    private AppUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new ResourceNotFoundException("Authenticated user not found");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof LocalDateTime localDateTime) {
            return localDateTime.toLocalDate();
        }
        if (value instanceof Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        return LocalDate.parse(value.toString());
    }

    private static final class MonthAccumulator {
        private final String monthKey;
        private final LocalDate date;
        private final Map<LocalDate, DayAccumulator> days = new LinkedHashMap<>();
        private final Set<Long> problemIds = new TreeSet<>();
        private long totalSubmissions;
        private long acceptedSubmissions;

        private MonthAccumulator(LocalDate date) {
            this.date = date;
            this.monthKey = YearMonth.from(date).toString();
        }
    }

    private static final class DayAccumulator {
        private final LocalDate date;
        private final Set<Long> problemIds = new TreeSet<>();
        private long totalSubmissions;
        private long acceptedSubmissions;

        private DayAccumulator(LocalDate date) {
            this.date = date;
        }
    }

    private static final class WeekAccumulator {
        private final int weekNumber;
        private final List<ActivityDaySummary> days = new ArrayList<>();
        private long totalSubmissions;
        private long acceptedSubmissions;
        private final Set<Long> problemIds = new TreeSet<>();

        private WeekAccumulator(int weekNumber, int year, int month) {
            this.weekNumber = weekNumber;
        }
    }
}
