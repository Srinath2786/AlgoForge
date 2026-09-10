package com.codingplatform.docker;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * Since every execution runs with --rm, Docker removes containers itself.
 * This service just makes sure any leftover temp sandbox directories from
 * crashed submissions don't accumulate on disk.
 */
@Slf4j
@Component
public class ContainerCleanupService {

    public void cleanup(Path workDir) {
        if (workDir == null) return;
        try (var paths = Files.walk(workDir)) {
            paths.sorted(Comparator.reverseOrder()).forEach(p -> {
                try {
                    Files.deleteIfExists(p);
                } catch (IOException e) {
                    log.warn("Could not delete sandbox path {}: {}", p, e.getMessage());
                }
            });
        } catch (IOException e) {
            log.warn("Sandbox cleanup failed for {}: {}", workDir, e.getMessage());
        }
    }

    @Scheduled(fixedDelay = 3_600_000)
    public void scheduledSweep() {
        // Placeholder hook for a periodic sweep of /tmp/sandbox-* directories
        // older than N hours, in case a JVM crash skips per-submission cleanup.
        log.debug("Container cleanup sweep tick");
    }
}
