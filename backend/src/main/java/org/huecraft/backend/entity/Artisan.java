package org.huecraft.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.huecraft.backend.entity.base.BaseAuditable;

@Entity
@Table(name = "artisans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artisan extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // optional link to User with role ARTISAN

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "village_id", nullable = false)
    private Village village;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Lob
    @Column(name = "bio")
    private String bio;

    @Column(name = "avatar_url", length = 1024)
    private String avatarUrl;
}
