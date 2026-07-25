package com.bytepe.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "sales_ledger")
public class SalesLedger {

    @Id
    private String id;

    @Column(name = "partner_id", nullable = false)
    private String partnerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_mobile", nullable = false, length = 15)
    private String customerMobile;

    @Column(nullable = false)
    private String product;

    private String category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal emi;

    @Column(nullable = false)
    private Integer tenure;

    @Column(nullable = false)
    private String lender;

    @Column(name = "apple_care")
    private String appleCare;

    private String status = "Active";

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public SalesLedger() {}

    public SalesLedger(String id, String partnerId, String customerName, String customerMobile, String product, String category, BigDecimal amount, BigDecimal emi, Integer tenure, String lender, String appleCare, String status, String createdBy, LocalDateTime createdAt) {
        this.id = id;
        this.partnerId = partnerId;
        this.customerName = customerName;
        this.customerMobile = customerMobile;
        this.product = product;
        this.category = category;
        this.amount = amount;
        this.emi = emi;
        this.tenure = tenure;
        this.lender = lender;
        this.appleCare = appleCare;
        this.status = status != null ? status : "Active";
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String partnerId;
        private String customerName;
        private String customerMobile;
        private String product;
        private String category;
        private BigDecimal amount;
        private BigDecimal emi;
        private Integer tenure;
        private String lender;
        private String appleCare;
        private String status = "Active";
        private String createdBy;
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder partnerId(String partnerId) { this.partnerId = partnerId; return this; }
        public Builder customerName(String customerName) { this.customerName = customerName; return this; }
        public Builder customerMobile(String customerMobile) { this.customerMobile = customerMobile; return this; }
        public Builder product(String product) { this.product = product; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder emi(BigDecimal emi) { this.emi = emi; return this; }
        public Builder tenure(Integer tenure) { this.tenure = tenure; return this; }
        public Builder lender(String lender) { this.lender = lender; return this; }
        public Builder appleCare(String appleCare) { this.appleCare = appleCare; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdBy(String createdBy) { this.createdBy = createdBy; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SalesLedger build() {
            return new SalesLedger(id, partnerId, customerName, customerMobile, product, category, amount, emi, tenure, lender, appleCare, status, createdBy, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPartnerId() { return partnerId; }
    public void setPartnerId(String partnerId) { this.partnerId = partnerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerMobile() { return customerMobile; }
    public void setCustomerMobile(String customerMobile) { this.customerMobile = customerMobile; }

    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getEmi() { return emi; }
    public void setEmi(BigDecimal emi) { this.emi = emi; }

    public Integer getTenure() { return tenure; }
    public void setTenure(Integer tenure) { this.tenure = tenure; }

    public String getLender() { return lender; }
    public void setLender(String lender) { this.lender = lender; }

    public String getAppleCare() { return appleCare; }
    public void setAppleCare(String appleCare) { this.appleCare = appleCare; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
