package com.bytepe.dto;

import java.math.BigDecimal;

public class SaleRequest {
    private String customerName;
    private String customerMobile;
    private String product;
    private String category;
    private BigDecimal amount;
    private BigDecimal emi;
    private Integer tenure;
    private String lender;
    private String appleCare;

    public SaleRequest() {}

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
}
