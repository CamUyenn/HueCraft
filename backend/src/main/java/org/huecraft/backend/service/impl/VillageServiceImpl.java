package org.huecraft.backend.service.impl;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.huecraft.backend.dto.VillageRequest;
import org.huecraft.backend.dto.VillageResponse;
import org.huecraft.backend.entity.Village;
import org.huecraft.backend.exception.ResourceNotFoundException;
import org.huecraft.backend.repository.VillageRepository;
import org.huecraft.backend.service.VillageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class VillageServiceImpl implements VillageService {

    private final VillageRepository villageRepository;

    @Override
    public VillageResponse create(VillageRequest request) {
        Village entity = new Village();
        applyRequest(entity, request);
        Village saved = villageRepository.save(entity);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VillageResponse> getAll() {
        return villageRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VillageResponse getById(Long id) {
        Village village = villageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Village not found with id: " + id));
        return toResponse(village);
    }

    @Override
    public VillageResponse update(Long id, VillageRequest request) {
        Village village = villageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Village not found with id: " + id));
        applyRequest(village, request);
        Village saved = villageRepository.save(village);
        return toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Village village = villageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Village not found with id: " + id));
        villageRepository.delete(village);
    }

    private void applyRequest(Village entity, VillageRequest request) {
        entity.setName(request.getName());
        entity.setDescription(request.getDescription());
        entity.setLocation(request.getLocation());
        entity.setCoverImageUrl(request.getCoverImageUrl());
        entity.setVrSceneUrl(request.getVrSceneUrl());
        entity.setAudioIntroUrl(request.getAudioIntroUrl());
    }

    private VillageResponse toResponse(Village v) {
        return VillageResponse.builder()
                .id(v.getId())
                .name(v.getName())
                .description(v.getDescription())
                .location(v.getLocation())
                .coverImageUrl(v.getCoverImageUrl())
                .vrSceneUrl(v.getVrSceneUrl())
                .audioIntroUrl(v.getAudioIntroUrl())
                .createdAt(v.getCreatedAt())
                .updatedAt(v.getUpdatedAt())
                .build();
    }
}
