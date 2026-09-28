package com.example.wagetrack_api.controller;

import com.example.wagetrack_api.model.Attendance;
import com.example.wagetrack_api.model.Worksite;
import com.example.wagetrack_api.model.worker;
import com.example.wagetrack_api.repository.worksiteRepository;
import com.example.wagetrack_api.repository.workerRepository;
import com.example.wagetrack_api.service.attendanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class attendanceController {

    private attendanceService attendanceService;
    private workerRepository workerRepository;
    private worksiteRepository worksiteRepository;

    public attendanceController(
            attendanceService attendanceService,
            workerRepository workerRepository,
            worksiteRepository worksiteRepository) {

        this.attendanceService = attendanceService;
        this.workerRepository = workerRepository;
        this.worksiteRepository = worksiteRepository;
    }

    // Add attendance
    @PostMapping
    public ResponseEntity<Attendance> addAttendance(
            @RequestParam Long workerId,
            @RequestParam Long worksiteId,
            @Valid @RequestBody Attendance attendance) {

        worker worker = workerRepository.findById(workerId)
                .orElseThrow(() ->
                        new RuntimeException("Worker not found"));

        Worksite worksite = worksiteRepository.findById(worksiteId)
                .orElseThrow(() ->
                        new RuntimeException("Worksite not found"));

        attendance.setWorker(worker);
        attendance.setWorksite(worksite);

        return ResponseEntity.ok(
                attendanceService.addAttendance(attendance)
        );
    }

    // Get weekly wage summary
    @GetMapping("/weekly-summary")
    public ResponseEntity<Map<String, Object>> getWeeklyWageSummary(
            @RequestParam Long workerId,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        return ResponseEntity.ok(
                attendanceService.getWeeklyWageSummary(
                        workerId,
                        start,
                        end
                )
        );
    }

    // Get all attendance
    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance()
        );
    }

    // Get attendance by ID
    @GetMapping("/{id}")
    public ResponseEntity<Attendance> getAttendanceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceById(id)
        );
    }

    // Update attendance
    @PutMapping("/{id}")
    public ResponseEntity<Attendance> updateAttendance(
            @PathVariable Long id,
            @RequestParam Long workerId,
            @RequestParam Long worksiteId,
            @Valid @RequestBody Attendance attendance) {

        worker worker = workerRepository.findById(workerId)
                .orElseThrow(() ->
                        new RuntimeException("Worker not found"));

        Worksite worksite = worksiteRepository.findById(worksiteId)
                .orElseThrow(() ->
                        new RuntimeException("Worksite not found"));

        attendance.setWorker(worker);
        attendance.setWorksite(worksite);

        return ResponseEntity.ok(
                attendanceService.updateAttendance(
                        id,
                        attendance
                )
        );
    }

    // Delete attendance
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return ResponseEntity.ok(
                "Attendance deleted successfully"
        );
    }
}