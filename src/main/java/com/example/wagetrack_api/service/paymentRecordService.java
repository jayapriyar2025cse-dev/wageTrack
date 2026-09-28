package com.example.wagetrack_api.service;

import com.example.wagetrack_api.model.PaymentRecord;
import com.example.wagetrack_api.repository.paymentRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class paymentRecordService {

    private final paymentRecordRepository paymentRecordRepository;

    public paymentRecordService(paymentRecordRepository paymentRecordRepository) {
        this.paymentRecordRepository = paymentRecordRepository;
    }

    public PaymentRecord addPayment(PaymentRecord paymentRecord) {
        return paymentRecordRepository.save(paymentRecord);
    }

    public List<PaymentRecord> getAllPayments() {
        return paymentRecordRepository.findAll();
    }

    public PaymentRecord getPaymentById(Long id) {
        return paymentRecordRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Payment record not found"));
    }

    public PaymentRecord updatePayment(
            Long id,
            PaymentRecord paymentRecord) {

        PaymentRecord existingPayment =
                paymentRecordRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment record not found"));

        existingPayment.setWorker(paymentRecord.getWorker());
        existingPayment.setPaymentDate(paymentRecord.getPaymentDate());
        existingPayment.setAmount(paymentRecord.getAmount());

        return paymentRecordRepository.save(existingPayment);
    }

    public void deletePayment(Long id) {

        PaymentRecord existingPayment =
                paymentRecordRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment record not found"));

        paymentRecordRepository.delete(existingPayment);
    }
}