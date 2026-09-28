package com.example.wagetrack_api.controller;

import com.example.wagetrack_api.model.PaymentRecord;
import com.example.wagetrack_api.model.User;
import com.example.wagetrack_api.model.worker;
import com.example.wagetrack_api.repository.workerRepository;
import com.example.wagetrack_api.service.paymentRecordService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class paymentRecordController {

    private final paymentRecordService paymentRecordService;
    private final workerRepository workerRepository;

    public paymentRecordController(
            paymentRecordService paymentRecordService,
            workerRepository workerRepository) {

        this.paymentRecordService = paymentRecordService;
        this.workerRepository = workerRepository;
    }


    // =========================
    // Admin - Add Payment
    // =========================

    @PostMapping
    public ResponseEntity<PaymentRecord> addPayment(
            @RequestParam Long workerId,
            @Valid @RequestBody PaymentRecord paymentRecord) {

        worker worker =
                workerRepository.findById(workerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );

        paymentRecord.setWorker(worker);

        return ResponseEntity.ok(
                paymentRecordService.addPayment(
                        paymentRecord
                )
        );
    }


    // =========================
    // Worker - Own Payments
    // =========================

    @GetMapping("/my")
    public ResponseEntity<List<PaymentRecord>> myPayments(
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
                paymentRecordService
                        .getPaymentsByWorkerId(
                                user.getWorkerId()
                        )
        );
    }


    // =========================
    // Admin - Get All Payments
    // =========================

    @GetMapping
    public ResponseEntity<List<PaymentRecord>> getAllPayments() {

        return ResponseEntity.ok(
                paymentRecordService.getAllPayments()
        );
    }


    // =========================
    // Get Payment By ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<PaymentRecord> getPaymentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentRecordService.getPaymentById(id)
        );
    }


    // =========================
    // Admin - Update Payment
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<PaymentRecord> updatePayment(
            @PathVariable Long id,
            @RequestParam Long workerId,
            @Valid @RequestBody PaymentRecord paymentRecord) {

        worker worker =
                workerRepository.findById(workerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Worker not found"
                                )
                        );

        paymentRecord.setWorker(worker);

        return ResponseEntity.ok(
                paymentRecordService.updatePayment(
                        id,
                        paymentRecord
                )
        );
    }


    // =========================
    // Admin - Delete Payment
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePayment(
            @PathVariable Long id) {

        paymentRecordService.deletePayment(id);

        return ResponseEntity.ok(
                "Payment record deleted successfully"
        );
    }
}