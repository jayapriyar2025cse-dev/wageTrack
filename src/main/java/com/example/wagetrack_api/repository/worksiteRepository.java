package com.example.wagetrack_api.repository;

import com.example.wagetrack_api.model.Worksite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface worksiteRepository extends JpaRepository<Worksite, Long> {
}