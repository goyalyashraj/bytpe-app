package com.bytepe.repository;

import com.bytepe.model.Partner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, String> {
    Optional<Partner> findByPhone(String phone);
    List<Partner> findByAssignedSalesmanId(String salesmanId);
    List<Partner> findByStatus(String status);
}
