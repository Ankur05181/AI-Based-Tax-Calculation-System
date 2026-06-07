package com.tax.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tax_history")
public class TaxHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private double income;

    private double oldTax;

    private double newTax;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Default Constructor
    public TaxHistory() {
        this.createdAt = LocalDateTime.now();
    }

    // Parameterized Constructor
    public TaxHistory(
            String username,
            double income,
            double oldTax,
            double newTax
    ) {
        this.username = username;
        this.income = income;
        this.oldTax = oldTax;
        this.newTax = newTax;
        this.createdAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public double getIncome() {
        return income;
    }

    public double getOldTax() {
        return oldTax;
    }

    public double getNewTax() {
        return newTax;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setIncome(double income) {
        this.income = income;
    }

    public void setOldTax(double oldTax) {
        this.oldTax = oldTax;
    }

    public void setNewTax(double newTax) {
        this.newTax = newTax;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}