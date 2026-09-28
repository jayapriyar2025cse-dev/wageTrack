package com.example.wagetrack_api.controller;

import com.example.wagetrack_api.model.worker;
import com.example.wagetrack_api.service.workerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
public class workerController {

    private final workerService workerService;

    public workerController(workerService workerService) {
        this.workerService = workerService;
    }

    @PostMapping
    public ResponseEntity<worker> addWorker(
            @Valid @RequestBody worker worker) {

        return ResponseEntity.ok(
                workerService.addWorker(worker)
        );
    }

    @GetMapping
    public ResponseEntity<List<worker>> getAllWorkers() {

        return ResponseEntity.ok(
                workerService.getAllWorkers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<worker> getWorkerById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                workerService.getWorkerById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<worker> updateWorker(
            @PathVariable Long id,
            @Valid @RequestBody worker worker) {

        return ResponseEntity.ok(
                workerService.updateWorker(id, worker)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorker(
            @PathVariable Long id) {

        workerService.deleteWorker(id);

        return ResponseEntity.ok(
                "Worker deleted successfully"
        );
    }
}