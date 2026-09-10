package com.codingplatform.execution;

public record CompilationResult(
        boolean success,
        String errorOutput
) {
    public static CompilationResult ok() {
        return new CompilationResult(true, null);
    }

    public static CompilationResult failed(String errorOutput) {
        return new CompilationResult(false, errorOutput);
    }
}
