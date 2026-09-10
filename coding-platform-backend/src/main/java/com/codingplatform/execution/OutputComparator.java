package com.codingplatform.execution;

import org.springframework.stereotype.Component;

/**
 * Compares actual vs expected output with whitespace normalization,
 * matching the judge behaviour described in the project spec: trailing
 * whitespace, line-ending, and multiple-space differences are ignored.
 */
@Component
public class OutputComparator {

    public boolean matches(String actual, String expected) {
        if (actual == null || expected == null) {
            return false;
        }
        return normalize(actual).equals(normalize(expected));
    }

    private String normalize(String s) {
        String[] lines = s.replace("\r\n", "\n").strip().split("\n");
        StringBuilder sb = new StringBuilder();
        for (String line : lines) {
            sb.append(line.strip().replaceAll("\\s+", " ")).append('\n');
        }
        return sb.toString().strip();
    }
}
