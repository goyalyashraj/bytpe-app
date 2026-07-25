import React, { useState, useEffect } from "react";
import BytePeLogo from "./BytePe Logo.png";

const UNI_STORE_NUMBERS   = ["9818886959"];
const isUNIStore          = (mobile) => {
  if (UNI_STORE_NUMBERS.includes(mobile.trim())) return true;
  try {
    const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
    const partner = partners.find(p => p.phone.trim() === mobile.trim());
    if (partner && (partner.shopName.toLowerCase().includes("apple") || partner.shopName.toLowerCase().includes("unicorn") || partner.category === "Smartphones")) {
      return true;
    }
  } catch(e) {}
  return false;
};
const NCEMI_INELIGIBLE    = ["9971666959"];
const isNCEMIEligible     = (mobile) => !NCEMI_INELIGIBLE.includes((mobile||"").trim());

const ORANGE  = "#FF5C2B";
const OL      = "#FFF0EC";
const DARK    = "#1A1A1A";
const GREY    = "#F4F5F7";
const MUT     = "#8A8F98";
const SEC     = "#4A4E58";
const OK      = "#00B67A";
const WARN    = "#F59E0B";
const ERR     = "#EF4444";
const BD      = "#E8EAED";
const BLUE    = "#3B82F6";
const BLUE_L  = "#EFF6FF";
const UNI_GREEN  = "#2ECC40";
const UNI_GREEN2 = "#A8E063";

const LENDERS = [
  { name: "HDFC Bank",    roi: 12.99, maxLimit: 200000, sla: "Instant" },
  { name: "ICICI Bank",   roi: 13.40, maxLimit: 180000, sla: "Instant" },
  { name: "IDFC First",   roi: 13.75, maxLimit: 150000, sla: "30 min"   },
];

const CATS = ["Mobiles & Tablets","Computers & Laptops","Electronics","Furniture","Education","Health & Hospitals","Fashion & Footwear","Travel","Jewellery"];
const PRODS = {
  "Mobiles & Tablets":    ["iPhone 15 Pro Max 256GB","Samsung Galaxy S24 Ultra","OnePlus 12 5G","Vivo X100 Pro"],
  "Computers & Laptops":  ["MacBook Air M3","Dell XPS 15","HP Spectre x360"],
  "Electronics":          ["Sony 65\" OLED TV","LG Washing Machine 8kg"],
  "Furniture":            ["Sleepyhead Ortho Mattress","Urban Ladder Sofa"],
};

const UNI_CATS = ["Smartphones","MacBooks","AirPods","iPad","Smartwatches","Other Accessories"];
const UNI_PRODS = {
  "Smartphones":  ["iPhone 16 Pro Max 256GB","iPhone 16 Pro Max 512GB","iPhone 16 Pro 256GB","iPhone 16 Plus 256GB","iPhone 16 128GB","iPhone 15 Pro Max 256GB","iPhone 15 Pro 128GB"],
  "MacBooks":     ["MacBook Air 13\" M3 8GB/256GB","MacBook Air 13\" M3 16GB/512GB","MacBook Air 15\" M3","MacBook Pro 14\" M4 Pro","MacBook Pro 16\" M4 Max"],
  "AirPods":      ["AirPods 4","AirPods 4 ANC","AirPods Pro 2nd Gen","AirPods Max USB-C"],
  "iPad":         ["iPad 10th Gen 64GB","iPad mini 7th Gen","iPad Air 11\" M3","iPad Air 13\" M3","iPad Pro 11\" M4","iPad Pro 13\" M4"],
  "Smartwatches": ["Apple Watch Series 10 41mm","Apple Watch Series 10 45mm","Apple Watch Ultra 2","Apple Watch SE 2nd Gen"],
  "Other Accessories": [],
};
const UNI_PRICES = {
  "iPhone 16 Pro Max 256GB": 159900, "iPhone 16 Pro Max 512GB": 179900,
  "iPhone 16 Pro 256GB": 134900,     "iPhone 16 Plus 256GB": 114900,
  "iPhone 16 128GB": 79900,          "iPhone 15 Pro Max 256GB": 134900,
  "MacBook Air 13\" M3 8GB/256GB": 114900, "MacBook Air 13\" M3 16GB/512GB": 134900,
  "MacBook Pro 14\" M4 Pro": 199900, "MacBook Pro 16\" M4 Max": 349900,
  "AirPods 4": 12900, "AirPods Pro 2nd Gen": 24900, "AirPods Max USB-C": 59900,
  "iPad 10th Gen 64GB": 44900, "iPad Air 11\" M3": 89900, "iPad Pro 11\" M4": 119900,
  "Apple Watch Series 10 41mm": 46900, "Apple Watch Ultra 2": 89900,
};

const getProductsDatabase = () => {
  const defaultProducts = {
    std: {
      "Mobiles & Tablets": ["iPhone 15 Pro Max", "iPhone 15", "Samsung Galaxy S24", "OnePlus 12", "iPad Air M2"],
      "Laptops & Computers": ["MacBook Air M3", "Dell XPS 13", "HP Spectre x360", "Lenovo Yoga Pro"],
      "Electronics & Appliances": ["Sony WH-1000XM5", "iPad Pro M4", "Apple Watch Ultra 2"],
      "Others": ["Custom Order Finance"]
    },
    uni: {
      "Smartphones": ["iPhone 16 Pro Max 256GB", "iPhone 16 Pro Max 512GB", "iPhone 16 Pro 256GB", "iPhone 16 Plus 256GB", "iPhone 16 128GB", "iPhone 15 Pro Max 256GB", "iPhone 15 Pro 128GB"],
      "MacBooks": ["MacBook Air 13\" M3 8GB/256GB", "MacBook Air 13\" M3 16GB/512GB", "MacBook Air 15\" M3", "MacBook Pro 14\" M4 Pro", "MacBook Pro 16\" M4 Max"],
      "AirPods": ["AirPods 4", "AirPods 4 ANC", "AirPods Pro 2nd Gen", "AirPods Max USB-C"],
      "iPad": ["iPad 10th Gen 64GB", "iPad mini 7th Gen", "iPad Air 11\" M3", "iPad Air 13\" M3", "iPad Pro 11\" M4", "iPad Pro 13\" M4"],
      "Smartwatches": ["Apple Watch Series 10 41mm", "Apple Watch Series 10 45mm", "Apple Watch Ultra 2", "Apple Watch SE 2nd Gen"],
      "Other Accessories": []
    },
    prices: {
      "iPhone 16 Pro Max 256GB": 159900, "iPhone 16 Pro Max 512GB": 179900,
      "iPhone 16 Pro 256GB": 134900,     "iPhone 16 Plus 256GB": 114900,
      "iPhone 16 128GB": 79900,          "iPhone 15 Pro Max 256GB": 134900,
      "MacBook Air 13\" M3 8GB/256GB": 114900, "MacBook Air 13\" M3 16GB/512GB": 134900,
      "MacBook Pro 14\" M4 Pro": 199900, "MacBook Pro 16\" M4 Max": 349900,
      "AirPods 4": 12900, "AirPods Pro 2nd Gen": 24900, "AirPods Max USB-C": 59900,
      "iPad 10th Gen 64GB": 44900, "iPad Air 11\" M3": 89900, "iPad Pro 11\" M4": 119900,
      "Apple Watch Series 10 41mm": 46900, "Apple Watch Ultra 2": 89900
    }
  };
  try {
    const data = localStorage.getItem("bytepe_products");
    return data ? JSON.parse(data) : defaultProducts;
  } catch(e) {
    return defaultProducts;
  }
};
const AC_ELIGIBLE = ["Smartphones","MacBooks","iPad","Smartwatches"];
const APPLE_CARE  = { 1: 8000, 2: 14000 };

const STD_TXN = [
  { id: "BP2401001", customer: "Rajesh Kumar",  product: "iPhone 15 Pro Max",  amount: 134900, emi: 12299, tenure: 12, status: "Active",    date: "Jan 14", lender: "HDFC Bank",     icon: "📱" },
  { id: "BP2401002", customer: "Priya Sharma",  product: "MacBook Air M3",     amount: 114900, emi: 10450, tenure: 12, status: "Active",    date: "Jan 12", lender: "Bajaj Finance", icon: "💻" },
  { id: "BP2312003", customer: "Amit Singh",    product: "Samsung Galaxy S24", amount: 79999,  emi: 7100,  tenure: 12, status: "Completed", date: "Dec 22", lender: "IDFC First",    icon: "📱" },
];
const UNI_TXN = [
  { id: "UNI2401001", customer: "Aditya Menon", product: "iPhone 16 Pro Max 256GB", amount: 159900, emi: 14588, tenure: 12, status: "Active",    date: "Jan 20", lender: "HDFC Bank",     ac: "2 Year AppleCare+" },
  { id: "UNI2401002", customer: "Sneha Iyer",   product: "MacBook Air 13\" M3",    amount: 114900, emi: 10480, tenure: 12, status: "Active",    date: "Jan 18", lender: "Bajaj Finance", ac: "1 Year AppleCare+" },
  { id: "UNI2312003", customer: "Rahul Verma",  product: "iPad Pro 11\" M4",       amount: 119900, emi: 10940, tenure: 12, status: "Completed", date: "Dec 28", lender: "HDFC Bank",     ac: "—" },
];

const fmt     = n => "₹" + Number(n).toLocaleString("en-IN");
const calcEMI = (p, roi, m) => { if (!p || !m) return 0; const r = roi / 12 / 100; return Math.round(p * r * Math.pow(1+r,m) / (Math.pow(1+r,m)-1)); };
const calcNC  = (p, m)       => (!p || !m) ? 0 : Math.round(p / m);

const S = {
  app:        { fontFamily:"'DM Sans',sans-serif", background: GREY, minHeight:"100vh", maxWidth:420, margin:"0 auto", position:"relative", overflowX:"hidden", paddingTop: 0 },
  header:     { background: DARK, padding:"16px 20px 20px", color:"white" },
  card:       { background:"#fff", borderRadius:16, padding:20, marginBottom:12, boxShadow:"0 2px 12px rgba(0,0,0,0.06)", border:`1px solid ${BD}` },
  primaryBtn: { background:`linear-gradient(135deg,${ORANGE},#FF7A4D)`, color:"white", border:"none", borderRadius:12, padding:"15px 20px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%", boxShadow:`0 4px 16px ${ORANGE}40`, transition:"all 0.2s", display:"block", textAlign:"center" },
  outlineBtn: { background:"white", color:ORANGE, border:`2px solid ${ORANGE}`, borderRadius:12, padding:"13px 20px", fontSize:15, fontWeight:600, cursor:"pointer", width:"100%", transition:"all 0.2s", display:"block", textAlign:"center" },
  darkBtn:    { background: DARK, color:"white", border:"none", borderRadius:12, padding:"15px 20px", fontSize:15, fontWeight:600, cursor:"pointer", width:"100%", transition:"all 0.2s", display:"block", textAlign:"center" },
  input:      { width:"100%", border:`1.5px solid ${BD}`, borderRadius:10, padding:"13px 14px", fontSize:15, color:DARK, background:"#FAFBFC", outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif" },
  select:     { width:"100%", border:`1.5px solid ${BD}`, borderRadius:10, padding:"13px 14px", fontSize:15, color:DARK, background:"#FAFBFC", outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans',sans-serif", appearance:"none" },
  label:      { fontSize:12, fontWeight:600, color:MUT, textTransform:"uppercase", letterSpacing:0.8, marginBottom:6, display:"block" },
  tag:        { display:"inline-block", background:OL, color:ORANGE, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 },
  okTag:      { display:"inline-block", background:"#E6FAF4", color:OK, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 },
  warnTag:    { display:"inline-block", background:"#FFF8E7", color:WARN, borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 },
  row:        { display:"flex", justifyContent:"space-between", alignItems:"center" },
  navBar:     { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:"white", borderTop:`1px solid ${BD}`, display:"flex", justifyContent:"space-around", padding:"10px 0 16px", boxShadow:"0 -4px 20px rgba(0,0,0,0.08)" },
  navItem:    { display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontSize:11, fontWeight:500, color:MUT, cursor:"pointer", padding:"4px 12px", borderRadius:10 },
  pb:         { height:6, background:BD, borderRadius:3, overflow:"hidden" },
  pf:         (p, c=ORANGE) => ({ height:"100%", width:`${p}%`, background:c, borderRadius:3, transition:"width 1s ease" }),
  dot:        { width:8, height:8, borderRadius:"50%", background:OK, display:"inline-block", marginRight:6 },
  emiRow:     { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:`1px solid ${BD}` },
  divider:    { height:1, background:BD, margin:"14px 0" },
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes grow  { from{width:0} to{width:75%} }
  @keyframes spin  { to{transform:rotate(360deg)} }
  input::placeholder { color: #B0B5BE; }
  input:focus, select:focus { border-color: #FF5C2B !important; outline: none; }
  button:active { transform: scale(.98); }
  ::-webkit-scrollbar { display: none; }
  body { overflow-x: hidden; }
`;

const BPLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="50" fill={DARK} />
    <text x="50" y="44" textAnchor="middle" fontFamily="Georgia,serif" fontSize="26" fontWeight="bold" fill="white">Byte</text>
    <text x="50" y="72" textAnchor="middle" fontFamily="Georgia,serif" fontSize="26" fontWeight="bold" fill="white">Pé</text>
  </svg>
);

const BPWordmark = ({ size = 28 }) => (
  <span style={{ fontSize:size, fontWeight:900, fontFamily:"Georgia,serif", color:"white", letterSpacing:-0.5, lineHeight:1 }}>
    Byte<span style={{ color:ORANGE }}>Pé</span>
  </span>
);

const AppleLogo = ({ size = 18, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 814 1000" fill={color}>
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-37.5-147.2-93.4C67.3 716.1 17 604.7 17 503.5c0-179.4 117.4-274.6 233.5-274.6 61.9 0 113.4 39.8 152.2 39.8 37.2 0 95.7-41.9 165.5-41.9 26.6 0 108.8 2.6 164.1 99.4zm-240.9-119.2c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);

const UNILogo = ({ height = 34 }) => {
  const w = height * 2.6;
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} fill="none">
      <defs>
        <linearGradient id="uG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={UNI_GREEN2}/>
          <stop offset="100%" stopColor={UNI_GREEN}/>
        </linearGradient>
      </defs>
      <text x="2"  y={height * 0.76} fontFamily="Arial Black,Arial,sans-serif" fontSize={height * 0.68} fontWeight="900" fill="url(#uG)">u</text>
      <text x={height * 0.46} y={height * 0.76} fontFamily="Arial Black,Arial,sans-serif" fontSize={height * 0.68} fontWeight="900" fill="url(#uG)">n</text>
      <text x={height * 0.92} y={height * 0.76} fontFamily="Arial Black,Arial,sans-serif" fontSize={height * 0.68} fontWeight="900" fill="url(#uG)">i</text>
      <circle cx={height * 0.19} cy={height * 0.1}  r={height * 0.09} fill="url(#uG)" />
      <circle cx={height * 0.65} cy={height * 0.09} r={height * 0.07} fill="url(#uG)" />
      <circle cx={height * 1.0}  cy={height * 0.09} r={height * 0.08} fill="url(#uG)" />
      <text x="2" y={height} fontFamily="Arial,sans-serif" fontSize={height * 0.22} fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="1.5">UNICORN</text>
    </svg>
  );
};

function DemoSwitcher({ activeTab }) {
  return null;
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 56,
      background: "#1A1A1A",
      borderBottom: "1px solid #2D2D2D",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px",
      zIndex: 99999,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5C2B", boxShadow: "0 0 10px #FF5C2B" }} />
        <span style={{ fontWeight: 500, fontSize: 14, color: "white", letterSpacing: 0.5 }}>BytePé Workspace</span>
      </div>
      
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <a href="/" style={{
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 500,
          textDecoration: "none",
          transition: "all 0.2s",
          background: activeTab === "retailer" ? "#FF5C2B" : "transparent",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 6
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
          Retailer Sales
        </a>
        <a href="/Onboarding Flow/index.html" style={{
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 500,
          textDecoration: "none",
          transition: "all 0.2s",
          background: activeTab === "onboarding" ? "#FF5C2B" : "transparent",
          color: activeTab === "onboarding" ? "white" : "#8A8F98",
          display: "flex",
          alignItems: "center",
          gap: 6
        }} onMouseOver={e => e.target.style.color = "white"} onMouseOut={e => { if(activeTab!=="onboarding") e.target.style.color = "#8A8F98"; }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Onboarding
        </a>
        <a href="/crm/index.html" style={{
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 500,
          textDecoration: "none",
          transition: "all 0.2s",
          background: activeTab === "crm" ? "#FF5C2B" : "transparent",
          color: activeTab === "crm" ? "white" : "#8A8F98",
          display: "flex",
          alignItems: "center",
          gap: 6
        }} onMouseOver={e => e.target.style.color = "white"} onMouseOut={e => { if(activeTab!=="crm") e.target.style.color = "#8A8F98"; }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          BytePé Console
        </a>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00B67A" }} />
        <span style={{ fontSize: 10, color: "#8A8F98", fontWeight: 500 }}>Sync: Active</span>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp]       = useState("");
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const sendOTP = () => {
    if (mobile.length !== 10) return;
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
      const partner = partners.find(p => p.phone.trim() === mobile.trim());
      
      if (!partner) {
        setError("This mobile number is not registered. Please complete onboarding in the Field App first.");
        return;
      }
      
      if (partner.status !== "Verified and Approved") {
        if (partner.status === "Verified and Not Approved") {
          setError("Your store onboarding has been disapproved. Please contact BytePé support.");
        } else {
          setError(`Your store onboarding is currently: "${partner.status}". Please approve it in the Ops CRM first.`);
        }
        return;
      }
      
      setStep(2);
    }, 1200);
  };

  const verifyOTP = () => {
    if (otp.length !== 6) return;
    const expectedOtp = mobile.trim().slice(-6);
    if (otp !== expectedOtp && otp !== "123456") {
      setError(`Invalid verification OTP. Try using the last 6 digits of your mobile number: ${expectedOtp}`);
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      onLogin(mobile);
    }, 1400);
  };

  return (
    <div style={{ background:"#fff", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <div style={{ background:DARK, padding:"48px 28px 36px", textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
          <img src={BytePeLogo} alt="BytePe Logo" style={{ width: 72, height: 72 }} />
        </div>
        <div style={{ fontSize:13, color:ORANGE, fontWeight:600, letterSpacing:2, textTransform:"uppercase" }}>For Business</div>
        <div style={{ fontSize:22, fontWeight:800, color:"white", marginTop:12, lineHeight:1.3 }}>
          Easy Finance Solution<br />for Customers in Your Store
        </div>
      </div>
      <div style={{ background:ORANGE, padding:"12px 28px", display:"flex", justifyContent:"space-around" }}>
        {["500+ Partners","₹200Cr+ Financed","NBFC Backed"].map(t => (
          <div key={t} style={{ textAlign:"center", fontSize:11, color:"white", fontWeight:700 }}>{t}</div>
        ))}
      </div>
      <div style={{ padding:"28px 28px 0", flex:1 }}>
        <div style={{ fontSize:18, fontWeight:800, color:DARK, marginBottom:4 }}>
          {step === 1 ? "Login to your account" : "Verify your number"}
        </div>
        <div style={{ fontSize:13, color:MUT, marginBottom:24 }}>
          {step === 1 ? "Enter your registered mobile number" : `OTP sent to +91 ${mobile}`}
        </div>
        {error && (
          <div style={{ background: "#FFF0EC", border: `1px solid ${ERR}`, borderRadius: 12, padding: 14, color: ERR, fontSize: 13, marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 16, marginTop: -2 }}>⚠️</span>
            <span style={{ fontWeight: 500, lineHeight: 1.4 }}>{error}</span>
          </div>
        )}
        {step === 1 ? (
          <>
            <label style={S.label}>Mobile Number</label>
            <div style={{ display:"flex", gap:10, marginBottom:20 }}>
              <div style={{ ...S.input, width:52, textAlign:"center", fontWeight:700, flexShrink:0 }}>+91</div>
              <input style={{ ...S.input, flex:1 }} placeholder="98765 43210" value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g,"").slice(0,10))} type="tel" />
            </div>
            <button style={{ ...S.primaryBtn, opacity: mobile.length===10 ? 1 : 0.5 }}
              onClick={sendOTP} disabled={loading || mobile.length < 10}>
              {loading ? "Sending OTP..." : "Send OTP →"}
            </button>
          </>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, background:"#E6FAF4", borderRadius:10, padding:12 }}>
              <span style={S.dot} />
              <span style={{ color:OK, fontSize:13, fontWeight:500 }}>OTP sent to +91 {mobile}</span>
            </div>
            <label style={S.label}>Enter 6-Digit OTP</label>
            <input style={{ ...S.input, letterSpacing:8, fontSize:22, fontWeight:700, marginBottom:20, textAlign:"center" }}
              placeholder="• • • • • •" value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g,"").slice(0,6))} type="tel" />
            <button style={{ ...S.primaryBtn, opacity: otp.length===6 ? 1 : 0.5 }}
              onClick={verifyOTP} disabled={loading || otp.length < 6}>
              {loading ? "Verifying..." : "Verify & Login →"}
            </button>
            <div style={{ textAlign:"center", marginTop:14, fontSize:13, color:MUT, cursor:"pointer" }} onClick={() => setStep(1)}>
              ← Change Number
            </div>
          </>
        )}
      </div>
      <div style={{ padding:"24px 28px 32px" }}>
        <div style={{ fontSize:11, fontWeight:700, color:MUT, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Coming Soon...</div>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1, background:`linear-gradient(135deg,#1E3A5F,#2563EB)`, borderRadius:14, padding:14 }}>
            <div style={{ fontSize:18, marginBottom:6 }}>👤</div>
            <div style={{ fontSize:13, fontWeight:800, color:"white" }}>Personal Loan</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", marginTop:4 }}>Instant · Up to ₹5L</div>
          </div>
          <div style={{ flex:1, background:`linear-gradient(135deg,#064E3B,#059669)`, borderRadius:14, padding:14 }}>
            <div style={{ fontSize:18, marginBottom:6 }}>🏪</div>
            <div style={{ fontSize:13, fontWeight:800, color:"white" }}>Business Loan</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", marginTop:4 }}>For shop owners · Up to ₹25L</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StdDashboard({ sales, onNewSale, onPersonalLoan, onBusinessLoan, setTab, retailerMobile }) {
  const recentSales = sales.slice(0, 2);
  const todayCollections = sales.filter(s => (s.status === 'Active' || s.status === 'Completed') && s.date.includes("Jul")).reduce((sum, s) => sum + s.amount, 0); // jul simulation
  const todaySalesCount = sales.filter(s => (s.status === 'Active' || s.status === 'Completed') && s.date.includes("Jul")).length;
  
  const totalSalesVal = sales.filter(s => s.status === "Active" || s.status === "Completed").reduce((sum, s) => sum + s.amount, 0);
  const salesCount = sales.filter(s => s.status === "Active" || s.status === "Completed").length;
  const formattedMonthCollections = "₹" + (totalSalesVal / 100000).toFixed(1) + "L";
  
  const totalAttempts = sales.length;
  const successfulAttempts = sales.filter(s => s.status === 'Active' || s.status === 'Completed').length;
  const appRate = totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 100;
  
  const avgTicket = salesCount > 0 ? Math.round(totalSalesVal / salesCount) : 0;
  const formattedAvgTicket = "₹" + Math.round(avgTicket / 1000) + "K";

  const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
  const partner = partners.find(p => p.phone === retailerMobile) || { shopName: "Delhi Electronics Hub", city: "Bengaluru" };
  const initials = partner.shopName ? partner.shopName.substring(0, 1).toUpperCase() : "M";

  return (
    <div style={{ paddingBottom:80 }}>
      <div style={{ ...S.header, paddingBottom:24 }}>
        <div style={{ ...S.row, marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src={BytePeLogo} alt="BytePe Logo" style={{ width: 40, height: 40 }} />
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:"white", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{partner.shopName}</div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:1 }}>FOR BUSINESS</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:20, padding:"6px 12px", fontSize:12, color:"rgba(255,255,255,0.7)" }}>📍 {partner.city}</div>
            <div style={{ width:36, height:36, background:ORANGE, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"white", fontSize:15, cursor:"pointer" }} onClick={() => setShowProfile(true)}>{initials}</div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 16px" }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.45)", marginBottom:4 }}>Today's Collections</div>
          <div style={{ fontSize:28, fontWeight:800, color:"white" }}>{fmt(todayCollections || 214800)}</div>
          <div style={{ display:"flex", gap:16, marginTop:8 }}>
            <span style={{ fontSize:12, color:OK }}>↑ {todaySalesCount || 3} Sales Today</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>|</span>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Settlement: T+1</span>
          </div>
        </div>
      </div>
      <div style={{ padding:"16px 16px 0" }}>
        <button style={{ ...S.primaryBtn, fontSize:17, padding:"18px 24px", borderRadius:14, marginBottom:12 }} onClick={onNewSale}>＋  Add New Sale (EMI)</button>
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          <div onClick={onPersonalLoan} style={{ flex:1, background:`linear-gradient(135deg,#1E3A5F,#2563EB)`, borderRadius:14, padding:14, cursor:"pointer" }}>
            <div style={{ fontSize:20, marginBottom:6 }}>👤</div>
            <div style={{ fontSize:13, fontWeight:800, color:"white" }}>Personal Loan</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", marginTop:2 }}>Up to ₹5L · Direct to customer</div>
          </div>
          <div onClick={onBusinessLoan} style={{ flex:1, background:`linear-gradient(135deg,#064E3B,#059669)`, borderRadius:14, padding:14, cursor:"pointer" }}>
            <div style={{ fontSize:20, marginBottom:6 }}>🏪</div>
            <div style={{ fontSize:13, fontWeight:800, color:"white" }}>Business Loan</div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", marginTop:2 }}>Up to ₹25L · For shop owners</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          {[{ label:"This Month", value:formattedMonthCollections, sub:`${salesCount} Sales` },{ label:"Approval Rate", value:`${appRate}%`, sub:"↑ 4%" },{ label:"Avg Ticket", value:formattedAvgTicket, sub:"EMI Avg" }].map(m => (
            <div key={m.label} style={{ ...S.card, flex:1, padding:14, marginBottom:0 }}>
              <div style={{ fontSize:17, fontWeight:800, color:DARK }}>{m.value}</div>
              <div style={{ fontSize:10, color:MUT, marginTop:2 }}>{m.label}</div>
              <div style={{ fontSize:10, color:OK, marginTop:2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ background:`linear-gradient(135deg,${DARK},#2D2D2D)`, borderRadius:14, padding:18, marginBottom:12, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, background:`${ORANGE}30`, borderRadius:"50%" }} />
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:4 }}>🔥 Lender Offer Active</div>
          <div style={{ fontSize:17, fontWeight:800, color:"white" }}>0% Processing Fee</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:4 }}>Valid till Jan 31 · HDFC Bank · All Categories</div>
        </div>
        <div style={{ ...S.card, marginBottom:12 }}>
          <div style={{ ...S.row, marginBottom:14 }}>
            <span style={{ fontSize:15, fontWeight:700, color:DARK }}>Approval Ratio</span>
            <span style={S.tag}>Live</span>
          </div>
          {[{ label:"Pre-Approved", pct:62, c:OK },{ label:"Partially Approved", pct:25, c:WARN },{ label:"Rejected", pct:13, c:ERR }].map(s => (
            <div key={s.label} style={{ marginBottom:12 }}>
              <div style={{ ...S.row, marginBottom:6 }}><span style={{ fontSize:13, color:SEC }}>{s.label}</span><span style={{ fontSize:13, fontWeight:700, color:s.c }}>{s.pct}%</span></div>
              <div style={S.pb}><div style={S.pf(s.pct, s.c)} /></div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ ...S.row, marginBottom:14 }}>
            <span style={{ fontSize:15, fontWeight:700, color:DARK }}>Recent Sales</span>
            <span style={{ fontSize:13, color:ORANGE, fontWeight:600, cursor:"pointer" }} onClick={() => setTab("transactions")}>View All →</span>
          </div>
          {recentSales.map(t => (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:14, marginBottom:14, borderBottom:`1px solid ${BD}` }}>
              <div style={{ width:44, height:44, background:OL, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{t.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:DARK }}>{t.customer}</div>
                <div style={{ fontSize:12, color:MUT }}>{t.product}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:14, fontWeight:700, color:DARK }}>{fmt(t.amount)}</div>
                <div style={t.status === "Active" || t.status === "Completed" ? S.okTag : S.warnTag}>{t.status}</div>
              </div>
            </div>
          ))}
          {recentSales.length === 0 && (
            <div style={{ textAlign:"center", padding:"20px 0", color:MUT, fontSize:13 }}>No sales transactions found yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function UNIDashboard({ sales, onNewSale, setTab, retailerMobile }) {
  const recentSales = sales.slice(0, 2);
  const todayVolume = sales.filter(s => (s.status === 'Active' || s.status === 'Completed') && s.date.includes("Jul")).reduce((sum, s) => sum + s.amount, 0); // jul simulation
  const todaySalesCount = sales.filter(s => (s.status === 'Active' || s.status === 'Completed') && s.date.includes("Jul")).length;
  
  const totalSalesVal = sales.filter(s => s.status === "Active" || s.status === "Completed").reduce((sum, s) => sum + s.amount, 0);
  const salesCount = sales.filter(s => s.status === "Active" || s.status === "Completed").length;
  const formattedMonthVolume = "₹" + (totalSalesVal / 100000).toFixed(1) + "L";
  
  const totalAttempts = sales.length;
  const successfulAttempts = sales.filter(s => s.status === 'Active' || s.status === 'Completed').length;
  const appRate = totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 100;
  
  const appleCareSales = sales.filter(s => s.ac && s.ac !== "—" && s.status === "Active").length;
  const acAttachRate = salesCount > 0 ? Math.round((appleCareSales / salesCount) * 100) : 0;

  const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
  const partner = partners.find(p => p.phone === retailerMobile) || { shopName: "UNIcorn Apple Premium Store", city: "Indiranagar" };
  const initials = partner.shopName ? partner.shopName.substring(0, 1).toUpperCase() : "U";

  return (
    <div style={{ paddingBottom:80 }}>
      <div style={{ background:DARK, padding:"18px 20px 22px" }}>
        <div style={{ ...S.row, marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <BPWordmark size={26} />
            <div style={{ width:1, height:28, background:"rgba(255,255,255,0.2)" }} />
            <UNILogo height={30} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:20, padding:"5px 12px", fontSize:11, color:"rgba(255,255,255,0.6)" }}>📍 {partner.city}</div>
            <div style={{ width:34, height:34, background:ORANGE, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"white", fontSize:14, cursor:"pointer" }} onClick={() => setShowProfile(true)}>{initials}</div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:14, padding:"14px 16px" }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4, textTransform:"uppercase", letterSpacing:0.8 }}>Today's Finance Volume</div>
          <div style={{ fontSize:26, fontWeight:800, color:"white" }}>{fmt(todayVolume || 394700)}</div>
          <div style={{ display:"flex", gap:14, marginTop:6 }}>
            <span style={{ fontSize:11, color:OK }}>↑ {todaySalesCount || 5} Sales Today</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>·</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>Settlement: T+1</span>
          </div>
        </div>
      </div>
      <div style={{ padding:"16px 16px 0" }}>
        <button style={{ ...S.primaryBtn, fontSize:16, padding:"17px 24px", borderRadius:14, marginBottom:14 }} onClick={onNewSale}>
          ＋  Add New Sale
        </button>
        <div style={{ display:"flex", gap:10, marginBottom:14 }}>
          {[{ label:"This Month", value:formattedMonthVolume, sub:`${salesCount} Sales` },{ label:"Approval Rate", value:`${appRate}%`, sub:"↑ 6%" },{ label:"AppleCare+", value:`${acAttachRate}%`, sub:"Attachment" }].map(m => (
            <div key={m.label} style={{ ...S.card, flex:1, padding:14, marginBottom:0 }}>
              <div style={{ fontSize:17, fontWeight:800, color:DARK }}>{m.value}</div>
              <div style={{ fontSize:10, color:MUT, marginTop:2 }}>{m.label}</div>
              <div style={{ fontSize:10, color:OK, marginTop:2 }}>{m.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ background:DARK, borderRadius:16, padding:18, marginBottom:14, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:120, height:120, background:`${ORANGE}20`, borderRadius:"50%" }} />
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, position:"relative" }}>
            <AppleLogo size={13} color="rgba(255,255,255,0.4)" />
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:0.5 }}>ACTIVE OFFER</span>
          </div>
          <div style={{ fontSize:17, fontWeight:800, color:"white", position:"relative" }}>No Cost EMI on iPhones</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginTop:4, position:"relative" }}>3 / 6 / 9 months · iPhone 15 & 16 · HDFC Bank</div>
        </div>
        <div style={{ ...S.card, marginBottom:14 }}>
          <div style={{ ...S.row, marginBottom:14 }}>
            <span style={{ fontSize:14, fontWeight:700, color:DARK }}>Approval Breakdown</span>
            <span style={S.okTag}>Live</span>
          </div>
          {[{ l:"Pre-Approved", pct:71, c:OK },{ l:"Partially Approved", pct:20, c:WARN },{ l:"Rejected", pct:9, c:ERR }].map(s => (
            <div key={s.l} style={{ marginBottom:12 }}>
              <div style={{ ...S.row, marginBottom:5 }}><span style={{ fontSize:12, color:MUT }}>{s.l}</span><span style={{ fontSize:12, fontWeight:700, color:s.c }}>{s.pct}%</span></div>
              <div style={S.pb}><div style={S.pf(s.pct, s.c)} /></div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ ...S.row, marginBottom:14 }}>
            <span style={{ fontSize:14, fontWeight:700, color:DARK }}>Recent Sales</span>
            <span style={{ fontSize:12, color:ORANGE, fontWeight:600, cursor:"pointer" }} onClick={() => setTab("transactions")}>View All →</span>
          </div>
          {recentSales.map(t => (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:14, marginBottom:14, borderBottom:`1px solid ${BD}` }}>
              <div style={{ width:42, height:42, background:DARK, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <AppleLogo size={17} color="white" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:DARK }}>{t.customer}</div>
                <div style={{ fontSize:11, color:MUT }}>{t.product}</div>
                {t.ac !== "—" && <div style={{ fontSize:10, color:OK, fontWeight:600, marginTop:2 }}>✓ {t.ac}</div>}
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, fontWeight:700, color:DARK }}>{fmt(t.amount)}</div>
                <div style={t.status === "Active" || t.status === "Completed" ? S.okTag : S.warnTag}>{t.status}</div>
              </div>
            </div>
          ))}
          {recentSales.length === 0 && (
            <div style={{ textAlign:"center", padding:"20px 0", color:MUT, fontSize:13 }}>No sales transactions found yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function PGJourneyScreen({ onBack, productAmount, customerName, pgLabel = "BytePé PG" }) {
  const [step, setStep]     = useState(1);
  const [method, setMethod] = useState("");
  const [serial, setSerial] = useState("");
  const [invoiceDone, setInvoiceDone] = useState(false);
  const [loading, setLoading] = useState(false);

  if (step === 3) return (
    <div style={{ background:DARK, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
      <div style={{ width:76, height:76, background:OK, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, marginBottom:20, boxShadow:`0 0 0 14px ${OK}25` }}>✓</div>
      <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:6 }}>Payment Successful!</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:28, textAlign:"center" }}>{fmt(productAmount)} collected via {method}</div>
      <button style={S.primaryBtn} onClick={onBack}>Back to Dashboard</button>
    </div>
  );

  return (
    <div style={{ paddingBottom:80 }}>
      <div style={{ ...S.header, paddingTop:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <button onClick={step !== 1 ? () => setStep(s => s-1) : onBack} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"white", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:16 }}>←</button>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:"white" }}>Full Payment — {pgLabel}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{fmt(productAmount)} · {customerName}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {[1,2].map(s => <div key={s} style={{ flex:1, height:4, borderRadius:2, background: step >= s ? ORANGE : "rgba(255,255,255,0.15)" }} />)}
        </div>
      </div>
      <div style={{ padding:"14px 16px 0" }}>
        {step === 1 && (
          <>
            <div style={{ ...S.card, marginBottom:14 }}>
              <div style={{ ...S.row }}>
                <div><div style={{ fontSize:12, color:MUT }}>Customer</div><div style={{ fontSize:14, fontWeight:700, color:DARK }}>{customerName}</div></div>
                <div style={{ textAlign:"right" }}><div style={{ fontSize:12, color:MUT }}>Total</div><div style={{ fontSize:20, fontWeight:900, color:DARK }}>{fmt(productAmount)}</div></div>
              </div>
            </div>
            <div style={{ fontSize:12, fontWeight:700, color:MUT, textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Payment Method</div>
            {[{ id:"UPI", icon:"📲", label:"UPI", sub:"GPay, PhonePe, BHIM" },{ id:"Card", icon:"💳", label:"Credit / Debit Card", sub:"Visa, Mastercard, RuPay" },{ id:"NetBanking", icon:"🏦", label:"Net Banking", sub:"All major banks" }].map(m => (
              <div key={m.id} onClick={() => setMethod(m.id)} style={{ ...S.card, display:"flex", alignItems:"center", gap:12, border:`2px solid ${method === m.id ? ORANGE : BD}`, marginBottom:8, cursor:"pointer" }}>
                <div style={{ width:44, height:44, background: method === m.id ? OL : GREY, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{m.icon}</div>
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:DARK }}>{m.label}</div><div style={{ fontSize:11, color:MUT }}>{m.sub}</div></div>
                <div style={{ width:20, height:20, borderRadius:"50%", border:`2px solid ${method === m.id ? ORANGE : BD}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {method === m.id && <div style={{ width:8, height:8, borderRadius:"50%", background:ORANGE }} />}
                </div>
              </div>
            ))}
            <button style={{ ...S.primaryBtn, opacity: method ? 1 : 0.5, marginTop:6 }} onClick={() => setStep(2)} disabled={!method}>
              Pay {fmt(productAmount)} →
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ ...S.card, background:"#E6FAF4", border:`1.5px solid ${OK}40`, marginBottom:12 }}>
              <div style={{ fontSize:13, fontWeight:700, color:OK }}>✅ Payment Initiated via {method}</div>
              <div style={{ fontSize:11, color:SEC, marginTop:2 }}>Capture device details before completing</div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:14 }}>Product Verification</div>
              <label style={S.label}>Serial Number / IMEI *</label>
              <input style={{ ...S.input, marginBottom:12 }} placeholder="Enter serial or IMEI" value={serial} onChange={e => setSerial(e.target.value)} />
              <div onClick={() => setInvoiceDone(true)} style={{ background: invoiceDone ? "#E6FAF4" : GREY, borderRadius:10, padding:14, border:`1.5px dashed ${invoiceDone ? OK : BD}`, textAlign:"center", cursor:"pointer" }}>
                {invoiceDone ? <div style={{ color:OK, fontWeight:600, fontSize:13 }}>✅ Invoice Photo Captured</div>
                  : <><div style={{ fontSize:22, marginBottom:4 }}>📸</div><div style={{ fontSize:13, fontWeight:600, color:SEC }}>Tap to Capture Invoice</div></>}
              </div>
            </div>
            <button style={{ ...S.primaryBtn, opacity: serial && invoiceDone ? 1 : 0.5 }}
              onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setStep(3); }, 1500); }}
              disabled={!serial || !invoiceDone || loading}>
              {loading ? "Processing..." : "Complete Sale ✓"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SuccessScreen({ form, loanAmount, emi, tenure, lender, totalDP, programFee, onSuccess, acPlan, acCost, baseAmount, isUNI, retailerMobile, emiType }) {
  React.useEffect(() => {
    const salesStr = localStorage.getItem("bytepe_sales");
    let sales = salesStr ? JSON.parse(salesStr) : [];
    
    const key = `BP-TXN-${form.mobile}-${loanAmount}-${tenure}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "true");

    const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
    const partner = partners.find(p => p.phone === retailerMobile) || { shopName: "BytePé Partner Store" };
    
    const isNoCost = emiType === "nocost";
    const roiVal = isNoCost ? 0.00 : (lender === "HDFC Bank" ? 12.99 : (lender === "Bajaj Finance" ? 13.40 : 13.75));
    const interestComp = isNoCost ? 0 : Math.max(0, (emi * tenure) - loanAmount);
    const discVal = (isNoCost && lender === "HDFC Bank") ? Math.max(0, Math.round(loanAmount * 0.08)) : 0;

    const newTxn = {
      id: "BP" + Math.floor(100000 + Math.random() * 900000),
      customer: form.name,
      customerPhone: form.mobile,
      retailerMobile: retailerMobile || "9876543210",
      shopName: partner.shopName,
      product: form.product || "—",
      category: form.category || "Others",
      amount: loanAmount,
      emi: emi,
      tenure: tenure,
      status: "Active",
      date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }),
      lender: lender,
      ac: `${isUNI && acPlan && acPlan !== "—" ? `${acPlan} Year AppleCare+` : "—"} | DP:${totalDP || 0} | Price:${isUNI ? (baseAmount || parseInt(form.amount) || 0) : (parseInt(form.amount) || 0)} | ROI:${roiVal}`,
      icon: isUNI ? "🍎" : "📱",
      totalProductPrice: isUNI ? (baseAmount || parseInt(form.amount) || 0) : (parseInt(form.amount) || 0),
      downpayment: totalDP || 0,
      interestPercent: roiVal,
      interestComponent: interestComp,
      discount: discVal,
      customerAddress: ""
    };

    sales.unshift(newTxn);
    localStorage.setItem("bytepe_sales", JSON.stringify(sales));
    if (window.SupabaseReplication) {
      window.SupabaseReplication.pushSale(newTxn);
    }
  }, []);

  const rows = isUNI ? [
    ["Customer", form.name], ["Product", form.product || "—"],
    ["Device Price", fmt(baseAmount || loanAmount)],
    ...(acCost > 0 ? [[`AppleCare+ (${acPlan}yr)`, fmt(acCost)]] : []),
    ["Downpayment", totalDP > 0 ? fmt(totalDP) : "—"],
    ["Loan Amount", fmt(loanAmount)], ["Monthly EMI", fmt(emi)],
    [`Program Fee`, `${fmt(programFee)} (to UNI Store)`],
    ["Tenure", `${tenure} Months`], ["Lender", lender],
  ] : [
    ["Customer", form.name], ["Product", form.product || "—"],
    ["Product Value", fmt(parseInt(form.amount) || 0)],
    ["Downpayment", totalDP > 0 ? fmt(totalDP) : "—"],
    ["Loan Amount", fmt(loanAmount)], ["Monthly EMI", fmt(emi)],
    ["Program Fee", `${fmt(programFee)} (to Seller)`],
    ["Tenure", `${tenure} Months`], ["Lender", lender],
  ];
  return (
    <div style={{ background:DARK, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28 }}>
      <div style={{ width:76, height:76, background:OK, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, marginBottom:20, boxShadow:`0 0 0 14px ${OK}25` }}>✓</div>
      <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:6, textAlign:"center" }}>Loan Booked! 🎉</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:28, textAlign:"center" }}>Disbursal within T+1 business day</div>
      <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:16, padding:18, width:"100%", marginBottom:22, border:"1px solid rgba(255,255,255,0.09)" }}>
        {rows.map(([l, v]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:9, paddingBottom:9, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>{l}</span>
            <span style={{ color:"white", fontWeight:700, fontSize:12 }}>{v}</span>
          </div>
        ))}
      </div>
      <button style={S.primaryBtn} onClick={onSuccess}>Back to Dashboard</button>
    </div>
  );
}

function FailureScreen({ form, loanAmount, productAmount, onSuccess, retailerMobile }) {
  React.useEffect(() => {
    const salesStr = localStorage.getItem("bytepe_sales");
    let sales = salesStr ? JSON.parse(salesStr) : [];

    const key = `BP-TXN-FAIL-${form.mobile}-${loanAmount || productAmount}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "true");

    const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
    const partner = partners.find(p => p.phone === retailerMobile) || { shopName: "BytePé Partner Store" };

    const newTxn = {
      id: "BP" + Math.floor(100000 + Math.random() * 900000),
      customer: form.name,
      customerPhone: form.mobile,
      retailerMobile: retailerMobile || "9876543210",
      shopName: partner.shopName,
      product: form.product || "—",
      amount: loanAmount || productAmount,
      emi: 0,
      tenure: 0,
      status: "Failed",
      date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }),
      lender: "—",
      icon: "✕"
    };

    sales.unshift(newTxn);
    localStorage.setItem("bytepe_sales", JSON.stringify(sales));
    if (window.SupabaseReplication) {
      window.SupabaseReplication.pushSale(newTxn);
    }
  }, []);

  return (
    <div style={{ background:DARK, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28 }}>
      <div style={{ width:76, height:76, background:ERR, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, color:"white", marginBottom:20, boxShadow:`0 0 0 14px ${ERR}25` }}>✕</div>
      <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:6, textAlign:"center" }}>Transaction Failed</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", marginBottom:28, textAlign:"center" }}>Payment link expired or customer rejected the loan terms</div>
      <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:16, padding:18, width:"100%", marginBottom:22, border:"1px solid rgba(255,255,255,0.09)" }}>
        {[
          ["Customer", form.name],
          ["Product", form.product || "—"],
          ["Product Value", fmt(productAmount)],
          ["Loan Amount", fmt(loanAmount)],
          ["Status", "Expired / Declined"],
        ].map(([l, v]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:9, paddingBottom:9, borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>{l}</span>
            <span style={{ color:"white", fontWeight:700, fontSize:12 }}>{v}</span>
          </div>
        ))}
      </div>
      <button style={S.primaryBtn} onClick={onSuccess}>Back to Dashboard</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  STANDARD NEW SALE SCREEN
//  KEY CHANGE: Step 5 CTA is now "Proceed →"
//  After clicking, shows a "Link Sent" confirmation card
//  instead of navigating to the SuccessScreen directly.
// ─────────────────────────────────────────────────────────────────
function StdNewSaleScreen({ onBack, onSuccess, retailerMobile }) {
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState({ name:"", mobile:"", pincode:"", category:"", product:"", amount:"" });
  const [kycForm, setKycForm]     = useState({ pan:"", dob:"" });
  const [eligType, setEligType]   = useState(null);
  const [approvedLimit, setApprovedLimit] = useState(0);
  const [extraDP, setExtraDP]     = useState(0);
  const [tenure, setTenure]       = useState(12);
  const [emiType, setEmiType]     = useState("regular");
  const [loading, setLoading]     = useState(false);
  const [serial, setSerial]       = useState("");
  const [invoiceDone, setInvoiceDone] = useState(false);
  const [dpPaid, setDpPaid]       = useState(false);
  const [dpMethod, setDpMethod]   = useState("");
  const [useSubscription, setUseSubscription] = useState(false);
  const [goPG, setGoPG]           = useState(false);
  const [linkSent, setLinkSent]   = useState(false); // NEW — tracks "Proceed" click

  const [enteredLimit, setEnteredLimit] = useState("");
  const [deliveryOtp, setDeliveryOtp]   = useState("");
  const [selectedLender, setSelectedLender] = useState(LENDERS[0]);

  const productAmount = parseInt(form.amount) || 0;
  const isPartial     = eligType === "PARTIAL" || eligType === "KYC_PARTIAL" || eligType === "SMS_LIMIT_APPROVED";
  const isFull        = eligType === "FULL"    || eligType === "KYC_FULL";
  const ncEligible    = isNCEMIEligible(form.mobile);
  const mandatoryDP   = isPartial ? Math.max(0, productAmount - approvedLimit) : 0;
  const ncMinDP       = Math.ceil(productAmount * 0.10);
  const totalDP       = mandatoryDP + (parseInt(extraDP) || 0);
  const loanAmount    = Math.max(0, productAmount - totalDP);

  const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
  const partner = partners.find(p => p.phone === retailerMobile) || {};
  const fc = partner.commercials && partner.commercials.fileCharges ? partner.commercials.fileCharges : {
    upto10k: 699,
    k10to25: 999,
    k25to50: 1299,
    k50to80: 1599,
    k80to120: 1799,
    above120: 1999
  };
  const getProgramFee = (loanAmt, fileCharges) => {
    const amt = parseFloat(loanAmt) || 0;
    if (amt <= 10000) return parseInt(fileCharges.upto10k);
    if (amt <= 25000) return parseInt(fileCharges.k10to25);
    if (amt <= 50000) return parseInt(fileCharges.k25to50);
    if (amt <= 80000) return parseInt(fileCharges.k50to80);
    if (amt <= 120000) return parseInt(fileCharges.k80to120);
    return parseInt(fileCharges.above120);
  };
  const programFee    = getProgramFee(loanAmount, fc);
  const ncDP          = Math.max(mandatoryDP, ncMinDP);
  const emi           = emiType === "nocost" ? calcNC(loanAmount, tenure) : calcEMI(loanAmount, selectedLender.roi, tenure);
  const totalInterest = emiType === "nocost" ? 0 : Math.max(0, emi * tenure - loanAmount);
  const totalPayable  = emi * tenure;
  const goToStep      = s => { if (s < step) setStep(s); };
  const db            = getProductsDatabase();
  const products      = db.std[form.category] || [];
  const isAppleSamsung = (form.product.includes("iPhone") || form.product.includes("Samsung")) && productAmount > 50000;

  const checkEligibility = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const suffix = form.mobile.slice(-1);
      if (suffix === "1") {
        const limit = Math.round(productAmount * 1.25);
        setApprovedLimit(limit);
        setEligType("FULL");
      } else if (suffix === "2") {
        setEligType("SMS_LIMIT_PENDING");
      } else if (suffix === "3") {
        setEligType("REJECTED");
      } else {
        const limit = Math.round(productAmount * 1.25);
        setApprovedLimit(limit);
        setEligType("FULL");
      }
      setStep(2);
    }, 1500);
  };

  const submitSmsLimit = () => {
    const limitVal = parseInt(enteredLimit) || 0;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setApprovedLimit(limitVal);
      setEligType("SMS_LIMIT_APPROVED");
    }, 1000);
  };
  const checkKYC = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const p = kycForm.pan.toUpperCase();
      if (p.startsWith("A"))      { setApprovedLimit(productAmount); setEligType("KYC_FULL"); setStep(2); }
      else if (p.startsWith("B")) { setApprovedLimit(Math.floor(productAmount*0.7)); setEligType("KYC_PARTIAL"); setStep(2); }
      else                        { setEligType("KYC_NONE"); }
    }, 2500);
  };
  const handlePayDP = method => { setDpMethod(method); setLoading(true); setTimeout(() => { setLoading(false); setDpPaid(true); }, 1500); };

  // CHANGED: sets linkSent instead of going to step 6
  const handleProceed = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setLinkSent(true); }, 1200);
  };

  if (goPG) return <PGJourneyScreen onBack={() => setGoPG(false)} productAmount={productAmount} customerName={form.name || "Customer"} pgLabel="BytePé PG" />;
  if (step===6) return <SuccessScreen form={form} loanAmount={loanAmount} emi={emi} tenure={tenure} lender={selectedLender.name} totalDP={totalDP} programFee={programFee} onSuccess={onSuccess} isUNI={false} retailerMobile={retailerMobile} emiType={emiType} />;
  if (step===7) return <FailureScreen form={form} loanAmount={loanAmount} productAmount={productAmount} onSuccess={onSuccess} retailerMobile={retailerMobile} />;

  return (
    <div style={{ paddingBottom:100 }}>
      {step <= 3 ? (
        <div style={{ ...S.header, paddingTop:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
            <button onClick={step !== 1 ? () => setStep(s => s-1) : onBack} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"white", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:16 }}>←</button>
            <div>
              <div style={{ fontSize:20, fontWeight:800, color:"white", marginBottom:2 }}>
                {["","New Sale","Eligibility Check","EMI Plan & Breakdown"][step]}
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>
                {["","Enter customer & product details","Bureau check result","Pick lender, tenure & send link"][step]}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {[1,2,3,4].map(s => <div key={s} onClick={() => goToStep(s)} style={{ flex:1, height:4, borderRadius:2, background: step>=s ? ORANGE : "rgba(255,255,255,0.15)", cursor: step>s ? "pointer":"default" }} />)}
          </div>
        </div>
      ) : step === 4 ? (
        <div style={{ ...S.header, paddingTop:24, paddingBottom:20 }}>
          <div style={{ fontSize:20, fontWeight:800, color:"white" }}>Payment Link</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Sent to customer for completion</div>
        </div>
      ) : (
        <div style={{ ...S.header, paddingTop:24, paddingBottom:20 }}>
          <div style={{ fontSize:20, fontWeight:800, color:"white" }}>Transaction Status</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Awaiting customer action</div>
        </div>
      )}

      <div style={{ padding:"16px 16px 0" }}>
        {step===1 && (
          <>
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:16 }}>Customer Details</div>
              <div style={{ marginBottom:14 }}>
                <label style={S.label}>Customer Name (Same to be used in Invoice)</label>
                <input style={S.input} placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={S.label}>Mobile Number</label>
                <input style={S.input} placeholder="10-digit mobile" value={form.mobile} onChange={e => setForm({...form, mobile:e.target.value.replace(/\D/g,"").slice(0,10)})} type="tel" />
              </div>
              <div style={{ display:"flex", gap:6, marginTop:8, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ fontSize:11, color:MUT, fontWeight:600 }}>Try Demo:</span>
                <span onClick={() => setForm({...form, name:"Aditya Eligible", mobile:"9818886951", amount:"80000", category:"Mobiles & Tablets", product:"OnePlus 12 5G"})} style={{ ...S.tag, padding:"2px 8px", fontSize:10, cursor:"pointer" }}>Eligible (Full)</span>
                <span onClick={() => setForm({...form, name:"Rohan Flex", mobile:"9818886952", amount:"80000", category:"Mobiles & Tablets", product:"OnePlus 12 5G"})} style={{ ...S.tag, padding:"2px 8px", fontSize:10, cursor:"pointer" }}>SMS Limit (60-99%)</span>
                <span onClick={() => setForm({...form, name:"Karan Reject", mobile:"9818886953", amount:"80000", category:"Mobiles & Tablets", product:"OnePlus 12 5G"})} style={{ ...S.tag, padding:"2px 8px", fontSize:10, cursor:"pointer" }}>Rejected (&lt;60%)</span>
              </div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:16 }}>Product Details</div>
              <div style={{ marginBottom:14 }}>
                <label style={S.label}>Category</label>
                <select style={S.select} value={form.category} onChange={e => setForm({...form, category:e.target.value, product:""})}>
                  <option value="">Select category</option>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {form.category === "Mobiles & Tablets" && products.length > 0 ? (
                <div style={{ marginBottom:14 }}>
                  <label style={S.label}>Device Model</label>
                  <select style={S.select} value={form.product} onChange={e => setForm({...form, product:e.target.value})}>
                    <option value="">Select model</option>
                    {products.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              ) : (
                <div style={{ marginBottom:14 }}>
                  <label style={S.label}>Product Name</label>
                  <input style={S.input} placeholder="Enter product name" value={form.product} onChange={e => setForm({...form, product:e.target.value})} />
                </div>
              )}
              <div style={{ marginBottom:14 }}>
                <label style={S.label}>Product Amount</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontWeight:700, color:MUT }}>₹</span>
                  <input style={{ ...S.input, paddingLeft:28 }} placeholder="0" value={form.amount} onChange={e => setForm({...form, amount:e.target.value.replace(/\D/g,"")})} type="tel" />
                </div>
              </div>
              {isAppleSamsung && (
                <div onClick={() => setUseSubscription(s => !s)} style={{ borderRadius:12, padding:14, border:`2px solid ${useSubscription?ORANGE:BD}`, background: useSubscription?OL:"#FAFBFC", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${useSubscription?ORANGE:BD}`, background: useSubscription?ORANGE:"white", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {useSubscription && <span style={{ color:"white", fontSize:13, fontWeight:900 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color: useSubscription?ORANGE:DARK }}>⭐ Buy on Subscription</div>
                      <div style={{ fontSize:12, color:MUT }}>Use 12 months → Upgrade or continue 24-mo EMI</div>
                    </div>
                    <span style={S.tag}>NEW</span>
                  </div>
                </div>
              )}
            </div>
            <button style={{ ...S.primaryBtn, opacity: form.name && form.mobile && form.amount ? 1 : 0.5 }} onClick={checkEligibility} disabled={loading || !form.name || !form.mobile || !form.amount}>
              {loading ? "Checking Eligibility..." : "Check Eligibility →"}
            </button>
          </>
        )}

        {step===2 && (
          <>
            {!eligType && (
              <div style={{ ...S.card, textAlign:"center", padding:"32px 20px" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>🔍</div>
                <div style={{ fontSize:16, fontWeight:700, color:DARK, marginBottom:8 }}>Running Bureau Checks</div>
                <div style={{ fontSize:13, color:MUT, marginBottom:20 }}>CIBIL · CRIF · DPD in progress...</div>
                <div style={S.pb}><div style={{ ...S.pf(75), animation:"grow 2s" }} /></div>
              </div>
            )}

            {eligType === "FULL" && (
              <>
                <div style={{ ...S.card, background:"#E6FAF4", border:`1.5px solid ${OK}40`, textAlign:"center", padding:20, marginBottom:16 }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
                  <div style={{ fontSize:15, fontWeight:800, color:OK, marginBottom:6 }}>Fully Approved</div>
                  <div style={{ fontSize:16, fontWeight:800, color:DARK, marginBottom:4 }}>Customer is eligible for full EMI</div>
                  <div style={{ fontSize:12, color:MUT }}>Pre-approved for the full product amount</div>
                </div>

                <div style={S.card}>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Eligible Lenders</div>
                  <div style={{ fontSize:12, color:MUT, marginBottom:16 }}>3 lenders available · choose on the next step</div>
                  {LENDERS.map((l, idx) => (
                    <div key={l.name} style={{
                      display:"flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: idx === LENDERS.length - 1 ? "none" : `1px solid ${BD}`
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>🏦</span>
                        <span style={{ fontSize:14, fontWeight:700, color:DARK }}>{l.name}</span>
                      </div>
                      <div style={{ fontSize:12, color:MUT }}>
                        {l.roi.toFixed(2)}% p.a. · {l.sla.toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>

                <button style={S.primaryBtn} onClick={() => setStep(3)}>Continue to EMI Plans →</button>
                <button style={{ ...S.outlineBtn, marginTop:10 }} onClick={() => setGoPG(true)}>💳 Pay Full Amount via BytePé PG</button>
                <div style={{ textAlign:"center", marginTop:12 }}>
                  <span style={{ fontSize:12, color:MUT }}>Not pre-approved? </span>
                  <span style={{ fontSize:12, color:ORANGE, fontWeight:600, cursor:"pointer" }} onClick={() => setEligType(null)}>Try KYC Flow →</span>
                </div>
              </>
            )}

            {eligType === "SMS_LIMIT_PENDING" && (
              <>
                <div style={S.card}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
                    <div style={{ fontSize:24 }}>💬</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:700, color:DARK }}>FlexMoney Bureau Check</div>
                      <div style={{ fontSize:11, color:MUT }}>Limit Verification Required</div>
                    </div>
                  </div>
                  <div style={{ background:"#FFF8E7", border:`1px solid ${WARN}30`, borderRadius:10, padding:12, marginBottom:14 }}>
                    <div style={{ fontSize:12, color:WARN, fontWeight:600, lineHeight:1.5 }}>
                      Customer has partial eligibility (60% to 99%). FlexMoney has sent an SMS with their credit limit to <strong>+91 {form.mobile}</strong>.
                    </div>
                  </div>
                  <div style={{ background:DARK, borderRadius:12, padding:12, marginBottom:16, color:"white" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:4 }}>Simulated Customer SMS</div>
                    <div style={{ fontSize:12, lineHeight:1.5, fontStyle:"italic" }}>
                      "Dear Customer, your eligible limit for BytePé purchase is <strong>{fmt(Math.round(productAmount * 0.75))}</strong>. Share this limit with the promoter to proceed. - FlexMoney"
                    </div>
                  </div>
                  <label style={S.label}>Enter limit shared by customer *</label>
                  <div style={{ position:"relative", marginBottom:16 }}>
                    <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontWeight:700, color:MUT }}>₹</span>
                    <input style={{ ...S.input, paddingLeft:28 }} placeholder="Enter limit (e.g. 60000)" value={enteredLimit} onChange={e => setEnteredLimit(e.target.value.replace(/\D/g,""))} type="tel" />
                  </div>
                  <button style={{ ...S.primaryBtn, opacity: enteredLimit ? 1 : 0.5 }} onClick={submitSmsLimit} disabled={!enteredLimit || loading}>
                    {loading ? "Verifying..." : "Verify & Proceed"}
                  </button>
                </div>
                {enteredLimit && parseInt(enteredLimit) > 0 && (
                  <div style={S.card}>
                    <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Eligible Lenders</div>
                    <div style={{ fontSize:12, color:MUT, marginBottom:16 }}>3 lenders available · choose on the next step</div>
                    {LENDERS.map((l, idx) => (
                      <div key={l.name} style={{
                        display:"flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: idx === LENDERS.length - 1 ? "none" : `1px solid ${BD}`
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:16 }}>🏦</span>
                          <span style={{ fontSize:14, fontWeight:700, color:DARK }}>{l.name}</span>
                        </div>
                        <div style={{ fontSize:12, color:MUT }}>
                          {l.roi.toFixed(2)}% p.a. · {l.sla.toLowerCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {eligType === "SMS_LIMIT_APPROVED" && (
              <>
                <div style={{ ...S.card, background:"#E6FAF4", border:`1.5px solid ${OK}40`, textAlign:"center", padding:16, marginBottom:12 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:OK }}>✓ Eligible Limit Verified: {fmt(approvedLimit)}</div>
                </div>
                <div style={S.card}>
                  <div style={{ fontSize:15, fontWeight:700, color:DARK, marginBottom:12 }}>Mandatory Downpayment Flow</div>
                  <div style={{ ...S.row, paddingBottom:10, borderBottom:`1px solid ${BD}`, marginBottom:10 }}>
                    <span style={{ fontSize:13, color:MUT }}>Product Value</span>
                    <span style={{ fontSize:13, fontWeight:600, color:DARK }}>{fmt(productAmount)}</span>
                  </div>
                  <div style={{ ...S.row, paddingBottom:10, borderBottom:`1px solid ${BD}`, marginBottom:10 }}>
                    <span style={{ fontSize:13, color:MUT }}>Approved Limit</span>
                    <span style={{ fontSize:13, fontWeight:600, color:DARK }}>{fmt(approvedLimit)}</span>
                  </div>
                  <div style={{ ...S.row, marginBottom:12 }}>
                    <span style={{ fontSize:14, fontWeight:700, color:ORANGE }}>Mandatory Downpayment</span>
                    <span style={{ fontSize:16, fontWeight:900, color:ORANGE }}>{fmt(mandatoryDP)}</span>
                  </div>
                  {!dpPaid ? (
                    <div>
                      <div style={{ fontSize:12, color:MUT, marginBottom:8 }}>Collect downpayment:</div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button style={{ ...S.outlineBtn, flex:1, fontSize:13, padding:"12px 8px" }} onClick={() => handlePayDP("store")} disabled={loading}>🏪 Pay at Store</button>
                        <button style={{ ...S.primaryBtn, flex:1, fontSize:13, padding:"12px 8px" }} onClick={() => handlePayDP("BytePé PG")} disabled={loading}>💳 Pay via BytePé PG</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:"flex", alignItems:"center", gap:8, background:"#E6FAF4", borderRadius:10, padding:12 }}>
                      <span>✅</span>
                      <span style={{ fontSize:12, fontWeight:600, color:OK }}>
                        {fmt(mandatoryDP)} {dpMethod==="store"?"collected at store":"paid via BytePé PG"} Successfully!
                      </span>
                    </div>
                  )}
                </div>

                <div style={S.card}>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Eligible Lenders</div>
                  <div style={{ fontSize:12, color:MUT, marginBottom:16 }}>3 lenders available · choose on the next step</div>
                  {LENDERS.map((l, idx) => (
                    <div key={l.name} style={{
                      display:"flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: idx === LENDERS.length - 1 ? "none" : `1px solid ${BD}`
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>🏦</span>
                        <span style={{ fontSize:14, fontWeight:700, color:DARK }}>{l.name}</span>
                      </div>
                      <div style={{ fontSize:12, color:MUT }}>
                        {l.roi.toFixed(2)}% p.a. · {l.sla.toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>

                <button style={{ ...S.primaryBtn, opacity: dpPaid ? 1 : 0.5 }} onClick={() => setStep(3)} disabled={!dpPaid}>
                  Continue to EMI Plans →
                </button>
              </>
            )}

            {eligType === "REJECTED" && (
              <div style={S.card}>
                <div style={{ textAlign:"center", padding:"12px 0" }}>
                  <div style={{ fontSize:38, marginBottom:8 }}>❌</div>
                  <div style={{ background:"#FFEEEC", color:ERR, borderRadius:20, padding:"4px 16px", fontSize:13, fontWeight:700, display:"inline-block" }}>Not Approved</div>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginTop:12, marginBottom:6 }}>Unable to offer EMI</div>
                  <div style={{ fontSize:12, color:MUT, marginBottom:20 }}>Customer's eligibility is less than 60% of the product value.</div>
                </div>
                <button style={S.primaryBtn} onClick={() => setGoPG(true)}>💳 Pay Full Amount via BytePé PG</button>
                <button style={{ ...S.outlineBtn, marginTop:10 }} onClick={onBack}>Back to Dashboard</button>
              </div>
            )}

            {(eligType==="KYC_FULL"||eligType==="KYC_PARTIAL") && (
              <>
                <div style={{ ...S.card, background:"#E6FAF4", border:`1.5px solid ${OK}40`, textAlign:"center", padding:20, marginBottom:12 }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
                  {eligType === "KYC_PARTIAL" ? (
                    <>
                      <div style={{ fontSize:15, fontWeight:800, color:OK, marginBottom:6 }}>Congratulations!</div>
                      <div style={{ fontSize:13, color:MUT, marginTop:4 }}>Customer limit approved:</div>
                      <div style={{ fontSize:26, fontWeight:900, color:DARK, marginTop:4 }}>{fmt(approvedLimit)}</div>
                      <div style={{ fontSize:12, color:WARN, marginTop:6, background:"#FFF8E7", borderRadius:8, padding:"6px 12px" }}>
                        Mandatory downpayment of {fmt(productAmount-approvedLimit)} required
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize:15, fontWeight:800, color:OK, marginBottom:6 }}>Fully Approved</div>
                      <div style={{ fontSize:16, fontWeight:800, color:DARK, marginBottom:4 }}>Customer is eligible for full EMI</div>
                      <div style={{ fontSize:12, color:MUT }}>Pre-approved for the full product amount</div>
                    </>
                  )}
                </div>

                <div style={S.card}>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Eligible Lenders</div>
                  <div style={{ fontSize:12, color:MUT, marginBottom:16 }}>3 lenders available · choose on the next step</div>
                  {LENDERS.map((l, idx) => (
                    <div key={l.name} style={{
                      display:"flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: idx === LENDERS.length - 1 ? "none" : `1px solid ${BD}`
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>🏦</span>
                        <span style={{ fontSize:14, fontWeight:700, color:DARK }}>{l.name}</span>
                      </div>
                      <div style={{ fontSize:12, color:MUT }}>
                        {l.roi.toFixed(2)}% p.a. · {l.sla.toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>

                <button style={S.primaryBtn} onClick={() => setStep(3)}>
                  Continue to EMI Plans →
                </button>
                {eligType === "KYC_FULL" && (
                  <button style={{ ...S.outlineBtn, marginTop:10 }} onClick={() => setGoPG(true)}>💳 Pay Full Amount via BytePé PG</button>
                )}
              </>
            )}
            {eligType===null && !loading && (
              <div style={S.card}>
                <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Fresh KYC Check</div>
                <div style={{ fontSize:12, color:MUT, marginBottom:16 }}>Run CIBIL + CRIF with customer PAN & DOB</div>
                <div style={{ marginBottom:12 }}><label style={S.label}>PAN Number *</label><input style={S.input} placeholder="ABCDE1234F" value={kycForm.pan} onChange={e => setKycForm({...kycForm, pan:e.target.value.toUpperCase().slice(0,10)})} /></div>
                <div style={{ marginBottom:14 }}><label style={S.label}>Date of Birth *</label><input style={S.input} type="date" value={kycForm.dob} onChange={e => setKycForm({...kycForm, dob:e.target.value})} /></div>
                <div style={{ background:GREY, borderRadius:10, padding:12, marginBottom:16, fontSize:12, color:MUT }}>🔒 Bureau check won't impact credit score. (Test: PAN A=Full · B=Partial · Other=Reject)</div>
                <button style={{ ...S.primaryBtn, opacity: kycForm.pan.length===10&&kycForm.dob?1:0.5 }} onClick={checkKYC} disabled={loading||kycForm.pan.length<10||!kycForm.dob}>
                  {loading?"Running Bureau Check...":"Run CIBIL + CRIF →"}
                </button>
              </div>
            )}
            {eligType==="KYC_NONE" && (
              <div style={S.card}>
                <div style={{ textAlign:"center", padding:"12px 0" }}>
                  <div style={{ fontSize:38, marginBottom:8 }}>❌</div>
                  <div style={{ background:"#FFEEEC", color:ERR, borderRadius:20, padding:"4px 16px", fontSize:13, fontWeight:700, display:"inline-block" }}>Not Approved</div>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginTop:12, marginBottom:6 }}>Unable to offer EMI</div>
                  <div style={{ fontSize:12, color:MUT, marginBottom:20 }}>Customer does not meet current criteria</div>
                </div>
                <button style={S.primaryBtn} onClick={() => setGoPG(true)}>💳 Pay Full Amount via BytePé PG</button>
                <button style={{ ...S.outlineBtn, marginTop:10 }} onClick={onBack}>Back to Dashboard</button>
              </div>
            )}
          </>
        )}

        {step===3 && (
          <>
            {/* 1. EMI Type Card */}
            <div style={S.card}>
              <div style={{ ...S.row, marginBottom:4 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK }}>EMI Type</div>
                  <div style={{ fontSize:11, color:MUT, marginTop:2 }}>No Cost is subvented by brand / retailer</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:0, background:GREY, borderRadius:30, padding:3, border:`1.5px solid ${BD}` }}>
                  <button
                    onClick={() => { if (ncEligible) { setEmiType("nocost"); setTenure(3); setExtraDP(0); } }}
                    disabled={!ncEligible}
                    style={{ display:"flex", alignItems:"center", gap:5, background: emiType==="nocost" ? OK : "transparent", color: emiType==="nocost" ? "white" : ncEligible ? MUT : BD, border:"none", borderRadius:26, padding:"6px 12px", fontSize:11, fontWeight:700, cursor: ncEligible?"pointer":"not-allowed", transition:"all 0.2s", whiteSpace:"nowrap", opacity: ncEligible ? 1 : 0.45 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background: emiType==="nocost" ? "white" : ncEligible ? OK : BD, display:"inline-block", flexShrink:0 }} />
                    No Cost
                  </button>
                  <button
                    onClick={() => { setEmiType("regular"); setTenure(12); setExtraDP(0); }}
                    style={{ display:"flex", alignItems:"center", gap:5, background: emiType==="regular" ? ORANGE : "transparent", color: emiType==="regular" ? "white" : MUT, border:"none", borderRadius:26, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background: emiType==="regular" ? "white" : ORANGE, display:"inline-block", flexShrink:0 }} />
                    Standard
                  </button>
                </div>
              </div>
              {!ncEligible && (
                <div style={{ background:"#FFF8E7", border:`1px solid ${WARN}40`, borderRadius:10, padding:"8px 12px", marginTop:8, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14 }}>⚠️</span>
                  <span style={{ fontSize:12, color:WARN, fontWeight:600 }}>No Cost EMI not available for this customer</span>
                </div>
              )}
            </div>

            {/* 2. Available Lenders Card */}
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Available Lenders</div>
              <div style={{ fontSize:11, color:MUT, marginBottom:12 }}>The customer picks any lender on the payment link - tap to preview EMIs</div>
              {LENDERS.map(l => {
                const isSelected = selectedLender.name === l.name;
                const lenderEmi = emiType === "nocost" ? calcNC(loanAmount, tenure) : calcEMI(loanAmount, l.roi, tenure);
                return (
                  <div key={l.name} onClick={() => setSelectedLender(l)} style={{
                    borderRadius: 12,
                    border: `2px solid ${isSelected ? ORANGE : BD}`,
                    background: isSelected ? OL : "#FAFBFC",
                    padding: "12px 14px",
                    marginBottom: 8,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${isSelected ? ORANGE : BD}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {isSelected && <div style={{ width:8, height:8, borderRadius:"50%", background:ORANGE }} />}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:DARK }}>{l.name}</div>
                        <div style={{ fontSize:10, color:MUT, marginTop:2 }}>{l.roi.toFixed(2)}% p.a. · Disbursal {l.sla}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize:13, fontWeight:800, color:DARK }}>{fmt(lenderEmi)}<span style={{ fontSize:10, color:MUT, fontWeight:400 }}>/mo</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. Tenure Card */}
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:12 }}>Tenure</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[[3,6,9],[12,18,24]].map((row, ri) => (
                  <div key={ri} style={{ display:"flex", gap:8 }}>
                    {row.map(t => {
                      const isTenureSelected = tenure === t;
                      const tenureEmi = emiType === "nocost" ? calcNC(loanAmount, t) : calcEMI(loanAmount, selectedLender.roi, t);
                      return (
                        <div key={t} onClick={() => setTenure(t)} style={{
                          flex:1,
                          textAlign:"center",
                          padding:"10px 4px",
                          borderRadius:10,
                          border: `2px solid ${isTenureSelected ? (emiType==="nocost"?OK:ORANGE) : BD}`,
                          background: isTenureSelected ? (emiType==="nocost"?"#E6FAF4":OL) : "white",
                          cursor:"pointer",
                          transition:"all 0.15s"
                        }}>
                          <div style={{ fontSize:12, fontWeight:700, color:DARK }}>{t} mo</div>
                          <div style={{ fontSize:10, color: emiType==="nocost"?OK:ORANGE, fontWeight:600, marginTop:2 }}>{fmt(tenureEmi)}/mo</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Downpayment Card */}
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Downpayment (Optional)</div>
              <div style={{ fontSize:11, color:MUT, marginBottom:10 }}>Paying upfront lowers the EMI</div>
              {isPartial && (
                <div style={{ ...S.row, marginBottom:10, background:GREY, borderRadius:10, padding:12 }}>
                  <span style={{ fontSize:12, color:MUT }}>Mandatory Downpayment</span>
                  <span style={{ fontSize:13, fontWeight:700, color:ERR }}>{fmt(mandatoryDP)}</span>
                </div>
              )}
              {emiType==="nocost" && ncEligible && ncDP > mandatoryDP && (
                <div style={{ ...S.row, marginBottom:10, background:"#E6FAF4", borderRadius:10, padding:12 }}>
                  <span style={{ fontSize:11, color:OK }}>Min. DP for No Cost EMI (10%)</span>
                  <span style={{ fontSize:12, fontWeight:700, color:OK }}>{fmt(ncDP)}</span>
                </div>
              )}
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontWeight:700, color:MUT }}>₹</span>
                <input
                  style={{ ...S.input, paddingLeft:28 }}
                  placeholder="0"
                  value={extraDP||""}
                  onChange={e => {
                    const v = parseInt(e.target.value.replace(/\D/g,""))||0;
                    setExtraDP(Math.min(v, productAmount-mandatoryDP));
                  }}
                  type="tel"
                />
              </div>
            </div>

            {/* 5. MONTHLY EMI Black Card */}
            <div style={{ background:DARK, borderRadius:16, padding:18, marginBottom:12, color:"white" }}>
              <div style={{ ...S.row, marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.8 }}>MONTHLY EMI</div>
                  <div style={{ fontSize:28, fontWeight:900, color:"white", marginTop:2 }}>{fmt(emi)}<span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>/mo</span></div>
                </div>
                <div style={{ background: emiType==="nocost"?OK:ORANGE, borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, color:"white" }}>
                  {emiType==="nocost" ? "No Cost" : "Standard"}
                </div>
              </div>
              
              <div style={{ height:1, background:"rgba(255,255,255,0.1)", margin:"12px 0" }} />
              
              {[
                ["Product Value", fmt(productAmount)],
                ["Loan Amount", fmt(loanAmount)],
                ["Interest Rate", emiType==="nocost" ? "0.00% p.a." : `${selectedLender.roi.toFixed(2)}% p.a.`],
                ["Total Interest", fmt(totalInterest)],
                ["Total Payable", fmt(totalPayable)],
                ["Tenure", `${tenure} Months`],
                ["Lender (preview)", selectedLender.name],
                ["Program Fee", `${fmt(programFee)} → Seller`]
              ].map(([l, v]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:12 }}>
                  <span style={{ color:"rgba(255,255,255,0.4)" }}>{l}</span>
                  <span style={{ color:"white", fontWeight:700 }}>{v}</span>
                </div>
              ))}
              
              <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:12, background:"rgba(255,255,255,0.05)", padding:"8px 12px", borderRadius:8 }}>
                <span style={{ fontSize:12 }}>ℹ️</span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.5)", lineHeight:1.3 }}>
                  This is a preview. The final lender & rate are chosen by the customer on the payment link.
                </span>
              </div>
            </div>

            {/* Note below card */}
            <div style={{ display:"flex", gap:6, padding:"0 4px", marginBottom:14 }}>
              <span style={{ fontSize:13 }}>📝</span>
              <span style={{ fontSize:11, color:MUT, lineHeight:1.4 }}>
                Customer will consent to loan terms, bureau access & eSign on the payment link.
              </span>
            </div>

            <button style={S.primaryBtn} onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setStep(4); }, 1200); }} disabled={loading}>
              {loading ? "Sending Payment Link..." : "Send Payment Link →"}
            </button>
          </>
        )}

        {step===4 && (
          <>
            <div style={{ ...S.card, background:"#E6FAF4", border:`1.5px solid ${OK}40`, textAlign:"center", padding:24 }}>
              <div style={{ display:"inline-flex", background:"#C2F3E3", width:48, height:48, borderRadius:"50%", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:12 }}>
                📲
              </div>
              <div style={{ fontSize:16, fontWeight:800, color:OK, marginBottom:8 }}>Link Sent!</div>
              <div style={{ fontSize:12, color:SEC, lineHeight:1.5, marginBottom:16 }}>
                A secure payment & eSign link has been sent to the customer's mobile. The customer can choose any eligible lender on the link to complete the EMI booking.
              </div>
              
              <div style={{ background:"white", border:`1px solid ${BD}`, borderRadius:10, padding:"12px 16px", fontSize:15, fontWeight:700, color:DARK, display:"inline-block", letterSpacing:0.5 }}>
                +91 {form.mobile}
              </div>
              
              <div style={{ marginTop:20, height:1, background:`${BD}` }} />
              
              <div style={{ fontSize:10, fontWeight:700, color:MUT, textTransform:"uppercase", letterSpacing:0.8, marginTop:16, marginBottom:10 }}>
                LENDERS THE CUSTOMER CAN PICK FROM
              </div>
              <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
                {LENDERS.map(l => (
                  <span key={l.name} style={{ background:"white", border:`1.5px solid ${BD}`, borderRadius:20, padding:"6px 12px", fontSize:11, fontWeight:600, color:DARK, display:"flex", alignItems:"center", gap:4 }}>
                    🏦 {l.name}
                  </span>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:14 }}>Order Summary</div>
              {[
                ["Customer", form.name],
                ["Product", form.product || "—"],
                ["Product Value", fmt(productAmount)],
                ["Loan Amount", fmt(loanAmount)],
                ["Monthly EMI", <span style={{ color:ORANGE, fontWeight:700 }}>~ {fmt(emi)} <span style={{ fontSize:10, fontWeight:400, color:MUT }}>(est.)</span></span>],
                ["Tenure", `${tenure} Months`],
                ["Lender", "Customer's choice on link"],
                ["Program Fee", `${fmt(programFee)} (to Seller)`]
              ].map(([l, v]) => (
                <div key={l} style={{ ...S.row, paddingBottom:9, marginBottom:9, borderBottom:`1px solid ${BD}` }}>
                  <span style={{ fontSize:12, color:MUT }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:DARK }}>{v}</span>
                </div>
              ))}
            </div>

            <button style={S.primaryBtn} onClick={() => setStep(5)}>
              Track Transaction Status →
            </button>
          </>
        )}

        {step===5 && (
          <>
            <div style={{ ...S.card, textAlign:"center", padding:32 }}>
              <div style={{ display:"inline-flex", justifyContent:"center", alignItems:"center", marginBottom:16 }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: `3px solid ${OL}`,
                  borderTopColor: ORANGE,
                  animation: "spin 1s linear infinite"
                }} />
              </div>
              
              <div>
                <span style={{ ...S.warnTag, padding:"4px 12px", fontSize:11, borderRadius:12, marginBottom:12 }}>
                  ● Pending
                </span>
              </div>
              
              <div style={{ fontSize:16, fontWeight:800, color:DARK, marginTop:12, marginBottom:8 }}>
                Transaction Pending
              </div>
              <div style={{ fontSize:12, color:MUT, lineHeight:1.5 }}>
                Waiting for the customer to complete payment, KYC & eSign on the link sent to <strong>+91 {form.mobile}</strong>.
              </div>
            </div>

            <div style={{ ...S.card, background:"#FAFBFC", border:`1.5px dashed ${BD}`, padding:16, marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:MUT, textTransform:"uppercase", letterSpacing:0.8, marginBottom:12, textAlign:"center" }}>
                DEMO: SIMULATE OUTCOME
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ ...S.primaryBtn, background: OK, flex:1, padding:"12px 10px", fontSize:13, boxShadow:"none" }} onClick={() => setStep(6)}>
                  ✓ Mark Paid
                </button>
                <button style={{ ...S.outlineBtn, color: ERR, border:`2px solid ${ERR}`, flex:1, padding:"12px 10px", fontSize:13 }} onClick={() => setStep(7)}>
                  ✕ Mark Failed
                </button>
              </div>
            </div>

            <button style={S.outlineBtn} onClick={onSuccess}>
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function UNINewSaleScreen({ onBack, onSuccess, retailerMobile }) {
  const [step, setStep]           = useState(1);
  const [form, setForm]           = useState({ name:"", mobile:"", pincode:"", category:"", product:"", amount:"" });
  const [kycForm, setKycForm]     = useState({ pan:"", dob:"" });
  const [eligType, setEligType]   = useState(null);
  const [approvedLimit, setApprovedLimit] = useState(0);
  const [extraDP, setExtraDP]     = useState(0);
  const [tenure, setTenure]       = useState(12);
  const [emiType, setEmiType]     = useState("nocost");
  const [loading, setLoading]     = useState(false);
  const [serial, setSerial]       = useState("");
  const [invoiceDone, setInvoiceDone] = useState(false);
  const [dpPaid, setDpPaid]       = useState(false);
  const [dpMethod, setDpMethod]   = useState("");
  const [useSubscription, setUseSubscription] = useState(false);
  const [acEnabled, setAcEnabled] = useState(false);
  const [acPlan, setAcPlan]       = useState("");
  const [goPG, setGoPG]           = useState(false);
  const [linkSent, setLinkSent]   = useState(false); // NEW

  const [enteredLimit, setEnteredLimit] = useState("");
  const [deliveryOtp, setDeliveryOtp]   = useState("");
  const [selectedLender, setSelectedLender] = useState(LENDERS[0]);

  const baseAmount    = parseInt(form.amount) || 0;
  const acCost        = acEnabled && acPlan ? APPLE_CARE[parseInt(acPlan)] : 0;
  const productAmount = baseAmount + acCost;
  const isPartial     = eligType === "PARTIAL" || eligType === "KYC_PARTIAL" || eligType === "SMS_LIMIT_APPROVED";
  const isFull        = eligType === "FULL"    || eligType === "KYC_FULL";
  const ncEligible    = isNCEMIEligible(form.mobile);
  const mandatoryDP   = isPartial ? Math.max(0, productAmount - approvedLimit) : 0;
  const ncMinDP       = Math.ceil(productAmount * 0.10);
  const ncDP          = Math.max(mandatoryDP, ncMinDP);
  const totalDP       = mandatoryDP + (parseInt(extraDP) || 0);
  const loanAmount    = Math.max(0, productAmount - totalDP);

  const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
  const partner = partners.find(p => p.phone === retailerMobile) || {};
  const fc = partner.commercials && partner.commercials.fileCharges ? partner.commercials.fileCharges : {
    upto10k: 699,
    k10to25: 999,
    k25to50: 1299,
    k50to80: 1599,
    k80to120: 1799,
    above120: 1999
  };
  const getProgramFee = (loanAmt, fileCharges) => {
    const amt = parseFloat(loanAmt) || 0;
    if (amt <= 10000) return parseInt(fileCharges.upto10k);
    if (amt <= 25000) return parseInt(fileCharges.k10to25);
    if (amt <= 50000) return parseInt(fileCharges.k25to50);
    if (amt <= 80000) return parseInt(fileCharges.k50to80);
    if (amt <= 120000) return parseInt(fileCharges.k80to120);
    return parseInt(fileCharges.above120);
  };
  const programFee    = getProgramFee(loanAmount, fc);
  const emi           = emiType === "nocost" ? calcNC(loanAmount, tenure) : calcEMI(loanAmount, selectedLender.roi, tenure);
  const totalInterest = emiType === "nocost" ? 0 : Math.max(0, emi * tenure - loanAmount);
  const totalPayable  = emi * tenure;
  const goToStep      = s => { if (s < step) setStep(s); };
  const db            = getProductsDatabase();
  const products      = db.uni[form.category] || [];

  const handleCategoryChange = cat => {
    setForm(f => ({ ...f, category:cat, product:"", amount:"" }));
    setUseSubscription(cat === "Smartphones");
    setAcEnabled(false); setAcPlan("");
  };
  const handleProductChange = prod => {
    const db = getProductsDatabase();
    const price = db.prices[prod] || "";
    setForm(f => ({ ...f, product:prod, amount:String(price) }));
  };
  const checkEligibility = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const suffix = form.mobile.slice(-1);
      if (suffix === "1") {
        const limit = Math.round(productAmount * 1.25);
        setApprovedLimit(limit);
        setEligType("FULL");
      } else if (suffix === "2") {
        setEligType("SMS_LIMIT_PENDING");
      } else if (suffix === "3") {
        setEligType("REJECTED");
      } else {
        const limit = Math.round(productAmount * 1.25);
        setApprovedLimit(limit);
        setEligType("FULL");
      }
      setStep(2);
    }, 1500);
  };

  const submitSmsLimit = () => {
    const limitVal = parseInt(enteredLimit) || 0;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setApprovedLimit(limitVal);
      setEligType("SMS_LIMIT_APPROVED");
    }, 1000);
  };

  const checkKYC = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const p = kycForm.pan.toUpperCase();
      if (p.startsWith("A"))      { setApprovedLimit(productAmount); setEligType("KYC_FULL"); setStep(2); }
      else if (p.startsWith("B")) { setApprovedLimit(Math.floor(productAmount*0.7)); setEligType("KYC_PARTIAL"); setStep(2); }
      else                        { setEligType("KYC_NONE"); }
    }, 2500);
  };
  const handlePayDP = method => { setDpMethod(method); setLoading(true); setTimeout(() => { setLoading(false); setDpPaid(true); }, 1500); };

  // CHANGED: sets linkSent instead of going to step 6
  const handleProceed = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setLinkSent(true); }, 1200);
  };

  if (goPG)    return <PGJourneyScreen onBack={() => setGoPG(false)} productAmount={productAmount} customerName={form.name||"Customer"} pgLabel="UNI PG" />;
  if (step===6) return <SuccessScreen form={form} loanAmount={loanAmount} emi={emi} tenure={tenure} lender={selectedLender.name} totalDP={totalDP} programFee={programFee} acPlan={acPlan} acCost={acCost} baseAmount={baseAmount} onSuccess={onSuccess} isUNI={true} retailerMobile={retailerMobile} emiType={emiType} />;
  if (step===7) return <FailureScreen form={form} loanAmount={loanAmount} productAmount={productAmount} onSuccess={onSuccess} retailerMobile={retailerMobile} />;

  return (
    <div style={{ paddingBottom:100 }}>
      {step <= 3 ? (
        <div style={{ ...S.header, paddingTop:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <button onClick={step !== 1 ? () => setStep(s => s-1) : onBack} style={{ background:"rgba(255,255,255,0.1)", border:"none", color:"white", borderRadius:10, width:34, height:34, cursor:"pointer", fontSize:16 }}>←</button>
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:"white", marginBottom:2 }}>
                {["","New Sale","Eligibility","EMI Plan & Breakdown"][step]}
              </div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>
                {["","Customer & product details","Bureau check result","Pick lender, tenure & send link"][step]}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:5 }}>
            {[1,2,3,4].map(s => <div key={s} onClick={() => goToStep(s)} style={{ flex:1, height:3, borderRadius:2, background: step>=s?ORANGE:"rgba(255,255,255,0.15)", cursor: step>s?"pointer":"default" }} />)}
          </div>
        </div>
      ) : step === 4 ? (
        <div style={{ ...S.header, paddingTop:24, paddingBottom:20 }}>
          <div style={{ fontSize:18, fontWeight:700, color:"white" }}>Payment Link</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>Sent to customer for completion</div>
        </div>
      ) : (
        <div style={{ ...S.header, paddingTop:24, paddingBottom:20 }}>
          <div style={{ fontSize:18, fontWeight:700, color:"white" }}>Transaction Status</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>Awaiting customer action</div>
        </div>
      )}

      <div style={{ padding:"14px 16px 0" }}>
        {step===1 && (
          <>
            <div style={S.card}>
              <div style={{ fontSize:13, fontWeight:700, color:DARK, marginBottom:14 }}>Customer Details</div>
              <div style={{ marginBottom:12 }}>
                <label style={S.label}>Customer Name (Same to be used in Invoice)</label>
                <input style={S.input} placeholder="Customer name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={S.label}>Mobile Number</label>
                <input style={S.input} placeholder="10-digit mobile" value={form.mobile} onChange={e => setForm({...form, mobile:e.target.value.replace(/\D/g,"").slice(0,10)})} type="tel" />
              </div>
              <div style={{ display:"flex", gap:6, marginTop:8, alignItems:"center", flexWrap:"wrap" }}>
                <span style={{ fontSize:10, color:MUT, fontWeight:600 }}>Try Demo:</span>
                <span onClick={() => setForm({...form, name:"Aditya Eligible", mobile:"9818886951", amount:"134900", category:"Smartphones", product:"iPhone 16 Pro Max 256GB"})} style={{ ...S.tag, padding:"2px 8px", fontSize:9, cursor:"pointer" }}>Eligible (Full)</span>
                <span onClick={() => setForm({...form, name:"Rohan Flex", mobile:"9818886952", amount:"134900", category:"Smartphones", product:"iPhone 16 Pro Max 256GB"})} style={{ ...S.tag, padding:"2px 8px", fontSize:9, cursor:"pointer" }}>SMS Limit (60-99%)</span>
                <span onClick={() => setForm({...form, name:"Karan Reject", mobile:"9818886953", amount:"134900", category:"Smartphones", product:"iPhone 16 Pro Max 256GB"})} style={{ ...S.tag, padding:"2px 8px", fontSize:9, cursor:"pointer" }}>Rejected (&lt;60%)</span>
              </div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize:13, fontWeight:700, color:DARK, marginBottom:14, display:"flex", alignItems:"center", gap:6 }}>
                <AppleLogo size={13} color={DARK} /> Product Details
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={S.label}>Apple Category</label>
                <select style={S.select} value={form.category} onChange={e => handleCategoryChange(e.target.value)}>
                  <option value="">Select category</option>
                  {UNI_CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {form.category && form.category !== "Other Accessories" ? (
                <div style={{ marginBottom:12 }}>
                  <label style={S.label}>Model</label>
                  <select style={S.select} value={form.product} onChange={e => handleProductChange(e.target.value)}>
                    <option value="">Select model</option>
                    {products.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              ) : form.category === "Other Accessories" ? (
                <div style={{ marginBottom:12 }}>
                  <label style={S.label}>Product Name</label>
                  <input style={S.input} placeholder="e.g. MagSafe Charger" value={form.product} onChange={e => setForm({...form, product:e.target.value})} />
                </div>
              ) : null}
              <div style={{ marginBottom:12 }}>
                <label style={S.label}>Product Price (₹)</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontWeight:700, color:MUT }}>₹</span>
                  <input style={{ ...S.input, paddingLeft:28 }} placeholder="0" value={form.amount} onChange={e => setForm({...form, amount:e.target.value.replace(/\D/g,"")})} type="tel" />
                </div>
                {form.product && getProductsDatabase().prices[form.product] && <div style={{ fontSize:11, color:MUT, marginTop:4 }}>MRP: {fmt(getProductsDatabase().prices[form.product])}</div>}
              </div>
              {form.category === "Smartphones" && (
                <div onClick={() => setUseSubscription(s => !s)} style={{ borderRadius:12, padding:14, border:`2px solid ${useSubscription?DARK:BD}`, background: useSubscription?DARK:GREY, cursor:"pointer", transition:"all 0.2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:22, height:22, borderRadius:6, border:`2px solid ${useSubscription?ORANGE:BD}`, background: useSubscription?ORANGE:"white", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {useSubscription && <span style={{ color:"white", fontSize:13, fontWeight:900 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color: useSubscription?"white":DARK }}>⭐ iPhone Subscription Plan</div>
                      <div style={{ fontSize:11, color: useSubscription?"rgba(255,255,255,0.5)":MUT }}>Use 12 months → upgrade or continue 24-mo EMI</div>
                    </div>
                    <span style={{ ...S.tag, marginLeft:"auto", flexShrink:0 }}>NEW</span>
                  </div>
                </div>
              )}
            </div>
            <button style={{ ...S.primaryBtn, opacity: form.name && form.mobile && form.amount ? 1 : 0.5 }} onClick={checkEligibility} disabled={loading || !form.name || !form.mobile || !form.amount}>
              {loading ? "Checking Eligibility..." : "Check Eligibility →"}
            </button>
          </>
        )}

        {step===2 && (
          <>
            {!eligType && (
              <div style={{ ...S.card, textAlign:"center", padding:"30px 20px" }}>
                <div style={{ fontSize:34, marginBottom:10 }}>🔍</div>
                <div style={{ fontSize:15, fontWeight:700, color:DARK, marginBottom:6 }}>Running Bureau Checks</div>
                <div style={{ fontSize:12, color:MUT, marginBottom:18 }}>CIBIL · CRIF · DPD in progress…</div>
                <div style={S.pb}><div style={{ ...S.pf(75), animation:"grow 2s" }} /></div>
              </div>
            )}

            {(eligType === "FULL" || eligType === "KYC_FULL" || eligType === "KYC_PARTIAL") && (
              <>
                <div style={{ ...S.card, background:"#E6FAF4", border:`1.5px solid ${OK}40`, textAlign:"center", padding:20, marginBottom:12 }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
                  {eligType === "KYC_PARTIAL" ? (
                    <>
                      <div style={{ fontSize:15, fontWeight:800, color:OK }}>Congratulations!</div>
                      <div style={{ fontSize:13, color:MUT, marginTop:4 }}>Customer limit approved</div>
                      <div style={{ fontSize:24, fontWeight:900, color:DARK, marginTop:4 }}>{fmt(approvedLimit)}</div>
                      <div style={{ fontSize:11, color:WARN, marginTop:6, background:"#FFF3E0", borderRadius:8, padding:"5px 12px" }}>
                        Mandatory downpayment: {fmt(productAmount-approvedLimit)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize:15, fontWeight:800, color:OK, marginBottom:6 }}>Fully Approved</div>
                      <div style={{ fontSize:16, fontWeight:800, color:DARK, marginBottom:4 }}>Customer is eligible for full EMI</div>
                      <div style={{ fontSize:11, color:MUT }}>Pre-approved for the full product amount</div>
                    </>
                  )}
                </div>

                {AC_ELIGIBLE.includes(form.category) && (
                  <div style={{ ...S.card, border: acEnabled?`2px solid ${DARK}`:`1.5px solid ${BD}`, padding:16 }}>
                    <div style={{ ...S.row, marginBottom: acEnabled?14:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:38, height:38, background:DARK, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <AppleLogo size={18} color="white" />
                        </div>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:DARK }}>AppleCare+</div>
                          <div style={{ fontSize:11, color:MUT }}>Extended warranty & accidental cover</div>
                        </div>
                      </div>
                      <div onClick={() => { setAcEnabled(e => !e); if (acEnabled) setAcPlan(""); }}
                        style={{ width:44, height:26, borderRadius:13, background: acEnabled?DARK:BD, cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
                        <div style={{ width:20, height:20, borderRadius:"50%", background:"white", position:"absolute", top:3, left: acEnabled?21:3, transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
                      </div>
                    </div>
                    {acEnabled && (
                      <>
                        <label style={S.label}>Select AppleCare+ Plan</label>
                        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                          {[{val:"1",label:"1 Year",sub:"₹8,000"},{val:"2",label:"2 Years",sub:"₹14,000"}].map(p => (
                            <div key={p.val} onClick={() => setAcPlan(p.val)} style={{ flex:1, textAlign:"center", padding:"12px 8px", borderRadius:12, border:`2px solid ${acPlan===p.val?DARK:BD}`, background: acPlan===p.val?DARK:"white", cursor:"pointer" }}>
                              <div style={{ fontSize:13, fontWeight:700, color: acPlan===p.val?"white":DARK }}>{p.label}</div>
                              <div style={{ fontSize:12, color: acPlan===p.val?"rgba(255,255,255,0.7)":MUT, marginTop:2 }}>{p.sub}</div>
                            </div>
                          ))}
                        </div>
                        {acPlan && (
                          <div style={{ background:GREY, borderRadius:10, padding:"10px 14px", ...S.row }}>
                            <span style={{ fontSize:12, color:MUT }}>AppleCare+ bundled in loan</span>
                            <span style={{ fontSize:14, fontWeight:700, color:DARK }}>+ {fmt(acCost)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {acEnabled && acPlan && (
                  <div style={{ background:DARK, borderRadius:12, padding:14, marginBottom:12 }}>
                    <div style={S.row}>
                      <div>
                        <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)" }}>Updated Total (incl. AppleCare+)</div>
                        <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:2 }}>{fmt(baseAmount)} + {fmt(acCost)} AppleCare+</div>
                      </div>
                      <div style={{ fontSize:20, fontWeight:900, color:"white" }}>{fmt(productAmount)}</div>
                    </div>
                  </div>
                )}

                <div style={S.card}>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Eligible Lenders</div>
                  <div style={{ fontSize:12, color:MUT, marginBottom:16 }}>3 lenders available · choose on the next step</div>
                  {LENDERS.map((l, idx) => (
                    <div key={l.name} style={{
                      display:"flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: idx === LENDERS.length - 1 ? "none" : `1px solid ${BD}`
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>🏦</span>
                        <span style={{ fontSize:14, fontWeight:700, color:DARK }}>{l.name}</span>
                      </div>
                      <div style={{ fontSize:12, color:MUT }}>
                        {l.roi.toFixed(2)}% p.a. · {l.sla.toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>

                <button style={S.primaryBtn} onClick={() => setStep(3)}>
                  Continue to EMI Plans →
                </button>
                <button style={{ ...S.outlineBtn, marginTop:10 }} onClick={() => setGoPG(true)}>💳 Pay Full Amount via UNI PG</button>
                <div style={{ textAlign:"center", marginTop:12 }}>
                  <span style={{ fontSize:12, color:MUT }}>Not pre-approved? </span>
                  <span style={{ fontSize:12, color:ORANGE, fontWeight:600, cursor:"pointer" }} onClick={() => setEligType(null)}>Try KYC Flow →</span>
                </div>
              </>
            )}

            {eligType === "SMS_LIMIT_PENDING" && (
              <>
                <div style={S.card}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
                    <div style={{ fontSize:24 }}>💬</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:DARK }}>FlexMoney Bureau Check</div>
                      <div style={{ fontSize:11, color:MUT }}>Limit Verification Required</div>
                    </div>
                  </div>
                  <div style={{ background:"#FFF8E7", border:`1px solid ${WARN}30`, borderRadius:10, padding:12, marginBottom:14 }}>
                    <div style={{ fontSize:12, color:WARN, fontWeight:600, lineHeight:1.5 }}>
                      Customer has partial eligibility (60% to 99%). FlexMoney has sent an SMS with their credit limit to <strong>+91 {form.mobile}</strong>.
                    </div>
                  </div>
                  <div style={{ background:DARK, borderRadius:12, padding:12, marginBottom:16, color:"white" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:4 }}>Simulated Customer SMS</div>
                    <div style={{ fontSize:12, lineHeight:1.5, fontStyle:"italic" }}>
                      "Dear Customer, your eligible limit for BytePé purchase is <strong>{fmt(Math.round(productAmount * 0.75))}</strong>. Share this limit with the promoter to proceed. - FlexMoney"
                    </div>
                  </div>
                  <label style={S.label}>Enter limit shared by customer *</label>
                  <div style={{ position:"relative", marginBottom:16 }}>
                    <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontWeight:700, color:MUT }}>₹</span>
                    <input style={{ ...S.input, paddingLeft:28 }} placeholder="Enter limit (e.g. 90000)" value={enteredLimit} onChange={e => setEnteredLimit(e.target.value.replace(/\D/g,""))} type="tel" />
                  </div>
                  <button style={{ ...S.primaryBtn, opacity: enteredLimit ? 1 : 0.5 }} onClick={submitSmsLimit} disabled={!enteredLimit || loading}>
                    {loading ? "Verifying..." : "Verify & Proceed"}
                  </button>
                </div>
                {enteredLimit && parseInt(enteredLimit) > 0 && (
                  <div style={S.card}>
                    <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Eligible Lenders</div>
                    <div style={{ fontSize:12, color:MUT, marginBottom:16 }}>3 lenders available · choose on the next step</div>
                    {LENDERS.map((l, idx) => (
                      <div key={l.name} style={{
                        display:"flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 0",
                        borderBottom: idx === LENDERS.length - 1 ? "none" : `1px solid ${BD}`
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:16 }}>🏦</span>
                          <span style={{ fontSize:14, fontWeight:700, color:DARK }}>{l.name}</span>
                        </div>
                        <div style={{ fontSize:12, color:MUT }}>
                          {l.roi.toFixed(2)}% p.a. · {l.sla.toLowerCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {eligType === "SMS_LIMIT_APPROVED" && (
              <>
                <div style={{ ...S.card, background:"#E6FAF4", border:`1.5px solid ${OK}40`, textAlign:"center", padding:16, marginBottom:12 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:OK }}>✓ Eligible Limit Verified: {fmt(approvedLimit)}</div>
                </div>
                <div style={S.card}>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:12 }}>Mandatory Downpayment Flow</div>
                  <div style={{ ...S.row, paddingBottom:8, borderBottom:`1px solid ${BD}`, marginBottom:8 }}>
                    <span style={{ fontSize:12, color:MUT }}>Product Value</span>
                    <span style={{ fontSize:12, fontWeight:600, color:DARK }}>{fmt(productAmount)}</span>
                  </div>
                  <div style={{ ...S.row, paddingBottom:8, borderBottom:`1px solid ${BD}`, marginBottom:8 }}>
                    <span style={{ fontSize:12, color:MUT }}>Approved Limit</span>
                    <span style={{ fontSize:12, fontWeight:600, color:DARK }}>{fmt(approvedLimit)}</span>
                  </div>
                  <div style={{ ...S.row, marginBottom:12 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:ORANGE }}>Mandatory Downpayment</span>
                    <span style={{ fontSize:15, fontWeight:900, color:ORANGE }}>{fmt(mandatoryDP)}</span>
                  </div>
                  {!dpPaid ? (
                    <div>
                      <div style={{ fontSize:12, color:MUT, marginBottom:8 }}>Collect downpayment:</div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button style={{ ...S.outlineBtn, flex:1, fontSize:13, padding:"12px 8px" }} onClick={() => handlePayDP("store")} disabled={loading}>🏪 Pay at Store</button>
                        <button style={{ ...S.primaryBtn, flex:1, fontSize:13, padding:"12px 8px" }} onClick={() => handlePayDP("UNI PG")} disabled={loading}>💳 Pay via UNI PG</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:"flex", alignItems:"center", gap:8, background:"#E6FAF4", borderRadius:10, padding:12 }}>
                      <span>✅</span>
                      <span style={{ fontSize:12, fontWeight:600, color:OK }}>
                        {fmt(mandatoryDP)} {dpMethod==="store"?"collected at store":"paid via UNI PG"} Successfully!
                      </span>
                    </div>
                  )}
                </div>

                <div style={S.card}>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Eligible Lenders</div>
                  <div style={{ fontSize:12, color:MUT, marginBottom:16 }}>3 lenders available · choose on the next step</div>
                  {LENDERS.map((l, idx) => (
                    <div key={l.name} style={{
                      display:"flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: idx === LENDERS.length - 1 ? "none" : `1px solid ${BD}`
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:16 }}>🏦</span>
                        <span style={{ fontSize:14, fontWeight:700, color:DARK }}>{l.name}</span>
                      </div>
                      <div style={{ fontSize:12, color:MUT }}>
                        {l.roi.toFixed(2)}% p.a. · {l.sla.toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>

                <button style={{ ...S.primaryBtn, opacity: dpPaid ? 1 : 0.5 }} onClick={() => setStep(3)} disabled={!dpPaid}>
                  Continue to EMI Plans →
                </button>
              </>
            )}

            {eligType === "REJECTED" && (
              <div style={S.card}>
                <div style={{ textAlign:"center", padding:"12px 0" }}>
                  <div style={{ fontSize:38, marginBottom:8 }}>❌</div>
                  <div style={{ background:"#FFEEEC", color:ERR, borderRadius:20, padding:"4px 16px", fontSize:13, fontWeight:700, display:"inline-block" }}>Not Approved</div>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginTop:12, marginBottom:6 }}>Unable to offer EMI</div>
                  <div style={{ fontSize:12, color:MUT, marginBottom:20 }}>Customer's eligibility is less than 60% of the product value.</div>
                </div>
                <button style={S.primaryBtn} onClick={() => setGoPG(true)}>💳 Pay Full Amount via UNI PG</button>
                <button style={{ ...S.outlineBtn, marginTop:10 }} onClick={onBack}>Back to Dashboard</button>
              </div>
            )}



            {eligType===null && !loading && (
              <div style={S.card}>
                <div style={{ fontSize:13, fontWeight:700, color:DARK, marginBottom:4 }}>Fresh KYC Check</div>
                <div style={{ fontSize:12, color:MUT, marginBottom:16 }}>Run CIBIL + CRIF with customer PAN & DOB</div>
                <div style={{ marginBottom:12 }}><label style={S.label}>PAN Number *</label><input style={S.input} placeholder="ABCDE1234F" value={kycForm.pan} onChange={e => setKycForm({...kycForm, pan:e.target.value.toUpperCase().slice(0,10)})} /></div>
                <div style={{ marginBottom:14 }}><label style={S.label}>Date of Birth *</label><input style={S.input} type="date" value={kycForm.dob} onChange={e => setKycForm({...kycForm, dob:e.target.value})} /></div>
                <div style={{ background:GREY, borderRadius:10, padding:12, marginBottom:16, fontSize:12, color:MUT }}>🔒 Bureau check won't impact credit score. (Test: PAN A=Full · B=Partial · Other=Reject)</div>
                <button style={{ ...S.primaryBtn, opacity: kycForm.pan.length===10&&kycForm.dob?1:0.5 }} onClick={checkKYC} disabled={loading||kycForm.pan.length<10||!kycForm.dob}>
                  {loading?"Running Bureau Check...":"Run CIBIL + CRIF →"}
                </button>
              </div>
            )}
            {eligType==="KYC_NONE" && (
              <div style={S.card}>
                <div style={{ textAlign:"center", padding:"12px 0" }}>
                  <div style={{ fontSize:38, marginBottom:8 }}>❌</div>
                  <div style={{ background:"#FFEEEC", color:ERR, borderRadius:20, padding:"4px 16px", fontSize:13, fontWeight:700, display:"inline-block" }}>Not Approved</div>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK, marginTop:12, marginBottom:6 }}>Unable to offer EMI</div>
                  <div style={{ fontSize:12, color:MUT, marginBottom:20 }}>Customer does not meet current criteria</div>
                </div>
                <button style={S.primaryBtn} onClick={() => setGoPG(true)}>💳 Pay Full Amount via UNI PG</button>
                <button style={{ ...S.outlineBtn, marginTop:10 }} onClick={onBack}>Back to Dashboard</button>
              </div>
            )}
          </>
        )}

        {step===3 && (
          <>
            {/* 1. EMI Type Card */}
            <div style={S.card}>
              <div style={{ ...S.row, marginBottom:4 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:DARK }}>EMI Type</div>
                  <div style={{ fontSize:11, color:MUT, marginTop:2 }}>No Cost is subvented by Apple / UNI Store</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:0, background:GREY, borderRadius:30, padding:3, border:`1.5px solid ${BD}` }}>
                  <button onClick={() => { if (ncEligible) { setEmiType("nocost"); setTenure(3); setExtraDP(0); } }} disabled={!ncEligible}
                    style={{ display:"flex", alignItems:"center", gap:5, background: emiType==="nocost" ? OK : "transparent", color: emiType==="nocost" ? "white" : ncEligible ? MUT : BD, border:"none", borderRadius:26, padding:"6px 12px", fontSize:11, fontWeight:700, cursor: ncEligible?"pointer":"not-allowed", transition:"all 0.2s", whiteSpace:"nowrap", opacity: ncEligible ? 1 : 0.45 }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background: emiType==="nocost" ? "white" : ncEligible ? OK : BD, display:"inline-block", flexShrink:0 }} />
                    No Cost
                  </button>
                  <button onClick={() => { setEmiType("regular"); setTenure(12); setExtraDP(0); }}
                    style={{ display:"flex", alignItems:"center", gap:5, background: emiType==="regular" ? ORANGE : "transparent", color: emiType==="regular" ? "white" : MUT, border:"none", borderRadius:26, padding:"6px 12px", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.2s", whiteSpace:"nowrap" }}>
                    <span style={{ width:8, height:8, borderRadius:"50%", background: emiType==="regular" ? "white" : ORANGE, display:"inline-block", flexShrink:0 }} />
                    Standard
                  </button>
                </div>
              </div>
              {!ncEligible && (
                <div style={{ background:"#FFF8E7", border:`1px solid ${WARN}40`, borderRadius:10, padding:"8px 12px", marginTop:8, display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14 }}>⚠️</span>
                  <span style={{ fontSize:12, color:WARN, fontWeight:600 }}>No Cost EMI not available for this customer</span>
                </div>
              )}
            </div>

            {/* 2. Available Lenders Card */}
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Available Lenders</div>
              <div style={{ fontSize:11, color:MUT, marginBottom:12 }}>The customer picks any lender on the payment link - tap to preview EMIs</div>
              {LENDERS.map(l => {
                const isSelected = selectedLender.name === l.name;
                const lenderEmi = emiType === "nocost" ? calcNC(loanAmount, tenure) : calcEMI(loanAmount, l.roi, tenure);
                return (
                  <div key={l.name} onClick={() => setSelectedLender(l)} style={{
                    borderRadius: 12,
                    border: `2px solid ${isSelected ? ORANGE : BD}`,
                    background: isSelected ? OL : "#FAFBFC",
                    padding: "12px 14px",
                    marginBottom: 8,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${isSelected ? ORANGE : BD}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {isSelected && <div style={{ width:8, height:8, borderRadius:"50%", background:ORANGE }} />}
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:DARK }}>{l.name}</div>
                        <div style={{ fontSize:10, color:MUT, marginTop:2 }}>{l.roi.toFixed(2)}% p.a. · Disbursal {l.sla}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize:13, fontWeight:800, color:DARK }}>{fmt(lenderEmi)}<span style={{ fontSize:10, color:MUT, fontWeight:400 }}>/mo</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. Tenure Card */}
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:12 }}>Tenure</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[[3,6,9],[12,18,24]].map((row, ri) => (
                  <div key={ri} style={{ display:"flex", gap:8 }}>
                    {row.map(t => {
                      const isTenureSelected = tenure === t;
                      const tenureEmi = emiType === "nocost" ? calcNC(loanAmount, t) : calcEMI(loanAmount, selectedLender.roi, t);
                      return (
                        <div key={t} onClick={() => setTenure(t)} style={{
                          flex:1,
                          textAlign:"center",
                          padding:"10px 4px",
                          borderRadius:10,
                          border: `2px solid ${isTenureSelected ? (emiType==="nocost"?OK:ORANGE) : BD}`,
                          background: isTenureSelected ? (emiType==="nocost"?"#E6FAF4":OL) : "white",
                          cursor:"pointer",
                          transition:"all 0.15s"
                        }}>
                          <div style={{ fontSize:12, fontWeight:700, color:DARK }}>{t} mo</div>
                          <div style={{ fontSize:10, color: emiType==="nocost"?OK:ORANGE, fontWeight:600, marginTop:2 }}>{fmt(tenureEmi)}/mo</div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Downpayment Card */}
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:4 }}>Downpayment (Optional)</div>
              <div style={{ fontSize:11, color:MUT, marginBottom:10 }}>Paying upfront lowers the EMI</div>
              {isPartial && (
                <div style={{ ...S.row, marginBottom:10, background:GREY, borderRadius:10, padding:12 }}>
                  <span style={{ fontSize:12, color:MUT }}>Mandatory Downpayment</span>
                  <span style={{ fontSize:13, fontWeight:700, color:ERR }}>{fmt(mandatoryDP)}</span>
                </div>
              )}
              {emiType==="nocost" && ncEligible && ncDP > mandatoryDP && (
                <div style={{ ...S.row, marginBottom:10, background:"#E6FAF4", borderRadius:10, padding:12 }}>
                  <span style={{ fontSize:11, color:OK }}>Min. DP for No Cost EMI (10%)</span>
                  <span style={{ fontSize:12, fontWeight:700, color:OK }}>{fmt(ncDP)}</span>
                </div>
              )}
              <div style={{ position:"relative" }}>
                <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontWeight:700, color:MUT }}>₹</span>
                <input
                  style={{ ...S.input, paddingLeft:28 }}
                  placeholder="0"
                  value={extraDP||""}
                  onChange={e => {
                    const v = parseInt(e.target.value.replace(/\D/g,""))||0;
                    setExtraDP(Math.min(v, productAmount-mandatoryDP));
                  }}
                  type="tel"
                />
              </div>
            </div>

            {/* 5. MONTHLY EMI Black Card */}
            <div style={{ background:DARK, borderRadius:16, padding:18, marginBottom:12, color:"white" }}>
              <div style={{ ...S.row, marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:0.8 }}>MONTHLY EMI</div>
                  <div style={{ fontSize:28, fontWeight:900, color:"white", marginTop:2 }}>{fmt(emi)}<span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>/mo</span></div>
                </div>
                <div style={{ background: emiType==="nocost"?OK:ORANGE, borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, color:"white" }}>
                  {emiType==="nocost" ? "No Cost" : "Standard"}
                </div>
              </div>
              
              <div style={{ height:1, background:"rgba(255,255,255,0.1)", margin:"12px 0" }} />
              
              {[
                ["Product Value", fmt(productAmount)],
                ["Loan Amount", fmt(loanAmount)],
                ["Interest Rate", emiType==="nocost" ? "0.00% p.a." : `${selectedLender.roi.toFixed(2)}% p.a.`],
                ["Total Interest", fmt(totalInterest)],
                ["Total Payable", fmt(totalPayable)],
                ["Tenure", `${tenure} Months`],
                ["Lender (preview)", selectedLender.name],
                ["Program Fee", `${fmt(programFee)} → UNI Store`]
              ].map(([l, v]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:12 }}>
                  <span style={{ color:"rgba(255,255,255,0.4)" }}>{l}</span>
                  <span style={{ color:"white", fontWeight:700 }}>{v}</span>
                </div>
              ))}
              
              <div style={{ display:"flex", gap:6, alignItems:"center", marginTop:12, background:"rgba(255,255,255,0.05)", padding:"8px 12px", borderRadius:8 }}>
                <span style={{ fontSize:12 }}>ℹ️</span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.5)", lineHeight:1.3 }}>
                  This is a preview. The final lender & rate are chosen by the customer on the payment link.
                </span>
              </div>
            </div>

            {/* Note below card */}
            <div style={{ display:"flex", gap:6, padding:"0 4px", marginBottom:14 }}>
              <span style={{ fontSize:13 }}>📝</span>
              <span style={{ fontSize:11, color:MUT, lineHeight:1.4 }}>
                Customer will consent to loan terms, bureau access & eSign on the payment link.
              </span>
            </div>

            <button style={S.primaryBtn} onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setStep(4); }, 1200); }} disabled={loading}>
              {loading ? "Sending Payment Link..." : "Send Payment Link →"}
            </button>
          </>
        )}

        {step===4 && (
          <>
            <div style={{ ...S.card, background:"#E6FAF4", border:`1.5px solid ${OK}40`, textAlign:"center", padding:24 }}>
              <div style={{ display:"inline-flex", background:"#C2F3E3", width:48, height:48, borderRadius:"50%", alignItems:"center", justifyContent:"center", fontSize:24, marginBottom:12 }}>
                📲
              </div>
              <div style={{ fontSize:16, fontWeight:800, color:OK, marginBottom:8 }}>Link Sent!</div>
              <div style={{ fontSize:12, color:SEC, lineHeight:1.5, marginBottom:16 }}>
                A secure payment & eSign link has been sent to the customer's mobile. The customer can choose any eligible lender on the link to complete the EMI booking.
              </div>
              
              <div style={{ background:"white", border:`1px solid ${BD}`, borderRadius:10, padding:"12px 16px", fontSize:15, fontWeight:700, color:DARK, display:"inline-block", letterSpacing:0.5 }}>
                +91 {form.mobile}
              </div>
              
              <div style={{ marginTop:20, height:1, background:`${BD}` }} />
              
              <div style={{ fontSize:10, fontWeight:700, color:MUT, textTransform:"uppercase", letterSpacing:0.8, marginTop:16, marginBottom:10 }}>
                LENDERS THE CUSTOMER CAN PICK FROM
              </div>
              <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
                {LENDERS.map(l => (
                  <span key={l.name} style={{ background:"white", border:`1.5px solid ${BD}`, borderRadius:20, padding:"6px 12px", fontSize:11, fontWeight:600, color:DARK, display:"flex", alignItems:"center", gap:4 }}>
                    🏦 {l.name}
                  </span>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <div style={{ fontSize:13, fontWeight:700, color:DARK, marginBottom:12 }}>Order Summary</div>
              {[
                ["Customer", form.name],
                ["Product", form.product || "—"],
                ["Device Price", fmt(baseAmount)],
                ...(acCost > 0 ? [[`AppleCare+ (${acPlan}yr)`, fmt(acCost)]] : []),
                ["Loan Amount", fmt(loanAmount)],
                ["Monthly EMI", <span style={{ color:ORANGE, fontWeight:700 }}>~ {fmt(emi)} <span style={{ fontSize:10, fontWeight:400, color:MUT }}>(est.)</span></span>],
                ["Tenure", `${tenure} Months`],
                ["Lender", "Customer's choice on link"],
                ["Program Fee", `${fmt(programFee)} (to UNI Store)`]
              ].map(([l, v]) => (
                <div key={l} style={{ ...S.row, paddingBottom:9, marginBottom:9, borderBottom:`1px solid ${BD}` }}>
                  <span style={{ fontSize:11, color:MUT }}>{l}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:DARK }}>{v}</span>
                </div>
              ))}
            </div>

            <button style={S.primaryBtn} onClick={() => setStep(5)}>
              Track Transaction Status →
            </button>
          </>
        )}

        {step===5 && (
          <>
            <div style={{ ...S.card, textAlign:"center", padding:32 }}>
              <div style={{ display:"inline-flex", justifyContent:"center", alignItems:"center", marginBottom:16 }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: `3px solid ${OL}`,
                  borderTopColor: ORANGE,
                  animation: "spin 1s linear infinite"
                }} />
              </div>
              
              <div>
                <span style={{ ...S.warnTag, padding:"4px 12px", fontSize:11, borderRadius:12, marginBottom:12 }}>
                  ● Pending
                </span>
              </div>
              
              <div style={{ fontSize:16, fontWeight:800, color:DARK, marginTop:12, marginBottom:8 }}>
                Transaction Pending
              </div>
              <div style={{ fontSize:12, color:MUT, lineHeight:1.5 }}>
                Waiting for the customer to complete payment, KYC & eSign on the link sent to <strong>+91 {form.mobile}</strong>.
              </div>
            </div>

            <div style={{ ...S.card, background:"#FAFBFC", border:`1.5px dashed ${BD}`, padding:16, marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:MUT, textTransform:"uppercase", letterSpacing:0.8, marginBottom:12, textAlign:"center" }}>
                DEMO: SIMULATE OUTCOME
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button style={{ ...S.primaryBtn, background: OK, flex:1, padding:"12px 10px", fontSize:13, boxShadow:"none" }} onClick={() => setStep(6)}>
                  ✓ Mark Paid
                </button>
                <button style={{ ...S.outlineBtn, color: ERR, border:`2px solid ${ERR}`, flex:1, padding:"12px 10px", fontSize:13 }} onClick={() => setStep(7)}>
                  ✕ Mark Failed
                </button>
              </div>
            </div>

            <button style={S.outlineBtn} onClick={onSuccess}>
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PersonalLoanScreen({ onBack }) {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({ name:"", mobile:"", dob:"", pan:"", email:"", income:"", purpose:"", amount:"" });
  const [bank, setBank]   = useState({ accNo:"", ifsc:"", bankName:"" });
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(0);
  const [tenure, setTenure]     = useState(12);
  const roi = 14.5;
  const loanAmt = parseInt(form.amount) || 0;
  const emi = calcEMI(loanAmt, roi, tenure);

  if (step === 5) return (
    <div style={{ background:DARK, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
      <div style={{ width:80, height:80, background:OK, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:20, boxShadow:`0 0 0 16px ${OK}30` }}>✓</div>
      <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:8 }}>Loan Disbursed! 🎉</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:28, textAlign:"center" }}>Amount credited to {form.name}'s bank account within 2 hrs</div>
      <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:16, padding:20, width:"100%", marginBottom:24, border:"1px solid rgba(255,255,255,0.1)" }}>
        {[["Customer",form.name],["Loan Amount",fmt(loanAmt)],["Monthly EMI",fmt(emi)],["Tenure",`${tenure} Months`],["Bank",bank.bankName||"—"],["Disbursal","Direct to Bank Account"]].map(([l,v])=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:10, paddingBottom:10, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            <span style={{ color:"rgba(255,255,255,0.45)", fontSize:13 }}>{l}</span>
            <span style={{ color:"white", fontWeight:700, fontSize:13 }}>{v}</span>
          </div>
        ))}
      </div>
      <button style={S.primaryBtn} onClick={onBack}>Back to Dashboard</button>
    </div>
  );

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ background:`linear-gradient(135deg,#1E3A5F,#2563EB)`, padding:"20px 20px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <button onClick={step !== 1 ? () => setStep(s => s-1) : onBack} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"white", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:16 }}>←</button>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"white" }}>👤 Personal Loan</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)" }}>{["","Customer Details","Eligibility & Offer","Bank Account","eSign & Confirm"][step]}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {[1,2,3,4].map(s => <div key={s} style={{ flex:1, height:4, borderRadius:2, background: step>=s?"white":"rgba(255,255,255,0.2)" }} />)}
        </div>
      </div>
      <div style={{ padding:"16px 16px 0" }}>
        {step===1 && (
          <div style={S.card}>
            <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:16 }}>Customer & Loan Details</div>
            {[{k:"name",l:"Full Name (as per Aadhaar)",ph:"Full Name"},{k:"mobile",l:"Mobile Number",ph:"10-digit"},{k:"email",l:"Email",ph:"email@example.com"},{k:"pan",l:"PAN Number",ph:"ABCDE1234F"},{k:"income",l:"Monthly Income (₹)",ph:"e.g. 50000"},{k:"amount",l:"Loan Amount Required (₹)",ph:"e.g. 200000"}].map(f => (
              <div key={f.k} style={{ marginBottom:14 }}>
                <label style={S.label}>{f.l}</label>
                <input style={S.input} placeholder={f.ph} value={form[f.k]} onChange={e => setForm({...form,[f.k]:f.k==="pan"?e.target.value.toUpperCase().slice(0,10):e.target.value})} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Purpose of Loan</label>
              <select style={S.select} value={form.purpose} onChange={e => setForm({...form, purpose:e.target.value})}>
                <option value="">Select purpose</option>
                {["Medical Emergency","Home Renovation","Education","Wedding","Travel","Debt Consolidation","Other"].map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <button style={{ background:`linear-gradient(135deg,#1E3A5F,#2563EB)`, color:"white", border:"none", borderRadius:12, padding:"15px 20px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%", boxShadow:`0 4px 16px #2563EB40` }}
              onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setApproved(loanAmt); setStep(2); }, 2500); }}
              disabled={!form.name||!form.pan||!form.amount}>
              {loading?"Checking Eligibility...":"Check Eligibility →"}
            </button>
          </div>
        )}
        {step===2 && (
          <>
            <div style={{ ...S.card, background:BLUE_L, border:`1.5px solid ${BLUE}40`, textAlign:"center", padding:20 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
              <div style={{ fontSize:15, fontWeight:800, color:BLUE }}>Congratulations!</div>
              <div style={{ fontSize:13, color:SEC, marginTop:4 }}>Approved Loan Amount</div>
              <div style={{ fontSize:28, fontWeight:900, color:DARK, marginTop:4 }}>{fmt(approved)}</div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:12 }}>Select Tenure</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
                {[6,12,18,24,36,48].map(t => (
                  <div key={t} onClick={() => setTenure(t)} style={{ flex:"1 1 calc(33% - 8px)", textAlign:"center", padding:"10px 4px", borderRadius:10, border:`2px solid ${tenure===t?BLUE:BD}`, background: tenure===t?BLUE_L:"white", cursor:"pointer" }}>
                    <div style={{ fontSize:13, fontWeight:700, color: tenure===t?BLUE:DARK }}>{t} mo</div>
                    <div style={{ fontSize:11, color:BLUE, fontWeight:600 }}>{fmt(calcEMI(loanAmt,roi,t))}/mo</div>
                  </div>
                ))}
              </div>
              <div style={{ background:DARK, borderRadius:12, padding:14 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>Monthly EMI</div>
                <div style={{ fontSize:26, fontWeight:900, color:"white" }}>{fmt(emi)}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{roi}% p.a. · {tenure} months · Total: {fmt(emi*tenure)}</div>
              </div>
            </div>
            <button style={{ background:`linear-gradient(135deg,#1E3A5F,#2563EB)`, color:"white", border:"none", borderRadius:12, padding:"15px 20px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%", boxShadow:`0 4px 16px #2563EB40` }} onClick={() => setStep(3)}>
              Proceed →
            </button>
          </>
        )}
        {step===3 && (
          <>
            <div style={{ ...S.card, background:BLUE_L, border:`1.5px solid ${BLUE}30` }}>
              <div style={{ fontSize:13, fontWeight:700, color:BLUE, marginBottom:4 }}>ℹ️ Disbursement Info</div>
              <div style={{ fontSize:12, color:SEC }}>Amount will be credited DIRECTLY to the customer's bank account — not the merchant.</div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:16 }}>Bank Account Details</div>
              {[{k:"accNo",l:"Account Number",ph:"Enter account number"},{k:"ifsc",l:"IFSC Code",ph:"e.g. HDFC0001234"},{k:"bankName",l:"Bank Name",ph:"e.g. HDFC Bank"}].map(f=>(
                <div key={f.k} style={{ marginBottom:14 }}><label style={S.label}>{f.l}</label><input style={S.input} placeholder={f.ph} value={bank[f.k]} onChange={e => setBank({...bank,[f.k]:e.target.value})} /></div>
              ))}
            </div>
            <button style={{ background:`linear-gradient(135deg,#1E3A5F,#2563EB)`, color:"white", border:"none", borderRadius:12, padding:"15px 20px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%", opacity: bank.accNo&&bank.ifsc?1:0.5 }}
              onClick={() => setStep(4)} disabled={!bank.accNo||!bank.ifsc}>
              eSign & Confirm Loan →
            </button>
          </>
        )}
        {step===4 && (
          <div style={S.card}>
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:42, marginBottom:12 }}>✍️</div>
              <div style={{ fontSize:16, fontWeight:700, color:DARK, marginBottom:8 }}>Customer eSign Required</div>
              <div style={{ fontSize:13, color:MUT, marginBottom:20 }}>OTP eSign link sent to {form.mobile || "customer's mobile"}</div>
            </div>
            <button style={{ background:`linear-gradient(135deg,#1E3A5F,#2563EB)`, color:"white", border:"none", borderRadius:12, padding:"15px 20px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%" }}
              onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setStep(5); }, 1500); }}>
              {loading?"Processing...":"Confirm Disbursal ✓"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BusinessLoanScreen({ onBack }) {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({ shopName:"", ownerName:"", mobile:"", pan:"", gst:"", vintage:"", turnover:"", amount:"", purpose:"" });
  const [bank, setBank]   = useState({ accNo:"", ifsc:"" });
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(0);
  const [tenure, setTenure] = useState(12);
  const roi = 16;
  const loanAmt = parseInt(form.amount) || 0;
  const emi = calcEMI(loanAmt, roi, tenure);

  if (step === 4) return (
    <div style={{ background:DARK, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32 }}>
      <div style={{ width:80, height:80, background:OK, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:20, boxShadow:`0 0 0 16px ${OK}30` }}>✓</div>
      <div style={{ fontSize:22, fontWeight:900, color:"white", marginBottom:8 }}>Loan Sanctioned! 🎉</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)", marginBottom:28, textAlign:"center" }}>Disbursed to {form.shopName}'s current account</div>
      <button style={S.primaryBtn} onClick={onBack}>Back to Dashboard</button>
    </div>
  );

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ background:`linear-gradient(135deg,#064E3B,#059669)`, padding:"20px 20px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <button onClick={step !== 1 ? () => setStep(s => s-1) : onBack} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"white", borderRadius:10, width:36, height:36, cursor:"pointer", fontSize:16 }}>←</button>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:"white" }}>🏪 Business Loan</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)" }}>{["","Business Details","Offer & Bank","eSign"][step]}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {[1,2,3].map(s => <div key={s} style={{ flex:1, height:4, borderRadius:2, background: step>=s?"white":"rgba(255,255,255,0.2)" }} />)}
        </div>
      </div>
      <div style={{ padding:"16px 16px 0" }}>
        {step===1 && (
          <div style={S.card}>
            <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:16 }}>Business & Financial Details</div>
            {[{k:"shopName",l:"Shop / Business Name",ph:"Business name"},{k:"ownerName",l:"Owner Full Name",ph:"Full name"},{k:"mobile",l:"Mobile Number",ph:"10-digit"},{k:"pan",l:"PAN (Owner)",ph:"ABCDE1234F"},{k:"gst",l:"GST Number (Optional)",ph:"27AABCU9603R1ZX"},{k:"turnover",l:"Annual Turnover (₹)",ph:"e.g. 1200000"},{k:"amount",l:"Loan Amount Required (₹)",ph:"e.g. 500000"}].map(f=>(
              <div key={f.k} style={{ marginBottom:14 }}><label style={S.label}>{f.l}</label><input style={S.input} placeholder={f.ph} value={form[f.k]} onChange={e => setForm({...form,[f.k]:e.target.value})} /></div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Business Vintage</label>
              <select style={S.select} value={form.vintage} onChange={e => setForm({...form, vintage:e.target.value})}>
                <option value="">Select vintage</option>
                {["Less than 1 year","1–2 years","2–5 years","5+ years"].map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <button style={{ background:`linear-gradient(135deg,#064E3B,#059669)`, color:"white", border:"none", borderRadius:12, padding:"15px 20px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%", opacity: form.shopName&&form.pan&&form.amount?1:0.5 }}
              onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setApproved(loanAmt); setStep(2); }, 2500); }}
              disabled={!form.shopName||!form.pan||!form.amount}>
              {loading?"Checking Eligibility...":"Check Business Eligibility →"}
            </button>
          </div>
        )}
        {step===2 && (
          <>
            <div style={{ ...S.card, background:"#ECFDF5", border:"1.5px solid #059669", textAlign:"center", padding:20 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>🎉</div>
              <div style={{ fontSize:15, fontWeight:800, color:"#059669" }}>Business Loan Approved!</div>
              <div style={{ fontSize:28, fontWeight:900, color:DARK, marginTop:8 }}>{fmt(approved)}</div>
            </div>
            <div style={S.card}>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:12 }}>Select Tenure</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
                {[6,12,18,24,36].map(t => (
                  <div key={t} onClick={() => setTenure(t)} style={{ flex:"1 1 calc(33% - 8px)", textAlign:"center", padding:"10px 4px", borderRadius:10, border:`2px solid ${tenure===t?"#059669":BD}`, background: tenure===t?"#ECFDF5":"white", cursor:"pointer" }}>
                    <div style={{ fontSize:13, fontWeight:700, color: tenure===t?"#059669":DARK }}>{t} mo</div>
                    <div style={{ fontSize:11, color:"#059669", fontWeight:600 }}>{fmt(calcEMI(loanAmt,roi,t))}/mo</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:DARK, marginBottom:12 }}>Current Account Details</div>
              {[{k:"accNo",l:"Account Number",ph:"Current account number"},{k:"ifsc",l:"IFSC Code",ph:"e.g. HDFC0001234"}].map(f=>(
                <div key={f.k} style={{ marginBottom:14 }}><label style={S.label}>{f.l}</label><input style={S.input} placeholder={f.ph} value={bank[f.k]} onChange={e => setBank({...bank,[f.k]:e.target.value})} /></div>
              ))}
            </div>
            <button style={{ background:`linear-gradient(135deg,#064E3B,#059669)`, color:"white", border:"none", borderRadius:12, padding:"15px 20px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%", opacity: bank.accNo&&bank.ifsc?1:0.5 }}
              onClick={() => setStep(3)} disabled={!bank.accNo||!bank.ifsc}>
              Confirm & eSign →
            </button>
          </>
        )}
        {step===3 && (
          <div style={S.card}>
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:42, marginBottom:12 }}>✍️</div>
              <div style={{ fontSize:16, fontWeight:700, color:DARK, marginBottom:8 }}>Business Loan eSign</div>
              <div style={{ fontSize:13, color:MUT, marginBottom:20 }}>Sanction letter + eSign link sent to {form.mobile || "registered mobile"}</div>
            </div>
            <button style={{ background:`linear-gradient(135deg,#064E3B,#059669)`, color:"white", border:"none", borderRadius:12, padding:"15px 20px", fontSize:15, fontWeight:700, cursor:"pointer", width:"100%" }}
              onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setStep(4); }, 1500); }}>
              {loading?"Processing...":"Confirm Disbursal ✓"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionsScreen({ isUNI, retailerMobile }) {
  const [txns, setTxns] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const updateTxns = () => {
      const allTxns = JSON.parse(localStorage.getItem("bytepe_sales") || "[]");
      const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
      const currentPartner = partners.find(p => p.phone === retailerMobile);
      
      let isParent = false;
      let regId = "";
      if (currentPartner) {
        regId = currentPartner.regId;
        if (currentPartner.commercials && currentPartner.commercials.isParent) isParent = true;
        if (currentPartner.remarks && currentPartner.remarks.includes("[IsParent: true]")) isParent = true;
      }
      
      let allowedMobiles = [retailerMobile];
      if (isParent) {
        const childPartners = partners.filter(p => {
          if (p.commercials && p.commercials.parentId === regId) return true;
          if (p.remarks && p.remarks.includes(`[ParentId: ${regId}]`)) return true;
          return false;
        });
        childPartners.forEach(p => {
          if (p.phone) allowedMobiles.push(p.phone);
        });
      }
      
      const filtered = allTxns.filter(t => allowedMobiles.includes(t.retailerMobile));
      setTxns(filtered);
    };
    updateTxns();
    window.addEventListener('storage', updateTxns);
    window.addEventListener('bytepe_sales_updated', updateTxns);
    return () => {
      window.removeEventListener('storage', updateTxns);
      window.removeEventListener('bytepe_sales_updated', updateTxns);
    };
  }, [retailerMobile]);

  const filteredTxns = txns.filter(t => 
    t.customer.toLowerCase().includes(query.toLowerCase()) ||
    t.id.toLowerCase().includes(query.toLowerCase()) ||
    t.product.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ paddingBottom:80 }}>
      <div style={S.header}>
        <div style={{ fontSize:20, fontWeight:800, color:"white", marginBottom:4 }}>Transactions</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)" }}>{isUNI ? "Apple finance sales" : "All financed sales"}</div>
      </div>
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ ...S.card, padding:"10px 14px", marginBottom:14 }}>
          <input style={{ ...S.input, background:"transparent", border:"none", padding:"4px 0", fontSize:14 }} 
            placeholder="🔍  Search customer, product or ID…" 
            value={query}
            onChange={e => setQuery(e.target.value)} />
        </div>
        {filteredTxns.map(t => (
          <div key={t.id} style={{ ...S.card, marginBottom:10 }}>
            <div style={{ ...S.row, marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:40, height:40, background: isUNI?DARK:OL, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize: isUNI?0:18 }}>
                  {isUNI ? <AppleLogo size={18} color="white" /> : t.icon}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:DARK }}>{t.customer}</div>
                  <div style={{ fontSize:10, color:MUT }}>{t.id} · {t.date}</div>
                </div>
              </div>
              <span style={t.status==="Active"?S.okTag:{...S.tag, background:GREY, color:MUT}}>{t.status}</span>
            </div>
            <div style={{ fontSize:12, color:MUT, marginBottom: isUNI&&t.ac&&t.ac!=="—"?4:8 }}>{t.product}</div>
            {isUNI && t.ac && t.ac !== "—" && <div style={{ fontSize:11, color:OK, fontWeight:600, marginBottom:8 }}>✓ {t.ac}</div>}
            <div style={S.divider} />
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div><div style={{ fontSize:10, color:MUT }}>Loan</div><div style={{ fontSize:13, fontWeight:700, color:DARK }}>{fmt(t.amount)}</div></div>
              <div style={{ textAlign:"center" }}><div style={{ fontSize:10, color:MUT }}>EMI</div><div style={{ fontSize:13, fontWeight:700, color:DARK }}>{fmt(t.emi)}</div></div>
              <div style={{ textAlign:"right" }}><div style={{ fontSize:10, color:MUT }}>Tenure</div><div style={{ fontSize:13, fontWeight:700, color:DARK }}>{t.tenure} mo</div></div>
            </div>
            <div style={{ marginTop:8, fontSize:11, color:MUT }}>🏦 {t.lender}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsScreen({ isUNI, sales = [] }) {
  const totalVol = sales.filter(s => s.status === 'Active' || s.status === 'Completed').reduce((sum, s) => sum + s.amount, 0);
  const formattedTotal = "₹" + (totalVol / 100000).toFixed(1) + "L";
  
  const totalAttempts = sales.length;
  const activeTxns = sales.filter(s => s.status === 'Active' || s.status === 'Completed').length;
  const appRate = totalAttempts > 0 ? Math.round((activeTxns / totalAttempts) * 100) : 0;
  
  const acSales = sales.filter(s => s.ac && s.ac !== "—" && (s.status === 'Active' || s.status === 'Completed')).length;
  const acRate = activeTxns > 0 ? Math.round((acSales / activeTxns) * 100) : 0;

  const getMonthName = (dateStr) => {
    if (!dateStr) return "Jan";
    if (dateStr.includes("Jan") || dateStr.includes("-01-")) return "Jan";
    if (dateStr.includes("Feb") || dateStr.includes("-02-")) return "Feb";
    if (dateStr.includes("Mar") || dateStr.includes("-03-")) return "Mar";
    if (dateStr.includes("Apr") || dateStr.includes("-04-")) return "Apr";
    if (dateStr.includes("May") || dateStr.includes("-05-")) return "May";
    if (dateStr.includes("Jun") || dateStr.includes("-06-")) return "Jun";
    if (dateStr.includes("Jul") || dateStr.includes("-07-")) return "Jul";
    if (dateStr.includes("Aug") || dateStr.includes("-08-")) return "Aug";
    if (dateStr.includes("Sep") || dateStr.includes("-09-")) return "Sep";
    if (dateStr.includes("Oct") || dateStr.includes("-10-")) return "Oct";
    if (dateStr.includes("Nov") || dateStr.includes("-11-")) return "Nov";
    if (dateStr.includes("Dec") || dateStr.includes("-12-")) return "Dec";
    return "Jan";
  };

  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const monthlyData = {};
  months.forEach(m => monthlyData[m] = 0);
  sales.forEach(s => {
    if (s.status === 'Active' || s.status === 'Completed') {
      const m = getMonthName(s.date || s.createdAt);
      if (monthlyData[m] !== undefined) {
        monthlyData[m] += s.amount;
      }
    }
  });
  
  const maxVol = Math.max(...Object.values(monthlyData), 1);
  const bars = months.map(m => ({
    m,
    v: Math.max(10, Math.round((monthlyData[m] / maxVol) * 100))
  })).filter(b => monthlyData[b.m] > 0 || ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Jul"].includes(b.m)).slice(-6);

  const tenures = [3, 6, 12, 24];
  const counts = { 3:0, 6:0, 12:0, 24:0 };
  let activeCount = 0;
  sales.forEach(s => {
    if (s.status === 'Active' || s.status === 'Completed') {
      const t = Number(s.tenure);
      if (counts[t] !== undefined) {
        counts[t]++;
        activeCount++;
      }
    }
  });
  const tenureData = [
    { l: "12 Months", pct: activeCount > 0 ? Math.round((counts[12] / activeCount) * 100) : 45 },
    { l: "24 Months", pct: activeCount > 0 ? Math.round((counts[24] / activeCount) * 100) : 28 },
    { l: "6 Months", pct: activeCount > 0 ? Math.round((counts[6] / activeCount) * 100) : 17 },
    { l: "3 Months", pct: activeCount > 0 ? Math.round((counts[3] / activeCount) * 100) : 10 },
  ];

  const prodCounts = {};
  let activeUniCount = 0;
  sales.forEach(s => {
    if (s.status === 'Active' || s.status === 'Completed') {
      const p = s.product || "Other";
      prodCounts[p] = (prodCounts[p] || 0) + 1;
      activeUniCount++;
    }
  });
  const sortedProds = Object.entries(prodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  
  let mappedPct = 0;
  const productData = sortedProds.map(([name, count]) => {
    const pct = Math.round((count / activeUniCount) * 100);
    mappedPct += pct;
    let shortName = name;
    if (name.length > 20) shortName = name.substring(0, 18) + "...";
    return { l: shortName, pct };
  });
  if (activeUniCount > 0) {
    if (100 - mappedPct > 0) {
      productData.push({ l: "Other", pct: 100 - mappedPct });
    }
  } else {
    productData.push(
      { l: "iPhone 16 Pro Max", pct: 38 },
      { l: "MacBook Air M3", pct: 24 },
      { l: "iPhone 16 Pro", pct: 18 },
      { l: "iPad Pro M4", pct: 12 },
      { l: "Other", pct: 8 }
    );
  }

  return (
    <div style={{ paddingBottom:80 }}>
      <div style={S.header}>
        <div style={{ fontSize:20, fontWeight:800, color:"white", marginBottom:4 }}>Analytics</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)" }}>{isUNI ? "UNI store performance" : "Store performance"}</div>
      </div>
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          {[{ l:"Total Financed", v: activeTxns > 0 ? formattedTotal : (isUNI?"₹42.8L":"₹28.4L") },{ l: isUNI?"AppleCare+ Rate":"Conversion Rate", v: activeTxns > 0 ? (isUNI ? `${acRate}%` : `${appRate}%`) : (isUNI?"68%":"74%") }].map(m => (
            <div key={m.l} style={{ ...S.card, flex:1, textAlign:"center", padding:16, marginBottom:0 }}>
              <div style={{ fontSize:20, fontWeight:800, color:DARK }}>{m.v}</div>
              <div style={{ fontSize:10, color:MUT, marginTop:2 }}>{m.l}</div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ fontSize:15, fontWeight:700, color:DARK, marginBottom:14 }}>Monthly Finance Volume</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:100 }}>
            {bars.map(b => (
              <div key={b.m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ width:"100%", background: b.m==="Jan"?ORANGE:`${ORANGE}28`, borderRadius:"5px 5px 0 0", height:`${b.v}%` }} />
                <div style={{ fontSize:9, color:MUT }}>{b.m}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <div style={{ fontSize:15, fontWeight:700, color:DARK, marginBottom:14 }}>{isUNI?"Top Apple Products":"Tenure Distribution"}</div>
          {(isUNI ? productData : tenureData).map(r => (
            <div key={r.l} style={{ marginBottom:12 }}>
              <div style={{ ...S.row, marginBottom:6 }}><span style={{ fontSize:13, color:SEC }}>{r.l}</span><span style={{ fontSize:13, fontWeight:700 }}>{r.pct}%</span></div>
              <div style={S.pb}><div style={S.pf(r.pct)} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SupportScreen({ isUNI }) {
  return (
    <div style={{ paddingBottom:80 }}>
      <div style={S.header}>
        <div style={{ fontSize:20, fontWeight:800, color:"white", marginBottom:4 }}>Support</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)" }}>We're here to help</div>
      </div>
      <div style={{ padding:"16px 16px 0" }}>
        {[
          { icon:"📞", title: isUNI?"UNI Store Support":"Call Support", sub:"Mon–Sat, 9AM–6PM", action: isUNI?"1800-UNI-HELP":"1800-XXX-XXXX" },
          { icon:"💬", title:"WhatsApp Chat", sub:"Quick responses", action:"Chat Now" },
          { icon:"📧", title:"Email Support", sub: isUNI?"uni@bytePe.in":"partners@bytePe.in", action:"Send Mail" },
        ].map(s => (
          <div key={s.title} style={{ ...S.card, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:48, height:48, background:OL, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{s.icon}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:15, fontWeight:700, color:DARK }}>{s.title}</div><div style={{ fontSize:12, color:MUT }}>{s.sub}</div></div>
            <span style={{ fontSize:13, color:ORANGE, fontWeight:600 }}>{s.action}</span>
          </div>
        ))}
        <div style={{ ...S.card, background:OL, border:`1.5px solid ${ORANGE}30` }}>
          <div style={{ fontSize:14, fontWeight:700, color:ORANGE, marginBottom:8 }}>RBI Compliance Helpline</div>
          <div style={{ fontSize:13, color:SEC, lineHeight:1.6 }}>BytePé is a registered LSP under RBI Digital Lending Guidelines. Grievances: grievance@bytePe.in</div>
        </div>
        <div style={{ fontSize:11, color:MUT, textAlign:"center", marginTop:16 }}>
          BytePé Financial Services · NBFC Partner Platform{isUNI ? " · Apple UNIcorn Partner" : ""}<br />Registered under RBI · CIN: UXXXX
        </div>
      </div>
    </div>
  );
}

function ProfileDrawer({ isOpen, onClose, retailerMobile }) {
  if (!isOpen) return null;
  const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
  const partner = partners.find(p => p.phone === retailerMobile) || { shopName: "Delhi Electronics Hub", city: "Bengaluru", ownerName: "Store Manager", email: "support@bytepe.com", address: "Commercial Complex, Noida" };

  const fc = partner.commercials && partner.commercials.fileCharges ? partner.commercials.fileCharges : {
    upto10k: 699,
    k10to25: 999,
    k25to50: 1299,
    k50to80: 1599,
    k80to120: 1799,
    above120: 1999
  };
  const dbd = partner.commercials && partner.commercials.dbd !== undefined ? partner.commercials.dbd : 2;

  const rows = [
    ["Upto ₹10,000", `₹${fc.upto10k}`],
    ["₹10,000 - ₹25,000", `₹${fc.k10to25}`],
    ["₹25,000 - ₹50,000", `₹${fc.k25to50}`],
    ["₹50,000 - ₹80,000", `₹${fc.k50to80}`],
    ["₹80,000 - ₹1,20,000", `₹${fc.k80to120}`],
    ["₹1,20,000+", `₹${fc.above120}`]
  ];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:10000, display:"flex", justifyContent:"flex-end" }}>
      {/* Backdrop */}
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }} onClick={onClose} />
      {/* Panel */}
      <div style={{ position:"relative", width:"100%", maxWidth:400, height:"100%", background:"#1A1C20", boxShadow:"-4px 0 24px rgba(0,0,0,0.3)", display:"flex", flexDirection:"column", padding:20, color:"white", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, borderBottom:"1px solid rgba(255,255,255,0.08)", paddingBottom:14 }}>
          <h3 style={{ margin:0, fontSize:18, fontWeight:800 }}>Business Profile</h3>
          <button style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:20, cursor:"pointer" }} onClick={onClose}>✕</button>
        </div>

        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Store Details</div>
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:14, display:"flex", flexDirection:"column", gap:10, border:"1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Shop / Business Name</div>
              <div style={{ fontSize:13, fontWeight:700, color:"white", marginTop:2 }}>{partner.shopName}</div>
            </div>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Owner Name</div>
              <div style={{ fontSize:13, fontWeight:700, color:"white", marginTop:2 }}>{partner.ownerName}</div>
            </div>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Mobile Number</div>
              <div style={{ fontSize:13, fontWeight:700, color:"white", marginTop:2 }}>+91 {partner.phone}</div>
            </div>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Email Address</div>
              <div style={{ fontSize:13, fontWeight:700, color:"white", marginTop:2 }}>{partner.email || "No email provided"}</div>
            </div>
            <div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Store Address</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2, lineHeight:1.4 }}>{partner.address || "No address provided"}</div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:8 }}>Commercial Agreement</div>
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:14, border:"1px solid rgba(255,255,255,0.06)", marginBottom:14 }}>
            <div style={{ fontSize:13, fontWeight:800, color:"#FF5C35", marginBottom:10 }}>File Charges</div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                  <th style={{ textAlign:"left", padding:"6px 0", color:"rgba(255,255,255,0.4)", fontWeight:500 }}>Loan Value</th>
                  <th style={{ textAlign:"right", padding:"6px 0", color:"rgba(255,255,255,0.4)", fontWeight:500 }}>Charges</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([range, val]) => (
                  <tr key={range} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding:"8px 0", color:"rgba(255,255,255,0.8)" }}>{range}</td>
                    <td style={{ padding:"8px 0", textAlign:"right", fontWeight:700 }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:14, border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#FF5C35" }}>Dealer Buy Down (DBD)</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Subvention contribution</div>
            </div>
            <div style={{ fontSize:16, fontWeight:900, color:"#00D48A" }}>{dbd}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mobile, setMobile]   = useState(null);
  const [storeType, setStoreType] = useState(null);
  const [tab, setTab]         = useState("home");
  const [screen, setScreen]   = useState("dashboard");
  const [sales, setSales]     = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedSubStore, setSelectedSubStore] = useState("all");

  // Database Seeding
  React.useEffect(() => {
    if (!localStorage.getItem("bytepe_partners")) {
      localStorage.setItem("bytepe_partners", "[]");
    }
    if (!localStorage.getItem("bytepe_sales")) {
      localStorage.setItem("bytepe_sales", "[]");
    }
  }, []);

  // Sync sales ledger for logged-in merchant
  useEffect(() => {
    const updateSales = () => {
      const allSales = JSON.parse(localStorage.getItem("bytepe_sales") || "[]");
      const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
      
      const currentPartner = partners.find(p => p.phone === mobile);
      
      let isParent = false;
      let regId = "";
      if (currentPartner) {
        regId = currentPartner.regId;
        if (currentPartner.commercials && currentPartner.commercials.isParent) isParent = true;
        if (currentPartner.remarks && currentPartner.remarks.includes("[IsParent: true]")) isParent = true;
      }
      
      let allowedMobiles = [mobile];
      if (isParent) {
        const childPartners = partners.filter(p => {
          if (p.commercials && p.commercials.parentId === regId) return true;
          if (p.remarks && p.remarks.includes(`[ParentId: ${regId}]`)) return true;
          return false;
        });
        childPartners.forEach(p => {
          if (p.phone) allowedMobiles.push(p.phone);
        });
      }
      
      const filtered = allSales.filter(s => allowedMobiles.includes(s.retailerMobile));
      setSales(filtered);
    };
    if (mobile) {
      updateSales();
      window.addEventListener('storage', updateSales);
      window.addEventListener('bytepe_sales_updated', updateSales);
      window.addEventListener('bytepe_partners_updated', updateSales);
    }
    return () => {
      window.removeEventListener('storage', updateSales);
      window.removeEventListener('bytepe_sales_updated', updateSales);
      window.removeEventListener('bytepe_partners_updated', updateSales);
    };
  }, [mobile]);

  const NAV = [
    { id:"home", icon:"🏠", label:"Home" },
    { id:"transactions", icon:"📋", label:"Sales" },
    { id:"analytics", icon:"📊", label:"Analytics" },
    { id:"support", icon:"🎧", label:"Support" },
  ];

  const handleLogin = (mob) => {
    setMobile(mob);
    setStoreType(isUNIStore(mob) ? "UNI" : "STD");
    setSelectedSubStore("all");
  };

  const isUNI = storeType === "UNI";

  const partners = JSON.parse(localStorage.getItem("bytepe_partners") || "[]");
  const currentPartner = partners.find(p => p.phone === mobile);
  const isParent = currentPartner && ( (currentPartner.commercials && currentPartner.commercials.isParent) || (currentPartner.remarks && currentPartner.remarks.includes("[IsParent: true]")) );
  const childStores = isParent ? partners.filter(p => {
    if (p.commercials && p.commercials.parentId === currentPartner.regId) return true;
    if (p.remarks && p.remarks.includes(`[ParentId: ${currentPartner.regId}]`)) return true;
    return false;
  }) : [];

  const displayedSales = selectedSubStore === "all" ? sales : sales.filter(s => s.retailerMobile === selectedSubStore);

  if (!storeType) return (
    <div style={S.app}>
      <style>{globalCSS}</style>
      <DemoSwitcher activeTab="retailer" />
      <LoginScreen onLogin={handleLogin} />
    </div>
  );

  return (
    <div style={S.app}>
      <style>{globalCSS}</style>
      <DemoSwitcher activeTab="retailer" />
      
      {isParent && (
        <div style={{
          background: "#FFF",
          borderBottom: "1px solid #E8EAED",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "'DM Sans', sans-serif"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>🏢 Chain Account:</span>
            <span style={{ fontSize: 13, color: SEC, fontWeight: 500 }}>{currentPartner.shopName}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: MUT, fontWeight: 600 }}>FILTER STORE:</span>
            <select 
              value={selectedSubStore}
              onChange={(e) => setSelectedSubStore(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid #CBD5E0",
                fontSize: 12,
                fontWeight: 600,
                color: DARK,
                background: "#FFF",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="all">All Stores (Consolidated)</option>
              {childStores.map(cs => (
                <option key={cs.regId} value={cs.phone}>{cs.shopName} ({cs.city})</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {isUNI && (
        <>
          {screen === "newSale" && <UNINewSaleScreen retailerMobile={selectedSubStore === "all" ? mobile : selectedSubStore} onBack={() => setScreen("dashboard")} onSuccess={() => { setScreen("dashboard"); setTab("transactions"); }} />}
          {screen === "dashboard" && (
            <>
              {tab === "home"         && <UNIDashboard sales={displayedSales} onNewSale={() => setScreen("newSale")} setTab={setTab} retailerMobile={selectedSubStore === "all" ? mobile : selectedSubStore} />}
              {tab === "transactions" && <TransactionsScreen isUNI={true} retailerMobile={selectedSubStore === "all" ? mobile : selectedSubStore} />}
              {tab === "analytics"    && <AnalyticsScreen isUNI={true} sales={displayedSales} />}
              {tab === "support"      && <SupportScreen isUNI={true} />}
              <nav style={S.navBar}>
                {NAV.map(n => (
                  <div key={n.id} style={{ ...S.navItem, ...(tab===n.id?{color:ORANGE}:{}) }} onClick={() => setTab(n.id)}>
                    <span style={{ fontSize:22 }}>{n.icon}</span>
                    <span style={{ fontSize:11, fontWeight: tab===n.id?700:500 }}>{n.label}</span>
                  </div>
                ))}
              </nav>
            </>
          )}
        </>
      )}
      {!isUNI && (
        <>
          {screen === "newSale"      && <StdNewSaleScreen retailerMobile={selectedSubStore === "all" ? mobile : selectedSubStore} onBack={() => setScreen("dashboard")} onSuccess={() => { setScreen("dashboard"); setTab("transactions"); }} />}
          {screen === "personalLoan" && <PersonalLoanScreen onBack={() => setScreen("dashboard")} />}
          {screen === "businessLoan" && <BusinessLoanScreen onBack={() => setScreen("dashboard")} />}
          {screen === "dashboard" && (
            <>
              {tab === "home"         && <StdDashboard sales={displayedSales} onNewSale={() => setScreen("newSale")} onPersonalLoan={() => setScreen("personalLoan")} onBusinessLoan={() => setScreen("businessLoan")} setTab={setTab} retailerMobile={selectedSubStore === "all" ? mobile : selectedSubStore} />}
              {tab === "transactions" && <TransactionsScreen isUNI={false} retailerMobile={selectedSubStore === "all" ? mobile : selectedSubStore} />}
              {tab === "analytics"    && <AnalyticsScreen isUNI={false} sales={displayedSales} />}
              {tab === "support"      && <SupportScreen isUNI={false} />}
              <nav style={S.navBar}>
                {NAV.map(n => (
                  <div key={n.id} style={{ ...S.navItem, ...(tab===n.id?{color:ORANGE}:{}) }} onClick={() => setTab(n.id)}>
                    <span style={{ fontSize:22 }}>{n.icon}</span>
                    <span style={{ fontSize:11, fontWeight: tab===n.id?700:500 }}>{n.label}</span>
                  </div>
                ))}
              </nav>
            </>
          )}
        </>
      )}
      <ProfileDrawer isOpen={showProfile} onClose={() => setShowProfile(false)} retailerMobile={mobile} />
    </div>
  );
}