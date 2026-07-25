package com.bytepe.dto;

public class PartnerRegistrationRequest {
    private String shopName;
    private String ownerName;
    private String phone;
    private String email;
    private String category;
    private String city;
    private String assignedSalesmanId;
    private String password;

    public PartnerRegistrationRequest() {}

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getAssignedSalesmanId() { return assignedSalesmanId; }
    public void setAssignedSalesmanId(String assignedSalesmanId) { this.assignedSalesmanId = assignedSalesmanId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
