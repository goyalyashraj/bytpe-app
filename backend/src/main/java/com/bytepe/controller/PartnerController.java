package com.bytepe.controller;

import com.bytepe.config.JwtAuthFilter.CustomUserDetails;
import com.bytepe.dto.PartnerRegistrationRequest;
import com.bytepe.model.Partner;
import com.bytepe.service.PartnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partners")
public class PartnerController {

    private final PartnerService partnerService;

    public PartnerController(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    @PostMapping("/register")
    public ResponseEntity<Partner> registerPartner(@RequestBody PartnerRegistrationRequest req, Authentication auth) {
        String registeredBy = (auth != null && auth.getDetails() instanceof CustomUserDetails d) ? d.userId() : "SELF_ONBOARDING";
        Partner p = partnerService.registerPartner(req, registeredBy);
        return ResponseEntity.ok(p);
    }

    @GetMapping
    public ResponseEntity<List<Partner>> getPartners(Authentication auth) {
        CustomUserDetails details = (CustomUserDetails) auth.getDetails();
        String role = details.role();

        if ("ADMIN".equals(role)) {
            return ResponseEntity.ok(partnerService.getAllPartners());
        } else if ("SALESMAN".equals(role)) {
            return ResponseEntity.ok(partnerService.getPartnersBySalesman(details.userId()));
        } else {
            return ResponseEntity.ok(partnerService.getAllPartners().stream()
                    .filter(p -> p.getId().equals(details.partnerId()))
                    .toList());
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Partner>> getPendingPartners() {
        return ResponseEntity.ok(partnerService.getPendingPartners());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Partner> approvePartner(@PathVariable String id) {
        return ResponseEntity.ok(partnerService.approvePartner(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Partner> rejectPartner(@PathVariable String id) {
        return ResponseEntity.ok(partnerService.rejectPartner(id));
    }
}
