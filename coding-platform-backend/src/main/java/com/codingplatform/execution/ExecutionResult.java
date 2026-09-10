package com.codingplatform.execution;

public record ExecutionResult(
        boolean timedOut,
        boolean memoryExceeded,
        int exitCode,
        String stdout,
        String stderr,
        long executionTimeMs
) {
    public boolean isSuccessful() {
        return !timedOut && !memoryExceeded && exitCode == 0;
    }
}
