package com.bytepe.service;

import com.bytepe.dto.PartnerRegistrationRequest;
import com.bytepe.model.Partner;
import com.bytepe.model.User;
import com.bytepe.repository.PartnerRepository;
import com.bytepe.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PartnerService {

    private final PartnerRepository partnerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PartnerService(PartnerRepository partnerRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.partnerRepository = partnerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Partner registerPartner(PartnerRegistrationRequest req, String registeredByUserId) {
        String partnerId = "P_" + UUID.randomUUID().toString().substring(0, 8);
        
        Partner partner = Partner.builder()
                .id(partnerId)
                .shopName(req.getShopName())
                .ownerName(req.getOwnerName())
                .phone(req.getPhone().trim())
                .email(req.getEmail())
                .category(req.getCategory())
                .city(req.getCity())
                .assignedSalesmanId(req.getAssignedSalesmanId())
                .status("Pending")
                .build();

        Partner saved = partnerRepository.save(partner);

        // Also create user record for logging in
        String pass = (req.getPassword() != null && !req.getPassword().isBlank()) ? req.getPassword() : "123456";
        User user = User.builder()
                .id("U_" + UUID.randomUUID().toString().substring(0, 8))
                .phone(req.getPhone().trim())
                .passwordHash(passwordEncoder.encode(pass))
                .role("RETAILER")
                .name(req.getOwnerName())
                .partnerId(saved.getId())
                .createdByUserId(registeredByUserId)
                .isActive(false) // Pending admin approval
                .build();

        userRepository.save(user);
        return saved;
    }

    public Partner approvePartner(String partnerId) {
        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found: " + partnerId));
        
        partner.setStatus("Verified and Approved");
        Partner updated = partnerRepository.save(partner);

        userRepository.findByPhone(partner.getPhone()).ifPresent(user -> {
            user.setIsActive(true);
            userRepository.save(user);
        });

        return updated;
    }

    public Partner rejectPartner(String partnerId) {
        Partner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found: " + partnerId));
        
        partner.setStatus("Rejected");
        Partner updated = partnerRepository.save(partner);

        userRepository.findByPhone(partner.getPhone()).ifPresent(user -> {
            user.setIsActive(false);
            userRepository.save(user);
        });

        return updated;
    }

    public List<Partner> getAllPartners() {
        return partnerRepository.findAll();
    }

    public List<Partner> getPartnersBySalesman(String salesmanId) {
        return partnerRepository.findByAssignedSalesmanId(salesmanId);
    }

    public List<Partner> getPendingPartners() {
        return partnerRepository.findByStatus("Pending");
    }
}
