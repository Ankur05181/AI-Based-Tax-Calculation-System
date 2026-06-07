package com.tax.model;

public class TaxResponse {

    private double oldTax;
    private double newTax;
    private String recommendation;

    // =========================
    // CONSTRUCTOR
    // =========================
    public TaxResponse(double oldTax, double newTax, String recommendation) {
        this.oldTax = oldTax;
        this.newTax = newTax;
        this.recommendation = recommendation;
    }

    // =========================
    // GETTERS
    // =========================

    public double getOldTax() {
        return oldTax;
    }

    public double getNewTax() {
        return newTax;
    }

    public String getRecommendation() {
        return recommendation;
    }

    // =========================
    // OPTIONAL: SETTERS (recommended for JSON flexibility)
    // =========================

    public void setOldTax(double oldTax) {
        this.oldTax = oldTax;
    }

    public void setNewTax(double newTax) {
        this.newTax = newTax;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}