package com.codingplatform.docker;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.codingplatform.execution.ExecutionResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Wraps ProcessBuilder to run a submission inside a Docker sandbox and
 * enforce the CPU-timeout / memory-limit constraints from the spec.
 * Requires the Docker daemon to be reachable on the host running this
 * service (see execution.docker.enabled in application.yml).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DockerManager {

    private final DockerCommandBuilder commandBuilder;

    @Value("${execution.docker.memory-limit:512m}")
    private String memoryLimit;

    @Value("${execution.docker.cpu-timeout-seconds:5}")
    private long cpuTimeoutSeconds;

    @Value("${execution.docker.network-disabled:true}")
    private boolean networkDisabled;

    public ExecutionResult run(String image, Path workDir, List<String> command, String stdin) {
        long start = System.currentTimeMillis();
        List<String> dockerArgs = commandBuilder.build(image, workDir.toAbsolutePath().toString(),
                memoryLimit, networkDisabled, command);

        ProcessBuilder pb = new ProcessBuilder(dockerArgs);
        pb.redirectErrorStream(false);

        try {
            Process process = pb.start();

            if (stdin != null && !stdin.isEmpty()) {
                try (var os = process.getOutputStream()) {
                    os.write(stdin.getBytes());
                }
            } else {
                process.getOutputStream().close();
            }

            boolean finished = process.waitFor(cpuTimeoutSeconds, TimeUnit.SECONDS);
            long elapsed = System.currentTimeMillis() - start;

            if (!finished) {
                process.destroyForcibly();
                return new ExecutionResult(true, false, -1, "", "Time Limit Exceeded", elapsed);
            }

            String stdout = new String(process.getInputStream().readAllBytes());
            String stderr = new String(process.getErrorStream().readAllBytes());
            int exitCode = process.exitValue();

            // Docker's OOM killer typically returns exit code 137 (128 + SIGKILL).
            boolean memoryExceeded = exitCode == 137;

            return new ExecutionResult(false, memoryExceeded, exitCode, stdout, stderr, elapsed);

        } catch (IOException e) {
            log.error("Failed to start docker sandbox process", e);
            String message = e.getMessage() == null ? "Unknown Docker error" : e.getMessage();
            String normalized = message.toLowerCase();
            boolean dockerUnavailable =
                    normalized.contains("dockerdesktoplinuxengine")
                            || normalized.contains("docker api")
                            || normalized.contains("pipe")
                            || normalized.contains("cannot find the file specified");
            String friendlyMessage = dockerUnavailable
                    ? "Docker Desktop is not running or the Docker engine is not reachable. "
                            + "Start Docker Desktop and try again, or set DOCKER_EXECUTION_ENABLED=false for API-only work."
                    : "Sandbox execution failed: " + message;
            return new ExecutionResult(false, false, -1, "", friendlyMessage,
                    System.currentTimeMillis() - start);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return new ExecutionResult(false, false, -1, "", "Execution interrupted",
                    System.currentTimeMillis() - start);
        }
    }

    public Path createWorkDir(String prefix) throws IOException {
        return Files.createTempDirectory(prefix);
    }
}
