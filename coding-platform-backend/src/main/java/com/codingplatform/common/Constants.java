package com.codingplatform.common;

public final class Constants {

    private Constants() {}

    public static final String API_BASE = "/api";

    public static final int MAX_SUBMISSIONS_PER_MINUTE = 5;

    public static final long DEFAULT_TIME_LIMIT_MS = 5000;
    public static final long DEFAULT_MEMORY_LIMIT_MB = 512;

    public static final String[] SUPPORTED_LANGUAGES = {"java", "python", "cpp", "javascript"};
}
