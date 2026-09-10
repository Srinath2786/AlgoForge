package com.codingplatform.user;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import com.codingplatform.common.Role;
import com.codingplatform.user.entity.RoleAttributeConverter;

class RoleAttributeConverterTest {

    private final RoleAttributeConverter converter = new RoleAttributeConverter();

    @Test
    void shouldNormalizeLegacyRoleNames() {
        assertEquals(Role.ADMIN, converter.convertToEntityAttribute("ROLE_ADMIN"));
        assertEquals(Role.USER, converter.convertToEntityAttribute("ROLE_USER"));
        assertEquals(Role.ADMIN, converter.convertToEntityAttribute("ADMIN"));
    }

    @Test
    void shouldWritePlainEnumValuesToDatabase() {
        assertEquals("ADMIN", converter.convertToDatabaseColumn(Role.ADMIN));
        assertEquals("USER", converter.convertToDatabaseColumn(Role.USER));
    }
}
