package org.huecraft.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.huecraft.backend.entity.base.BaseAuditable;

@Entity
@Table(name = "villages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Village extends BaseAuditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "location", length = 512)
    private String location;

    @Column(name = "cover_image_url", length = 1024)
    private String coverImageUrl;

    @Column(name = "vr_scene_url", length = 1024)
    private String vrSceneUrl;

    @Column(name = "audio_intro_url", length = 1024)
    private String audioIntroUrl;
}
