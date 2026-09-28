package com.example.wagetrack_api.controller;

import com.example.wagetrack_api.model.PaymentRecord;
import com.example.wagetrack_api.model.worker;
import com.example.wagetrack_api.repository.workerRepository;
import com.example.wagetrack_api.service.paymentRecordService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class paymentRecordController {

    private paymentRecordService paymentRecordService;
    private workerRepository workerRepository;

    public paymentRecordController(
            paymentRecordService paymentRecordService,
            workerRepository workerRepository) {

        this.paymentRecordService = paymentRecordService;
        this.workerRepository = workerRepository;
    }

    // Add payment
    @PostMapping
    public ResponseEntity<PaymentRecord> addPayment(
            @RequestParam Long workerId,
            @Valid @RequestBody PaymentRecord paymentRecord) {

        worker worker = workerRepository.findById(workerId)
                .orElseThrow(() ->
                        new RuntimeException("Worker not found"));

        paymentRecord.setWorker(worker);

        return ResponseEntity.ok(
                paymentRecordService.addPayment(paymentRecord)
        );
    }

    // Get all payments
    @GetMapping
    public ResponseEntity<List<PaymentRecord>> getAllPayments() {

        return ResponseEntity.ok(
                paymentRecordService.getAllPayments()
        );
    }

    // Get payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<PaymentRecord> getPaymentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentRecordService.getPaymentById(id)
        );
    }

    // Update payment
    @PutMapping("/{id}")
    public ResponseEntity<PaymentRecord> updatePayment(
            @PathVariable Long id,
            @RequestParam Long workerId,
            @Valid @RequestBody PaymentRecord paymentRecord) {

        worker worker = workerRepository.findById(workerId)
                .orElseThrow(() ->
                        new RuntimeException("Worker not found"));

        paymentRecord.setWorker(worker);

        return ResponseEntity.ok(
                paymentRecordService.updatePayment(
                        id,
                        paymentRecord
                )
        );
    }

    // Delete payment
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePayment(
            @PathVariable Long id) {

        paymentRecordService.deletePayment(id);

        return ResponseEntity.ok(
                "Payment record deleted successfully"
        );
    }
}