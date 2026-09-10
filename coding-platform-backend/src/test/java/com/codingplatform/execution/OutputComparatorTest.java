package com.codingplatform.execution;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class OutputComparatorTest {

    private final OutputComparator comparator = new OutputComparator();

    @Test
    void identicalOutputsMatch() {
        assertTrue(comparator.matches("0 1", "0 1"));
    }

    @Test
    void trailingWhitespaceAndNewlinesAreIgnored() {
        assertTrue(comparator.matches("0 1\n\n", "0 1"));
        assertTrue(comparator.matches("0 1\r\n", "0 1\n"));
    }

    @Test
    void extraInternalSpacesAreNormalized() {
        assertTrue(comparator.matches("0   1", "0 1"));
    }

    @Test
    void differentValuesDoNotMatch() {
        assertFalse(comparator.matches("0 2", "0 1"));
    }

    @Test
    void nullInputsNeverMatch() {
        assertFalse(comparator.matches(null, "0 1"));
        assertFalse(comparator.matches("0 1", null));
    }
}
