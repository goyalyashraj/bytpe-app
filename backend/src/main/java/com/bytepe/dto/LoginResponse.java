package com.bytepe.dto;

public class LoginResponse {
    private String token;
    private String role;
    private String phone;
    private String name;
    private String partnerId;
    private String status;

    public LoginResponse() {}

    public LoginResponse(String token, String role, String phone, String name, String partnerId, String status) {
        this.token = token;
        this.role = role;
        this.phone = phone;
        this.name = name;
        this.partnerId = partnerId;
        this.status = status;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String role;
        private String phone;
        private String name;
        private String partnerId;
        private String status;

        public Builder token(String token) { this.token = token; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder partnerId(String partnerId) { this.partnerId = partnerId; return this; }
        public Builder status(String status) { this.status = status; return this; }

        public LoginResponse build() {
            return new LoginResponse(token, role, phone, name, partnerId, status);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPartnerId() { return partnerId; }
    public void setPartnerId(String partnerId) { this.partnerId = partnerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
