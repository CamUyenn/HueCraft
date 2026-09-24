package org.huecraft.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VillageRequest {

    @NotBlank
    @Size(max = 255)
    private String name;

    private String description;

    @Size(max = 512)
    private String location;

    @Size(max = 1024)
    private String coverImageUrl;

    @Size(max = 1024)
    private String vrSceneUrl;

    @Size(max = 1024)
    private String audioIntroUrl;
}
