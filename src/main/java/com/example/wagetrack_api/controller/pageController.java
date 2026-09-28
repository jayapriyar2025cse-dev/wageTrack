package com.example.wagetrack_api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class pageController {

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/workers")
    public String workers() {
        return "workers";
    }

    @GetMapping("/worksites")
    public String worksites() {
        return "worksites";
    }

    // Admin Attendance
    @GetMapping("/attendance")
    public String attendance() {
        return "attendance";
    }

    // Worker Attendance
    @GetMapping("/worker-attendance")
    public String workerAttendance() {
        return "attendance";
    }

    // Admin Weekly Summary
    @GetMapping("/weekly-summary")
    public String weeklySummary() {
        return "weekly-summary";
    }

    // Worker Weekly Summary
    @GetMapping("/worker-weekly-summary")
    public String workerWeeklySummary() {
        return "weekly-summary";
    }

    // Admin Payments
    @GetMapping("/payments")
    public String payments() {
        return "payments";
    }

    // Worker Payments
    @GetMapping("/worker-payments")
    public String workerPayments() {
        return "payments";
    }
}