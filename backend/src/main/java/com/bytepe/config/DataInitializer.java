package com.bytepe.config;

import com.bytepe.model.Partner;
import com.bytepe.model.User;
import com.bytepe.repository.PartnerRepository;
import com.bytepe.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PartnerRepository partnerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PartnerRepository partnerRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.partnerRepository = partnerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByPhone("9999999999")) {
            User admin = User.builder()
                    .id("U_ADMIN_001")
                    .phone("9999999999")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .name("BytePé Super Admin")
                    .isActive(true)
                    .build();
            userRepository.save(admin);
        }

        if (!userRepository.existsByPhone("8888888888")) {
            User salesman = User.builder()
                    .id("U_SALES_001")
                    .phone("8888888888")
                    .passwordHash(passwordEncoder.encode("sales123"))
                    .role("SALESMAN")
                    .name("Rahul Verma (FSE)")
                    .isActive(true)
                    .build();
            userRepository.save(salesman);
        }

        if (partnerRepository.findByPhone("9818886959").isEmpty()) {
            Partner uniStore = Partner.builder()
                    .id("P_UNI_001")
                    .shopName("Unicorn Apple Premium Reseller")
                    .ownerName("Vikramaditya Sharma")
                    .phone("9818886959")
                    .email("store@unicorn.in")
                    .category("Smartphones")
                    .city("Delhi NCR")
                    .assignedSalesmanId("U_SALES_001")
                    .status("Verified and Approved")
                    .build();
            partnerRepository.save(uniStore);

            User uniUser = User.builder()
                    .id("U_UNI_001")
                    .phone("9818886959")
                    .passwordHash(passwordEncoder.encode("123456"))
                    .role("RETAILER")
                    .name("Vikramaditya Sharma")
                    .partnerId("P_UNI_001")
                    .createdByUserId("U_SALES_001")
                    .isActive(true)
                    .build();
            userRepository.save(uniUser);
        }
    }
}
