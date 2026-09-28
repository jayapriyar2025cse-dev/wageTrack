package com.example.wagetrack_api.repository;

import com.example.wagetrack_api.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface attendanceRepository extends JpaRepository<Attendance, Long> {

    // Get attendance for a particular worker between two dates
    List<Attendance> findByWorkerIdAndDateBetween(
            Long workerId,
            LocalDate startDate,
            LocalDate endDate
    );

    // Get all attendance records of a particular worker
    List<Attendance> findByWorkerId(Long workerId);
}