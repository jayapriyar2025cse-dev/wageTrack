package com.example.wagetrack_api.repository;

import com.example.wagetrack_api.model.worker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface workerRepository extends JpaRepository<worker, Long> {
}