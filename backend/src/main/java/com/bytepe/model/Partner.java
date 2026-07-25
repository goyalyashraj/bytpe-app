package com.bytepe.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "partners")
public class Partner {

    @Id
    private String id;

    @Column(name = "shop_name", nullable = false, length = 120)
    private String shopName;

    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Column(nullable = false, unique = true, length = 15)
    private String phone;

    private String email;
    private String category;
    private String city;

    @Column(name = "assigned_salesman_id")
    private String assignedSalesmanId;

    @Column(length = 30)
    private String status = "Pending";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Partner() {}

    public Partner(String id, String shopName, String ownerName, String phone, String email, String category, String city, String assignedSalesmanId, String status, LocalDateTime createdAt) {
        this.id = id;
        this.shopName = shopName;
        this.ownerName = ownerName;
        this.phone = phone;
        this.email = email;
        this.category = category;
        this.city = city;
        this.assignedSalesmanId = assignedSalesmanId;
        this.status = status != null ? status : "Pending";
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String shopName;
        private String ownerName;
        private String phone;
        private String email;
        private String category;
        private String city;
        private String assignedSalesmanId;
        private String status = "Pending";
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder shopName(String shopName) { this.shopName = shopName; return this; }
        public Builder ownerName(String ownerName) { this.ownerName = ownerName; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder assignedSalesmanId(String assignedSalesmanId) { this.assignedSalesmanId = assignedSalesmanId; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Partner build() {
            return new Partner(id, shopName, ownerName, phone, email, category, city, assignedSalesmanId, status, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
