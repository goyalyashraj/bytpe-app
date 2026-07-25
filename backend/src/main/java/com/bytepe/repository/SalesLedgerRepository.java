package com.bytepe.repository;

import com.bytepe.model.SalesLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SalesLedgerRepository extends JpaRepository<SalesLedger, String> {
    List<SalesLedger> findByPartnerId(String partnerId);

    @Query("SELECT s FROM SalesLedger s JOIN Partner p ON s.partnerId = p.id WHERE p.assignedSalesmanId = :salesmanId")
    List<SalesLedger> findBySalesmanId(@Param("salesmanId") String salesmanId);
}
