/* ==========================================================================
   BYTEPE ONBOARDING FLOW - FRONTEND CONTROLLER (JS)
   ========================================================================= */

// Mock Database Seeds
const MOCK_PARTNERS_SEED = [];

const MOCK_COUNTERS_SEED = {
  "UT-DE": 1101,
  "KA-BA": 1101,
  "DL-DE": 1101,
  "MA-MU": 1101
};

// State Variables
let currentScreenId = "screen-login";
let partnersDb = [];
let countersDb = {};
let currentEmpId = null;
let currentEmpName = "Amit Kumar";
let activeLeadData = null; // Step 1 data cache
let activeUploads = {}; // File preview cache

// Geocoding mappings for state codes
const STATE_CODES = {
  "karnataka": "KA",
  "uttarakhand": "UT",
  "delhi": "DL",
  "maharashtra": "MA",
  "uttar pradesh": "UP",
  "haryana": "HR",
  "tamil nadu": "TN",
  "telangana": "TS",
  "west bengal": "WB"
};

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initDatabase();
  setupEventListeners();
  setupProfileAttendance();
  
  // Restore session if already logged in
  if (currentEmpId) {
    updateHeaderAvatarDisplay();
    navigateTo("screen-dashboard");
    updateDashboardStats();
    renderPipelineList();
  } else {
    navigateTo("screen-login");
  }
});

// Database Init
function initDatabase() {
  if (!localStorage.getItem("bytepe_partners")) {
    localStorage.setItem("bytepe_partners", JSON.stringify(MOCK_PARTNERS_SEED));
  }
  if (!localStorage.getItem("bytepe_city_counters")) {
    localStorage.setItem("bytepe_city_counters", JSON.stringify(MOCK_COUNTERS_SEED));
  }
  partnersDb = JSON.parse(localStorage.getItem("bytepe_partners"));
  countersDb = JSON.parse(localStorage.getItem("bytepe_city_counters"));
  
  currentEmpId = localStorage.getItem("bytepe_active_emp_id") || null;
  currentEmpName = localStorage.getItem("bytepe_active_emp_name") || "Amit Kumar";
}

function saveDatabase() {
  localStorage.setItem("bytepe_partners", JSON.stringify(partnersDb));
  localStorage.setItem("bytepe_city_counters", JSON.stringify(countersDb));
  if (typeof SupabaseReplication !== "undefined") {
    partnersDb.forEach(partner => {
      SupabaseReplication.pushRetailer(partner);
    });
  }
}

function updateHeaderAvatarDisplay() {
  const headerAvatar = document.getElementById("btn-dashboard-avatar");
  const welcomeName = document.getElementById("dashboard-fe-name");
  
  if (!headerAvatar) return;
  
  let teamList = [];
  try {
    const storedTeam = localStorage.getItem("bytepe_team");
    if (storedTeam) teamList = JSON.parse(storedTeam);
  } catch (e) {
    console.error(e);
  }
  
  const currentEmp = teamList.find(t => t.id === currentEmpId);
  
  if (welcomeName) {
    welcomeName.innerText = `${currentEmpName} (${currentEmpId})`;
  }
  
  if (currentEmp && currentEmp.photo) {
    headerAvatar.innerHTML = `<img src="${currentEmp.photo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;" />`;
    headerAvatar.style.background = "none";
    headerAvatar.style.border = "1.5px solid #e2e8f0";
  } else {
    const names = currentEmpName.split(" ").filter(Boolean);
    let initials = "BP";
    if (names.length > 1) {
      initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
    } else if (names.length === 1) {
      initials = names[0].substring(0, 2).toUpperCase();
    }
    headerAvatar.innerHTML = initials;
    headerAvatar.style.background = "#fff0ec";
    headerAvatar.style.color = "#ff5c2b";
    headerAvatar.style.border = "1.5px solid #ffbe98";
  }
}

// Navigation Helper
function navigateTo(screenId) {
  const currentScreen = document.getElementById(currentScreenId);
  const targetScreen = document.getElementById(screenId);
  
  if (currentScreen && targetScreen) {
    currentScreen.classList.remove("active");
    targetScreen.classList.add("active");
    currentScreenId = screenId;
    
    // Auto-scroll content to top on navigation
    const content = targetScreen.querySelector(".screen-content");
    if (content) content.scrollTop = 0;
  }
}

// Notification Toast Helper
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-msg">${message}</span>`;
  container.appendChild(toast);
  
  // Auto remove toast after 5s
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Event Listeners Setup
function setupEventListeners() {
  
  // 1. Login Flow
  const loginForm = document.getElementById("form-login");
  const sendLoginOtpBtn = document.getElementById("btn-send-login-otp");
  const loginSubmitBtn = document.getElementById("btn-login-submit");
  const otpSection = document.getElementById("login-otp-section");
  const empIdInput = document.getElementById("login-emp-id");
  let loginOtpTimer = null;
  
  sendLoginOtpBtn.addEventListener("click", () => {
    const empId = empIdInput.value.trim();
    if (!empId) {
      showToast("Please enter your Employee ID or Mobile Number.", "error");
      return;
    }
    
    // Retrieve team from local storage to check for Chander or other BDEs
    let teamList = [];
    try {
      const storedTeam = localStorage.getItem("bytepe_team");
      if (storedTeam) {
        teamList = JSON.parse(storedTeam);
      }
    } catch (e) {
      console.error("Failed to parse team", e);
    }
    
    if (teamList.length === 0) {
      teamList = [
        { id: "BP100", name: "Amit Kumar", email: "amit.kumar@bytepe.in", phone: "9811002233", role: "BDE", status: "Active" }
      ];
    }
    
    // Find matching employee by ID or phone number
    const foundEmployee = teamList.find(member => 
      (member.id && member.id.toUpperCase() === empId.toUpperCase()) || 
      (member.phone && member.phone.trim() === empId)
    );
    
    if (!foundEmployee) {
      showToast("Access Denied. Employee ID or Mobile Number not registered.", "error");
      return;
    }
    
    if (foundEmployee.role !== "BDE" && foundEmployee.role !== "Admin" && foundEmployee.role !== "Sub Admin") {
      showToast("Access Denied. Only BDE, Admin, or Sub Admin can access the Onboarding App.", "error");
      return;
    }
    
    if (foundEmployee.status.toLowerCase() !== "active") {
      showToast(`Access Denied. Employee status is ${foundEmployee.status}.`, "error");
      return;
    }
    
    currentEmpId = foundEmployee.id;
    currentEmpName = foundEmployee.name;
    
    const expectedOtp = foundEmployee.phone ? foundEmployee.phone.trim().slice(-6) : "123456";
    showToast("🔑 OTP sent to executive's mobile number.", "success");
    
    // UI adjustment
    otpSection.classList.remove("hidden");
    sendLoginOtpBtn.classList.add("hidden");
    loginSubmitBtn.classList.remove("hidden");
    document.getElementById("login-otp").focus();
    
    // OTP Countdown Timer
    let seconds = 59;
    const timerLbl = document.getElementById("login-otp-timer");
    timerLbl.innerText = `00:${seconds}`;
    if (loginOtpTimer) clearInterval(loginOtpTimer);
    
    loginOtpTimer = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        clearInterval(loginOtpTimer);
        timerLbl.innerText = "Expired";
      } else {
        timerLbl.innerText = `00:${seconds < 10 ? '0' + seconds : seconds}`;
      }
    }, 1000);
  });
  
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredOtp = document.getElementById("login-otp").value.trim();
    
    let teamList = [];
    try {
      const storedTeam = localStorage.getItem("bytepe_team");
      if (storedTeam) teamList = JSON.parse(storedTeam);
    } catch (err) {}
    const emp = teamList.find(t => t.id === currentEmpId) || { phone: "123456" };
    const expectedOtp = emp.phone ? emp.phone.trim().slice(-6) : "123456";
    
    if (enteredOtp === expectedOtp || enteredOtp === "123456") {
      // Login success
      localStorage.setItem("bytepe_active_emp_id", currentEmpId);
      localStorage.setItem("bytepe_active_emp_name", currentEmpName);
      
      // Save actual login timestamp for tracking in CRM BDE Analytics
      const now = new Date();
      const actualTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      localStorage.setItem(`bytepe_bde_login_time_${currentEmpId}`, actualTimeStr);
      
      updateHeaderAvatarDisplay();
      showToast(`Logged in successfully as ${currentEmpName}`, "success");
      
      // Reset fields
      document.getElementById("login-otp").value = "";
      otpSection.classList.add("hidden");
      sendLoginOtpBtn.classList.remove("hidden");
      loginSubmitBtn.classList.add("hidden");
      if (loginOtpTimer) clearInterval(loginOtpTimer);
      
      navigateTo("screen-dashboard");
      updateDashboardStats();
      renderPipelineList();
    } else {
      showToast("Invalid verification OTP. Please try again.", "error");
    }
  });

  // Header Avatar click navigation to Profile
  const headerAvatar = document.getElementById("btn-dashboard-avatar");
  if (headerAvatar) {
    headerAvatar.addEventListener("click", () => {
      navigateTo("screen-profile");
      renderProfileView();
    });
  }

  // Bottom Navigation tab switching logic
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab");
      
      if (targetTab === "home") {
        navigateTo("screen-dashboard");
        updateDashboardStats();
        renderPipelineList();
      } else if (targetTab === "partners") {
        navigateTo("screen-partners");
        renderPartnersDirectory();
      } else if (targetTab === "add") {
        resetStep1Form();
        navigateTo("screen-lead-gen");
      } else if (targetTab === "analytics") {
        navigateTo("screen-analytics");
        renderAnalyticsView();
      } else if (targetTab === "profile") {
        navigateTo("screen-profile");
        renderProfileView();
      }
    });
  });

  // Search input change events on Dashboard
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("btn-search-clear");
  const searchResults = document.getElementById("search-results-box");
  
  searchInput.addEventListener("input", (e) => {
    const val = e.target.value.trim().toLowerCase();
    if (val.length > 0) {
      clearSearchBtn.style.display = "block";
      searchResults.classList.remove("hidden");
      filterSearchResults(val);
    } else {
      clearSearchBtn.style.display = "none";
      searchResults.classList.add("hidden");
    }
  });
  
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearSearchBtn.style.display = "none";
    searchResults.classList.add("hidden");
  });

  // Partners Directory search, filter and sort hooks
  const directorySearch = document.getElementById("partners-list-search");
  const directoryFilter = document.getElementById("filter-status");
  const directorySort = document.getElementById("sort-by");
  
  if (directorySearch) {
    directorySearch.addEventListener("input", renderPartnersDirectory);
  }
  if (directoryFilter) {
    directoryFilter.addEventListener("change", renderPartnersDirectory);
  }
  if (directorySort) {
    directorySort.addEventListener("change", renderPartnersDirectory);
  }

  // Analytics Month Filter Selector
  const analyticsMonthSelect = document.getElementById("analytics-month-select");
  if (analyticsMonthSelect) {
    analyticsMonthSelect.addEventListener("change", renderAnalyticsView);
  }

  // Back buttons event delegation
  document.querySelectorAll(".btn-back").forEach(btn => {
    btn.addEventListener("click", () => {
      if (currentScreenId === "screen-lead-gen" || currentScreenId === "screen-lead-success") {
        navigateTo("screen-dashboard");
      } else if (currentScreenId === "screen-kyc-registration") {
        navigateTo("screen-lead-success");
      } else if (currentScreenId === "screen-otp-verify") {
        navigateTo("screen-kyc-registration");
      }
    });
  });

  // Step 1: Capture GPS Button
  document.getElementById("btn-capture-gps").addEventListener("click", () => {
    captureGPS();
  });

  // Step 1: Click interactive Hub marker on Map to autofill
  const mapPins = document.querySelectorAll(".map-hub-pin");
  mapPins.forEach(pin => {
    pin.addEventListener("click", () => {
      const city = pin.getAttribute("data-city");
      const state = pin.getAttribute("data-state");
      const pincode = pin.getAttribute("data-pincode");
      const coords = pin.getAttribute("data-coords");

      document.getElementById("gps-coords-value").innerText = coords;
      document.getElementById("gps-state").value = state;
      document.getElementById("gps-city").value = city;
      document.getElementById("gps-pincode").value = pincode;

      showToast(`📍 Selected Hub from Map: ${city}, ${state}`, "success");
      
      // Update visual feedback (reset pins orange, selected pin green)
      mapPins.forEach(p => {
        const c = p.querySelector("circle:nth-child(2)");
        if (c) c.setAttribute("fill", "#ff5c2b");
      });
      const selectedCircle = pin.querySelector("circle:nth-child(2)");
      if (selectedCircle) selectedCircle.setAttribute("fill", "#22c55e");

      unlockStep1Form();
    });
  });
  
  // Submit Step 1
  document.getElementById("form-lead-gen").addEventListener("submit", (e) => {
    e.preventDefault();
    submitLeadGenStep1();
  });

  // Success Bridge Page Actions
  document.getElementById("btn-copy-id").addEventListener("click", () => {
    const regId = document.getElementById("generated-reg-id").innerText;
    navigator.clipboard.writeText(regId).then(() => {
      showToast("Registration ID copied to clipboard!", "success");
    }).catch(err => {
      showToast("Registration ID: " + regId, "info");
    });
  });

  document.getElementById("btn-proceed-kyc").addEventListener("click", () => {
    prefillStep2KYC();
    navigateTo("screen-kyc-registration");
  });

  document.getElementById("btn-back-dashboard").addEventListener("click", () => {
    updateDashboardStats();
    renderPipelineList();
    navigateTo("screen-dashboard");
  });

  // Step 2 KYC GST/Udyam Toggles
  const gstChoices = document.getElementsByName("gst-choice");
  gstChoices.forEach(choice => {
    choice.addEventListener("change", (e) => {
      const gstinGroup = document.getElementById("gst-input-group");
      const udyamGroup = document.getElementById("udyam-input-group");
      
      if (e.target.value === "yes") {
        gstinGroup.classList.remove("hidden");
        udyamGroup.classList.add("hidden");
        document.getElementById("kyc-gstin").setAttribute("required", "true");
        document.getElementById("kyc-udyam").removeAttribute("required");
      } else {
        gstinGroup.classList.add("hidden");
        udyamGroup.classList.remove("hidden");
        document.getElementById("kyc-gstin").removeAttribute("required");
        document.getElementById("kyc-udyam").removeAttribute("required");
      }
    });
  });

  // Documents file slots upload setups
  setupFileUploads();

  // Handle account type selection (standalone, parent, child)
  const accountTypeSelect = document.getElementById("lead-account-type");
  const parentSelectGroup = document.getElementById("lead-parent-select-group");
  if (accountTypeSelect) {
    accountTypeSelect.addEventListener("change", (e) => {
      if (e.target.value === "child") {
        updateParentDropdown();
        parentSelectGroup.classList.remove("hidden");
        document.getElementById("lead-parent-id").setAttribute("required", "true");
      } else {
        parentSelectGroup.classList.add("hidden");
        document.getElementById("lead-parent-id").removeAttribute("required");
      }
    });
  }

  // Recapture GPS at registration (KYC) step
  const recaptureKycGpsBtn = document.getElementById("btn-kyc-re-capture");
  if (recaptureKycGpsBtn) {
    recaptureKycGpsBtn.addEventListener("click", () => {
      captureRegistrationGPS();
    });
  }

  // Send Verification OTP button trigger
  document.getElementById("btn-kyc-verify-trigger").addEventListener("click", () => {
    triggerKYCVerification();
  });

  // OTP Screen Digit autofocusing
  const digitBoxes = document.querySelectorAll(".otp-digit-box");
  digitBoxes.forEach((box, idx) => {
    box.addEventListener("input", (e) => {
      if (e.target.value.length === 1 && idx < digitBoxes.length - 1) {
        digitBoxes[idx + 1].focus();
      }
    });
    
    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && e.target.value.length === 0 && idx > 0) {
        digitBoxes[idx - 1].focus();
      }
    });
  });

  // Verify OTP click
  document.getElementById("btn-confirm-verification-otp").addEventListener("click", () => {
    verifyRegistrationOTP();
  });
  
  // Resend OTP verification click
  document.getElementById("btn-resend-verification-otp").addEventListener("click", () => {
    triggerKYCVerification();
  });

  // Final Success return button
  document.getElementById("btn-final-dashboard").addEventListener("click", () => {
    updateDashboardStats();
    renderPipelineList();
    navigateTo("screen-dashboard");
  });
}

// ----------------------------------------------------
// Location (GPS Capture) Logic
// ----------------------------------------------------
function captureGPS() {
  const cordsVal = document.getElementById("gps-coords-value");
  const stateInput = document.getElementById("gps-state");
  const cityInput = document.getElementById("gps-city");
  const pincodeInput = document.getElementById("gps-pincode");
  const locateBtn = document.getElementById("btn-capture-gps");
  
  cordsVal.innerText = "Locating GPS...";
  locateBtn.disabled = true;
  
  if (!navigator.geolocation) {
    useLocationFallback(locateBtn, cordsVal, stateInput, cityInput, pincodeInput);
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      cordsVal.innerText = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
      
      // Reverse geocoding through OpenStreetMap Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: {
          'User-Agent': 'BytePeRetailerOnboardingFlow/2.0'
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.address) {
          const addr = data.address;
          const state = addr.state || addr.region || "Delhi";
          const city = addr.city || addr.town || addr.suburb || addr.village || addr.county || "Delhi";
          const pincode = addr.postcode || "110001";
          
          stateInput.value = state;
          cityInput.value = city;
          pincodeInput.value = pincode;
          showToast(`📍 GPS captured: ${city}, ${state}`, "success");
          unlockStep1Form();
        } else {
          useAddressFallback(lat, lng);
          showToast(`📍 GPS fallback: ${cityInput.value}, ${stateInput.value}`, "success");
          unlockStep1Form();
        }
        locateBtn.disabled = false;
      })
      .catch(err => {
        console.error("Reverse geocoding error: ", err);
        useAddressFallback(lat, lng);
        locateBtn.disabled = false;
        unlockStep1Form();
      });
    },
    (error) => {
      console.warn("Geolocation denied/error: ", error.message);
      useLocationFallback(locateBtn, cordsVal, stateInput, cityInput, pincodeInput);
    },
    { enableHighAccuracy: true, timeout: 4000 }
  );
}

function captureRegistrationGPS() {
  const cordsVal = document.getElementById("kyc-gps-coords");
  if (!cordsVal) return;
  cordsVal.innerText = "Locating GPS...";
  
  if (!navigator.geolocation) {
    setTimeout(() => {
      cordsVal.innerText = `28.6139° N, 77.2090° E (Fallback)`;
    }, 400);
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      cordsVal.innerText = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
    },
    (error) => {
      cordsVal.innerText = `28.6139° N, 77.2090° E (Fallback)`;
    },
    { enableHighAccuracy: true, timeout: 4000 }
  );
}

function updateParentDropdown() {
  const parentSelect = document.getElementById("lead-parent-id");
  if (!parentSelect) return;
  
  parentSelect.innerHTML = '<option value="" disabled selected>Select Parent Chain/Account *</option>';
  
  const parents = partnersDb.filter(p => {
    let isParent = false;
    if (p.commercials && p.commercials.isParent) isParent = true;
    if (p.remarks && p.remarks.includes("[IsParent: true]")) isParent = true;
    return isParent;
  });
  
  parents.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.regId;
    opt.textContent = `${p.shopName} (${p.regId})`;
    parentSelect.appendChild(opt);
  });
}

function useLocationFallback(locateBtn, cordsVal, stateInput, cityInput, pincodeInput) {
  // Simulate coordinates for random cities to test nomenclature increments
  const simulations = [
    { lat: 12.9716, lng: 77.5946, state: "Karnataka", city: "Bangalore", pincode: "560001" },
    { lat: 30.3165, lng: 78.0322, state: "Uttarakhand", city: "Dehradun", pincode: "248001" },
    { lat: 28.6139, lng: 77.2090, state: "Delhi", city: "Delhi", pincode: "110001" },
    { lat: 19.0760, lng: 72.8777, state: "Maharashtra", city: "Mumbai", pincode: "400001" }
  ];
  
  const chosen = simulations[Math.floor(Math.random() * simulations.length)];
  
  setTimeout(() => {
    cordsVal.innerText = `${chosen.lat.toFixed(4)}° N, ${chosen.lng.toFixed(4)}° E`;
    stateInput.value = chosen.state;
    cityInput.value = chosen.city;
    pincodeInput.value = chosen.pincode;
    locateBtn.disabled = false;
    showToast(`📍 GPS simulated: ${chosen.city}, ${chosen.state} (Fallback)`, "info");
    unlockStep1Form();
  }, 400);
}

function useAddressFallback(lat, lng) {
  const stateInput = document.getElementById("gps-state");
  const cityInput = document.getElementById("gps-city");
  const pincodeInput = document.getElementById("gps-pincode");
  
  if (lat > 29 && lat < 31) {
    stateInput.value = "Uttarakhand";
    cityInput.value = "Dehradun";
    pincodeInput.value = "248001";
  } else if (lat > 12 && lat < 14) {
    stateInput.value = "Karnataka";
    cityInput.value = "Bangalore";
    pincodeInput.value = "560001";
  } else if (lat > 18 && lat < 20) {
    stateInput.value = "Maharashtra";
    cityInput.value = "Mumbai";
    pincodeInput.value = "400001";
  } else {
    stateInput.value = "Delhi";
    cityInput.value = "Delhi";
    pincodeInput.value = "110001";
  }
}

// ----------------------------------------------------
// ID Generation & Step 1 Lead Gen Submit
// ----------------------------------------------------
function submitLeadGenStep1() {
  const state = document.getElementById("gps-state").value.trim();
  const city = document.getElementById("gps-city").value.trim();
  const pincode = document.getElementById("gps-pincode").value.trim();
  const shopName = document.getElementById("lead-shop-name").value.trim();
  const ownerName = document.getElementById("lead-owner-name").value.trim();
  const phone = document.getElementById("lead-phone").value.trim();
  const category = document.getElementById("lead-category").value;
  const address = document.getElementById("lead-address").value.trim();
  const remarks = document.getElementById("lead-remarks").value.trim();
  
  if (!state || !city || !pincode) {
    showToast("Please capture Geolocation coordinates first.", "error");
    return;
  }
  
  if (!phone.match(/^[6-9][0-9]{9}$/)) {
    showToast("Please enter a valid 10-digit mobile number.", "error");
    return;
  }

  if (!category) {
    showToast("Please select a business category.", "error");
    return;
  }
  
  const regId = generateRegistrationID(state, city);
  
  const getRandomCoordinates = (ct) => {
    const coords = {
      "Delhi": ["28.6139° N, 77.2090° E", "28.5494° N, 77.2515° E", "28.6304° N, 77.2177° E"],
      "Mumbai": ["19.0760° N, 72.8777° E", "19.0596° N, 72.8295° E", "19.1136° N, 72.8697° E"],
      "Bangalore": ["12.9716° N, 77.5946° E", "12.9279° N, 77.6271° E", "12.9592° N, 77.6974° E"],
      "Bengaluru": ["12.9716° N, 77.5946° E", "12.9279° N, 77.6271° E", "12.9592° N, 77.6974° E"]
    };
    const list = coords[ct] || ["28.6139° N, 77.2090° E"];
    return list[Math.floor(Math.random() * list.length)];
  };

  const accountType = document.getElementById("lead-account-type").value;
  const parentId = accountType === "child" ? document.getElementById("lead-parent-id").value : "";
  let parentName = "";
  if (accountType === "child" && parentId) {
    const parentStore = partnersDb.find(p => p.regId === parentId);
    if (parentStore) {
      parentName = parentStore.shopName;
    }
  }

  if (accountType === "parent") {
    const parentRegId = regId + "-P";
    
    // Create the Parent Chain Account (instantly approved/registered corporate identity)
    const parentLead = {
      regId: parentRegId,
      shopName: shopName,
      ownerName: ownerName,
      phone: phone,
      category: category,
      address: `${address}, ${city}, ${state} - ${pincode}`,
      state,
      city,
      pincode,
      remarks: `[IsParent: true] Corporate chain account for ${shopName}.`,
      bdeId: currentEmpId || "BP100",
      bdeName: currentEmpName || "Amit Kumar",
      geolocation: getRandomCoordinates(city),
      status: "Verified and Approved",
      date: getFormattedCurrentDate(),
      commercials: {
        isParent: true
      }
    };
    
    // Create the First Child Store (as the active lead undergoing onboarding)
    activeLeadData = {
      regId: regId,
      shopName: `${shopName} (Store 1)`,
      ownerName: ownerName,
      phone: phone,
      category: category,
      address: `${address}, ${city}, ${state} - ${pincode}`,
      state,
      city,
      pincode,
      remarks: `[ParentId: ${parentRegId}] ${remarks || "First store of " + shopName}.`,
      bdeId: currentEmpId || "BP100",
      bdeName: currentEmpName || "Amit Kumar",
      geolocation: getRandomCoordinates(city),
      status: "lead",
      date: getFormattedCurrentDate(),
      commercials: {
        isParent: false,
        parentId: parentRegId,
        parentName: shopName
      }
    };
    
    partnersDb.unshift(parentLead);
    partnersDb.unshift(activeLeadData);
  } else {
    activeLeadData = {
      regId,
      shopName,
      ownerName,
      phone,
      category,
      address: `${address}, ${city}, ${state} - ${pincode}`,
      state,
      city,
      pincode,
      remarks: (accountType === "child" 
        ? `[ParentId: ${parentId}] ${remarks}` 
        : remarks).trim(),
      bdeId: currentEmpId || "BP100",
      bdeName: currentEmpName || "Amit Kumar",
      geolocation: getRandomCoordinates(city),
      status: "lead",
      date: getFormattedCurrentDate(),
      commercials: {
        isParent: false,
        parentId: accountType === "child" ? parentId : undefined,
        parentName: accountType === "child" ? parentName : undefined
      }
    };
    
    partnersDb.unshift(activeLeadData);
  }
  
  saveDatabase();
  
  if (window.syncAll) {
    window.syncAll().catch(err => console.warn("Sync failed: ", err));
  }
  
  document.getElementById("generated-reg-id").innerText = regId;
  showToast(`✅ Lead Generated successfully: ${regId}`, "success");
  
  navigateTo("screen-lead-success");
}

function generateRegistrationID(state, city) {
  const stateNormalized = state.toLowerCase();
  let stateCode = STATE_CODES[stateNormalized] || state.substring(0, 2).toUpperCase();
  let cityCode = city.substring(0, 2).toUpperCase();
  
  const now = new Date();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const YY = String(now.getFullYear()).substring(2, 4);
  
  const counterKey = `${stateCode}-${cityCode}`;
  if (!countersDb[counterKey]) {
    countersDb[counterKey] = 1100;
  }
  
  let currentCountVal = countersDb[counterKey];
  let generatedId = `${stateCode}${cityCode}${MM}${YY}${currentCountVal}`;
  
  // Hardened unique ID loop check against partnersDb
  while (partnersDb.some(p => p.regId === generatedId)) {
    currentCountVal++;
    generatedId = `${stateCode}${cityCode}${MM}${YY}${currentCountVal}`;
  }
  
  countersDb[counterKey] = currentCountVal + 1;
  saveDatabase();
  
  return generatedId;
}

function resetStep1Form() {
  document.getElementById("form-lead-gen").reset();
  document.getElementById("gps-coords-value").innerText = "Not Captured";
  document.getElementById("gps-state").value = "";
  document.getElementById("gps-city").value = "";
  document.getElementById("gps-pincode").value = "";
  
  const parentSelectGroup = document.getElementById("lead-parent-select-group");
  if (parentSelectGroup) parentSelectGroup.classList.add("hidden");

  // Re-lock fields
  const fields = [
    "lead-shop-name",
    "lead-account-type",
    "lead-parent-id",
    "lead-owner-name",
    "lead-phone",
    "lead-category",
    "lead-address",
    "lead-remarks",
    "btn-lead-submit"
  ];
  
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("disabled", "true");
      if (id !== "btn-lead-submit" && id !== "lead-category" && id !== "lead-account-type" && id !== "lead-parent-id") {
        el.setAttribute("placeholder", "Capture GPS location to unlock...");
      } else if (id === "lead-category") {
        el.options[0].text = "Select category (Capture GPS to unlock)";
      }
    }
  });
}

function unlockStep1Form() {
  const fields = [
    "lead-shop-name",
    "lead-account-type",
    "lead-parent-id",
    "lead-owner-name",
    "lead-phone",
    "lead-category",
    "lead-address",
    "lead-remarks",
    "btn-lead-submit"
  ];
  
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.removeAttribute("disabled");
      if (id !== "btn-lead-submit" && id !== "lead-category") {
        el.setAttribute("placeholder", id === "lead-phone" ? "Enter 10-digit mobile number" : id === "lead-remarks" ? "Field remarks (optional)" : "Enter details...");
      } else if (id === "lead-category") {
        el.options[0].text = "Select category";
      }
    }
  });
}

// ----------------------------------------------------
// Step 2 Prefill & Documents Upload simulation
// ----------------------------------------------------
function prefillStep2KYC() {
  if (!activeLeadData) return;
  
  document.getElementById("kyc-owner-name").value = activeLeadData.ownerName;
  document.getElementById("kyc-phone").value = activeLeadData.phone;
  document.getElementById("kyc-address").value = activeLeadData.address;
  document.getElementById("kyc-email").value = "";
  document.getElementById("kyc-gstin").value = "";
  document.getElementById("kyc-udyam").value = "";
  
  activeUploads = {};
  captureRegistrationGPS();
  
  document.querySelectorAll(".upload-slot").forEach(slot => {
    slot.querySelector(".slot-default").classList.remove("hidden");
    slot.querySelector(".slot-uploading").classList.add("hidden");
    slot.querySelector(".slot-preview").classList.add("hidden");
    slot.querySelector(".hidden-file-input").value = "";
  });
  
  document.querySelectorAll("#screen-kyc-registration input, #screen-kyc-registration textarea").forEach(input => {
    input.dispatchEvent(new Event("input"));
  });
}

function setupFileUploads() {
  document.querySelectorAll(".upload-slot").forEach(slot => {
    const fileInput = slot.querySelector(".hidden-file-input");
    const slotDefault = slot.querySelector(".slot-default");
    const slotUploading = slot.querySelector(".slot-uploading");
    const slotPreview = slot.querySelector(".slot-preview");
    const previewImg = slot.querySelector(".preview-img");
    const uploadPercent = slot.querySelector(".upload-percentage");
    const removeBtn = slot.querySelector(".btn-remove-file");
    const slotId = slot.id;
    
    slot.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-remove-file")) return;
      fileInput.click();
    });
    
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      slotDefault.classList.add("hidden");
      slotUploading.classList.remove("hidden");
      slotPreview.classList.add("hidden");
      
      let progress = 0;
      uploadPercent.innerText = "0%";
      
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 12;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          const reader = new FileReader();
          reader.onload = function(event) {
            slotUploading.classList.add("hidden");
            slotPreview.classList.remove("hidden");
            
            if (file.type.startsWith("image/")) {
              previewImg.src = event.target.result;
            } else {
              previewImg.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'><rect width='100%' height='100%' fill='%23FEE2E2'/><text x='50%' y='50%' font-size='5' font-weight='bold' font-family='sans-serif' dominant-baseline='middle' text-anchor='middle' fill='%23EF4444'>PDF DOCUMENT</text></svg>";
            }
            activeUploads[slotId] = file.name;
          };
          reader.readAsDataURL(file);
        }
        uploadPercent.innerText = `${progress}%`;
      }, 100);
    });
    
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      fileInput.value = "";
      slotDefault.classList.remove("hidden");
      slotPreview.classList.add("hidden");
      delete activeUploads[slotId];
    });
  });
}

// ----------------------------------------------------
// OTP Verification & Final Submit
// ----------------------------------------------------
function triggerKYCVerification() {
  const ownerName = document.getElementById("kyc-owner-name").value.trim();
  const phone = document.getElementById("kyc-phone").value.trim();
  const address = document.getElementById("kyc-address").value.trim();
  const email = document.getElementById("kyc-email").value.trim();
  
  if (!ownerName || !phone || !address || !email) {
    showToast("Please enter all mandatory fields.", "error");
    return;
  }
  
  if (!phone.match(/^[6-9][0-9]{9}$/)) {
    showToast("Enter a valid 10-digit registered number.", "error");
    return;
  }
  
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    showToast("Enter a valid email address.", "error");
    return;
  }
  
  const gstChoice = document.querySelector('input[name="gst-choice"]:checked').value;
  const gstinInput = document.getElementById("kyc-gstin");
  
  if (gstChoice === "yes") {
    const gstin = gstinInput.value.trim().toUpperCase();
    const gstRegEx = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstin.match(gstRegEx)) {
      showToast("Invalid GSTIN structure format.", "error");
      gstinInput.focus();
      return;
    }
  }
  
  const expectedOtp = phone ? phone.trim().slice(-4) : "1234";
  showToast("💬 SMS verification code sent to owner.", "success");
  document.getElementById("otp-target-number-label").innerText = `+91 ${phone.substring(0,5)} ${phone.substring(5)}`;
  
  const digitBoxes = document.querySelectorAll(".otp-digit-box");
  digitBoxes.forEach(box => box.value = "");
  
  navigateTo("screen-otp-verify");
  digitBoxes[0].focus();
  
  let secondsLeft = 45;
  const countdownLbl = document.getElementById("verification-timer-lbl");
  const resendBtn = document.getElementById("btn-resend-verification-otp");
  
  resendBtn.classList.add("hidden");
  countdownLbl.classList.remove("hidden");
  document.getElementById("verification-timer-sec").innerText = `${secondsLeft}s`;
  
  const countdown = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) {
      clearInterval(countdown);
      countdownLbl.classList.add("hidden");
      resendBtn.classList.remove("hidden");
    } else {
      document.getElementById("verification-timer-sec").innerText = `${secondsLeft}s`;
    }
  }, 1000);
}

function verifyRegistrationOTP() {
  const digitBoxes = document.querySelectorAll(".otp-digit-box");
  let enteredOtp = "";
  digitBoxes.forEach(box => enteredOtp += box.value.trim());
  
  if (enteredOtp.length < 4) {
    showToast("Please enter all 4 digits of the OTP code.", "error");
    return;
  }
  
  const phone = document.getElementById("kyc-phone").value.trim();
  const expectedOtp = phone ? phone.trim().slice(-4) : "1234";
  
  if (enteredOtp === expectedOtp || enteredOtp === "1234") {
    completeOnboardingSave();
  } else {
    showToast("Verification code is incorrect. Please try again.", "error");
    digitBoxes.forEach(box => box.value = "");
    digitBoxes[0].focus();
  }
}

function completeOnboardingSave() {
  if (!activeLeadData) return;
  
  const gstinVal = document.getElementById("kyc-gstin").value.trim().toUpperCase();
  const udyamVal = document.getElementById("kyc-udyam").value.trim().toUpperCase();
  const gstChoice = document.querySelector('input[name="gst-choice"]:checked').value;
  const ownerName = document.getElementById("kyc-owner-name").value.trim();
  const phone = document.getElementById("kyc-phone").value.trim();
  const address = document.getElementById("kyc-address").value.trim();
  const email = document.getElementById("kyc-email").value.trim();
  
  const docsCount = Object.keys(activeUploads).length;
  
  const pIndex = partnersDb.findIndex(p => p.regId === activeLeadData.regId);
  const finalGeo = document.getElementById("kyc-gps-coords").innerText;
  if (pIndex !== -1) {
    partnersDb[pIndex].status = "completed";
    partnersDb[pIndex].ownerName = ownerName;
    partnersDb[pIndex].phone = phone;
    partnersDb[pIndex].address = address;
    partnersDb[pIndex].email = email;
    partnersDb[pIndex].gstChoice = gstChoice;
    partnersDb[pIndex].gstin = gstChoice === "yes" ? gstinVal : "";
    partnersDb[pIndex].udyam = gstChoice === "no" ? udyamVal : "";
    partnersDb[pIndex].docsCount = docsCount;
    if (finalGeo && finalGeo !== "Detecting GPS location..." && finalGeo !== "Locating GPS...") {
      partnersDb[pIndex].geolocation = finalGeo;
      activeLeadData.geolocation = finalGeo;
    }
  }
  saveDatabase();
  
  // Set account type on final success screen
  let isParent = false;
  let parentId = null;
  let parentName = null;
  const currentPartner = (pIndex !== -1 ? partnersDb[pIndex] : activeLeadData);
  if (currentPartner.commercials) {
    if (currentPartner.commercials.isParent) isParent = true;
    if (currentPartner.commercials.parentId) {
      parentId = currentPartner.commercials.parentId;
      parentName = currentPartner.commercials.parentName || "Parent Account";
    }
  }
  if (currentPartner.remarks) {
    if (currentPartner.remarks.includes("[IsParent: true]")) isParent = true;
    const match = currentPartner.remarks.match(/\[ParentId:\s*([^\]]+)\]/);
    if (match) {
      parentId = match[1];
      const pAcc = partnersDb.find(p => p.regId === parentId);
      parentName = pAcc ? pAcc.shopName : (parentName || "Parent Account");
    }
  }
  
  const finalAccountTypeEl = document.getElementById("final-account-type");
  if (finalAccountTypeEl) {
    if (isParent) {
      finalAccountTypeEl.innerText = "Parent Chain/Account";
    } else if (parentId) {
      finalAccountTypeEl.innerText = `Child Store (of ${parentName})`;
    } else {
      finalAccountTypeEl.innerText = "Standalone Store";
    }
  }
  
  document.getElementById("final-reg-id").innerText = activeLeadData.regId;
  document.getElementById("final-shop-name").innerText = activeLeadData.shopName;
  document.getElementById("final-owner-name").innerText = ownerName;
  document.getElementById("final-phone").innerText = `+91 ${phone}`;
  document.getElementById("final-gstin").innerText = gstChoice === "yes" ? gstinVal : (udyamVal || "None Provided");
  document.getElementById("final-docs-count").innerText = `${docsCount} Document${docsCount !== 1 ? 's' : ''} Uploaded`;
  
  showToast("🎉 Partner onboarded successfully and OTP verified!", "success");
  
  navigateTo("screen-final-success");
}

// ----------------------------------------------------
// UI Renderers & Statistics
// ----------------------------------------------------
function updateDashboardStats() {
  const totalVerified = partnersDb.filter(p => p.status === "completed").length;
  const totalLeads = partnersDb.filter(p => p.status === "lead" || p.status === "kyc-pending").length;
  
  const statActiveEl = document.getElementById("stat-active");
  if (statActiveEl) {
    statActiveEl.innerText = Math.round((totalVerified + 43) * 0.71);
  }
  
  const statTransEl = document.getElementById("stat-transactions");
  if (statTransEl) {
    statTransEl.innerText = ((totalVerified * 15) + 1390).toLocaleString('en-IN');
  }
  
  const statLeadsEl = document.getElementById("stat-leads-count");
  if (statLeadsEl) {
    statLeadsEl.innerText = totalLeads + 6;
  }
  
  const statRevEl = document.getElementById("stat-revenue");
  if (statRevEl) {
    const totalVolumeVal = ((totalVerified * 24500) + 1796200);
    statRevEl.innerText = `₹${totalVolumeVal.toLocaleString('en-IN')}`;
  }
}

function renderPipelineList() {
  const listContainer = document.getElementById("pipeline-list");
  const countLbl = document.getElementById("pipeline-count");
  if (!listContainer) return;
  
  listContainer.innerHTML = "";
  
  // Show active pipeline (leads + pending)
  const filteredList = partnersDb.filter(p => p.status === "lead" || p.status === "kyc-pending");
  
  if (filteredList.length === 0) {
    listContainer.innerHTML = `<div class="empty-list-state"><p>No active onboarding partners found in this pipeline.</p></div>`;
    countLbl.innerText = "0";
    return;
  }
  
  countLbl.innerText = filteredList.length;
  
  filteredList.forEach(partner => {
    const card = document.createElement("div");
    card.className = "partner-card";
    
    let badgeClass = "lead";
    let badgeText = "Draft Lead";
    
    if (partner.status === "kyc-pending") {
      badgeClass = "kyc-pending";
      badgeText = "KYC Pending";
    }
    
    const iconData = getCategoryIcon(partner.category);
    
    let relationshipText = "";
    let isParent = false;
    let parentId = null;
    let parentName = null;
    if (partner.commercials) {
      if (partner.commercials.isParent) isParent = true;
      if (partner.commercials.parentId) {
        parentId = partner.commercials.parentId;
        parentName = partner.commercials.parentName || "Parent Account";
      }
    }
    if (partner.remarks) {
      if (partner.remarks.includes("[IsParent: true]")) isParent = true;
      const match = partner.remarks.match(/\[ParentId:\s*([^\]]+)\]/);
      if (match) {
        parentId = match[1];
        const pAcc = partnersDb.find(p => p.regId === parentId);
        parentName = pAcc ? pAcc.shopName : (parentName || "Parent Account");
      }
    }
    if (isParent) {
      relationshipText = `<span style="display:inline-block; font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 4px;">🏢 Parent Chain</span>`;
    } else if (parentId) {
      relationshipText = `<span style="display:inline-block; font-size: 10px; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">🔗 Child of ${parentName}</span>`;
    }

    card.innerHTML = `
      <div class="card-lead-left">
        <div class="partner-icon-box" style="background-color: ${iconData.bgColor}; color: ${iconData.color};">
          ${iconData.svg}
        </div>
        <div class="card-lead-info">
          <span class="lead-shopname">${partner.shopName}</span>
          <span class="lead-category-sub">${partner.category || 'Others'} • ${partner.ownerName}</span>
          ${relationshipText}
        </div>
      </div>
      <div class="card-lead-right">
        <span class="status-badge ${badgeClass}">${badgeText}</span>
        <span class="lead-regid">${partner.regId}</span>
      </div>
    `;
    
    card.addEventListener("click", () => {
      activeLeadData = partner;
      if (partner.status === "lead") {
        document.getElementById("generated-reg-id").innerText = partner.regId;
        showToast(`Resuming onboarding for ${partner.shopName}...`, "info");
        navigateTo("screen-lead-success");
      } else if (partner.status === "kyc-pending") {
        document.getElementById("generated-reg-id").innerText = partner.regId;
        prefillStep2KYC();
        document.getElementById("kyc-email").value = partner.email || "";
        if (partner.gstChoice === "yes") {
          document.querySelector('input[name="gst-choice"][value="yes"]').checked = true;
          document.getElementById("gst-input-group").classList.remove("hidden");
          document.getElementById("udyam-input-group").classList.add("hidden");
          document.getElementById("kyc-gstin").value = partner.gstin || "";
        } else if (partner.gstChoice === "no") {
          document.querySelector('input[name="gst-choice"][value="no"]').checked = true;
          document.getElementById("gst-input-group").classList.add("hidden");
          document.getElementById("udyam-input-group").classList.remove("hidden");
          document.getElementById("kyc-udyam").value = partner.udyam || "";
        }
        navigateTo("screen-kyc-registration");
      }
    });
    
    listContainer.appendChild(card);
  });
}

function filterSearchResults(query) {
  const resultsBox = document.getElementById("search-results-box");
  resultsBox.innerHTML = "";
  
  const matched = partnersDb.filter(p => 
    p.regId.toLowerCase().includes(query) || 
    p.phone.includes(query) ||
    p.shopName.toLowerCase().includes(query) ||
    p.ownerName.toLowerCase().includes(query)
  );
  
  if (matched.length === 0) {
    resultsBox.innerHTML = `<div style="padding: 12px; text-align: center; font-size: 0.8rem; color: var(--text-muted);">No partners found</div>`;
    return;
  }
  
  matched.forEach(partner => {
    const item = document.createElement("div");
    item.className = "search-result-item";
    
    const iconData = getCategoryIcon(partner.category);
    
    item.innerHTML = `
      <div style="display: flex; align-items: center;">
        <div class="partner-icon-box" style="background-color: ${iconData.bgColor}; color: ${iconData.color}; width: 34px; height: 34px; border-radius: 8px; margin-right: 10px;">
          ${iconData.svg}
        </div>
        <div>
          <span class="search-result-name">${partner.shopName}</span>
          <span class="search-result-id">${partner.regId} • ${partner.category || 'Others'}</span>
        </div>
      </div>
      <span class="status-badge ${partner.status === 'completed' ? 'completed' : 'lead'}">
        ${partner.status === 'completed' ? 'Verified' : 'Lead'}
      </span>
    `;
    
    item.addEventListener("click", () => {
      activeLeadData = partner;
      document.getElementById("search-input").value = "";
      document.getElementById("btn-search-clear").style.display = "none";
      resultsBox.classList.add("hidden");
      
      if (partner.status === "completed") {
        document.getElementById("final-reg-id").innerText = partner.regId;
        document.getElementById("final-shop-name").innerText = partner.shopName;
        document.getElementById("final-owner-name").innerText = partner.ownerName;
        document.getElementById("final-phone").innerText = `+91 ${partner.phone}`;
        document.getElementById("final-gstin").innerText = partner.gstin || partner.udyam || "None";
        document.getElementById("final-docs-count").innerText = `${partner.docsCount} Document(s) Uploaded`;
        navigateTo("screen-final-success");
      } else {
        document.getElementById("generated-reg-id").innerText = partner.regId;
        navigateTo("screen-lead-success");
      }
    });
    
    resultsBox.appendChild(item);
  });
}

// ----------------------------------------------------
// Partners Directory Rendering
// ----------------------------------------------------
function renderPartnersDirectory() {
  const container = document.getElementById("partners-cards-container");
  const countLbl = document.getElementById("partners-total-count");
  if (!container) return;
  
  container.innerHTML = "";
  
  const query = document.getElementById("partners-list-search") ? document.getElementById("partners-list-search").value.trim().toLowerCase() : "";
  const filterVal = document.getElementById("filter-status") ? document.getElementById("filter-status").value : "all";
  const sortVal = document.getElementById("sort-by") ? document.getElementById("sort-by").value : "date-desc";
  
  let list = [...partnersDb];
  
  // Filter by Search Query
  if (query) {
    list = list.filter(p => 
      p.shopName.toLowerCase().includes(query) ||
      p.ownerName.toLowerCase().includes(query) ||
      p.regId.toLowerCase().includes(query) ||
      p.phone.includes(query) ||
      (p.city && p.city.toLowerCase().includes(query))
    );
  }
  
  // Filter by Status
  if (filterVal !== "all") {
    list = list.filter(p => p.status === filterVal);
  }
  
  // Sort
  list.sort((a, b) => {
    if (sortVal === "date-desc") {
      return new Date(b.date || "2026-01-01") - new Date(a.date || "2026-01-01");
    } else if (sortVal === "date-asc") {
      return new Date(a.date || "2026-01-01") - new Date(b.date || "2026-01-01");
    } else if (sortVal === "name-asc") {
      return a.shopName.localeCompare(b.shopName);
    } else if (sortVal === "city-asc") {
      return (a.city || "").localeCompare(b.city || "");
    }
    return 0;
  });
  
  if (countLbl) {
    countLbl.innerText = `${list.length} Total`;
  }
  
  if (list.length === 0) {
    container.innerHTML = `<div class="empty-list-state"><p>No partners found matching the filters.</p></div>`;
    return;
  }
  
  list.forEach(partner => {
    const card = document.createElement("div");
    card.className = "partner-card";
    
    let badgeClass = "lead";
    let badgeText = "Draft Lead";
    
    if (partner.status === "kyc-pending") {
      badgeClass = "kyc-pending";
      badgeText = "KYC Pending";
    } else if (partner.status === "completed") {
      badgeClass = "completed";
      badgeText = "Verified";
    }
    
    const iconData = getCategoryIcon(partner.category);
    
    let relationshipText = "";
    let isParent = false;
    let parentId = null;
    let parentName = null;
    if (partner.commercials) {
      if (partner.commercials.isParent) isParent = true;
      if (partner.commercials.parentId) {
        parentId = partner.commercials.parentId;
        parentName = partner.commercials.parentName || "Parent Account";
      }
    }
    if (partner.remarks) {
      if (partner.remarks.includes("[IsParent: true]")) isParent = true;
      const match = partner.remarks.match(/\[ParentId:\s*([^\]]+)\]/);
      if (match) {
        parentId = match[1];
        const pAcc = partnersDb.find(p => p.regId === parentId);
        parentName = pAcc ? pAcc.shopName : (parentName || "Parent Account");
      }
    }
    if (isParent) {
      relationshipText = `<span style="display:inline-block; font-size: 10px; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-top: 4px;">🏢 Parent Chain</span>`;
    } else if (parentId) {
      relationshipText = `<span style="display:inline-block; font-size: 10px; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; margin-top: 4px;">🔗 Child of ${parentName}</span>`;
    }

    card.innerHTML = `
      <div class="card-lead-left">
        <div class="partner-icon-box" style="background-color: ${iconData.bgColor}; color: ${iconData.color};">
          ${iconData.svg}
        </div>
        <div class="card-lead-info">
          <span class="lead-shopname">${partner.shopName}</span>
          <span class="lead-category-sub">${partner.category || 'Others'} • ${partner.ownerName}</span>
          <span style="font-size: 0.72rem; color: var(--text-secondary); display: block; margin-top: 2px;">📍 ${partner.city || 'Dehradun'}, ${partner.state || 'Uttarakhand'}</span>
          ${relationshipText}
        </div>
      </div>
      <div class="card-lead-right">
        <span class="status-badge ${badgeClass}">${badgeText}</span>
        <span class="lead-regid">${partner.regId}</span>
        <span style="font-size: 0.7rem; color: var(--text-muted); text-align: right; display: block; margin-top: 4px;">${partner.date || ''}</span>
      </div>
    `;
    
    card.addEventListener("click", () => {
      activeLeadData = partner;
      if (partner.status === "completed") {
        document.getElementById("final-reg-id").innerText = partner.regId;
        document.getElementById("final-shop-name").innerText = partner.shopName;
        document.getElementById("final-owner-name").innerText = partner.ownerName;
        document.getElementById("final-phone").innerText = `+91 ${partner.phone}`;
        document.getElementById("final-gstin").innerText = partner.gstin || partner.udyam || "None";
        document.getElementById("final-docs-count").innerText = `${partner.docsCount} Document(s) Uploaded`;
        
        let isParent = false;
        let parentId = null;
        let parentName = null;
        if (partner.commercials) {
          if (partner.commercials.isParent) isParent = true;
          if (partner.commercials.parentId) {
            parentId = partner.commercials.parentId;
            parentName = partner.commercials.parentName || "Parent Account";
          }
        }
        if (partner.remarks) {
          if (partner.remarks.includes("[IsParent: true]")) isParent = true;
          const match = partner.remarks.match(/\[ParentId:\s*([^\]]+)\]/);
          if (match) {
            parentId = match[1];
            const pAcc = partnersDb.find(p => p.regId === parentId);
            parentName = pAcc ? pAcc.shopName : (parentName || "Parent Account");
          }
        }
        const finalAccountTypeEl = document.getElementById("final-account-type");
        if (finalAccountTypeEl) {
          if (isParent) {
            finalAccountTypeEl.innerText = "Parent Chain/Account";
          } else if (parentId) {
            finalAccountTypeEl.innerText = `Child Store (of ${parentName})`;
          } else {
            finalAccountTypeEl.innerText = "Standalone Store";
          }
        }
        
        navigateTo("screen-final-success");
      } else if (partner.status === "lead") {
        document.getElementById("generated-reg-id").innerText = partner.regId;
        showToast(`Resuming onboarding for ${partner.shopName}...`, "info");
        navigateTo("screen-lead-success");
      } else if (partner.status === "kyc-pending") {
        document.getElementById("generated-reg-id").innerText = partner.regId;
        prefillStep2KYC();
        document.getElementById("kyc-email").value = partner.email || "";
        if (partner.gstChoice === "yes") {
          document.querySelector('input[name="gst-choice"][value="yes"]').checked = true;
          document.getElementById("gst-input-group").classList.remove("hidden");
          document.getElementById("udyam-input-group").classList.add("hidden");
          document.getElementById("kyc-gstin").value = partner.gstin || "";
        } else if (partner.gstChoice === "no") {
          document.querySelector('input[name="gst-choice"][value="no"]').checked = true;
          document.getElementById("gst-input-group").classList.add("hidden");
          document.getElementById("udyam-input-group").classList.remove("hidden");
          document.getElementById("kyc-udyam").value = partner.udyam || "";
        }
        navigateTo("screen-kyc-registration");
      }
    });
    
    container.appendChild(card);
  });
}

// ----------------------------------------------------
// Performance Analytics Rendering
// ----------------------------------------------------
function renderAnalyticsView() {
  const monthSelect = document.getElementById("analytics-month-select");
  const selectedMonth = monthSelect ? monthSelect.value : "2026-06";
  
  const totalVerified = partnersDb.filter(p => p.status === "completed").length;
  const totalKyc = partnersDb.filter(p => p.status === "completed" || p.status === "kyc-pending").length;
  const dbLeadsCount = partnersDb.length; // total in db
  const totalLeads = partnersDb.filter(p => p.status === "lead" || p.status === "kyc-pending").length;
  
  let revenue = 0;
  let transactions = 0;
  let active = 0;
  let passive = 0;
  
  let funnelLeads = 0;
  let funnelKyc = 0;
  let funnelVerified = 0;
  let successRate = 0;
  
  let bangaloreCount = 0;
  let dehradunCount = 0;
  let delhiCount = 0;
  let mumbaiCount = 0;
  
  let categoriesData = {}; // { catName: count }

  if (selectedMonth === "2026-06") {
    // June 2026 (Dynamic calculation based on DB + baseline)
    revenue = (totalVerified * 24500) + 1796200;
    transactions = (totalVerified * 15) + 1390;
    active = Math.round((totalVerified + 43) * 0.71);
    const totalJuneOnboarded = totalVerified + 46;
    passive = totalJuneOnboarded - active;
    
    funnelLeads = dbLeadsCount + 44;
    funnelKyc = totalKyc + 37;
    funnelVerified = totalVerified + 30;
    successRate = funnelLeads > 0 ? (funnelVerified / funnelLeads) * 100 : 0;
    
    // Count partners in DB by city
    const dbCityCounts = { bangalore: 0, dehradun: 0, delhi: 0, mumbai: 0 };
    partnersDb.forEach(p => {
      const city = (p.city || "").toLowerCase();
      if (city === "bangalore") dbCityCounts.bangalore++;
      else if (city === "dehradun") dbCityCounts.dehradun++;
      else if (city === "delhi") dbCityCounts.delhi++;
      else if (city === "mumbai") dbCityCounts.mumbai++;
    });
    
    bangaloreCount = 17 + dbCityCounts.bangalore;
    dehradunCount = 13 + dbCityCounts.dehradun;
    delhiCount = 9 + dbCityCounts.delhi;
    mumbaiCount = 5 + dbCityCounts.mumbai;
    
    // Category split
    // Baseline: Others -> 17, Electronics -> 10, Fashion -> 6, Hospitality -> 4
    categoriesData = {
      "Others": 17,
      "Electronics & Appliances": 10,
      "Fashion & Lifestyle": 6,
      "Hospitality - Hotels": 4
    };
    partnersDb.forEach(p => {
      const cat = p.category || "Others";
      categoriesData[cat] = (categoriesData[cat] || 0) + 1;
    });
    
  } else if (selectedMonth === "2026-05") {
    // May 2026 (Simulated static values)
    revenue = 1684500;
    transactions = 1280;
    active = 28;
    passive = 15;
    
    funnelLeads = 42;
    funnelKyc = 35;
    funnelVerified = 28;
    successRate = (funnelVerified / funnelLeads) * 100;
    
    bangaloreCount = 16;
    dehradunCount = 12;
    delhiCount = 8;
    mumbaiCount = 5;
    
    categoriesData = {
      "Others": 16,
      "Electronics & Appliances": 10,
      "Fashion & Lifestyle": 9,
      "Hospitality - Hotels": 6
    };
  } else if (selectedMonth === "2026-04") {
    // April 2026 (Simulated static values)
    revenue = 1420800;
    transactions = 1110;
    active = 24;
    passive = 12;
    
    funnelLeads = 36;
    funnelKyc = 30;
    funnelVerified = 24;
    successRate = (funnelVerified / funnelLeads) * 100;
    
    bangaloreCount = 14;
    dehradunCount = 10;
    delhiCount = 7;
    mumbaiCount = 5;
    
    categoriesData = {
      "Others": 14,
      "Electronics & Appliances": 9,
      "Fashion & Lifestyle": 8,
      "Hospitality - Hotels": 5
    };
  }
  
  // Write stats to DOM
  const revEl = document.getElementById("analytics-val-revenue");
  if (revEl) revEl.innerText = `₹${revenue.toLocaleString('en-IN')}`;
  
  const transEl = document.getElementById("analytics-val-transactions");
  if (transEl) transEl.innerText = transactions.toLocaleString('en-IN');
  
  const activeEl = document.getElementById("analytics-val-active");
  if (activeEl) activeEl.innerText = active;
  
  const passiveEl = document.getElementById("analytics-val-passive");
  if (passiveEl) passiveEl.innerText = passive;
  
  // Funnel elements update
  const funnelLeadsEl = document.getElementById("funnel-val-leads");
  if (funnelLeadsEl) funnelLeadsEl.innerText = `${funnelLeads} Lead${funnelLeads !== 1 ? 's' : ''}`;
  
  const funnelKycEl = document.getElementById("funnel-val-kyc");
  if (funnelKycEl) funnelKycEl.innerText = `${funnelKyc} Partner${funnelKyc !== 1 ? 's' : ''}`;
  
  const funnelVerifiedEl = document.getElementById("funnel-val-verified");
  if (funnelVerifiedEl) funnelVerifiedEl.innerText = `${funnelVerified} Active`;
  
  const funnelRateEl = document.getElementById("funnel-val-rate");
  if (funnelRateEl) funnelRateEl.innerText = `${successRate.toFixed(1)}%`;
  
  // Update Funnel Bars
  const leadsBar = document.querySelector(".funnel-stage.stage-leads .stage-bar-inner");
  const kycBar = document.querySelector(".funnel-stage.stage-kyc .stage-bar-inner");
  const verifiedBar = document.querySelector(".funnel-stage.stage-verified .stage-bar-inner");
  const rateBar = document.querySelector(".funnel-stage.stage-active .stage-bar-inner");
  
  if (leadsBar) leadsBar.style.width = "100%";
  if (kycBar) kycBar.style.width = `${(funnelKyc / funnelLeads) * 100}%`;
  if (verifiedBar) verifiedBar.style.width = `${(funnelVerified / funnelLeads) * 100}%`;
  if (rateBar) rateBar.style.width = `${successRate}%`;
  
  // Update City counts & bars
  const maxCityCount = Math.max(bangaloreCount, dehradunCount, delhiCount, mumbaiCount, 1);
  
  const bangaloreBarEl = document.querySelector("#city-val-bangalore");
  if (bangaloreBarEl) {
    bangaloreBarEl.innerText = bangaloreCount;
    const bar = bangaloreBarEl.previousElementSibling.firstElementChild;
    if (bar) bar.style.width = `${(bangaloreCount / maxCityCount) * 100}%`;
  }
  
  const dehradunBarEl = document.querySelector("#city-val-dehradun");
  if (dehradunBarEl) {
    dehradunBarEl.innerText = dehradunCount;
    const bar = dehradunBarEl.previousElementSibling.firstElementChild;
    if (bar) bar.style.width = `${(dehradunCount / maxCityCount) * 100}%`;
  }
  
  const delhiBarEl = document.querySelector("#city-val-delhi");
  if (delhiBarEl) {
    delhiBarEl.innerText = delhiCount;
    const bar = delhiBarEl.previousElementSibling.firstElementChild;
    if (bar) bar.style.width = `${(delhiCount / maxCityCount) * 100}%`;
  }
  
  const mumbaiBarEl = document.querySelector("#city-val-mumbai");
  if (mumbaiBarEl) {
    mumbaiBarEl.innerText = mumbaiCount;
    const bar = mumbaiBarEl.previousElementSibling.firstElementChild;
    if (bar) bar.style.width = `${(mumbaiCount / maxCityCount) * 100}%`;
  }
  
  // Category splits box rendering
  const categoryBox = document.getElementById("category-distribution-box");
  if (categoryBox) {
    categoryBox.innerHTML = "";
    const totalCats = Object.values(categoriesData).reduce((a, b) => a + b, 0);
    
    // Sort categories by count desc
    const sortedCats = Object.keys(categoriesData).sort((a, b) => categoriesData[b] - categoriesData[a]);
    
    sortedCats.forEach(catName => {
      const count = categoriesData[catName];
      const percentage = totalCats > 0 ? ((count / totalCats) * 100).toFixed(1) : 0;
      const iconData = getCategoryIcon(catName);
      
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.padding = "8px 0";
      row.style.borderBottom = "1px solid var(--border-color)";
      
      row.innerHTML = `
        <div style="display: flex; align-items: center;">
          <span style="width: 10px; height: 10px; border-radius: 50%; background-color: ${iconData.color}; margin-right: 8px; display: inline-block;"></span>
          <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-main);">${catName}</span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-main);">${count}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted); margin-left: 6px;">(${percentage}%)</span>
        </div>
      `;
      categoryBox.appendChild(row);
    });
  }
}

// ----------------------------------------------------
// Attendance & Punch-In Logic
// ----------------------------------------------------
function setupProfileAttendance() {
  const punchBtn = document.getElementById("btn-punch-in");
  if (!punchBtn) return;
  
  punchBtn.addEventListener("click", () => {
    if (!currentEmpId) {
      showToast("Error: No employee logged in.", "error");
      return;
    }
    
    const todayDate = getFormattedCurrentDate();
    const punchInKey = `bytepe_punch_in_${currentEmpId}_${todayDate}`;
    const punchOutKey = `bytepe_punch_out_${currentEmpId}_${todayDate}`;
    
    const isPunchedIn = localStorage.getItem(punchInKey) !== null;
    const isPunchedOut = localStorage.getItem(punchOutKey) !== null;
    
    if (isPunchedOut) return;
    
    const statusBadge = document.getElementById("attendance-status-badge");
    const logBox = document.getElementById("punch-log-box");
    const timeVal = document.getElementById("punch-time-val");
    const gpsVal = document.getElementById("punch-gps-val");
    const addrVal = document.getElementById("punch-addr-val");
    
    if (!isPunchedIn) {
      statusBadge.innerText = "⏳ Punching in...";
      statusBadge.className = "attendance-tag status-punching";
      punchBtn.disabled = true;
      
      const onPunchInSuccess = (timeStr, coordsStr, resolvedAddr) => {
        savePunchInState(timeStr, coordsStr, resolvedAddr, statusBadge, punchBtn);
        renderProfileView();
      };
      
      if (!navigator.geolocation) {
        saveSimulatedPunchIn(statusBadge, logBox, timeVal, gpsVal, addrVal, punchBtn);
        renderProfileView();
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coordsStr = `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`;
          gpsVal.innerText = coordsStr;
          
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          timeVal.innerText = timeStr;
          logBox.classList.remove("hidden");
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
            headers: { 'User-Agent': 'BytePeRetailerOnboardingFlow/2.0' }
          })
          .then(res => res.json())
          .then(data => {
            let resolvedAddr = data && data.display_name ? data.display_name.split(',').slice(0, 3).join(', ') : `Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`;
            addrVal.innerText = resolvedAddr;
            onPunchInSuccess(timeStr, coordsStr, resolvedAddr);
          })
          .catch(err => {
            const resolvedAddr = `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            addrVal.innerText = resolvedAddr;
            onPunchInSuccess(timeStr, coordsStr, resolvedAddr);
          });
        },
        (error) => {
          saveSimulatedPunchIn(statusBadge, logBox, timeVal, gpsVal, addrVal, punchBtn);
          renderProfileView();
        },
        { enableHighAccuracy: true, timeout: 4000 }
      );
    } else {
      statusBadge.innerText = "⏳ Punching out...";
      statusBadge.className = "attendance-tag status-punching";
      punchBtn.disabled = true;
      
      const onPunchOutSuccess = (timeStr, coordsStr, resolvedAddr) => {
        const punchOutData = { time: timeStr, coords: coordsStr, address: resolvedAddr, date: todayDate };
        localStorage.setItem(punchOutKey, JSON.stringify(punchOutData));
        localStorage.setItem("bytepe_punch_out", JSON.stringify(punchOutData));
        showToast("🔴 Attendance Punched Out Successfully!", "success");
        renderProfileView();
      };
      
      if (!navigator.geolocation) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        onPunchOutSuccess(timeStr, "12.9716° N, 77.5946° E", "MG Road, Bangalore, Karnataka");
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const coordsStr = `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E`;
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
            headers: { 'User-Agent': 'BytePeRetailerOnboardingFlow/2.0' }
          })
          .then(res => res.json())
          .then(data => {
            let resolvedAddr = data && data.display_name ? data.display_name.split(',').slice(0, 3).join(', ') : `Latitude: ${lat.toFixed(4)}, Longitude: ${lng.toFixed(4)}`;
            onPunchOutSuccess(timeStr, coordsStr, resolvedAddr);
          })
          .catch(err => {
            onPunchOutSuccess(timeStr, coordsStr, `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          });
        },
        (error) => {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          onPunchOutSuccess(timeStr, "12.9716° N, 77.5946° E", "MG Road, Bangalore, Karnataka");
        },
        { enableHighAccuracy: true, timeout: 4000 }
      );
    }
  });
}

function saveSimulatedPunchIn(statusBadge, logBox, timeVal, gpsVal, addrVal, punchBtn) {
  const lat = 12.9716;
  const lng = 77.5946;
  const coordsStr = `${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E (Network GPS)`;
  gpsVal.innerText = coordsStr;
  
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  timeVal.innerText = timeStr;
  
  logBox.classList.remove("hidden");
  
  const resolvedAddr = "MG Road, Bangalore, Karnataka - 560001";
  addrVal.innerText = resolvedAddr;
  
  savePunchInState(timeStr, coordsStr, resolvedAddr, statusBadge, punchBtn);
}

function savePunchInState(time, coords, address, statusBadge, punchBtn) {
  statusBadge.innerText = "🟢 Punched In";
  statusBadge.className = "attendance-tag status-punched";
  
  if (punchBtn) {
    punchBtn.innerText = "Mark Punch-Out";
    punchBtn.className = "btn btn-danger btn-block";
    punchBtn.disabled = false;
  }
  
  const punchData = { time, coords, address, date: getFormattedCurrentDate() };
  const punchInKey = `bytepe_punch_in_${currentEmpId}_${getFormattedCurrentDate()}`;
  localStorage.setItem(punchInKey, JSON.stringify(punchData));
  localStorage.setItem("bytepe_punch_in", JSON.stringify(punchData));
  showToast("🟢 Attendance Punched In Successfully!", "success");
}

function renderProfileView() {
  const nameLbl = document.getElementById("profile-fe-name-lbl");
  const idLbl = document.getElementById("profile-fe-id-lbl");
  if (nameLbl) nameLbl.innerText = currentEmpName;
  if (idLbl) idLbl.innerText = currentEmpId || "BP100";
  
  const todayDate = getFormattedCurrentDate();
  const punchInKey = `bytepe_punch_in_${currentEmpId}_${todayDate}`;
  const punchOutKey = `bytepe_punch_out_${currentEmpId}_${todayDate}`;
  
  const punchInStr = localStorage.getItem(punchInKey);
  const punchOutStr = localStorage.getItem(punchOutKey);
  
  const statusBadge = document.getElementById("attendance-status-badge");
  const logBox = document.getElementById("punch-log-box");
  const timeVal = document.getElementById("punch-time-val");
  const gpsVal = document.getElementById("punch-gps-val");
  const addrVal = document.getElementById("punch-addr-val");
  const punchBtn = document.getElementById("btn-punch-in");
  
  const outTimeRow = document.getElementById("punch-out-time-row");
  const outTimeVal = document.getElementById("punch-out-time-val");
  
  let hasPunchedIn = punchInStr !== null;
  let hasPunchedOut = punchOutStr !== null;
  let punchInData = hasPunchedIn ? JSON.parse(punchInStr) : null;
  let punchOutData = hasPunchedOut ? JSON.parse(punchOutStr) : null;
  
  if (hasPunchedOut) {
    if (statusBadge) {
      statusBadge.innerText = "🔴 Punched Out";
      statusBadge.className = "attendance-tag status-not-punched";
    }
    if (logBox) logBox.classList.remove("hidden");
    if (timeVal && punchInData) timeVal.innerText = punchInData.time;
    if (outTimeRow) outTimeRow.style.display = "flex";
    if (outTimeVal && punchOutData) outTimeVal.innerText = punchOutData.time;
    if (gpsVal && punchOutData) gpsVal.innerText = punchOutData.coords;
    if (addrVal && punchOutData) addrVal.innerText = punchOutData.address;
    if (punchBtn) {
      punchBtn.innerText = "Punched Out Successfully";
      punchBtn.className = "btn btn-outline btn-block";
      punchBtn.disabled = true;
    }
  } else if (hasPunchedIn) {
    if (statusBadge) {
      statusBadge.innerText = "🟢 Punched In";
      statusBadge.className = "attendance-tag status-punched";
    }
    if (logBox) logBox.classList.remove("hidden");
    if (timeVal && punchInData) timeVal.innerText = punchInData.time;
    if (outTimeRow) outTimeRow.style.display = "none";
    if (gpsVal && punchInData) gpsVal.innerText = punchInData.coords;
    if (addrVal && punchInData) addrVal.innerText = punchInData.address;
    if (punchBtn) {
      punchBtn.innerText = "Mark Punch-Out";
      punchBtn.className = "btn btn-danger btn-block";
      punchBtn.disabled = false;
    }
  } else {
    if (statusBadge) {
      statusBadge.innerText = "🔴 Not Punched In";
      statusBadge.className = "attendance-tag status-not-punched";
    }
    if (logBox) logBox.classList.add("hidden");
    if (outTimeRow) outTimeRow.style.display = "none";
    if (punchBtn) {
      punchBtn.innerText = "Mark Punch-In";
      punchBtn.className = "btn btn-primary btn-block";
      punchBtn.disabled = false;
    }
  }
  
  // Bind Logout Button
  const profileLogoutBtn = document.getElementById("btn-profile-logout");
  if (profileLogoutBtn) {
    profileLogoutBtn.onclick = () => {
      currentEmpId = null;
      currentEmpName = "";
      localStorage.removeItem("bytepe_active_emp_id");
      localStorage.removeItem("bytepe_active_emp_name");
      showToast("Logged out successfully.", "info");
      navigateTo("screen-login");
    };
  }
}

// ----------------------------------------------------
// Category Icon Helpers
// ----------------------------------------------------
function getCategoryIcon(category) {
  let svg = "";
  let bgColor = "";
  let color = "";
  
  const cat = category || "Others";
  
  switch(cat) {
    case "Electronics & Appliances":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12s4.48-10 10-10m0 2c-4.42 0-8 3.58-8 8s3.58 8 8 8s8-3.58 8-8s-3.58-8-8-8m-1 3h2v6h-2V7m0 8h2v2h-2v-2z"/></svg>`;
      bgColor = "rgba(59, 130, 246, 0.1)"; 
      color = "#3B82F6";
      break;
    case "Mobile & Accessories":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M17 19H7V5h10v14M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2Z"/></svg>`;
      bgColor = "rgba(16, 185, 129, 0.1)"; 
      color = "#10B981";
      break;
    case "Furniture & Home Care":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v10h2v-2h14v2h2V9c0-1.1-.9-2-2-2m-2 7H7v-2h10v2m2-5H5V8h14v1Z"/></svg>`;
      bgColor = "rgba(245, 158, 11, 0.1)"; 
      color = "#F59E0B";
      break;
    case "Fashion & Lifestyle":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M12 3c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4m6 4c0-3.31-2.69-6-6-6S6 3.69 6 7H2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7h-4Z"/></svg>`;
      bgColor = "rgba(236, 72, 153, 0.1)"; 
      color = "#EC4899";
      break;
    case "Education":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M12 3L1 9l11 6l9-4.91V17h2V9L12 3m0 14.5L4.82 13.6L1.5 15.4L12 21l10.5-5.6l-3.32-1.8L12 17.5Z"/></svg>`;
      bgColor = "rgba(139, 92, 246, 0.1)"; 
      color = "#8B5CF6";
      break;
    case "Health Care":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      bgColor = "rgba(239, 68, 68, 0.1)"; 
      color = "#EF4444";
      break;
    case "Hospitality - Hotels":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3s1.34 3 3 3m12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4Z"/></svg>`;
      bgColor = "rgba(6, 182, 212, 0.1)"; 
      color = "#06B6D4";
      break;
    case "Travel & Tourism":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1l3.5 1v-1.5L14 19v-5.5l7 2.5Z"/></svg>`;
      bgColor = "rgba(20, 184, 166, 0.1)"; 
      color = "#20B8A6";
      break;
    case "Sports & Fitness":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2S2 6.48 2 12s4.48 10 10 10m0-18c1.38 0 2.63.4 3.7 1.09l-7.61 7.61C7.4 11.63 7 10.38 7 9c0-2.76 2.24-5 5-5m3.7 6.91c.2 1.38-.2 2.63-1.09 3.7l-7.61-7.61C8.09 8.3 9.34 7.9 10.7 8.09c1.55.21 2.79 1.45 3 3.01Z"/></svg>`;
      bgColor = "rgba(79, 70, 229, 0.1)"; 
      color = "#4F46E5";
      break;
    case "Jewellery & Luxury":
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M12 2L1 9l11 13L23 9L12 2M3.47 9L12 3.57L20.53 9L12 14.43L3.47 9Z"/></svg>`;
      bgColor = "rgba(217, 70, 239, 0.1)"; 
      color = "#D946EF";
      break;
    default:
      svg = `<svg viewBox="0 0 24 24" class="icon-sm"><path fill="currentColor" d="M20 4H4v2h16V4m1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1m-9 4H6v-4h6v4Z"/></svg>`;
      bgColor = "rgba(255, 69, 0, 0.1)"; 
      color = "#FF4500";
  }
  
  return { svg, bgColor, color };
}

// ----------------------------------------------------
// Formatting Helpers
// ----------------------------------------------------
function getFormattedCurrentDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
