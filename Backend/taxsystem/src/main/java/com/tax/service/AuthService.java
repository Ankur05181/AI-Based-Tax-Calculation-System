package com.tax.service;

import com.tax.config.JwtUtil;
import com.tax.model.User;
import com.tax.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // =========================
    // REGISTER
    // =========================
    public String register(User user) {

        if (user.getUsername() == null ||
                user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }

        if (user.getEmail() == null ||
                user.getEmail().trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        if (user.getPassword() == null ||
                user.getPassword().length() < 6) {
            throw new RuntimeException(
                    "Password must be at least 6 characters");
        }

        if (userRepository.existsByUsername(
                user.getUsername())) {

            throw new RuntimeException(
                    "Username already exists");
        }

        if (userRepository.existsByEmail(
                user.getEmail())) {

            throw new RuntimeException(
                    "Email already exists");
        }

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        userRepository.save(user);

        return "User registered successfully";
    }

    // =========================
    // LOGIN
    // =========================
    public String login(User user) {

        User dbUser = userRepository
                .findByUsername(
                        user.getUsername()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        boolean passwordMatches =
                passwordEncoder.matches(
                        user.getPassword(),
                        dbUser.getPassword()
                );

        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid password");
        }

        return jwtUtil.generateToken(
                dbUser.getUsername()
        );
    }
}