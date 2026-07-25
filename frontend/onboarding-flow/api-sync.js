// BytePé Spring Boot REST API Client & Synchronization Bridge
const API_BASE_URL = window.BYTEPE_API_URL || "https://bytpe-app-production.up.railway.app/api";

class ApiClient {
  static getHeaders() {
    const token = localStorage.getItem("bytepe_jwt");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = this.getHeaders();
    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      if (response.status === 401) {
        console.warn("JWT Token expired or invalid. Clearing session.");
        localStorage.removeItem("bytepe_jwt");
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  }

  // Auth Endpoints
  static async login(phone, password = "123456") {
    const res = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone, password })
    });
    if (res && res.token) {
      localStorage.setItem("bytepe_jwt", res.token);
    }
    return res;
  }

  // Partner Endpoints
  static async getPartners() {
    return await this.request("/partners");
  }

  static async getPartnerById(id) {
    return await this.request(`/partners/${id}`);
  }

  static async registerPartner(partnerData) {
    return await this.request("/partners/register", {
      method: "POST",
      body: JSON.stringify(partnerData)
    });
  }

  static async updatePartnerStatus(id, status, assignedSalesmanId) {
    return await this.request(`/partners/${id}/status?status=${encodeURIComponent(status)}${assignedSalesmanId ? `&assignedSalesmanId=${assignedSalesmanId}` : ""}`, {
      method: "PUT"
    });
  }

  // Sales Endpoints
  static async getSales() {
    return await this.request("/sales");
  }

  static async getSalesByPartner(partnerId) {
    return await this.request(`/sales/partner/${partnerId}`);
  }

  static async createSale(saleData) {
    return await this.request("/sales", {
      method: "POST",
      body: JSON.stringify(saleData)
    });
  }

  // Team Endpoints
  static async getTeam() {
    return await this.request("/team");
  }

  static async addTeamMember(memberData) {
    return await this.request("/team", {
      method: "POST",
      body: JSON.stringify(memberData)
    });
  }

  static async deleteTeamMember(id) {
    return await this.request(`/team/${id}`, {
      method: "DELETE"
    });
  }

  // Products Endpoints
  static async getProducts() {
    return await this.request("/products");
  }

  static async addProduct(productData) {
    return await this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData)
    });
  }
}

// Global Supabase-compatible drop-in wrapper
const SupabaseClient = {
  async get(table) {
    try {
      if (table === "onboarding_retailers" || table === "partners") {
        return await ApiClient.getPartners();
      } else if (table === "sales_ledger" || table === "sales") {
        return await ApiClient.getSales();
      } else if (table === "team_members" || table === "team") {
        return await ApiClient.getTeam();
      } else if (table === "products") {
        return await ApiClient.getProducts();
      }
      return [];
    } catch (e) {
      console.warn(`Fallback for table ${table}:`, e.message);
      return JSON.parse(localStorage.getItem(`bytepe_${table}`) || "[]");
    }
  },

  async upsert(table, data) {
    try {
      if (table === "onboarding_retailers" || table === "partners") {
        return await ApiClient.registerPartner(data);
      } else if (table === "sales_ledger" || table === "sales") {
        return await ApiClient.createSale(data);
      } else if (table === "team_members" || table === "team") {
        return await ApiClient.addTeamMember(data);
      } else if (table === "products") {
        return await ApiClient.addProduct(data);
      }
    } catch (e) {
      console.warn(`Upsert fallback for table ${table}:`, e.message);
    }
  },

  async delete(table, id) {
    if (table === "team_members" || table === "team") {
      return await ApiClient.deleteTeamMember(id);
    }
    return false;
  }
};

const SupabaseReplication = {
  async pullAll() {
    try {
      const partners = await SupabaseClient.get("partners");
      if (partners) localStorage.setItem("bytepe_partners", JSON.stringify(partners));
      const sales = await SupabaseClient.get("sales");
      if (sales) localStorage.setItem("bytepe_transactions", JSON.stringify(sales));
    } catch (e) {
      console.warn("Pull background replication error:", e);
    }
  },

  async pushRetailer(retailer) {
    return await SupabaseClient.upsert("partners", retailer);
  },

  async pushSale(sale) {
    return await SupabaseClient.upsert("sales", sale);
  }
};

window.ApiClient = ApiClient;
window.SupabaseClient = SupabaseClient;
window.SupabaseReplication = SupabaseReplication;
