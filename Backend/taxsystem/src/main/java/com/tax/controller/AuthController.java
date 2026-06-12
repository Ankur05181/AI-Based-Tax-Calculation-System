package com.tax.controller;

import jakarta.validation.Valid;
import com.tax.model.User;
import com.tax.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService
    ) {
        this.authService = authService;
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
     public ResponseEntity<?> register(
        @Valid @RequestBody User user
   ){

        try {

            String message =
                    authService.register(user);

            return ResponseEntity.ok(message);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User user
    ) {

        try {

            String token =
                    authService.login(user);

            return ResponseEntity.ok(token);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}