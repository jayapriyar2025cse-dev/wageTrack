package com.example.wagetrack_api.service;

import com.example.wagetrack_api.model.Attendance;
import com.example.wagetrack_api.model.worker;
import com.example.wagetrack_api.repository.attendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class attendanceService {

    private attendanceRepository attendanceRepository;

    public attendanceService(attendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    // Add attendance
    public Attendance addAttendance(Attendance attendance) {

        if (attendance.getStatus() == null ||
                attendance.getStatus().trim().isEmpty()) {

            throw new RuntimeException("Attendance status is required");
        }

        String status = attendance.getStatus().toUpperCase();

        if (!status.equals("PRESENT") &&
                !status.equals("HALF_DAY") &&
                !status.equals("ABSENT")) {

            throw new RuntimeException(
                    "Status must be PRESENT, HALF_DAY or ABSENT");
        }

        attendance.setStatus(status);

        // Half-day and absent cannot have overtime
        if (status.equals("HALF_DAY") ||
                status.equals("ABSENT")) {

            attendance.setOvertimeHours(0);
        }

        return attendanceRepository.save(attendance);
    }

    // Get all attendance
    public List<Attendance> getAllAttendance() {

        return attendanceRepository.findAll();
    }

    // Get attendance by ID
    public Attendance getAttendanceById(Long id) {

        return attendanceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Attendance not found"));
    }

    // Update attendance
    public Attendance updateAttendance(
            Long id,
            Attendance attendance) {

        Attendance existingAttendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance not found"));

        existingAttendance.setWorker(
                attendance.getWorker());

        existingAttendance.setWorksite(
                attendance.getWorksite());

        existingAttendance.setDate(
                attendance.getDate());

        if (attendance.getStatus() == null ||
                attendance.getStatus().trim().isEmpty()) {

            throw new RuntimeException(
                    "Attendance status is required");
        }

        String status =
                attendance.getStatus().toUpperCase();

        if (!status.equals("PRESENT") &&
                !status.equals("HALF_DAY") &&
                !status.equals("ABSENT")) {

            throw new RuntimeException(
                    "Status must be PRESENT, HALF_DAY or ABSENT");
        }

        existingAttendance.setStatus(status);

        if (status.equals("HALF_DAY") ||
                status.equals("ABSENT")) {

            existingAttendance.setOvertimeHours(0);

        } else {

            existingAttendance.setOvertimeHours(
                    attendance.getOvertimeHours());
        }

        return attendanceRepository.save(
                existingAttendance);
    }

    // Delete attendance
    public void deleteAttendance(Long id) {

        Attendance attendance =
                attendanceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Attendance not found"));

        attendanceRepository.delete(attendance);
    }

    // Calculate regular wage
    public double calculateRegularWage(
            Attendance attendance) {

        if (attendance.getWorker() == null) {
            throw new RuntimeException(
                    "Worker is required");
        }

        double dailyWage =
                attendance.getWorker().getDailyWage();

        if (attendance.getStatus()
                .equalsIgnoreCase("PRESENT")) {

            return dailyWage;
        }

        if (attendance.getStatus()
                .equalsIgnoreCase("HALF_DAY")) {

            return dailyWage / 2;
        }

        return 0;
    }

    // Weekly wage summary
    public Map<String, Object> getWeeklyWageSummary(
            Long workerId,
            LocalDate startDate,
            LocalDate endDate) {

        if (endDate.isBefore(startDate)) {

            throw new RuntimeException(
                    "End date cannot be before start date");
        }

        List<Attendance> attendanceList =
                attendanceRepository.findByWorkerIdAndDateBetween(
                        workerId,
                        startDate,
                        endDate
                );

        if (attendanceList.isEmpty()) {

            throw new RuntimeException(
                    "No attendance records found for this worker");
        }

        worker worker =
                attendanceList.get(0).getWorker();

        double regularWage = 0;
        double overtimePay = 0;

        // Standard workday
        final double STANDARD_WORKDAY_HOURS = 8;

        // Overtime multiplier
        final double OVERTIME_MULTIPLIER = 1.5;

        for (Attendance attendance : attendanceList) {

            double dailyWage =
                    worker.getDailyWage();

            // Regular wage
            if (attendance.getStatus()
                    .equalsIgnoreCase("PRESENT")) {

                regularWage += dailyWage;

            } else if (attendance.getStatus()
                    .equalsIgnoreCase("HALF_DAY")) {

                regularWage += dailyWage / 2;
            }

            // Overtime wage
            double hourlyWage =
                    dailyWage / STANDARD_WORKDAY_HOURS;

            overtimePay +=
                    attendance.getOvertimeHours()
                    * hourlyWage
                    * OVERTIME_MULTIPLIER;
        }

        double totalPayable =
                regularWage + overtimePay;

        Map<String, Object> summary =
                new HashMap<>();

        summary.put("workerId", worker.getId());
        summary.put("workerName", worker.getName());
        summary.put("startDate", startDate);
        summary.put("endDate", endDate);
        summary.put("regularWage", regularWage);
        summary.put("overtimePay", overtimePay);
        summary.put("totalPayable", totalPayable);

        return summary;
    }
}