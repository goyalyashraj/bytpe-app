// BytePé Spring Boot REST API Synchronization Helper
// Replaces Supabase with Railway Spring Boot + MySQL Backend

const API_BASE_URL = window.BYTEPE_API_URL || "https://bytepe-api.up.railway.app/api";

const ApiClient = {
  getHeaders() {
    const token = localStorage.getItem("bytepe_jwt");
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  },

  async get(table) {
    try {
      const endpoint = table === "onboarding_retailers" ? "partners" : table;
      const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "GET",
        headers: this.getHeaders()
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.warn(`API GET ${table} failed (using local fallback):`, e.message);
      return null;
    }
  },

  async upsert(table, data) {
    try {
      const endpoint = table === "onboarding_retailers" ? "partners/register" : table;
      const method = "POST";
      const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: method,
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.warn(`API UPSERT ${table} failed (using local fallback):`, e.message);
      return null;
    }
  },

  async delete(table, id) {
    try {
      const res = await fetch(`${API_BASE_URL}/${table}/${id}`, {
        method: "DELETE",
        headers: this.getHeaders()
      });
      if (!res.ok) throw new Error(await res.text());
      return true;
    } catch (e) {
      console.error(`API DELETE ${table} failed:`, e.message);
      return false;
    }
  }
};

// Aliases for seamless drop-in compatibility with existing codebase
const SupabaseClient = ApiClient;

const SupabaseReplication = {
  async pullAll() {
    // Background sync helper
  },

  async pushRetailer(retailer) {
    await ApiClient.upsert("partners/register", {
      shopName: retailer.shopName || retailer.shop_name,
      ownerName: retailer.ownerName || retailer.owner_name,
      phone: retailer.phone,
      email: retailer.email,
      category: retailer.category,
      city: retailer.city
    });
  },

  async pushSale(sale) {
    await ApiClient.upsert("sales", {
      customerName: sale.customer || sale.customerName,
      customerMobile: sale.customerMobile || sale.phone || "",
      product: sale.product,
      category: sale.category || "",
      amount: sale.amount,
      emi: sale.emi,
      tenure: sale.tenure,
      lender: sale.lender,
      appleCare: sale.ac || sale.appleCare || ""
    });
  }
};

window.ApiClient = ApiClient;
window.SupabaseClient = SupabaseClient;
window.SupabaseReplication = SupabaseReplication;
