package com.bytepe.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_members")
public class TeamMember {

    @Id
    private String id;

    @Column(name = "partner_id", nullable = false)
    private String partnerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 15)
    private String mobile;

    private String role = "Store Agent";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public TeamMember() {}

    public TeamMember(String id, String partnerId, String name, String mobile, String role, LocalDateTime createdAt) {
        this.id = id;
        this.partnerId = partnerId;
        this.name = name;
        this.mobile = mobile;
        this.role = role != null ? role : "Store Agent";
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String partnerId;
        private String name;
        private String mobile;
        private String role = "Store Agent";
        private LocalDateTime createdAt;

        public Builder id(String id) { this.id = id; return this; }
        public Builder partnerId(String partnerId) { this.partnerId = partnerId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder mobile(String mobile) { this.mobile = mobile; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TeamMember build() {
            return new TeamMember(id, partnerId, name, mobile, role, createdAt);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPartnerId() { return partnerId; }
    public void setPartnerId(String partnerId) { this.partnerId = partnerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
