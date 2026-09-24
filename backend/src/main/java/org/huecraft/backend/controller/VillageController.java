package org.huecraft.backend.controller;

import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.huecraft.backend.dto.VillageRequest;
import org.huecraft.backend.dto.VillageResponse;
import org.huecraft.backend.service.VillageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/villages")
@RequiredArgsConstructor
public class VillageController {

    private final VillageService villageService;
//
/// enpoint 1 : api/villages : tạo mới 1 làng

    @PostMapping
    public ResponseEntity<VillageResponse> create(@RequestBody @Valid VillageRequest request) {
        VillageResponse created = villageService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    /// enpoint 2 :  api/villages	lấy danh sách lang
    @GetMapping
    public ResponseEntity<List<VillageResponse>> getAll() {
        List<VillageResponse> villages = villageService.getAll();
        return ResponseEntity.ok(villages);
    }

    ///api/villages/{id}	chi tieest làng theo id
    @GetMapping("/{id}")
    public ResponseEntity<VillageResponse> getById(@PathVariable Long id) {
        VillageResponse village = villageService.getById(id);
        return ResponseEntity.ok(village);
    }

    @PutMapping("/{id}") // câp nhat thong tin
    public ResponseEntity<VillageResponse> update(@PathVariable Long id,
                                                  @RequestBody @Valid VillageRequest request) {
        VillageResponse updated = villageService.update(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}") //xoa lang nghje theo id
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        villageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
