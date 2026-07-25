package com.bytepe.service;

import com.bytepe.dto.SaleRequest;
import com.bytepe.model.SalesLedger;
import com.bytepe.repository.SalesLedgerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesService {

    private final SalesLedgerRepository salesLedgerRepository;

    public SalesService(SalesLedgerRepository salesLedgerRepository) {
        this.salesLedgerRepository = salesLedgerRepository;
    }

    public SalesLedger createSale(SaleRequest req, String partnerId, String createdByPhone) {
        String saleId = "BP" + System.currentTimeMillis() % 1000000;

        SalesLedger sale = SalesLedger.builder()
                .id(saleId)
                .partnerId(partnerId)
                .customerName(req.getCustomerName())
                .customerMobile(req.getCustomerMobile())
                .product(req.getProduct())
                .category(req.getCategory())
                .amount(req.getAmount())
                .emi(req.getEmi())
                .tenure(req.getTenure())
                .lender(req.getLender())
                .appleCare(req.getAppleCare())
                .status("Active")
                .createdBy(createdByPhone)
                .build();

        return salesLedgerRepository.save(sale);
    }

    public List<SalesLedger> getAllSales() {
        return salesLedgerRepository.findAll();
    }

    public List<SalesLedger> getSalesByPartner(String partnerId) {
        return salesLedgerRepository.findByPartnerId(partnerId);
    }

    public List<SalesLedger> getSalesBySalesman(String salesmanId) {
        return salesLedgerRepository.findBySalesmanId(salesmanId);
    }
}
