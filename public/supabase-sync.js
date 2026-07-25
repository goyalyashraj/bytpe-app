// Supabase Realtime Synchronization Helper for BytePé MVP (Deprecated - replaced by api-sync.js)
const SUPABASE_URL = "";
const SUPABASE_KEY = "";

const SupabaseClient = {
  headers: {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  },

  async get(table) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
        method: "GET",
        headers: this.headers
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.error(`Supabase GET ${table} failed:`, e.message);
      return null;
    }
  },

  async upsert(table, data, conflictColumn = "id") {
    try {
      const url = `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${conflictColumn}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          ...this.headers,
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errText = await res.text();
        let errMsg = errText;
        try {
          const errObj = JSON.parse(errText);
          errMsg = errObj.message || errObj.details || errText;
        } catch(e) {}
        throw new Error(errMsg);
      }
      const text = await res.text();
      return text ? JSON.parse(text) : { success: true };
    } catch (e) {
      console.warn(`Supabase UPSERT ${table} failed (using local fallback):`, e.message);
      return null;
    }
  },

  async delete(table, id, idColumn = "id") {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${idColumn}=eq.${id}`, {
        method: "DELETE",
        headers: this.headers
      });
      if (!res.ok) throw new Error(await res.text());
      return true;
    } catch (e) {
      console.error(`Supabase DELETE ${table} failed:`, e.message);
      return false;
    }
  }
};

// Data Mapper Utilities
const SupabaseMappers = {
  team: {
    sqlToJs(row) {
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        status: row.status,
        location: row.location,
        manager: row.manager,
        remarks: row.remarks,
        mappedStore: row.mapped_store,
        photo: row.photo
      };
    },
    jsToSql(m) {
      return {
        id: m.id,
        name: m.name,
        email: m.email || "",
        phone: m.phone,
        role: m.role,
        status: m.status,
        location: m.location || "",
        manager: m.manager || "",
        remarks: m.remarks || "",
        mapped_store: m.mappedStore || "",
        photo: m.photo || null
      };
    }
  },
  retailer: {
    sqlToJs(row) {
      let commercials = null;
      let remarks = row.remarks || "";
      const commMatch = remarks.match(/\[Commercials:\s*(\{.*?\})\]/);
      if (commMatch) {
        try {
          commercials = JSON.parse(commMatch[1]);
          remarks = remarks.replace(/\[Commercials:\s*\{.*?\}\]/g, "").trim();
        } catch (e) {
          console.error("Failed to parse commercials from remarks", e);
        }
      }
      return {
        regId: row.reg_id,
        shopName: row.shop_name,
        ownerName: row.owner_name,
        phone: row.phone,
        email: row.email,
        category: row.category,
        address: row.address,
        state: row.state,
        city: row.city,
        pincode: row.pincode,
        remarks: remarks,
        bdeId: row.bde_id,
        bdeName: row.bde_name,
        geolocation: row.geolocation,
        status: row.status,
        gstChoice: row.gst_choice,
        gstin: row.gstin,
        udyam: row.udyam,
        docsCount: row.docs_count,
        date: row.date,
        commercials: commercials
      };
    },
    jsToSql(r) {
      let remarksWithComm = r.remarks || "";
      if (r.commercials) {
        remarksWithComm = remarksWithComm.replace(/\[Commercials:\s*[^\]]+\]/g, "").trim();
        remarksWithComm = `[Commercials: ${JSON.stringify(r.commercials)}] ${remarksWithComm}`.trim();
      }
      return {
        reg_id: r.regId,
        shop_name: r.shopName,
        owner_name: r.ownerName,
        phone: r.phone,
        email: r.email || "",
        category: r.category,
        address: r.address,
        state: r.state,
        city: r.city,
        pincode: r.pincode,
        remarks: remarksWithComm,
        bde_id: r.bdeId || "",
        bde_name: r.bdeName || "",
        geolocation: r.geolocation || "",
        status: r.status,
        gst_choice: r.gstChoice || "no",
        gstin: r.gstin || "",
        udyam: r.udyam || "",
        docs_count: r.docsCount || 0,
        date: r.date
      };
    }
  },
  sale: {
    sqlToJs(row) {
      return {
        id: row.id,
        customer: row.customer,
        customerPhone: row.customer_phone,
        retailerMobile: row.retailer_mobile,
        shopName: row.shop_name,
        product: row.product,
        amount: Number(row.amount),
        emi: Number(row.emi),
        tenure: Number(row.tenure),
        status: row.status,
        date: row.date,
        lender: row.lender,
        ac: row.ac,
        icon: row.icon,
        category: row.category || "",
        totalProductPrice: row.total_product_price ? Number(row.total_product_price) : undefined,
        downpayment: row.downpayment ? Number(row.downpayment) : undefined,
        interestPercent: row.interest_percent ? Number(row.interest_percent) : undefined,
        interestComponent: row.interest_component ? Number(row.interest_component) : undefined,
        discount: row.discount ? Number(row.discount) : undefined,
        customerAddress: row.customer_address || "",
        createdAt: row.created_at
      };
    },
    jsToSql(s) {
      return {
        id: s.id,
        customer: s.customer,
        customer_phone: s.customerPhone,
        retailer_mobile: s.retailerMobile,
        shop_name: s.shopName,
        product: s.product,
        amount: Number(s.amount),
        emi: Number(s.emi),
        tenure: Number(s.tenure),
        status: s.status,
        date: s.date,
        lender: s.lender,
        ac: s.ac || "",
        icon: s.icon || "",
        category: s.category || "",
        total_product_price: s.totalProductPrice !== undefined ? Number(s.totalProductPrice) : null,
        downpayment: s.downpayment !== undefined ? Number(s.downpayment) : null,
        interest_percent: s.interestPercent !== undefined ? Number(s.interestPercent) : null,
        interest_component: s.interestComponent !== undefined ? Number(s.interestComponent) : null,
        discount: s.discount !== undefined ? Number(s.discount) : null,
        customer_address: s.customerAddress || "",
        created_at: s.createdAt || new Date().toISOString()
      };
    }
  },
  product: {
    sqlToJs(row) {
      return {
        name: row.name,
        category: row.category,
        type: row.type,
        price: Number(row.price)
      };
    },
    jsToSql(p) {
      return {
        name: p.name,
        category: p.category,
        type: p.type,
        price: Number(p.price)
      };
    }
  }
};

// Global Replication Layer
const SupabaseReplication = {
  isPulling: false,

  async pullAll() {
    if (this.isPulling) return;
    this.isPulling = true;
    try {
      // 1. Pull Team members
      const teamRows = await SupabaseClient.get("team_members");
      if (teamRows) {
        let teamJs = teamRows.map(SupabaseMappers.team.sqlToJs);
        if (!teamJs.some(t => t.phone.trim() === "9818886959")) {
          const seedAdmin = {
            id: "BP103",
            name: "Rohit Agarwal",
            email: "rohit@bytepe.com",
            phone: "9818886959",
            role: "Admin",
            status: "Active",
            location: "Noida",
            manager: "Jayant Jha",
            remarks: "Seed administrator."
          };
          teamJs.push(seedAdmin);
          // Fire-and-forget push
          this.pushTeamMember(seedAdmin);
        }

        // Merge with local storage
        let localTeam = [];
        try {
          localTeam = JSON.parse(localStorage.getItem("bytepe_team") || "[]");
        } catch(e) {}
        const mergedTeam = [...teamJs];
        localTeam.forEach(lt => {
          if (!mergedTeam.some(mt => mt.id === lt.id)) {
            mergedTeam.push(lt);
          }
        });

        localStorage.setItem("bytepe_team", JSON.stringify(mergedTeam));
        if (typeof window.loadData === 'function') window.loadData();
        if (typeof window.renderTeam === 'function') window.renderTeam();
        if (typeof window.updateHeaderAvatarDisplay === 'function') window.updateHeaderAvatarDisplay();
      }

      // 2. Pull Retailers (Partners)
      const retailerRows = await SupabaseClient.get("retailers");
      if (retailerRows) {
        const retailerJs = retailerRows.map(SupabaseMappers.retailer.sqlToJs);
        
        // Merge with local storage to preserve local-only creations
        let localPartners = [];
        try {
          localPartners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
        } catch(e) {}
        const mergedPartners = [...retailerJs];
        localPartners.forEach(lp => {
          if (!mergedPartners.some(mp => mp.regId === lp.regId)) {
            mergedPartners.push(lp);
          }
        });

        localStorage.setItem("bytepe_partners", JSON.stringify(mergedPartners));
        if (typeof window.loadData === 'function') window.loadData();
        if (typeof window.renderPartners === 'function') window.renderPartners();
        if (typeof window.renderPartnersDirectory === 'function') window.renderPartnersDirectory();
        if (typeof window.updateDashboardStats === 'function') window.updateDashboardStats();
        if (typeof window.renderPipelineList === 'function') window.renderPipelineList();
        window.dispatchEvent(new CustomEvent('bytepe_partners_updated', { detail: mergedPartners }));
      }

      // 3. Pull Sales Ledger
      const salesRows = await SupabaseClient.get("sales_ledger");
      if (salesRows) {
        const salesJs = salesRows.map(SupabaseMappers.sale.sqlToJs);
        
        // Merge with local storage to preserve local-only sales
        let localSales = [];
        try {
          localSales = JSON.parse(localStorage.getItem("bytepe_sales") || "[]");
        } catch(e) {}
        const mergedSales = [...salesJs];
        localSales.forEach(ls => {
          if (!mergedSales.some(ms => ms.id === ls.id)) {
            mergedSales.push(ls);
          }
        });

        localStorage.setItem("bytepe_sales", JSON.stringify(mergedSales));
        if (typeof window.loadData === 'function') window.loadData();
        if (typeof window.renderSales === 'function') window.renderSales();
        if (typeof window.updateDashboardStats === 'function') window.updateDashboardStats();
        window.dispatchEvent(new CustomEvent('bytepe_sales_updated', { detail: mergedSales }));
      }
      
      // Auto-trigger rendering on any load/reload
      if (typeof window.renderAll === 'function') window.renderAll();

      // 4. Pull Products
      const prodRows = await SupabaseClient.get("products");
      if (prodRows) {
        const prodJs = prodRows.map(SupabaseMappers.product.sqlToJs);
        // Organize into category structure if needed, or save standard list
        localStorage.setItem("bytepe_products_list", JSON.stringify(prodJs));
        if (typeof window.renderProducts === 'function') window.renderProducts();
        window.dispatchEvent(new CustomEvent('bytepe_products_updated', { detail: prodJs }));
      }
    } catch (e) {
      console.error("Supabase replication pull failed: ", e.message);
    } finally {
      this.isPulling = false;
    }
  },

  async pushTeamMember(member) {
    const row = SupabaseMappers.team.jsToSql(member);
    await SupabaseClient.upsert("team_members", row, "id");
  },

  async pushRetailer(retailer) {
    const row = SupabaseMappers.retailer.jsToSql(retailer);
    await SupabaseClient.upsert("retailers", row, "reg_id");
  },

  async pushSale(sale) {
    const row = SupabaseMappers.sale.jsToSql(sale);
    await SupabaseClient.upsert("sales_ledger", row, "id");
  },

  async deleteTeamMember(id) {
    await SupabaseClient.delete("team_members", id, "id");
  }
};

// Load initial data on import/execution
SupabaseReplication.pullAll();

// Set up background pull worker (every 3 seconds)
setInterval(() => {
  SupabaseReplication.pullAll();
}, 3000);

window.SupabaseClient = SupabaseClient;
window.SupabaseReplication = SupabaseReplication;
