package com.example.wagetrack_api.controller;

import com.example.wagetrack_api.model.User;
import com.example.wagetrack_api.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    private final UserService userService;

    public LoginController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password,
            Model model,
            HttpSession session) {

        System.out.println("=================================");
        System.out.println("LOGIN ATTEMPT");
        System.out.println("Username entered: " + username);

        User user = userService.login(username, password);

        if (user != null) {

            System.out.println("User found: YES");
            System.out.println("Database username: " + user.getUsername());
            System.out.println("User role: " + user.getRole());
            System.out.println("Worker ID: " + user.getWorkerId());

            session.setAttribute("loggedInUser", user);

            if ("ADMIN".equals(user.getRole())) {

                System.out.println("REDIRECTING TO ADMIN DASHBOARD");
                System.out.println("=================================");

                return "redirect:/dashboard";
            }

            if ("WORKER".equals(user.getRole())) {

                System.out.println("REDIRECTING TO WORKER DASHBOARD");
                System.out.println("=================================");

                return "redirect:/worker-dashboard";
            }
        }

        System.out.println("User found: NO");
        System.out.println("LOGIN FAILED");
        System.out.println("=================================");

        model.addAttribute("error", "Invalid username or password");

        return "login";
    }
}
