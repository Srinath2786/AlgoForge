package com.codingplatform.user.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.codingplatform.exception.ResourceNotFoundException;
import com.codingplatform.leaderboard.repository.LeaderboardRepository;
import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.submission.entity.SubmissionStatus;
import com.codingplatform.submission.repository.SubmissionRepository;
import com.codingplatform.user.dto.DashboardStats;
import com.codingplatform.user.dto.UpdateProfileRequest;
import com.codingplatform.user.dto.UserDto;
import com.codingplatform.user.entity.AppUser;
import com.codingplatform.user.mapper.UserMapper;
import com.codingplatform.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final LeaderboardRepository leaderboardRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public UserDto getCurrentUser(String username) {
        AppUser user = findByUsername(username);
        return toDto(user);
    }

    @Override
    public UserDto getById(Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return toDto(user);
    }

    @Override
    public UserDto updateProfile(String username, UpdateProfileRequest request) {
        AppUser user = findByUsername(username);

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName().trim().isEmpty() ? null : request.getFullName().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim().isEmpty() ? null : request.getBio().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim().isEmpty() ? null : request.getAvatarUrl().trim());
        }
        if (request.getWebsite() != null) {
            user.setWebsite(request.getWebsite().trim().isEmpty() ? null : request.getWebsite().trim());
        }
        if (request.getLinkedIn() != null) {
            user.setLinkedIn(request.getLinkedIn().trim().isEmpty() ? null : request.getLinkedIn().trim());
        }
        if (request.getGithub() != null) {
            user.setGithub(request.getGithub().trim().isEmpty() ? null : request.getGithub().trim());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail().trim());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation().trim().isEmpty() ? null : request.getLocation().trim());
        }

        return toDto(userRepository.save(user));
    }

    @Override
    public DashboardStats getDashboardStats(String username) {
        AppUser user = findByUsername(username);

        long totalSubmissions = submissionRepository.countByUserId(user.getId());
        long accepted = submissionRepository.countByUserIdAndStatus(user.getId(), SubmissionStatus.ACCEPTED);
        long easy = submissionRepository.countDistinctSolvedByDifficulty(user.getId(), Difficulty.EASY);
        long medium = submissionRepository.countDistinctSolvedByDifficulty(user.getId(), Difficulty.MEDIUM);
        long hard = submissionRepository.countDistinctSolvedByDifficulty(user.getId(), Difficulty.HARD);

        double acceptanceRate = totalSubmissions == 0 ? 0.0 : (accepted * 100.0) / totalSubmissions;

        Integer rank = leaderboardRepository.findByUserId(user.getId())
                .map(entry -> entry.getRank())
                .orElse(null);
        double score = leaderboardRepository.findByUserId(user.getId())
            .map(entry -> entry.getScore())
            .orElse(0.0);

        return new DashboardStats(easy + medium + hard, totalSubmissions, acceptanceRate, easy, medium, hard, rank, score);
    }

    private AppUser findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    private UserDto toDto(AppUser user) {
        return userMapper.toDto(user);
    }
}
