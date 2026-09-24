package org.huecraft.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.huecraft.backend.entity.base.BaseAuditable;
import org.huecraft.backend.entity.enums.LanguagePreference;
import org.huecraft.backend.entity.enums.Role;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "uk_user_email", columnList = "email", unique = true)
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", length = 255)
    private String fullName;

    @Column(name = "email", length = 255, nullable = false, unique = true)
    private String email;

    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @Column(name = "phone", length = 50)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 20, nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "language_preference", length = 5)
    private LanguagePreference languagePreference;

    @Column(name = "avatar_url", length = 1024)
    private String avatarUrl;
}
