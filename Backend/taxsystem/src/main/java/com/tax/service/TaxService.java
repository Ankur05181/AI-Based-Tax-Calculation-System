package com.tax.service;

import com.tax.config.JwtUtil;
import com.tax.model.TaxHistory;
import com.tax.model.TaxRequest;
import com.tax.model.TaxResponse;
import com.tax.repository.TaxHistoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaxService {

    private final TaxHistoryRepository historyRepo;
    private final JwtUtil jwtUtil;

    public TaxService(
            TaxHistoryRepository historyRepo,
            JwtUtil jwtUtil
    ) {
        this.historyRepo = historyRepo;
        this.jwtUtil = jwtUtil;
    }

    // =========================
    // CALCULATE TAX
    // =========================
    public TaxResponse calculateTax(
            TaxRequest request,
            String token
    ) {

        if (token == null || token.isBlank()) {
            throw new RuntimeException(
                    "Invalid or Missing Token"
            );
        }

        String jwt = token.startsWith("Bearer ")
                ? token.substring(7)
                : token;

        String username =
                jwtUtil.extractUsername(jwt);

        double income =
                request.getIncome();

        double deduction80C =
        Math.max(
                0,
                Math.min(
                        request.getDeduction80C(),
                        150000
                )
        );

double deduction80D =
        Math.max(
                0,
                Math.min(
                        request.getDeduction80D(),
                        25000
                )
        );

double hraExemption =
        Math.max(
                0,
                request.getHraExemption()
        );
        // =========================
        // OLD REGIME
        // =========================
        double oldTaxable =
                income
                        - deduction80C
                        - deduction80D
                        - hraExemption
                        - 50000;

        oldTaxable =
                Math.max(oldTaxable, 0);

        double oldTax =
                calculateOldTax(oldTaxable);

        if (oldTaxable <= 500000) {
            oldTax = 0;
        }

        // =========================
        // NEW REGIME
        // =========================
        double newTaxable =
                income - 75000;

        newTaxable =
                Math.max(newTaxable, 0);

        double newTax =
                calculateNewTax(newTaxable);

        if (newTaxable <= 1200000) {
            newTax = 0;
        }
        // Health & Education Cess (4%)
        oldTax = oldTax + (oldTax * 0.04);
        newTax = newTax + (newTax * 0.04);

        // =========================
        // INCOME CATEGORY
        // =========================
        String incomeCategory;

        if (income <= 1200000) {

            incomeCategory =
                    "Low Income Category";

        } else if (income <= 2400000) {

            incomeCategory =
                    "Middle Income Category";

        } else {

            incomeCategory =
                    "High Income Category";
        }

        // =========================
        // TAX SAVINGS
        // =========================
        double savings =
                Math.abs(oldTax - newTax);

        // =========================
        // AI RECOMMENDATION
        // =========================
        String recommendation;

        if (newTax < oldTax) {

            recommendation =
                    "🟢 New Regime is better.\n" +
                    "Estimated Savings: ₹" +
                    String.format("%,.2f", savings) +
                    "\nIncome Category: " +
                    incomeCategory;

        } else if (oldTax < newTax) {

            recommendation =
                    "🟡 Old Regime is better.\n" +
                    "Estimated Savings: ₹" +
                    String.format("%,.2f", savings) +
                    "\nIncome Category: " +
                    incomeCategory +
                    "\nYour deductions are beneficial.";

        } else {

            recommendation =
                    "🔵 Both regimes provide the same tax liability.\n" +
                    "Income Category: " +
                    incomeCategory;
        }

        // =========================
        // SAVE HISTORY
        // =========================
        TaxHistory history =
                new TaxHistory(
                        username,
                        income,
                        oldTax,
                        newTax
                );

        historyRepo.save(history);

        // =========================
        // RESPONSE
        // =========================
        return new TaxResponse(
                oldTax,
                newTax,
                recommendation
        );
    }

    // =========================
    // HISTORY
    // =========================
    public List<TaxHistory> getHistory(
            String username
    ) {
        return historyRepo.findByUsername(
                username
        );
    }
    public void clearHistory(String username) {

    historyRepo.clearHistory(username);
}

    // =========================
    // OLD REGIME
    // =========================
    private double calculateOldTax(
            double income
    ) {

        if (income <= 250000)
            return 0;

        else if (income <= 500000)
            return (income - 250000) * 0.05;

        else if (income <= 1000000)
            return 12500 +
                    (income - 500000) * 0.20;

        else
            return 112500 +
                    (income - 1000000) * 0.30;
    }

    // =========================
    // NEW REGIME
    // =========================
    private double calculateNewTax(
            double income
    ) {

        if (income <= 400000)
            return 0;

        else if (income <= 800000)
            return (income - 400000) * 0.05;

        else if (income <= 1200000)
            return 20000 +
                    (income - 800000) * 0.10;

        else if (income <= 1600000)
            return 60000 +
                    (income - 1200000) * 0.15;

        else if (income <= 2000000)
            return 120000 +
                    (income - 1600000) * 0.20;

        else if (income <= 2400000)
            return 200000 +
                    (income - 2000000) * 0.25;

        else
            return 300000 +
                    (income - 2400000) * 0.30;
    }
    
}