package com.tax.controller;

import com.tax.model.*;
import com.tax.service.TaxService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tax")
@CrossOrigin(
    origins = "*",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
    }
)
public class TaxController {

    private final TaxService service;

    public TaxController(TaxService service) {
        this.service = service;
    }

    // =========================
    // TAX CALCULATION (FIXED)
    // =========================
    @PostMapping("/calculate")
    public TaxResponse calculate(
            @RequestBody TaxRequest request,
            @RequestHeader("Authorization") String token
    ) {
        return service.calculateTax(request, token);
    }
// =========================
// HISTORY
// =========================
@GetMapping("/history")
public List<TaxHistory> getHistory(
        @RequestParam String username) {

    return service.getHistory(username);
}

// =========================
// CLEAR HISTORY
// =========================
@PostMapping("/history/clear")
public String clearHistory(
        @RequestParam String username) {

    try {

        System.out.println(
                "CLEAR HISTORY CALLED: " +
                username
        );

        service.clearHistory(username);

        System.out.println(
                "HISTORY CLEARED SUCCESSFULLY"
        );

        return "History cleared";

    } catch (Exception e) {

        e.printStackTrace();

        return e.getMessage();
    }
}
}
