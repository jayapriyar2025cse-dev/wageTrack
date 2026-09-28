package com.example.wagetrack_api.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LogoutController {

    @GetMapping("/logout")
    public String logout(HttpSession session) {

        // Clear the logged-in user session
        session.invalidate();

        // Go back to login page
        return "redirect:/login";
    }
}