package com.example.wagetrack_api.repository;

import com.example.wagetrack_api.model.PaymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface paymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
}
