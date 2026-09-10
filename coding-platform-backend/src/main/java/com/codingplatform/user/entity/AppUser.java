
package com.codingplatform.user.entity;

import com.codingplatform.common.BaseEntity;
import com.codingplatform.common.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Mapped to the existing "users" table. Named AppUser to avoid clashing
 * with java.security.acl.Owner / Spring Security's User class.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppUser extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Convert(converter = RoleAttributeConverter.class)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Role role = Role.USER;

    @Builder.Default
    private boolean enabled = true;

    @Column(name = "full_name", length = 120)
    private String fullName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(length = 255)
    private String website;

    @Column(name = "linked_in", length = 255)
    private String linkedIn;

    @Column(length = 255)
    private String github;

    @Column(length = 120)
    private String location;
}
