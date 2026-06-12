package com.tax.repository;

import com.tax.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // used in login
    Optional<User> findByUsername(String username);

    // used in registration (email uniqueness check)
    Optional<User> findByEmail(String email);

    // OPTIONAL (future upgrade for validation/debugging)
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}