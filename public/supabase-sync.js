// BytePé Spring Boot API Bridge — Drop-in Replacement for Supabase Sync
const API_BASE_URL = window.BYTEPE_API_URL || "https://bytepe-api.up.railway.app/api";

const SupabaseClient = {
  getHeaders() {
    const token = localStorage.getItem("bytepe_jwt");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
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
      console.warn(`Spring Boot API GET ${table} failed (using local fallback):`, e.message);
      return null;
    }
  },

  async upsert(table, data) {
    try {
      const endpoint = table === "onboarding_retailers" ? "partners/register" : table;
      const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.warn(`Spring Boot API UPSERT ${table} failed (using local fallback):`, e.message);
      return null;
    }
  },

  async delete(table, id) {
    try {
      const res = await fetch(`${API_BASE_URL}/${table}/${id}`, {
        method: "DELETE",
        headers: this.getHeaders()
      });
      return res.ok;
    } catch (e) {
      console.error(`Spring Boot API DELETE ${table} failed:`, e.message);
      return false;
    }
  }
};

const SupabaseMappers = {
  team: {
    sqlToJs: (row) => row,
    jsToSql: (m) => m
  },
  retailer: {
    sqlToJs: (row) => row,
    jsToSql: (r) => r
  },
  ledger: {
    sqlToJs: (row) => row,
    jsToSql: (l) => l
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
      console.warn("Background pull failed:", e);
    }
  },

  async pushRetailer(retailer) {
    await SupabaseClient.upsert("partners/register", {
      shopName: retailer.shopName || retailer.shop_name,
      ownerName: retailer.ownerName || retailer.owner_name,
      phone: retailer.phone,
      email: retailer.email,
      category: retailer.category,
      city: retailer.city
    });
  },

  async pushSale(sale) {
    await SupabaseClient.upsert("sales", {
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

// Expose globally to maintain 100% compatibility with all existing HTML/JS files
window.SupabaseClient = SupabaseClient;
window.SupabaseMappers = SupabaseMappers;
window.SupabaseReplication = SupabaseReplication;
