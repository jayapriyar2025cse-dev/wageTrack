package com.example.wagetrack_api.controller;

import com.example.wagetrack_api.model.Worksite;
import com.example.wagetrack_api.service.worksiteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worksites")
public class worksiteController {

    private final worksiteService worksiteService;

    public worksiteController(worksiteService worksiteService) {
        this.worksiteService = worksiteService;
    }

    @PostMapping
    public ResponseEntity<Worksite> addWorksite(
            @Valid @RequestBody Worksite worksite) {

        return ResponseEntity.ok(
                worksiteService.addWorksite(worksite)
        );
    }

    @GetMapping
    public ResponseEntity<List<Worksite>> getAllWorksites() {

        return ResponseEntity.ok(
                worksiteService.getAllWorksites()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Worksite> getWorksiteById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                worksiteService.getWorksiteById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Worksite> updateWorksite(
            @PathVariable Long id,
            @Valid @RequestBody Worksite worksite) {

        return ResponseEntity.ok(
                worksiteService.updateWorksite(id, worksite)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorksite(
            @PathVariable Long id) {

        worksiteService.deleteWorksite(id);

        return ResponseEntity.ok(
                "Worksite deleted successfully"
        );
    }
}