package com.codingplatform.execution;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.codingplatform.docker.ContainerCleanupService;
import com.codingplatform.docker.DockerManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Per-language compile + run pipeline. Each submission gets its own
 * temp "sandbox" directory that is bind-mounted read/write into the
 * container; the container itself runs with --network=none, a memory
 * cap, and a single CPU per Docker sandbox constraints.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    private final DockerManager dockerManager;
    private final ContainerCleanupService cleanupService;

    @Value("${execution.docker.enabled:true}")
    private boolean dockerEnabled;

    private static final Map<String, String> IMAGES = Map.of(
            "java", "eclipse-temurin:17-jdk",
            "python", "python:3.11-slim",
            "cpp", "gcc:latest",
            "javascript", "node:20-slim"
    );

    private static final Map<String, String> SOURCE_FILE_NAMES = Map.of(
            "java", "Main.java",
            "python", "main.py",
            "cpp", "main.cpp",
            "javascript", "main.js"
    );

    public CompilationResult compile(String language, String sourceCode, Path workDir) {
        writeSourceFile(language, sourceCode, workDir);

        if (!"java".equals(language) && !"cpp".equals(language)) {
            // Python and JavaScript are interpreted: nothing to compile.
            return CompilationResult.ok();
        }

        String image = IMAGES.get(language);
        List<String> compileCommand = switch (language) {
            case "java" -> List.of("javac", "Main.java");
            case "cpp" -> List.of("g++", "-O2", "-o", "main", "main.cpp");
            default -> throw new IllegalStateException("Unsupported language: " + language);
        };

        if (!dockerEnabled) {
            return CompilationResult.ok();
        }

        ExecutionResult result = dockerManager.run(image, workDir, compileCommand, null);

        if (result.exitCode() != 0 && !result.timedOut()) {
            return CompilationResult.failed(result.stderr());
        }
        return CompilationResult.ok();
    }

    public ExecutionResult execute(String language, Path workDir, String stdin) {
        String image = IMAGES.get(language);
        List<String> runCommand = switch (language) {
            case "java" -> List.of("java", "Main");
            case "python" -> List.of("python3", "main.py");
            case "cpp" -> List.of("./main");
            case "javascript" -> List.of("node", "main.js");
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };

        if (!dockerEnabled) {
            log.warn("Docker execution disabled; returning a stub result. Enable Docker to run real submissions.");
            return new ExecutionResult(false, false, 0, "", "", 0);
        }

        return dockerManager.run(image, workDir, runCommand, stdin);
    }

    public Path prepareSandbox() throws IOException {
        return dockerManager.createWorkDir("sandbox-");
    }

    public void teardownSandbox(Path workDir) {
        cleanupService.cleanup(workDir);
    }

    private void writeSourceFile(String language, String sourceCode, Path workDir) {
        String fileName = SOURCE_FILE_NAMES.get(language);
        if (fileName == null) {
            throw new IllegalArgumentException("Unsupported language: " + language);
        }
        try {
            Files.writeString(workDir.resolve(fileName), sourceCode);
        } catch (IOException e) {
            throw new RuntimeException("Failed to write source file for sandbox", e);
        }
    }
}
