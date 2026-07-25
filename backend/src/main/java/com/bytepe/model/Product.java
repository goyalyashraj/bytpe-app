package com.bytepe.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class Product {

    @Id
    private String id;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "store_type")
    private String storeType = "std";

    @Column(name = "is_active")
    private Boolean isActive = true;

    public Product() {}

    public Product(String id, String category, String name, BigDecimal price, String storeType, Boolean isActive) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.price = price;
        this.storeType = storeType != null ? storeType : "std";
        this.isActive = isActive != null ? isActive : true;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String category;
        private String name;
        private BigDecimal price;
        private String storeType = "std";
        private Boolean isActive = true;

        public Builder id(String id) { this.id = id; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder price(BigDecimal price) { this.price = price; return this; }
        public Builder storeType(String storeType) { this.storeType = storeType; return this; }
        public Builder isActive(Boolean isActive) { this.isActive = isActive; return this; }

        public Product build() {
            return new Product(id, category, name, price, storeType, isActive);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getStoreType() { return storeType; }
    public void setStoreType(String storeType) { this.storeType = storeType; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
