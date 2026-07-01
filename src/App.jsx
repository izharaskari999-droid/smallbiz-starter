import { useState, useRef, useEffect } from "react";

const EMAILJS_SERVICE_ID = "service_fx38y6i";
const EMAILJS_TEMPLATE_ID = "template_7iaql2o";
const EMAILJS_PUBLIC_KEY = "j3czFp8ResoC6DiuK";
const SUPABASE_URL = "https://sojwfzoitieeypnkgakh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvandmem9pdGllZXlwbmtnYWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTY4MTgsImV4cCI6MjA5ODA3MjgxOH0.8FwNq9ygMwPqQot5Ekgk2YJcfBfSxg38nNBJKYq4DYI";

const C = {
  bg:"#0a0a0a", card:"#111111", border:"#1e1e1e", border2:"#2a2a2a",
  green:"#22c55e", green2:"#16a34a", greendim:"#052e16",
  greenbg:"rgba(34,197,94,0.1)", greenbg2:"rgba(34,197,94,0.05)",
  text:"#ffffff", text2:"#a1a1aa", text3:"#71717a",
  red:"#ef4444", redbg:"rgba(239,68,68,0.1)",
  amber:"#f59e0b", amberbg:"rgba(245,158,11,0.1)",
};

const db = {
  async saveReport(userId, form, report) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"return=representation"},
      body:JSON.stringify({user_id:userId,idea:form.idea,city:form.city,state:form.state,type:form.type,report_data:JSON.stringify(report)})
    });
    return res.json();
  },
  async getReports(userId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reports?user_id=eq.${userId}&order=created_at.desc`, {
      headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
    });
    return res.json();
  },
  async deleteReport(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${id}`, {
      method:"DELETE",
      headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
    });
    return res.ok;
  },
  async createUser(name,email,hash) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"return=representation"},
      body:JSON.stringify({name,email,password_hash:hash})
    });
    return res.json();
  },
  async getUser(email) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&limit=1`, {
      headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
    });
    const d = await res.json();
    return d[0]||null;
  }
};

async function hashPassword(p) {
  const buf=new TextEncoder().encode(p);
  const hash=await crypto.subtle.digest("SHA-256",buf);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

const BUSINESS_TYPES = [
  "Food & Beverage","Bakery / Catering","Coffee Shop / Café","Restaurant / Fast Food",
  "Retail / Store","Online / E-commerce","Dropshipping","Amazon FBA",
  "Freelance / Consulting","Coaching / Tutoring","Photography / Videography","Graphic Design / Creative",
  "Tech / App / SaaS","Digital Marketing Agency","Social Media Management","Content Creation / Blogging",
  "Cleaning Service","Landscaping / Lawn Care","Handyman / Home Repair","Moving Service",
  "Health & Beauty / Salon","Personal Training / Fitness","Childcare / Daycare","Elder Care / Home Care",
  "Real Estate","Property Management","Trucking / Delivery","Auto Repair / Detailing",
  "Pet Services","Event Planning","Construction / Contracting","Other"
];

const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const TABS = [{id:0,label:"Feasibility",icon:"ti-star"},{id:1,label:"Competition",icon:"ti-trophy"},{id:2,label:"Challenges",icon:"ti-alert-triangle"},{id:3,label:"Checklist",icon:"ti-checklist"},{id:4,label:"Funding",icon:"ti-coin"},{id:5,label:"Budget",icon:"ti-currency-dollar"}];

function Logo({size=32}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{flexShrink:0,borderRadius:10}}>
      <circle cx="50" cy="50" r="50" fill={C.green2}/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
      <line x1="50" y1="12" x2="50" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="50" y1="80" x2="50" y2="88" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="12" y1="50" x2="20" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="80" y1="50" x2="88" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="50" y="17" textAnchor="middle" style={{fontSize:9,fill:"white",fontWeight:"bold"}}>N</text>
      <text x="50" y="90" textAnchor="middle" style={{fontSize:9,fill:"white",fontWeight:"bold"}}>S</text>
      <text x="15" y="54" textAnchor="middle" style={{fontSize:9,fill:"white",fontWeight:"bold"}}>W</text>
      <text x="85" y="54" textAnchor="middle" style={{fontSize:9,fill:"white",fontWeight:"bold"}}>E</text>
      <polyline points="32,52 44,64 72,36" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Navbar({user,onLogout,onShowAuth,onShowDashboard,onHome}) {
  return (
    <div style={{borderBottom:`1px solid ${C.border}`,padding:"0 2rem",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bg,position:"sticky",top:0,zIndex:10}}>
      <div onClick={onHome} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
        <Logo size={32}/>
        <span style={{fontSize:16,fontWeight:700,color:C.text,letterSpacing:"0.02em"}}>INVENIO</span>
        <span style={{fontSize:11,color:C.green,background:C.greenbg,padding:"2px 8px",borderRadius:20,fontWeight:500,border:`1px solid ${C.green2}`}}>Business AI</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {user ? (
          <>
            <button onClick={onShowDashboard} style={{fontSize:13,padding:"6px 14px",borderRadius:8,background:C.greenbg,color:C.green,border:`1px solid ${C.green2}`,cursor:"pointer",fontWeight:500,display:"flex",alignItems:"center",gap:5}}>
              <i className="ti ti-layout-dashboard" style={{fontSize:13}}/>My reports
            </button>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:C.green2,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:600}}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{fontSize:13,color:C.text2}}>{user.name}</span>
              <button onClick={onLogout} style={{fontSize:12,color:C.text3,background:"none",border:"none",cursor:"pointer"}}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <button onClick={onShowAuth} style={{fontSize:13,padding:"6px 14px",borderRadius:8,background:"transparent",border:`1px solid ${C.border2}`,color:C.text2,cursor:"pointer"}}>Log in</button>
            <button onClick={onShowAuth} style={{fontSize:13,padding:"7px 16px",borderRadius:8,background:C.green,color:"#000",border:"none",fontWeight:600,cursor:"pointer"}}>Sign up</button>
          </>
        )}
      </div>
    </div>
  );
}

function DarkCard({children,style={},onClick}) {
  return (
    <div onClick={onClick} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1.5rem",...style}}>
      {children}
    </div>
  );
}

function GreenBtn({onClick,disabled,children,style={}}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{padding:"12px 24px",borderRadius:10,background:disabled?"#1a1a1a":C.green,color:disabled?C.text3:"#000",border:"none",fontWeight:700,fontSize:15,cursor:disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:8,transition:"all 0.15s",...style}}>
      {children}
    </button>
  );
}

function GhostBtn({onClick,children,style={}}) {
  return (
    <button onClick={onClick} style={{padding:"10px 18px",borderRadius:10,background:"transparent",color:C.text2,border:`1px solid ${C.border2}`,fontWeight:400,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,...style}}>
      {children}
    </button>
  );
}

function Loader() {
  const msgs=["Researching your market...","Checking local competition...","Building your checklist...","Estimating startup costs..."];
  const [idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%msgs.length),2000);return()=>clearInterval(t);},[]);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"6rem 2rem",gap:"2rem",background:C.bg,minHeight:"calc(100vh - 60px)"}}>
      <div style={{position:"relative",width:80,height:80}}>
        <div style={{width:80,height:80,border:`3px solid ${C.border2}`,borderTop:`3px solid ${C.green}`,borderRadius:"50%",animation:"spin 0.9s linear infinite"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}><Logo size={40}/></div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:20,fontWeight:700,marginBottom:8,color:C.text}}>Generating your report</div>
        <div style={{fontSize:14,color:C.text3,minHeight:20}}>{msgs[idx]}</div>
      </div>
      <div style={{display:"flex",gap:6}}>
        {msgs.map((_,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:i===idx?C.green:C.border2,transition:"background 0.3s"}}/>)}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function AuthModal({onLogin,onGuest}) {
  const [mode,setMode]=useState("choose");
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const inp = {width:"100%",boxSizing:"border-box",fontSize:14,background:"#1a1a1a",border:`1px solid ${C.border2}`,color:C.text,borderRadius:8,padding:"10px 12px",outline:"none"};

  async function handleSignup() {
    if(!name.trim()||!email.trim()||!password.trim()){setErr("All fields required.");return;}
    if(password.length<6){setErr("Password must be at least 6 characters.");return;}
    setLoading(true);setErr("");
    try {
      const existing=await db.getUser(email);
      if(existing){setErr("Email already registered.");setLoading(false);return;}
      const hash=await hashPassword(password);
      const users=await db.createUser(name,email,hash);
      if(users&&users[0])onLogin({id:users[0].id,name,email});
      else setErr("Signup failed. Try again.");
    } catch{setErr("Something went wrong.");}
    setLoading(false);
  }

  async function handleLogin() {
    if(!email.trim()||!password.trim()){setErr("All fields required.");return;}
    setLoading(true);setErr("");
    try {
      const user=await db.getUser(email);
      if(!user){setErr("No account found.");setLoading(false);return;}
      const hash=await hashPassword(password);
      if(hash!==user.password_hash){setErr("Incorrect password.");setLoading(false);return;}
      onLogin({id:user.id,name:user.name,email:user.email});
    } catch{setErr("Something went wrong.");}
    setLoading(false);
  }

  return (
    <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <DarkCard style={{maxWidth:420,width:"100%",padding:"2rem"}}>
        {mode==="choose"&&(
          <div>
            <div style={{textAlign:"center",marginBottom:"2rem"}}>
              <Logo size={52}/>
              <div style={{fontSize:22,fontWeight:700,marginTop:14,marginBottom:6,color:C.text}}>Welcome to INVENIO</div>
              <div style={{fontSize:14,color:C.text2}}>Create an account to save your reports</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <GreenBtn onClick={()=>setMode("signup")} style={{justifyContent:"center",width:"100%",boxSizing:"border-box"}}>
                <i className="ti ti-user-plus"/>Create free account
              </GreenBtn>
              <GhostBtn onClick={()=>setMode("login")} style={{justifyContent:"center",width:"100%",boxSizing:"border-box"}}>
                <i className="ti ti-login"/>Log in
              </GhostBtn>
              <button onClick={onGuest} style={{padding:"10px",borderRadius:8,background:"transparent",color:C.text3,border:"none",fontSize:13,cursor:"pointer"}}>
                Continue as guest (reports won't be saved)
              </button>
            </div>
          </div>
        )}
        {(mode==="signup"||mode==="login")&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1.5rem"}}>
              <button onClick={()=>setMode("choose")} style={{background:"none",border:"none",cursor:"pointer",color:C.text3}}><i className="ti ti-arrow-left" style={{fontSize:18}}/></button>
              <div style={{fontSize:18,fontWeight:600,color:C.text}}>{mode==="signup"?"Create account":"Log in"}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:"1rem"}}>
              {mode==="signup"&&(
                <div>
                  <label style={{fontSize:12,color:C.text2,display:"block",marginBottom:5}}>Full name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="John Smith" style={inp}/>
                </div>
              )}
              <div>
                <label style={{fontSize:12,color:C.text2,display:"block",marginBottom:5}}>Email address</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="john@email.com" type="email" style={inp}/>
              </div>
              <div>
                <label style={{fontSize:12,color:C.text2,display:"block",marginBottom:5}}>Password</label>
                <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(mode==="signup"?handleSignup():handleLogin())} placeholder={mode==="signup"?"At least 6 characters":"Your password"} type="password" style={inp}/>
              </div>
              {err&&<div style={{fontSize:12,color:C.red,display:"flex",alignItems:"center",gap:5}}><i className="ti ti-alert-circle"/>{err}</div>}
            </div>
            <GreenBtn onClick={mode==="signup"?handleSignup:handleLogin} disabled={loading} style={{width:"100%",justifyContent:"center",boxSizing:"border-box"}}>
              {loading?"Please wait...":(mode==="signup"?"Create account":"Log in")}
            </GreenBtn>
            <p style={{textAlign:"center",fontSize:12,color:C.text3,marginTop:12}}>
              {mode==="signup"?"Already have an account?":"No account?"}{" "}
              <button onClick={()=>setMode(mode==="signup"?"login":"signup")} style={{background:"none",border:"none",color:C.green,cursor:"pointer",fontSize:12,fontWeight:500}}>
                {mode==="signup"?"Log in":"Sign up"}
              </button>
            </p>
          </div>
        )}
      </DarkCard>
    </div>
  );
}

function Dashboard({user,onClose,onViewReport}) {
  const [reports,setReports]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{db.getReports(user.id).then(d=>{setReports(Array.isArray(d)?d:[]);setLoading(false);});},[]);

  async function handleDelete(e,id) {
    e.stopPropagation();
    if(!window.confirm("Delete this report?"))return;
    await db.deleteReport(id);
    setReports(p=>p.filter(r=>r.id!==id));
  }

  function handleView(r) {
    try {
      const rd=r.report_data?(typeof r.report_data==="string"?JSON.parse(r.report_data):r.report_data):null;
      if(!rd){alert("Report data not found.");return;}
      onViewReport(r.idea,r.city,r.state,r.type,rd);
    } catch(e){alert("Could not load this report.");}
  }

  return (
    <div style={{minHeight:"calc(100vh - 60px)",background:C.bg,padding:"2rem"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2rem"}}>
          <div>
            <h1 style={{fontSize:24,fontWeight:700,margin:"0 0 4px",color:C.text}}>My reports</h1>
            <div style={{fontSize:14,color:C.text3}}>Welcome back, {user.name}!</div>
          </div>
          <GreenBtn onClick={onClose}><i className="ti ti-plus"/>New report</GreenBtn>
        </div>
        {loading?(
          <div style={{textAlign:"center",padding:"3rem",color:C.text3}}>Loading...</div>
        ):reports.length===0?(
          <DarkCard style={{textAlign:"center",padding:"4rem"}}>
            <i className="ti ti-file-off" style={{fontSize:48,color:C.text3,display:"block",marginBottom:16}}/>
            <div style={{fontSize:18,fontWeight:600,marginBottom:8,color:C.text}}>No reports yet</div>
            <div style={{fontSize:14,color:C.text3,marginBottom:"1.5rem"}}>Generate your first business feasibility report</div>
            <GreenBtn onClick={onClose}><i className="ti ti-sparkles"/>Generate a report</GreenBtn>
          </DarkCard>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {reports.map((r,i)=>{
              const rd=r.report_data?(typeof r.report_data==="string"?JSON.parse(r.report_data):r.report_data):null;
              const score=rd?.feasibility?.score;
              return (
                <DarkCard key={i} onClick={()=>handleView(r)} style={{cursor:"pointer",border:`1px solid ${C.border}`,transition:"border-color 0.15s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                    <div style={{width:38,height:38,borderRadius:10,background:C.greenbg,border:`1px solid ${C.green2}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <i className="ti ti-file-text" style={{fontSize:18,color:C.green}}/>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:11,background:C.greenbg,color:C.green,padding:"2px 8px",borderRadius:20,fontWeight:600,border:`1px solid ${C.green2}`}}>{score||"?"}/10</span>
                      <button onClick={e=>handleDelete(e,r.id)} style={{width:26,height:26,borderRadius:6,background:C.redbg,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <i className="ti ti-trash" style={{fontSize:13,color:C.red}}/>
                      </button>
                    </div>
                  </div>
                  <div style={{fontSize:14,fontWeight:600,marginBottom:6,lineHeight:1.4,color:C.text}}>{r.idea?.length>60?r.idea.slice(0,60)+"...":r.idea}</div>
                  <div style={{fontSize:12,color:C.text3,marginBottom:8}}>{r.type} · {r.city}, {r.state}</div>
                  <div style={{fontSize:11,color:C.text3}}>{new Date(r.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
                </DarkCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [phase,setPhase]=useState("form");
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({idea:"",state:"",city:"",type:"",location:"home"});
  const [report,setReport]=useState(null);
  const [tab,setTab]=useState(0);
  const [checked,setChecked]=useState({});
  const [showAuth,setShowAuth]=useState(false);
  const [user,setUser]=useState(null);
  const [showDashboard,setShowDashboard]=useState(false);
  const [guestInfo,setGuestInfo]=useState({name:"",email:""});
  const [showGuestGate,setShowGuestGate]=useState(false);
  const [wordCount,setWordCount]=useState(0);

  useEffect(()=>{
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    s.onload=()=>window.emailjs&&window.emailjs.init(EMAILJS_PUBLIC_KEY);
    document.head.appendChild(s);
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    document.body.style.fontFamily="'Inter', sans-serif";
    document.body.style.background=C.bg;
    const saved=localStorage.getItem("invenio_user");
    if(saved) try{setUser(JSON.parse(saved));}catch{}
  },[]);

  function goHome(){setPhase("form");setStep(0);setReport(null);setChecked({});setShowDashboard(false);setShowGuestGate(false);setShowAuth(false);}
  function handleLogin(u){setUser(u);localStorage.setItem("invenio_user",JSON.stringify(u));setShowAuth(false);}
  function handleLogout(){setUser(null);localStorage.removeItem("invenio_user");goHome();}

  const valid=[form.idea.trim().length>10,form.state&&form.city.trim(),form.type,true];

  async function analyze(name,email) {
    setShowGuestGate(false);
    setPhase("loading");
    if(window.emailjs){window.emailjs.send(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,{user_name:name,user_email:email,business_idea:form.idea,city:form.city,state:form.state,business_type:form.type}).catch(()=>{});}
    const prompt=`You are a small business advisor. Return ONLY a valid JSON object, no markdown:
{"feasibility":{"score":<1-10>,"summary":"<2-3 sentences>"},"competition":{"level":"<Low|Medium|High>","summary":"<2-3 sentences about ${form.city}, ${form.state}>","competitors":["<type1>","<type2>","<type3>"],"gap":"<one sentence>"},"challenges":[{"title":"<title>","detail":"<1-2 sentences>"},{"title":"<title>","detail":"<1-2 sentences>"},{"title":"<title>","detail":"<1-2 sentences>"},{"title":"<title>","detail":"<1-2 sentences>"}],"checklist":[{"category":"Legal & registration","items":["<step>","<step>","<step>"]},{"category":"Financial setup","items":["<step>","<step>"]},{"category":"Operations","items":["<step>","<step>","<step>"]},{"category":"Marketing & launch","items":["<step>","<step>"]}],"funding":[{"name":"<program name>","type":"<Grant|Loan|Tax Credit|Other>","description":"<1 sentence>","eligibility":"<brief eligibility note>"},{"name":"<program name>","type":"<Grant|Loan|Tax Credit|Other>","description":"<1 sentence>","eligibility":"<brief eligibility note>"},{"name":"<program name>","type":"<Grant|Loan|Tax Credit|Other>","description":"<1 sentence>","eligibility":"<brief eligibility note>"},{"name":"<program name>","type":"<Grant|Loan|Tax Credit|Other>","description":"<1 sentence>","eligibility":"<brief eligibility note>"}],"costs":{"total_low":<number>,"total_high":<number>,"breakdown":[{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"}]}}
Business: ${form.idea} | State: ${form.state} | City: ${form.city} | Type: ${form.type} | ${form.location==="home"?"Home-based":"Physical location"}. Include federal AND ${form.state}-specific funding programs, grants, loans and tax credits relevant to this type of business.`;
    try {
      const res=await fetch("/api/proxy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const txt=data.content.find(b=>b.type==="text")?.text||"";
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setReport(parsed);
      if(user){await db.saveReport(user.id,form,parsed);}
      setPhase("report");
    } catch(e){alert("Analysis failed. Please try again.");setPhase("form");}
  }

  function downloadPDF() {
    if(!report) return;
    const typeColor={"Grant":"#22c55e","Loan":"#3b82f6","Tax Credit":"#f59e0b","Other":"#a1a1aa"};
    const typeBg={"Grant":"#052e16","Loan":"#1e3a5f","Tax Credit":"#431407","Other":"#1a1a1a"};
    const html=`<!DOCTYPE html><html><head><title>Invenio Business AI Report</title><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#0a0a0a;color:#fff;padding:40px;max-width:900px;margin:0 auto}
    .header{display:flex;align-items:center;gap:16px;padding-bottom:24px;border-bottom:2px solid #22c55e;margin-bottom:32px}
    .logo{width:52px;height:52px;background:#16a34a;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:#fff}
    .brand{font-size:22px;font-weight:800;color:#fff;letter-spacing:0.05em}
    .brand span{color:#22c55e}
    .meta{font-size:13px;color:#71717a;margin-top:4px}
    .section{margin-bottom:32px}
    h2{font-size:13px;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #1e1e1e}
    .score-box{background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:20px;display:flex;align-items:center;gap:20px}
    .score-num{font-size:48px;font-weight:900;color:#22c55e}
    .score-text{font-size:14px;color:#a1a1aa;line-height:1.7}
    .card{background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:16px;margin-bottom:10px}
    .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;margin-bottom:8px}
    .challenge-num{width:28px;height:28px;background:#431407;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#f59e0b;margin-right:10px;vertical-align:middle}
    .check{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #1a1a1a}
    .check-box{width:16px;height:16px;border:1.5px solid #22c55e;border-radius:3px;flex-shrink:0;margin-top:2px}
    .budget-row{display:grid;grid-template-columns:1fr 80px 80px;gap:8px;padding:10px 12px;border-bottom:1px solid #1a1a1a;font-size:13px}
    .budget-header{background:#1a1a1a;border-radius:6px 6px 0 0;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.05em}
    .green{color:#22c55e}
    .gray{color:#a1a1aa}
    .funding-badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:700;margin-bottom:6px}
    .footer{margin-top:40px;padding-top:20px;border-top:1px solid #1e1e1e;text-align:center;font-size:11px;color:#52525b}
    @media print{body{background:#0a0a0a;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
    </style></head><body>
    <div class="header">
      <div class="logo">I</div>
      <div>
        <div class="brand">INVENIO <span>Business AI</span></div>
        <div class="meta">Business Feasibility Report · ${form.type} · ${form.city}, ${form.state} · ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
      </div>
    </div>
    <div class="section">
      <h2>Business Idea</h2>
      <div class="card"><p style="color:#e4e4e7;line-height:1.7">${form.idea}</p></div>
    </div>
    <div class="section">
      <h2>Feasibility Score</h2>
      <div class="score-box">
        <div class="score-num">${report.feasibility?.score||0}<span style="font-size:20px;color:#71717a">/10</span></div>
        <div class="score-text">${report.feasibility?.summary||""}</div>
      </div>
    </div>
    <div class="section">
      <h2>Competition Analysis — ${report.competition?.level||""}</h2>
      <div class="card">
        <p style="color:#a1a1aa;line-height:1.7;margin-bottom:12px">${report.competition?.summary||""}</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
          ${(report.competition?.competitors||[]).map(c=>`<span style="background:#052e16;color:#22c55e;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600">${c}</span>`).join("")}
        </div>
        <div style="background:#052e16;border-radius:8px;padding:10px 14px;color:#22c55e;font-size:13px"><strong>Market gap:</strong> ${report.competition?.gap||""}</div>
      </div>
    </div>
    <div class="section">
      <h2>Challenges to Expect</h2>
      ${(report.challenges||[]).map((c,i)=>`<div class="card" style="margin-bottom:8px"><span class="challenge-num">${i+1}</span><strong style="color:#fff">${c.title}</strong><p style="color:#a1a1aa;font-size:13px;margin-top:6px;line-height:1.6">${c.detail}</p></div>`).join("")}
    </div>
    <div class="section">
      <h2>Launch Checklist — ${form.state}</h2>
      ${(report.checklist||[]).map(cat=>`<div style="margin-bottom:16px"><div style="font-size:11px;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px">${cat.category}</div>${cat.items.map(item=>`<div class="check"><div class="check-box"></div><span style="font-size:13px;color:#a1a1aa;line-height:1.5">${item}</span></div>`).join("")}</div>`).join("")}
    </div>
    <div class="section">
      <h2>Funding Opportunities</h2>
      ${(report.funding||[]).map(f=>`<div class="card" style="margin-bottom:8px"><span class="funding-badge" style="background:${typeBg[f.type]||"#1a1a1a"};color:${typeColor[f.type]||"#a1a1aa"}">${f.type}</span><div style="font-weight:700;color:#fff;margin-bottom:4px">${f.name}</div><div style="font-size:13px;color:#a1a1aa;margin-bottom:4px">${f.description}</div><div style="font-size:12px;color:#71717a"><strong>Eligibility:</strong> ${f.eligibility}</div></div>`).join("")}
    </div>
    <div class="section">
      <h2>Estimated Budget to First Sale</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        <div style="background:#052e16;border-radius:10px;padding:16px;text-align:center"><div style="font-size:11px;color:#22c55e;font-weight:700;margin-bottom:4px;text-transform:uppercase">Minimum</div><div style="font-size:28px;font-weight:900;color:#22c55e">${(report.costs?.total_low||0).toLocaleString()}</div></div>
        <div style="background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:16px;text-align:center"><div style="font-size:11px;color:#71717a;font-weight:700;margin-bottom:4px;text-transform:uppercase">Comfortable</div><div style="font-size:28px;font-weight:900;color:#fff">${(report.costs?.total_high||0).toLocaleString()}</div></div>
      </div>
      <div style="border-radius:8px;overflow:hidden;border:1px solid #1e1e1e">
        <div class="budget-row budget-header"><span style="color:#71717a">Expense</span><span style="color:#22c55e;text-align:right">Low</span><span style="color:#a1a1aa;text-align:right">High</span></div>
        ${(report.costs?.breakdown||[]).map(r=>`<div class="budget-row"><div><div style="color:#e4e4e7">${r.item}</div>${r.note?`<div style="font-size:11px;color:#71717a">${r.note}</div>`:""}</div><div class="green" style="text-align:right;font-weight:600">${r.low.toLocaleString()}</div><div class="gray" style="text-align:right">${r.high.toLocaleString()}</div></div>`).join("")}
      </div>
    </div>
    <div class="footer">Generated by INVENIO Business AI · www.invenioai.us · ${new Date().toLocaleDateString()}<br/>This report is for informational purposes only. Always consult a licensed professional before making business decisions.</div>
    </body></html>`;
    const blob=new Blob([html],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`Invenio-Report-${form.type.replace(/[^a-z0-9]/gi,"-")}-${form.city}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const inp={width:"100%",boxSizing:"border-box",fontSize:14,background:"#1a1a1a",border:`1px solid ${C.border2}`,color:C.text,borderRadius:8,padding:"10px 12px",outline:"none"};

  if(showAuth) return <AuthModal onLogin={handleLogin} onGuest={()=>{setShowAuth(false);setShowGuestGate(true);}}/>;

  if(showDashboard) return (
    <>
      <Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/>
      <Dashboard user={user} onClose={()=>setShowDashboard(false)} onViewReport={(idea,city,state,type,rd)=>{setForm({idea,city,state,type,location:"home"});setReport(rd);setShowDashboard(false);setPhase("report");}}/>
    </>
  );

  if(phase==="loading") return <><Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/><Loader/></>;

  if(showGuestGate) return (
    <>
      <Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/>
      <div style={{minHeight:"calc(100vh - 60px)",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
        <DarkCard style={{maxWidth:460,width:"100%",padding:"2rem"}}>
          <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
            <div style={{width:52,height:52,borderRadius:16,background:C.greenbg,border:`1px solid ${C.green2}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
              <i className="ti ti-mail" style={{fontSize:24,color:C.green}}/>
            </div>
            <div style={{fontSize:18,fontWeight:700,marginBottom:6,color:C.text}}>Almost ready</div>
            <div style={{fontSize:13,color:C.text2}}>Create a free account to save your reports, or continue as guest</div>
          </div>
          <GreenBtn onClick={()=>{setShowGuestGate(false);setShowAuth(true);}} style={{width:"100%",justifyContent:"center",boxSizing:"border-box",marginBottom:14}}>
            <i className="ti ti-user-plus"/>Create free account
          </GreenBtn>
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14}}>
            <div style={{fontSize:12,color:C.text3,marginBottom:10,textAlign:"center"}}>Or continue as guest</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input value={guestInfo.name} onChange={e=>setGuestInfo(p=>({...p,name:e.target.value}))} placeholder="Your name" style={inp}/>
              <input value={guestInfo.email} onChange={e=>setGuestInfo(p=>({...p,email:e.target.value}))} placeholder="Your email" type="email" style={inp}/>
              <GhostBtn onClick={()=>{if(guestInfo.name&&guestInfo.email)analyze(guestInfo.name,guestInfo.email);}} style={{justifyContent:"center",width:"100%",boxSizing:"border-box",borderColor:C.border2,color:C.text2}}>
                Continue as guest
              </GhostBtn>
            </div>
          </div>
        </DarkCard>
      </div>
    </>
  );

  if(phase==="form") return (
    <>
      <Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/>
      <div style={{background:C.bg,minHeight:"calc(100vh - 60px)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"4rem 2rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"start"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.greenbg,border:`1px solid ${C.green2}`,color:C.green,fontSize:12,fontWeight:600,padding:"5px 14px",borderRadius:20,marginBottom:24}}>
              <i className="ti ti-sparkles" style={{fontSize:13}}/>Invenio Intelligence
            </div>
            <h1 style={{fontSize:48,fontWeight:800,lineHeight:1.1,margin:"0 0 20px",color:C.text}}>
              Your business idea,{" "}
              <span style={{color:C.green}}>stress-tested by AI.</span>
            </h1>
            <p style={{fontSize:17,color:C.text2,lineHeight:1.7,margin:"0 0 2.5rem"}}>
              Instantly generate a comprehensive feasibility report, competitor analysis, cost estimate, and compliance checklist. Stop guessing, start executing.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {[["ti-star","Feasibility Score","Data-driven 1-10 rating with precise reasoning based on market conditions"],["ti-trophy","Competition Analysis","Identify real competitors and pinpoint actionable market gaps"],["ti-checklist","Compliance Checklist","State-specific legal steps, permits, and registrations"],["ti-currency-dollar","Cost Estimate","Realistic budget breakdown from day one to first sale"]].map(([icon,title,desc])=>(
                <div key={title} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  <div style={{width:42,height:42,borderRadius:10,background:C.greenbg,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <i className={`ti ${icon}`} style={{fontSize:19,color:C.green}}/>
                  </div>
                  <div>
                    <div style={{fontSize:15,fontWeight:600,marginBottom:3,color:C.text}}>{title}</div>
                    <div style={{fontSize:13,color:C.text3,lineHeight:1.5}}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DarkCard style={{padding:"2rem"}}>
            <div style={{display:"flex",gap:4,marginBottom:"1.5rem"}}>
              {Array.from({length:4}).map((_,i)=>(
                <div key={i} style={{height:3,borderRadius:4,flex:i===step?2:1,background:i<=step?C.green:C.border,transition:"all 0.3s"}}/>
              ))}
            </div>

            {step===0&&(
              <div>
                <label style={{fontSize:14,fontWeight:600,display:"block",marginBottom:6,color:C.text}}>The Idea</label>
                <textarea value={form.idea} onChange={e=>{setForm(p=>({...p,idea:e.target.value}));}} placeholder="Describe your business idea, target audience, and what makes it unique..." rows={5} style={{...inp,resize:"vertical",lineHeight:1.6,marginBottom:8}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,color:form.idea.length>10?C.green:C.text3}}>{form.idea.length>10?"✓ Ready":"At least 10 characters"}</span>
                  <GreenBtn onClick={()=>setStep(1)} disabled={!valid[0]}>Continue <i className="ti ti-arrow-right"/></GreenBtn>
                </div>
              </div>
            )}
            {step===1&&(
              <div>
                <label style={{fontSize:14,fontWeight:600,display:"block",marginBottom:14,color:C.text}}>Location</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  <div>
                    <div style={{fontSize:12,color:C.text2,marginBottom:5}}>State</div>
                    <select value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))} style={{...inp}}>
                      <option value="">Select state...</option>
                      {US_STATES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:12,color:C.text2,marginBottom:5}}>City</div>
                    <input value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} placeholder="e.g. Austin" style={inp}/>
                  </div>
                </div>
                <div style={{fontSize:12,color:C.text2,marginBottom:8}}>Where will you operate?</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  {[["home","ti-home","Home-based","Operate from home"],["physical","ti-building","Physical location","Storefront or office"]].map(([val,icon,title,sub])=>(
                    <button key={val} onClick={()=>setForm(p=>({...p,location:val}))} style={{padding:"12px",borderRadius:8,border:`1.5px solid ${form.location===val?C.green:C.border2}`,background:form.location===val?C.greenbg:"transparent",cursor:"pointer",textAlign:"left"}}>
                      <i className={`ti ${icon}`} style={{fontSize:18,color:form.location===val?C.green:C.text3,display:"block",marginBottom:5}}/>
                      <div style={{fontSize:13,fontWeight:600,color:form.location===val?C.green:C.text,marginBottom:2}}>{title}</div>
                      <div style={{fontSize:11,color:C.text3}}>{sub}</div>
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <GhostBtn onClick={()=>setStep(0)} style={{borderColor:C.border2,color:C.text2}}><i className="ti ti-arrow-left"/>Back</GhostBtn>
                  <GreenBtn onClick={()=>setStep(2)} disabled={!valid[1]}>Continue <i className="ti ti-arrow-right"/></GreenBtn>
                </div>
              </div>
            )}
            {step===2&&(
              <div>
                <label style={{fontSize:14,fontWeight:600,display:"block",marginBottom:10,color:C.text}}>Business type</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16,maxHeight:280,overflowY:"auto"}}>
                  {BUSINESS_TYPES.map(t=>(
                    <button key={t} onClick={()=>setForm(p=>({...p,type:t}))} style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${form.type===t?C.green:C.border2}`,background:form.type===t?C.greenbg:"transparent",color:form.type===t?C.green:C.text2,fontWeight:form.type===t?600:400,fontSize:13,cursor:"pointer",textAlign:"left"}}>
                      {t}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <GhostBtn onClick={()=>setStep(1)} style={{borderColor:C.border2,color:C.text2}}><i className="ti ti-arrow-left"/>Back</GhostBtn>
                  <GreenBtn onClick={()=>setStep(3)} disabled={!valid[2]}>Continue <i className="ti ti-arrow-right"/></GreenBtn>
                </div>
              </div>
            )}
            {step===3&&(
              <div>
                <div style={{fontSize:11,fontWeight:600,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14}}>Review details</div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
                  {[["ti-bulb","Business idea",form.idea.length>80?form.idea.slice(0,80)+"...":form.idea],["ti-map-pin","Location",`${form.city}, ${form.state}`],["ti-briefcase","Type",form.type],["ti-home","Setup",form.location==="home"?"Home-based":"Physical location"]].map(([icon,label,val])=>(
                    <div key={label} style={{display:"flex",gap:10,padding:"10px 12px",borderRadius:8,background:"#1a1a1a",border:`1px solid ${C.border}`}}>
                      <div style={{width:28,height:28,borderRadius:6,background:C.greenbg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <i className={`ti ${icon}`} style={{fontSize:14,color:C.green}}/>
                      </div>
                      <div>
                        <div style={{fontSize:11,color:C.text3,marginBottom:1}}>{label}</div>
                        <div style={{fontSize:13,color:C.text,lineHeight:1.4}}>{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <GhostBtn onClick={()=>setStep(2)} style={{borderColor:C.border2,color:C.text2}}><i className="ti ti-arrow-left"/>Back</GhostBtn>
                  <GreenBtn onClick={handleGenerate}>
                    <i className="ti ti-sparkles"/>Generate report →
                  </GreenBtn>
                </div>
              </div>
            )}
          </DarkCard>
        </div>
      </div>
    </>
  );

  if(phase==="report"&&report) {
    const compLevel=report?.competition?.level||"Medium";
    const compColor=compLevel==="Low"?C.green:compLevel==="Medium"?C.amber:C.red;
    const compBg=compLevel==="Low"?C.greenbg:compLevel==="Medium"?C.amberbg:C.redbg;
    const doneCount=Object.values(checked).filter(Boolean).length;
    const total=(report.checklist||[]).reduce((a,c)=>a+c.items.length,0);
    const score=report.feasibility?.score||0;
    const scoreColor=score>=7?C.green:score>=5?C.amber:C.red;
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/>
        <div style={{background:C.bg,minHeight:"calc(100vh - 60px)"}}>
          <div style={{maxWidth:1100,margin:"0 auto",padding:"2rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap",gap:12}}>
              <div>
                <h1 style={{fontSize:20,fontWeight:700,margin:"0 0 4px",color:C.text}}>{form.idea.length>60?form.idea.slice(0,60)+"...":form.idea}</h1>
                <div style={{fontSize:13,color:C.text3}}>{form.type} · {form.city}, {form.state}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {user&&<div style={{fontSize:12,background:C.greenbg,color:C.green,padding:"5px 12px",borderRadius:20,display:"flex",alignItems:"center",gap:5,fontWeight:600,border:`1px solid ${C.green2}`}}><i className="ti ti-check"/>Report saved</div>}
                <button onClick={downloadPDF} style={{fontSize:13,padding:"8px 16px",borderRadius:8,background:C.greenbg,border:`1px solid ${C.green2}`,color:C.green,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontWeight:600}}>
                  <i className="ti ti-download" style={{fontSize:14}}/>Download PDF
                </button>
                <button onClick={goHome} style={{fontSize:13,padding:"8px 16px",borderRadius:8,background:"transparent",border:`1px solid ${C.border2}`,color:C.text2,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <i className="ti ti-refresh"/>New report
                </button>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:"1.5rem"}}>
              {[
                {label:"Feasibility",value:`${score}/10`,color:scoreColor,icon:"ti-star"},
                {label:"Competition",value:compLevel,color:compColor,icon:"ti-trophy"},
                {label:"Funding",value:`${(report.funding||[]).length} programs`,color:C.amber,icon:"ti-coin"},
                {label:"Min. budget",value:`$${(report.costs?.total_low||0).toLocaleString()}`,color:C.green,icon:"ti-currency-dollar"},
              ].map(m=>(
                <DarkCard key={m.label} style={{padding:"1rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{width:28,height:28,borderRadius:6,background:C.greenbg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <i className={`ti ${m.icon}`} style={{fontSize:14,color:m.color}}/>
                    </div>
                    <div style={{fontSize:11,color:C.text3}}>{m.label}</div>
                  </div>
                  <div style={{fontSize:18,fontWeight:700,color:m.color}}>{m.value}</div>
                </DarkCard>
              ))}
            </div>

            <DarkCard>
              <div style={{display:"flex",gap:6,marginBottom:"1.25rem",flexWrap:"wrap"}}>
                {TABS.map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:20,border:`1.5px solid ${tab===t.id?C.green:C.border2}`,background:tab===t.id?C.greenbg:"transparent",color:tab===t.id?C.green:C.text2,fontWeight:tab===t.id?600:400,fontSize:13,cursor:"pointer"}}>
                    <i className={`ti ${t.icon}`} style={{fontSize:13}}/>{t.label}
                  </button>
                ))}
              </div>

              {tab===0&&(
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:16}}>Feasibility rating</div>
                  <div style={{display:"flex",gap:"2rem",alignItems:"center"}}>
                    <svg width={100} height={100} style={{flexShrink:0}}>
                      <circle cx={50} cy={50} r={40} fill="none" stroke={C.border} strokeWidth={7}/>
                      <circle cx={50} cy={50} r={40} fill="none" stroke={scoreColor} strokeWidth={7} strokeDasharray={2*Math.PI*40} strokeDashoffset={2*Math.PI*40*(1-score/10)} strokeLinecap="round" transform="rotate(-90 50 50)"/>
                      <text x={50} y={46} textAnchor="middle" style={{fontSize:22,fontWeight:700,fill:scoreColor}}>{score}</text>
                      <text x={50} y={62} textAnchor="middle" style={{fontSize:10,fill:C.text3}}>/ 10</text>
                    </svg>
                    <div>
                      <div style={{display:"inline-block",background:scoreColor==="green"?C.greenbg:C.amberbg,color:scoreColor,fontSize:12,fontWeight:600,padding:"3px 10px",borderRadius:20,marginBottom:8}}>{score>=7?"Strong":score>=5?"Moderate":"Challenging"}</div>
                      <p style={{fontSize:14,color:C.text2,lineHeight:1.7,margin:0}}>{report.feasibility?.summary}</p>
                    </div>
                  </div>
                </div>
              )}
              {tab===1&&(
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14}}>Competition in {form.city}</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:6,background:compBg,color:compColor,fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20,marginBottom:14,border:`1px solid ${compColor}33`}}>{compLevel} competition</div>
                  <p style={{fontSize:14,color:C.text2,lineHeight:1.75,marginBottom:14}}>{report.competition?.summary}</p>
                  <div style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:8}}>Likely competitors nearby</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                    {(report.competition?.competitors||[]).map((c,i)=><span key={i} style={{background:C.greenbg,color:C.green,fontSize:12,fontWeight:500,padding:"3px 10px",borderRadius:20,border:`1px solid ${C.green2}`}}>{c}</span>)}
                  </div>
                  <div style={{background:C.greenbg,borderRadius:8,padding:"12px 14px",display:"flex",gap:8,border:`1px solid ${C.green2}`}}>
                    <i className="ti ti-bulb" style={{fontSize:15,color:C.green,flexShrink:0,marginTop:1}}/>
                    <div style={{fontSize:13,color:C.green,lineHeight:1.6}}><strong>Market gap:</strong> {report.competition?.gap}</div>
                  </div>
                </div>
              )}
              {tab===2&&(
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14}}>Challenges to expect</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {(report.challenges||[]).map((c,i)=>(
                      <div key={i} style={{display:"flex",gap:12,padding:"14px",background:"#1a1a1a",borderRadius:8,border:`1px solid ${C.border}`}}>
                        <div style={{width:28,height:28,borderRadius:6,background:C.amberbg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <span style={{fontSize:12,fontWeight:700,color:C.amber}}>{i+1}</span>
                        </div>
                        <div>
                          <div style={{fontWeight:600,fontSize:14,marginBottom:3,color:C.text}}>{c.title}</div>
                          <div style={{color:C.text3,fontSize:13,lineHeight:1.6}}>{c.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab===3&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em"}}>Launch checklist — {form.state}</div>
                    <span style={{fontSize:12,color:doneCount===total&&total>0?C.green:C.text3,fontWeight:600}}>{doneCount}/{total} done</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                    {(report.checklist||[]).map((cat,ci)=>(
                      <div key={ci}>
                        <div style={{fontSize:11,fontWeight:600,color:C.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{cat.category}</div>
                        <div style={{display:"flex",flexDirection:"column",gap:4}}>
                          {cat.items.map((item,ii)=>{
                            const k=`${ci}-${ii}`;const done=checked[k];
                            return (
                              <div key={ii} onClick={()=>setChecked(p=>({...p,[k]:!p[k]}))} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 10px",borderRadius:8,background:done?C.greenbg:"#1a1a1a",cursor:"pointer",border:`1px solid ${done?C.green2:C.border}`}}>
                                <div style={{width:17,height:17,borderRadius:4,border:`1.5px solid ${done?C.green:C.border2}`,background:done?C.green:"transparent",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                                  {done&&<i className="ti ti-check" style={{fontSize:10,color:"#000"}}/>}
                                </div>
                                <span style={{fontSize:13,color:done?C.green:C.text2,textDecoration:done?"line-through":"none",lineHeight:1.5}}>{item}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab===4&&(
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14}}>Funding opportunities</div>
                  <div style={{background:C.greenbg,border:`1px solid ${C.green2}`,borderRadius:8,padding:"10px 14px",display:"flex",gap:8,marginBottom:16}}>
                    <i className="ti ti-info-circle" style={{fontSize:15,color:C.green,flexShrink:0,marginTop:1}}/>
                    <div style={{fontSize:13,color:C.green,lineHeight:1.6}}>These are federal and {form.state}-specific programs your business may qualify for. Always verify eligibility directly with the program.</div>
                  </div>
                  {(report.funding||[]).length===0?(
                    <div style={{textAlign:"center",padding:"2rem",color:C.text3}}>No specific funding programs found. Try regenerating your report.</div>
                  ):(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      {(report.funding||[]).map((f,i)=>{
                        const typeColor={"Grant":C.green,"Loan":"#3b82f6","Tax Credit":C.amber,"Other":C.text3};
                        const typeBg={"Grant":C.greenbg,"Loan":"rgba(59,130,246,0.1)","Tax Credit":C.amberbg,"Other":"#1a1a1a"};
                        const typeBorder={"Grant":C.green2,"Loan":"#1d4ed8","Tax Credit":"#92400e","Other":C.border};
                        return (
                          <div key={i} style={{background:"#111",border:`1px solid ${C.border}`,borderRadius:10,padding:"14px"}}>
                            <span style={{display:"inline-block",background:typeBg[f.type]||"#1a1a1a",color:typeColor[f.type]||C.text3,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,marginBottom:8,border:`1px solid ${typeBorder[f.type]||C.border}`}}>{f.type}</span>
                            <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:6}}>{f.name}</div>
                            <div style={{fontSize:13,color:C.text2,marginBottom:8,lineHeight:1.5}}>{f.description}</div>
                            <div style={{fontSize:12,color:C.text3,padding:"8px",background:"#1a1a1a",borderRadius:6}}><strong style={{color:C.text2}}>Eligibility:</strong> {f.eligibility}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {tab===5&&(
                <div>
                  <div style={{fontSize:11,fontWeight:600,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14}}>Estimated cost to first sale</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                    <div style={{background:C.greenbg,borderRadius:10,padding:"16px",textAlign:"center",border:`1px solid ${C.green2}`}}>
                      <div style={{fontSize:11,color:C.green,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Minimum</div>
                      <div style={{fontSize:26,fontWeight:700,color:C.green}}>${(report.costs?.total_low||0).toLocaleString()}</div>
                    </div>
                    <div style={{background:"#1a1a1a",borderRadius:10,padding:"16px",textAlign:"center",border:`1px solid ${C.border}`}}>
                      <div style={{fontSize:11,color:C.text3,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Comfortable</div>
                      <div style={{fontSize:26,fontWeight:700,color:C.text}}>${(report.costs?.total_high||0).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{borderRadius:8,overflow:"hidden",border:`1px solid ${C.border}`}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",padding:"8px 12px",background:"#1a1a1a",gap:8}}>
                      <span style={{fontSize:11,fontWeight:600,color:C.text3}}>EXPENSE</span>
                      <span style={{fontSize:11,fontWeight:600,color:C.green,textAlign:"right"}}>LOW</span>
                      <span style={{fontSize:11,fontWeight:600,color:C.text2,textAlign:"right"}}>HIGH</span>
                    </div>
                    {(report.costs?.breakdown||[]).map((row,i)=>(
                      <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",padding:"10px 12px",borderTop:`1px solid ${C.border}`,gap:8,alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:13,color:C.text}}>{row.item}</div>
                          {row.note&&<div style={{fontSize:11,color:C.text3,marginTop:1}}>{row.note}</div>}
                        </div>
                        <div style={{fontSize:13,color:C.green,textAlign:"right",fontWeight:600}}>${row.low.toLocaleString()}</div>
                        <div style={{fontSize:13,color:C.text2,textAlign:"right",fontWeight:500}}>${row.high.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </DarkCard>
          </div>
        </div>
      </>
    );
  }
  return null;
}
