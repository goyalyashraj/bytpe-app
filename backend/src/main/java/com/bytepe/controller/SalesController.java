package com.bytepe.controller;

import com.bytepe.config.JwtAuthFilter.CustomUserDetails;
import com.bytepe.dto.SaleRequest;
import com.bytepe.model.SalesLedger;
import com.bytepe.service.SalesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final SalesService salesService;

    public SalesController(SalesService salesService) {
        this.salesService = salesService;
    }

    @PostMapping
    public ResponseEntity<SalesLedger> createSale(@RequestBody SaleRequest req, Authentication auth) {
        CustomUserDetails details = (CustomUserDetails) auth.getDetails();
        String partnerId = details.partnerId();
        
        if (partnerId == null || partnerId.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        SalesLedger sale = salesService.createSale(req, partnerId, details.phone());
        return ResponseEntity.ok(sale);
    }

    @GetMapping
    public ResponseEntity<List<SalesLedger>> getSales(Authentication auth) {
        CustomUserDetails details = (CustomUserDetails) auth.getDetails();
        String role = details.role();

        if ("ADMIN".equals(role)) {
            return ResponseEntity.ok(salesService.getAllSales());
        } else if ("SALESMAN".equals(role)) {
            return ResponseEntity.ok(salesService.getSalesBySalesman(details.userId()));
        } else {
            return ResponseEntity.ok(salesService.getSalesByPartner(details.partnerId()));
        }
    }
}
