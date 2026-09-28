package com.example.wagetrack_api.controller;

import com.example.wagetrack_api.model.User;
import com.example.wagetrack_api.model.worker;
import com.example.wagetrack_api.repository.workerRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class workerDashboardController {

    private final workerRepository workerRepository;

    public workerDashboardController(workerRepository workerRepository) {
        this.workerRepository = workerRepository;
    }

    @GetMapping("/worker-dashboard")
    public String workerDashboard(HttpSession session, Model model) {

        User user = (User) session.getAttribute("loggedInUser");

        if (user == null) {
            return "redirect:/login";
        }

        worker workerData = null;

        if (user.getWorkerId() != null) {
            workerData = workerRepository
                    .findById(user.getWorkerId())
                    .orElse(null);
        }

        model.addAttribute("user", user);
        model.addAttribute("worker", workerData);

        return "worker-dashboard";
    }
}