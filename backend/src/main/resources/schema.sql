-- BytePé Database Schema for MySQL

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    phone VARCHAR(15) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- 'ADMIN', 'SALESMAN', 'RETAILER', 'STAFF'
    name VARCHAR(100),
    partner_id VARCHAR(50),
    created_by_user_id VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partners (
    id VARCHAR(50) PRIMARY KEY,
    shop_name VARCHAR(120) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100),
    category VARCHAR(50),
    city VARCHAR(50),
    assigned_salesman_id VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Pending', -- 'Pending', 'Verified and Approved', 'Rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_ledger (
    id VARCHAR(50) PRIMARY KEY,
    partner_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_mobile VARCHAR(15) NOT NULL,
    product VARCHAR(120) NOT NULL,
    category VARCHAR(50),
    amount DECIMAL(12,2) NOT NULL,
    emi DECIMAL(10,2) NOT NULL,
    tenure INT NOT NULL,
    lender VARCHAR(50) NOT NULL,
    apple_care VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Active', -- 'Active', 'Completed', 'Cancelled'
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(50) PRIMARY KEY,
    partner_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    role VARCHAR(30) DEFAULT 'Store Agent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(120) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    store_type VARCHAR(20) DEFAULT 'std', -- 'std' or 'uni'
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS app_config (
    config_key VARCHAR(50) PRIMARY KEY,
    config_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
