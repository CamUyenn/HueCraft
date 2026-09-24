package org.huecraft.backend.service;

import java.util.List;
import org.huecraft.backend.dto.VillageRequest;
import org.huecraft.backend.dto.VillageResponse;

public interface VillageService {
    VillageResponse create(VillageRequest request);
    List<VillageResponse> getAll();
    VillageResponse getById(Long id);
    VillageResponse update(Long id, VillageRequest request);
    void delete(Long id);
}
