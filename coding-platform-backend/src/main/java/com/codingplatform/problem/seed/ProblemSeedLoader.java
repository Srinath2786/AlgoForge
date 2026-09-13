package com.codingplatform.problem.seed;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.codingplatform.common.Role;
import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.testcase.entity.TestCase;
import com.codingplatform.testcase.repository.TestCaseRepository;
import com.codingplatform.user.entity.AppUser;
import com.codingplatform.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
// Demo content includes a known local admin account. Never load it in an
// unqualified production runtime; opt in with the `demo` profile instead.
@Profile({"test", "demo"})
@RequiredArgsConstructor
public class ProblemSeedLoader implements CommandLineRunner {

    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String encodedAdminPassword = passwordEncoder.encode("Admin@123");

        userRepository.findByUsername("admin")
            .map(existing -> {
                existing.setEmail("admin@algoforge.local");
                existing.setPassword(encodedAdminPassword);
                existing.setRole(Role.ADMIN);
                existing.setEnabled(true);
                return userRepository.save(existing);
            })
            .orElseGet(() -> userRepository.save(AppUser.builder()
                .username("admin")
                .email("admin@algoforge.local")
                .password(encodedAdminPassword)
                .role(Role.ADMIN)
                .enabled(true)
                .build()));

        if (problemRepository.count() > 0) {
            seedTwoSumTestCases();
            return;
        }

        List<Problem> demoProblems = List.of(
            buildProblem("Two Sum", "Given an array of integers and a target, return the indices of the two numbers that add up to the target.", "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9", "Example 1:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]", Difficulty.EASY, "Arrays", "arrays,hash-map"),
            buildProblem("Valid Parentheses", "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", "1 <= s.length <= 10^4\ns consists only of parentheses characters.", "Example:\nInput: s = \"()[]{}\"\nOutput: true", Difficulty.EASY, "Stack", "stack,strings"),
            buildProblem("Longest Substring Without Repeating Characters", "Find the length of the longest substring without repeating characters.", "0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.", "Example:\nInput: s = \"abcabcbb\"\nOutput: 3", Difficulty.MEDIUM, "Strings", "sliding-window,strings"),
            buildProblem("Merge Intervals", "Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals and return a list of the merged intervals.", "1 <= intervals.length <= 10^4\nintervals[i].length == 2", "Example:\nInput: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]", Difficulty.MEDIUM, "Sorting", "arrays,sorting"),
            buildProblem("Median of Two Sorted Arrays", "Given two sorted arrays nums1 and nums2 of size m and n, return the median of the two sorted arrays.", "nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000", "Example:\nInput: nums1 = [1,3], nums2 = [2]\nOutput: 2.0", Difficulty.HARD, "Binary Search", "arrays,binary-search")
        );

        problemRepository.saveAll(demoProblems);
        seedTwoSumTestCases();
    }

    private void seedTwoSumTestCases() {
        if (testCaseRepository.count() > 0) {
            return;
        }

        problemRepository.findByTitleContainingIgnoreCase("Two Sum").stream()
            .findFirst()
            .ifPresent(problem -> testCaseRepository.saveAll(List.of(
                buildTestCase(problem, "2 7 11 15\n9\n", "0 1\n", false, "Sample input"),
                buildTestCase(problem, "3 2 4\n6\n", "1 2\n", true, "Hidden validation case")
            )));
        problemRepository.findByTitleContainingIgnoreCase("Valid Parentheses").stream()
            .findFirst()
            .ifPresent(problem -> testCaseRepository.save(buildTestCase(problem, "()[]{}\n", "true\n", false,
                "Balanced brackets")));
        problemRepository.findByTitleContainingIgnoreCase("Longest Substring Without Repeating Characters").stream()
            .findFirst()
            .ifPresent(problem -> testCaseRepository.save(buildTestCase(problem, "abcabcbb\n", "3\n", false,
                "Repeated characters")));
        problemRepository.findByTitleContainingIgnoreCase("Merge Intervals").stream()
            .findFirst()
            .ifPresent(problem -> testCaseRepository.save(buildTestCase(problem,
                "4\n1 3\n2 6\n8 10\n15 18\n", "[1,6] [8,10] [15,18]\n", false, "Overlapping intervals")));
        problemRepository.findByTitleContainingIgnoreCase("Median of Two Sorted Arrays").stream()
            .findFirst()
            .ifPresent(problem -> testCaseRepository.save(buildTestCase(problem, "1 3\n2\n", "2.0\n", false,
                "Odd total length")));
    }

    private TestCase buildTestCase(Problem problem, String input, String expectedOutput, boolean hidden,
            String description) {
        TestCase testCase = new TestCase();
        testCase.setProblem(problem);
        testCase.setInput(input);
        testCase.setExpectedOutput(expectedOutput);
        testCase.setHidden(hidden);
        testCase.setDescription(description);
        testCase.setTimeLimitMs(5000);
        return testCase;
    }

    private Problem buildProblem(String title, String description, String constraints, String examples,
            Difficulty difficulty, String topic, String tags) {
        Problem problem = new Problem();
        problem.setTitle(title);
        problem.setDescription(description);
        problem.setConstraints(constraints);
        problem.setExamples(examples);
        problem.setDifficulty(difficulty);
        problem.setTopic(topic);
        problem.setTags(tags);
        problem.setStarterCodeJava("public class Solution {}\n");
        problem.setStarterCodePython("def solve():\n    pass\n");
        problem.setStarterCodeCpp("#include <bits/stdc++.h>\nusing namespace std;\nint main() { return 0; }\n");
        problem.setStarterCodeJavascript("function solve() {\n  // write code\n}\n");
        problem.setEditorial("This is a demo editorial for " + title + ".");
        problem.setHints("Think carefully and test edge cases.");
        problem.setEditorialUnlockAttempts(3);
        return problem;
    }
}
