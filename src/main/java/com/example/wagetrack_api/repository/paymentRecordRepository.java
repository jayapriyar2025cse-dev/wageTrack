package com.example.wagetrack_api.repository;

import com.example.wagetrack_api.model.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface paymentRecordRepository
        extends JpaRepository<PaymentRecord, Long> {

    // Get payments for one worker
    List<PaymentRecord> findByWorkerId(Long workerId);
}