package org.huecraft.backend.dto;

import java.time.Instant;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VillageResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private String coverImageUrl;
    private String vrSceneUrl;
    private String audioIntroUrl;
    private Instant createdAt;
    private Instant updatedAt;
}
