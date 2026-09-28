package com.example.wagetrack_api.controller;

import com.example.wagetrack_api.model.Attendance;
import com.example.wagetrack_api.model.User;
import com.example.wagetrack_api.model.Worksite;
import com.example.wagetrack_api.model.worker;
import com.example.wagetrack_api.repository.worksiteRepository;
import com.example.wagetrack_api.repository.workerRepository;
import com.example.wagetrack_api.service.attendanceService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class attendanceController {

    private final attendanceService attendanceService;
    private final workerRepository workerRepository;
    private final worksiteRepository worksiteRepository;

    public attendanceController(
            attendanceService attendanceService,
            workerRepository workerRepository,
            worksiteRepository worksiteRepository) {

        this.attendanceService = attendanceService;
        this.workerRepository = workerRepository;
        this.worksiteRepository = worksiteRepository;
    }


    // =========================
    // Admin - Add Attendance
    // =========================

    @PostMapping
    public ResponseEntity<Attendance> addAttendance(
            @RequestParam Long workerId,
            @RequestParam Long worksiteId,
            @Valid @RequestBody Attendance attendance) {

        worker worker =
                workerRepository.findById(workerId)
                        .orElseThrow();

        Worksite worksite =
                worksiteRepository.findById(worksiteId)
                        .orElseThrow();

        attendance.setWorker(worker);
        attendance.setWorksite(worksite);

        return ResponseEntity.ok(
                attendanceService.addAttendance(attendance)
        );
    }


    // =========================
    // Worker - Own Attendance
    // =========================

    @GetMapping("/my")
    public ResponseEntity<List<Attendance>> myAttendance(
            HttpSession session) {

        User user =
                (User) session.getAttribute(
                        "loggedInUser"
                );


        if (user == null) {

            return ResponseEntity
                    .status(401)
                    .build();
        }


        if (user.getWorkerId() == null) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        return ResponseEntity.ok(
                attendanceService.getAttendanceByWorkerId(
                        user.getWorkerId()
                )
        );
    }


    // =========================
    // Worker - Own Weekly Summary
    // =========================

    @GetMapping("/my-weekly-summary")
    public ResponseEntity<Map<String, Object>> myWeeklySummary(
            @RequestParam String startDate,
            @RequestParam String endDate,
            HttpSession session) {

        User user =
                (User) session.getAttribute(
                        "loggedInUser"
                );


        if (user == null) {

            return ResponseEntity
                    .status(401)
                    .build();
        }


        if (user.getWorkerId() == null) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }


        LocalDate start =
                LocalDate.parse(startDate);

        LocalDate end =
                LocalDate.parse(endDate);


        return ResponseEntity.ok(
                attendanceService.getWeeklyWageSummary(
                        user.getWorkerId(),
                        start,
                        end
                )
        );
    }


    // =========================
    // Admin - All Attendance
    // =========================

    @GetMapping
    public List<Attendance> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }


    // =========================
    // Admin - Weekly Summary
    // =========================

    @GetMapping("/weekly-summary")
    public ResponseEntity<Map<String, Object>> getWeeklyWageSummary(
            @RequestParam Long workerId,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        LocalDate start =
                LocalDate.parse(startDate);

        LocalDate end =
                LocalDate.parse(endDate);


        return ResponseEntity.ok(
                attendanceService.getWeeklyWageSummary(
                        workerId,
                        start,
                        end
                )
        );
    }


    // =========================
    // Get Attendance By ID
    // =========================

    @GetMapping("/{id}")
    public Attendance getAttendanceById(
            @PathVariable Long id) {

        return attendanceService.getAttendanceById(id);
    }


    // =========================
    // Admin - Update Attendance
    // =========================

    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @RequestParam Long workerId,
            @RequestParam Long worksiteId,
            @Valid @RequestBody Attendance attendance) {

        worker worker =
                workerRepository.findById(workerId)
                        .orElseThrow();

        Worksite worksite =
                worksiteRepository.findById(worksiteId)
                        .orElseThrow();

        attendance.setWorker(worker);
        attendance.setWorksite(worksite);


        return attendanceService.updateAttendance(
                id,
                attendance
        );
    }


    // =========================
    // Admin - Delete Attendance
    // =========================

    @DeleteMapping("/{id}")
    public String deleteAttendance(
            @PathVariable Long id) {

        attendanceService.deleteAttendance(id);

        return "Attendance deleted successfully";
    }
}