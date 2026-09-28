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

    @GetMapping("/attendance")
    public String attendance() {
        return "attendance";
    }

    @GetMapping("/weekly-summary")
    public String weeklySummary() {
        return "weekly-summary";
    }

    @GetMapping("/payments")
    public String payments() {
        return "payments";
    }
}