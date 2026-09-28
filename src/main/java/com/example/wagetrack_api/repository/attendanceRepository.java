package com.example.wagetrack_api.repository;

import com.example.wagetrack_api.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface attendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByWorkerIdAndDateBetween(
            Long workerId,
            LocalDate startDate,
            LocalDate endDate
    );
}