package com.tax.model;

public class TaxRequest {

    private double income;
    private double deduction80C;
    private double deduction80D;
    private double hraExemption;

    // =========================
    // GETTERS
    // =========================

    public double getIncome() {
        return income;
    }

    public double getDeduction80C() {
        return deduction80C;
    }

    public double getDeduction80D() {
        return deduction80D;
    }

    public double getHraExemption() {
        return hraExemption;
    }

    // =========================
    // SETTERS
    // =========================

    public void setIncome(double income) {
        this.income = income;
    }

    public void setDeduction80C(double deduction80C) {
        this.deduction80C = deduction80C;
    }

    public void setDeduction80D(double deduction80D) {
        this.deduction80D = deduction80D;
    }

    public void setHraExemption(double hraExemption) {
        this.hraExemption = hraExemption;
    }
}