import { useState, useRef, useEffect } from "react";

const EMAILJS_SERVICE_ID = "service_fx38y6i";
const EMAILJS_TEMPLATE_ID = "template_7iaql2o";
const EMAILJS_PUBLIC_KEY = "j3czFp8ResoC6DiuK";
const SUPABASE_URL = "https://sojwfzoitieeypnkgakh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvandmem9pdGllZXlwbmtnYWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTY4MTgsImV4cCI6MjA5ODA3MjgxOH0.8FwNq9ygMwPqQot5Ekgk2YJcfBfSxg38nNBJKYq4DYI";

const db = {
  async saveReport(userId, form, report) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
      method: "POST",
      headers: {"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"return=representation"},
      body: JSON.stringify({
        user_id: userId,
        idea: form.idea,
        city: form.city,
        state: form.state,
        type: form.type,
        report_data: JSON.stringify(report)
      })
    });
    const data = await res.json();
    console.log("Save report response:", data);
    return data;
  },
  async deleteReport(reportId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}`, {
      method: "DELETE",
      headers: {"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
    });
    return res.ok;
  },
  async getReports(userId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reports?user_id=eq.${userId}&order=created_at.desc`, {
      headers: {"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
    });
    return res.json();
  },
  async createUser(name, email, passwordHash) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"return=representation"},
      body: JSON.stringify({name,email,password_hash:passwordHash})
    });
    return res.json();
  },
  async getUser(email) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&limit=1`, {
      headers: {"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}
    });
    const data = await res.json();
    return data[0] || null;
  }
};

async function hashPassword(password) {
  const buf = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", buf);
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

const TABS = [{id:0,label:"Feasibility",icon:"ti-star"},{id:1,label:"Competition",icon:"ti-trophy"},{id:2,label:"Challenges",icon:"ti-alert-triangle"},{id:3,label:"Checklist",icon:"ti-checklist"},{id:4,label:"Budget",icon:"ti-currency-dollar"}];

const G = {
  50:"#EAF3DE",100:"#C0DD97",200:"#97C459",400:"#639922",600:"#3B6D11",800:"#27500A",
  a50:"#FAEEDA",a400:"#BA7517",a800:"#633806",
  r50:"#FCEBEB",r400:"#E24B4A",r800:"#791F1F",
};

const compMeta = {
  Low:{color:G[600],bg:G[50],text:G[800]},
  Medium:{color:G.a400,bg:G.a50,text:G.a800},
  High:{color:G.r400,bg:G.r50,text:G.r800}
};

function Logo({size=44}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{flexShrink:0,borderRadius:14}}>
      <circle cx="50" cy="50" r="50" fill={G[600]}/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
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

function Card({children,style={}}) {
  return <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"1.5rem",...style}}>{children}</div>;
}

function PrimaryBtn({onClick,disabled,children,style={}}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{padding:"10px 24px",borderRadius:8,background:disabled?"var(--color-background-secondary)":G[600],color:disabled?"var(--color-text-tertiary)":"#fff",border:"none",fontWeight:500,fontSize:14,cursor:disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:7,...style}}>
      {children}
    </button>
  );
}

function GhostBtn({onClick,children,style={}}) {
  return (
    <button onClick={onClick} style={{padding:"10px 18px",borderRadius:8,background:"transparent",color:"var(--color-text-secondary)",border:"0.5px solid var(--color-border-secondary)",fontWeight:400,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,...style}}>
      {children}
    </button>
  );
}

function StepDots({step,total=4}) {
  return (
    <div style={{display:"flex",gap:6,marginBottom:"1.5rem"}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{height:4,borderRadius:4,flex:i===step?2:1,background:i<=step?G[600]:"var(--color-border-tertiary)",transition:"all 0.3s"}}/>
      ))}
    </div>
  );
}

function SectionLabel({children}) {
  return <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>{children}</div>;
}

function ScoreRing({score,summary}) {
  const r=40,cx=50,cy=50,circ=2*Math.PI*r;
  const col=score>=7?G[400]:score>=5?G.a400:G.r400;
  const label=score>=7?"Strong":score>=5?"Moderate":"Challenging";
  return (
    <div style={{display:"flex",gap:"2rem",alignItems:"center"}}>
      <svg width={100} height={100} style={{flexShrink:0}}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border-tertiary)" strokeWidth={7}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={7} strokeDasharray={circ} strokeDashoffset={circ*(1-score/10)} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
        <text x={cx} y={cy-4} textAnchor="middle" style={{fontSize:22,fontWeight:500,fill:col}}>{score}</text>
        <text x={cx} y={cy+12} textAnchor="middle" style={{fontSize:10,fill:"var(--color-text-tertiary)"}}>/ 10</text>
      </svg>
      <div>
        <div style={{display:"inline-block",background:score>=7?G[50]:score>=5?G.a50:G.r50,color:score>=7?G[800]:score>=5?G.a800:G.r800,fontSize:12,fontWeight:500,padding:"3px 10px",borderRadius:20,marginBottom:8}}>{label}</div>
        <p style={{fontSize:14,color:"var(--color-text-secondary)",lineHeight:1.7,margin:0}}>{summary}</p>
      </div>
    </div>
  );
}

function Loader() {
  const msgs=["Researching your market...","Checking local competition...","Building your checklist...","Estimating startup costs..."];
  const [idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%msgs.length),2000);return()=>clearInterval(t);},[]);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"5rem 2rem",gap:"2rem"}}>
      <div style={{position:"relative",width:64,height:64}}>
        <div style={{width:64,height:64,border:`3px solid ${G[50]}`,borderTop:`3px solid ${G[600]}`,borderRadius:"50%",animation:"spin 0.9s linear infinite"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}><Logo size={36}/></div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:17,fontWeight:500,marginBottom:6}}>Generating your report</div>
        <div style={{fontSize:13,color:"var(--color-text-tertiary)",minHeight:20}}>{msgs[idx]}</div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function Navbar({user,onLogout,onShowAuth,onShowDashboard,onHome}) {
  return (
    <div style={{borderBottom:"0.5px solid var(--color-border-tertiary)",padding:"0 2rem",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--color-background-primary)",position:"sticky",top:0,zIndex:10}}>
      <div onClick={onHome} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
        <Logo size={32}/>
        <span style={{fontSize:16,fontWeight:700,color:"var(--color-text-primary)",letterSpacing:"0.05em"}}>INVENIO</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {user ? (
          <>
            <button onClick={onShowDashboard} style={{fontSize:13,padding:"6px 14px",borderRadius:8,background:G[50],color:G[800],border:`0.5px solid ${G[100]}`,cursor:"pointer",fontWeight:500,display:"flex",alignItems:"center",gap:5}}>
              <i className="ti ti-layout-dashboard" style={{fontSize:13}}/>My reports
            </button>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:G[600],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:500}}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{user.name}</span>
              <button onClick={onLogout} style={{fontSize:12,color:"var(--color-text-tertiary)",background:"none",border:"none",cursor:"pointer"}}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <button onClick={onShowAuth} style={{fontSize:13,padding:"6px 14px",borderRadius:8,background:"transparent",border:"0.5px solid var(--color-border-secondary)",color:"var(--color-text-secondary)",cursor:"pointer"}}>Log in</button>
            <PrimaryBtn onClick={onShowAuth} style={{padding:"7px 16px",fontSize:13}}>Sign up</PrimaryBtn>
          </>
        )}
      </div>
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

  async function handleSignup() {
    if(!name.trim()||!email.trim()||!password.trim()){setErr("All fields required.");return;}
    if(password.length<6){setErr("Password must be at least 6 characters.");return;}
    setLoading(true);setErr("");
    try {
      const existing=await db.getUser(email);
      if(existing){setErr("Email already registered. Please log in.");setLoading(false);return;}
      const hash=await hashPassword(password);
      const users=await db.createUser(name,email,hash);
      if(users&&users[0]){onLogin({id:users[0].id,name,email});}
      else{setErr("Signup failed. Please try again.");}
    } catch{setErr("Something went wrong. Try again.");}
    setLoading(false);
  }

  async function handleLogin() {
    if(!email.trim()||!password.trim()){setErr("All fields required.");return;}
    setLoading(true);setErr("");
    try {
      const user=await db.getUser(email);
      if(!user){setErr("No account found. Please sign up.");setLoading(false);return;}
      const hash=await hashPassword(password);
      if(hash!==user.password_hash){setErr("Incorrect password.");setLoading(false);return;}
      onLogin({id:user.id,name:user.name,email:user.email});
    } catch{setErr("Something went wrong. Try again.");}
    setLoading(false);
  }

  return (
    <div style={{minHeight:"100vh",background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <Card style={{maxWidth:420,width:"100%",padding:"2rem"}}>
        {mode==="choose"&&(
          <div>
            <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
              <Logo size={48}/>
              <div style={{fontSize:20,fontWeight:700,marginTop:12,marginBottom:4}}>Welcome to INVENIO</div>
              <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>Create an account to save your reports or continue as guest</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <PrimaryBtn onClick={()=>setMode("signup")} style={{justifyContent:"center",width:"100%",boxSizing:"border-box"}}>
                <i className="ti ti-user-plus" style={{fontSize:15}}/>Create account
              </PrimaryBtn>
              <GhostBtn onClick={()=>setMode("login")} style={{justifyContent:"center",width:"100%",boxSizing:"border-box"}}>
                <i className="ti ti-login" style={{fontSize:15}}/>Log in
              </GhostBtn>
              <button onClick={onGuest} style={{padding:"10px",borderRadius:8,background:"transparent",color:"var(--color-text-tertiary)",border:"none",fontSize:13,cursor:"pointer"}}>
                Continue as guest (reports won't be saved)
              </button>
            </div>
          </div>
        )}
        {mode==="signup"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1.5rem"}}>
              <button onClick={()=>setMode("choose")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)"}}><i className="ti ti-arrow-left" style={{fontSize:18}}/></button>
              <div style={{fontSize:17,fontWeight:500}}>Create account</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:"1rem"}}>
              <div>
                <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Full name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. John Smith" style={{width:"100%",boxSizing:"border-box",fontSize:14}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Email address</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="john@email.com" type="email" style={{width:"100%",boxSizing:"border-box",fontSize:14}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Password</label>
                <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" type="password" style={{width:"100%",boxSizing:"border-box",fontSize:14}}/>
              </div>
              {err&&<div style={{fontSize:12,color:G.r400}}><i className="ti ti-alert-circle" style={{fontSize:13,verticalAlign:-1}}/> {err}</div>}
            </div>
            <PrimaryBtn onClick={handleSignup} disabled={loading} style={{width:"100%",justifyContent:"center",boxSizing:"border-box"}}>
              {loading?"Creating account...":"Create account"}
            </PrimaryBtn>
            <p style={{textAlign:"center",fontSize:12,color:"var(--color-text-tertiary)",marginTop:12}}>Already have an account? <button onClick={()=>setMode("login")} style={{background:"none",border:"none",color:G[600],cursor:"pointer",fontSize:12,fontWeight:500}}>Log in</button></p>
          </div>
        )}
        {mode==="login"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1.5rem"}}>
              <button onClick={()=>setMode("choose")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--color-text-tertiary)"}}><i className="ti ti-arrow-left" style={{fontSize:18}}/></button>
              <div style={{fontSize:17,fontWeight:500}}>Log in</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:"1rem"}}>
              <div>
                <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Email address</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="john@email.com" type="email" style={{width:"100%",boxSizing:"border-box",fontSize:14}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Password</label>
                <input value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Your password" type="password" style={{width:"100%",boxSizing:"border-box",fontSize:14}}/>
              </div>
              {err&&<div style={{fontSize:12,color:G.r400}}><i className="ti ti-alert-circle" style={{fontSize:13,verticalAlign:-1}}/> {err}</div>}
            </div>
            <PrimaryBtn onClick={handleLogin} disabled={loading} style={{width:"100%",justifyContent:"center",boxSizing:"border-box"}}>
              {loading?"Logging in...":"Log in"}
            </PrimaryBtn>
            <p style={{textAlign:"center",fontSize:12,color:"var(--color-text-tertiary)",marginTop:12}}>No account? <button onClick={()=>setMode("signup")} style={{background:"none",border:"none",color:G[600],cursor:"pointer",fontSize:12,fontWeight:500}}>Sign up</button></p>
          </div>
        )}
      </Card>
    </div>
  );
}

function Dashboard({user,onClose,onViewReport}) {
  const [reports,setReports]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    db.getReports(user.id).then(data=>{setReports(Array.isArray(data)?data:[]);setLoading(false);});
  },[]);

  async function handleDelete(e, reportId) {
    e.stopPropagation();
    if(!window.confirm("Delete this report?")) return;
    await db.deleteReport(reportId);
    setReports(prev=>prev.filter(r=>r.id!==reportId));
  }

  function handleView(r) {
    try {
      const reportData = r.report_data
        ? (typeof r.report_data === "string" ? JSON.parse(r.report_data) : r.report_data)
        : null;
      if(!reportData){alert("Report data not found.");return;}
      const html=`<!DOCTYPE html><html><head><title>${r.idea}</title><style>body{font-family:Inter,sans-serif;max-width:800px;margin:0 auto;padding:32px;color:#1a1a1a;line-height:1.7}h1{color:#3B6D11;font-size:24px}h2{color:#3B6D11;font-size:16px;margin-top:24px;border-bottom:1px solid #EAF3DE;padding-bottom:6px}table{width:100%;border-collapse:collapse;font-size:13px}th{background:#EAF3DE;padding:8px;text-align:left;color:#27500A}td{padding:8px;border-bottom:1px solid #eee}ul{margin:4px 0;padding-left:20px}li{margin-bottom:4px}.score{font-size:32px;font-weight:bold;color:#3B6D11}.footer{margin-top:40px;font-size:11px;color:#aaa;border-top:1px solid #eee;padding-top:12px;text-align:center}</style></head><body>
      <h1>Business Feasibility Report</h1>
      <p style="color:#888;font-size:13px">${r.type} · ${r.city}, ${r.state} · ${new Date(r.created_at).toLocaleDateString()}</p>
      <h2>Business Idea</h2><p>${r.idea}</p>
      <h2>Feasibility Score</h2><p class="score">${reportData.feasibility?.score||"?"}/10</p><p>${reportData.feasibility?.summary||""}</p>
      <h2>Competition — ${reportData.competition?.level||""}</h2><p>${reportData.competition?.summary||""}</p><p><strong>Market gap:</strong> ${reportData.competition?.gap||""}</p>
      <h2>Challenges</h2>${(reportData.challenges||[]).map((c,i)=>`<p><strong>${i+1}. ${c.title}</strong><br/>${c.detail}</p>`).join("")}
      <h2>Launch Checklist — ${r.state}</h2>${(reportData.checklist||[]).map(cat=>`<p><strong>${cat.category}</strong></p><ul>${cat.items.map(it=>`<li>${it}</li>`).join("")}</ul>`).join("")}
      <h2>Estimated Budget</h2><p><strong style="color:#3B6D11">Minimum: ${(reportData.costs?.total_low||0).toLocaleString()}</strong> &nbsp;|&nbsp; <strong>Comfortable: ${(reportData.costs?.total_high||0).toLocaleString()}</strong></p>
      <table><tr><th>Expense</th><th>Low</th><th>High</th></tr>${(reportData.costs?.breakdown||[]).map(row=>`<tr><td>${row.item}</td><td style="color:#3B6D11">${row.low.toLocaleString()}</td><td>${row.high.toLocaleString()}</td></tr>`).join("")}</table>
      <p class="footer">Generated by INVENIO · AI-powered Business Feasibility Reports · ${new Date().toLocaleDateString()}</p>
      </body></html>`;
      const blob=new Blob([html],{type:"text/html"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;
      a.download=`Invenio-Report-${r.type.replace(/[^a-z0-9]/gi,"-")}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {
      console.error("Failed to load report:", e);
      alert("Could not load this report. Please generate a new one.");
    }
  }
  return (
    <div style={{minHeight:"calc(100vh - 60px)",background:"var(--color-background-secondary)",padding:"2rem"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem"}}>
          <div>
            <h1 style={{fontSize:22,fontWeight:500,margin:"0 0 4px"}}>My reports</h1>
            <div style={{fontSize:13,color:"var(--color-text-tertiary)"}}>Welcome back, {user.name}!</div>
          </div>
          <PrimaryBtn onClick={onClose}><i className="ti ti-plus" style={{fontSize:14}}/>New report</PrimaryBtn>
        </div>
        {loading?(
          <div style={{textAlign:"center",padding:"3rem",color:"var(--color-text-tertiary)"}}>Loading your reports...</div>
        ):reports.length===0?(
          <Card style={{textAlign:"center",padding:"3rem"}}>
            <i className="ti ti-file-off" style={{fontSize:40,color:"var(--color-text-tertiary)",display:"block",marginBottom:12}}/>
            <div style={{fontSize:16,fontWeight:500,marginBottom:6}}>No reports yet</div>
            <div style={{fontSize:13,color:"var(--color-text-tertiary)",marginBottom:"1.5rem"}}>Generate your first business feasibility report to get started</div>
            <PrimaryBtn onClick={onClose}><i className="ti ti-sparkles" style={{fontSize:14}}/>Generate a report</PrimaryBtn>
          </Card>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
            {reports.map((r,i)=>(
              <Card key={i} style={{cursor:"pointer",position:"relative"}} onClick={()=>handleView(r)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{width:36,height:36,borderRadius:8,background:G[50],display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <i className="ti ti-file-text" style={{fontSize:18,color:G[600]}}/>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,background:G[50],color:G[800],padding:"2px 8px",borderRadius:20,fontWeight:500}}>{r.report_data?.feasibility?.score||"?"}/10</span>
                    <button onClick={e=>handleDelete(e,r.id)} style={{width:26,height:26,borderRadius:6,background:G.r50,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <i className="ti ti-trash" style={{fontSize:13,color:G.r400}}/>
                    </button>
                  </div>
                </div>
                <div style={{fontSize:14,fontWeight:500,marginBottom:4,lineHeight:1.3}}>{r.idea?.length>60?r.idea.slice(0,60)+"...":r.idea}</div>
                <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:8}}>{r.type} · {r.city}, {r.state}</div>
                <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{new Date(r.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
              </Card>
            ))}
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
    const saved=localStorage.getItem("invenio_user");
    if(saved) try{setUser(JSON.parse(saved));}catch{}
  },[]);

  function goHome() {
    setPhase("form");setStep(0);setReport(null);setChecked({});
    setShowDashboard(false);setShowGuestGate(false);setShowAuth(false);
  }

  function handleLogin(u) {
    setUser(u);
    localStorage.setItem("invenio_user",JSON.stringify(u));
    setShowAuth(false);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem("invenio_user");
    goHome();
  }

  const valid=[form.idea.trim().length>10,form.state&&form.city.trim(),form.type,true];

  async function analyze(name,email) {
    setShowGuestGate(false);
    setPhase("loading");
    if(window.emailjs){
      window.emailjs.send(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,{user_name:name,user_email:email,business_idea:form.idea,city:form.city,state:form.state,business_type:form.type}).catch(()=>{});
    }
    const prompt=`You are a small business advisor. Return ONLY a valid JSON object, no markdown:
{"feasibility":{"score":<1-10>,"summary":"<2-3 sentences>"},"competition":{"level":"<Low|Medium|High>","summary":"<2-3 sentences about ${form.city}, ${form.state}>","competitors":["<type1>","<type2>","<type3>"],"gap":"<one sentence>"},"challenges":[{"title":"<title>","detail":"<1-2 sentences>"},{"title":"<title>","detail":"<1-2 sentences>"},{"title":"<title>","detail":"<1-2 sentences>"},{"title":"<title>","detail":"<1-2 sentences>"}],"checklist":[{"category":"Legal & registration","items":["<step>","<step>","<step>"]},{"category":"Financial setup","items":["<step>","<step>"]},{"category":"Operations","items":["<step>","<step>","<step>"]},{"category":"Marketing & launch","items":["<step>","<step>"]}],"costs":{"total_low":<number>,"total_high":<number>,"breakdown":[{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"}]}}
Business: ${form.idea} | State: ${form.state} | City: ${form.city} | Type: ${form.type} | ${form.location==="home"?"Home-based":"Physical location"}`;
    try {
      const res=await fetch("/api/proxy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const txt=data.content.find(b=>b.type==="text")?.text||"";
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setReport(parsed);
      if(user){
        const saved=await db.saveReport(user.id,form,parsed);
        console.log("Saved:",saved);
      }
      setPhase("report");
    } catch(e){console.error(e);alert("Analysis failed. Please try again.");setPhase("form");}
  }

  function handleGenerate() {
    if(user){analyze(user.name,user.email);}
    else{setShowGuestGate(true);}
  }

  if(showAuth) return <AuthModal onLogin={handleLogin} onGuest={()=>{setShowAuth(false);setShowGuestGate(true);}}/>;

  if(showDashboard) return (
    <>
      <Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/>
      <Dashboard user={user} onClose={()=>setShowDashboard(false)} onViewReport={(idea,city,state,type,reportData)=>{
        setForm({idea,city,state,type,location:"home"});
        setReport(reportData);
        setShowDashboard(false);
        setPhase("report");
      }}/>
    </>
  );

  if(phase==="loading") return (
    <>
      <Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/>
      <Loader/>
    </>
  );

  if(showGuestGate) return (
    <>
      <Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/>
      <div style={{minHeight:"calc(100vh - 60px)",background:"var(--color-background-secondary)",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
        <Card style={{maxWidth:460,width:"100%",padding:"2rem"}}>
          <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
            <div style={{width:52,height:52,borderRadius:16,background:G[50],display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
              <i className="ti ti-mail" style={{fontSize:24,color:G[600]}}/>
            </div>
            <div style={{fontSize:18,fontWeight:500,marginBottom:6}}>Almost ready</div>
            <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>Create a free account to save your reports, or continue as guest</div>
          </div>
          <PrimaryBtn onClick={()=>{setShowGuestGate(false);setShowAuth(true);}} style={{width:"100%",justifyContent:"center",boxSizing:"border-box",marginBottom:14}}>
            <i className="ti ti-user-plus" style={{fontSize:14}}/>Create account
          </PrimaryBtn>
          <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:14}}>
            <div style={{fontSize:12,color:"var(--color-text-tertiary)",marginBottom:10,textAlign:"center"}}>Or continue as guest</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div>
                <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Your name</label>
                <input value={guestInfo.name} onChange={e=>setGuestInfo(p=>({...p,name:e.target.value}))} placeholder="e.g. John Smith" style={{width:"100%",boxSizing:"border-box",fontSize:14}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Email address</label>
                <input value={guestInfo.email} onChange={e=>setGuestInfo(p=>({...p,email:e.target.value}))} placeholder="john@email.com" type="email" style={{width:"100%",boxSizing:"border-box",fontSize:14}}/>
              </div>
              <GhostBtn onClick={()=>{if(guestInfo.name&&guestInfo.email)analyze(guestInfo.name,guestInfo.email);}} style={{justifyContent:"center",width:"100%",boxSizing:"border-box"}}>
                Continue as guest
              </GhostBtn>
            </div>
          </div>
        </Card>
      </div>
    </>
  );

  if(phase==="form") return (
    <>
      <Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/>
      <div style={{minHeight:"calc(100vh - 60px)",background:"var(--color-background-secondary)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"3rem 2rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"start"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:G[50],color:G[800],fontSize:12,fontWeight:500,padding:"4px 12px",borderRadius:20,marginBottom:16}}>
              <i className="ti ti-sparkles" style={{fontSize:13}}/>AI-powered analysis
            </div>
            <h1 style={{fontSize:36,fontWeight:500,lineHeight:1.2,margin:"0 0 16px"}}>Turn your business idea into a plan</h1>
            <p style={{fontSize:16,color:"var(--color-text-secondary)",lineHeight:1.7,margin:"0 0 2rem"}}>Invenio gives you a comprehensive Business Feasibility Report in seconds — personalized to your idea, city, and state.</p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[["ti-star","Feasibility score","Rated 1-10 with detailed reasoning"],["ti-trophy","Competition analysis","Real competitors in your area with market gaps"],["ti-checklist","State-specific checklist","Every legal and operational step to launch"],["ti-currency-dollar","Cost estimate","Realistic budget from $0 to first sale"]].map(([icon,title,desc])=>(
                <div key={title} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,borderRadius:8,background:G[50],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <i className={`ti ${icon}`} style={{fontSize:17,color:G[600]}}/>
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:500,marginBottom:2}}>{title}</div>
                    <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Card style={{padding:"2rem"}}>
            <StepDots step={step}/>
            {step===0&&(
              <div>
                <label style={{fontSize:14,fontWeight:500,display:"block",marginBottom:4}}>What's your business idea?</label>
                <span style={{fontSize:12,color:"var(--color-text-tertiary)",display:"block",marginBottom:10}}>Describe it in a sentence or two</span>
                <textarea value={form.idea} onChange={e=>setForm(p=>({...p,idea:e.target.value}))} placeholder="e.g. A home-based bakery specialising in custom cakes..." rows={4} style={{width:"100%",resize:"vertical",fontSize:14,padding:"10px 12px",borderRadius:8,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",boxSizing:"border-box",lineHeight:1.6}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
                  <span style={{fontSize:12,color:form.idea.length>10?G[600]:"var(--color-text-tertiary)"}}>{form.idea.length>10?"✓ Ready":"At least 10 characters"}</span>
                  <PrimaryBtn onClick={()=>setStep(1)} disabled={!valid[0]}>Continue <i className="ti ti-arrow-right" style={{fontSize:14}}/></PrimaryBtn>
                </div>
              </div>
            )}
            {step===1&&(
              <div>
                <label style={{fontSize:14,fontWeight:500,display:"block",marginBottom:4}}>Where are you located?</label>
                <span style={{fontSize:12,color:"var(--color-text-tertiary)",display:"block",marginBottom:12}}>Determines your legal checklist and cost estimates</span>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  <div>
                    <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:5}}>State</div>
                    <select value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))} style={{width:"100%",fontSize:14}}>
                      <option value="">Select state...</option>
                      {US_STATES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:5}}>City</div>
                    <input value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} placeholder="e.g. Austin" style={{width:"100%",fontSize:14,boxSizing:"border-box"}}/>
                  </div>
                </div>
                <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:8}}>Where will you operate?</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  {[["home","ti-home","Home-based","From your home"],["physical","ti-building","Physical location","Storefront or office"]].map(([val,icon,title,sub])=>(
                    <button key={val} onClick={()=>setForm(p=>({...p,location:val}))} style={{padding:"12px",borderRadius:8,border:`1.5px solid ${form.location===val?G[600]:"var(--color-border-tertiary)"}`,background:form.location===val?G[50]:"var(--color-background-primary)",cursor:"pointer",textAlign:"left"}}>
                      <i className={`ti ${icon}`} style={{fontSize:18,color:form.location===val?G[600]:"var(--color-text-tertiary)",display:"block",marginBottom:5}}/>
                      <div style={{fontSize:13,fontWeight:500,color:form.location===val?G[800]:"var(--color-text-primary)",marginBottom:2}}>{title}</div>
                      <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{sub}</div>
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <GhostBtn onClick={()=>setStep(0)}><i className="ti ti-arrow-left" style={{fontSize:14}}/>Back</GhostBtn>
                  <PrimaryBtn onClick={()=>setStep(2)} disabled={!valid[1]}>Continue <i className="ti ti-arrow-right" style={{fontSize:14}}/></PrimaryBtn>
                </div>
              </div>
            )}
            {step===2&&(
              <div>
                <label style={{fontSize:14,fontWeight:500,display:"block",marginBottom:4}}>What type of business?</label>
                <span style={{fontSize:12,color:"var(--color-text-tertiary)",display:"block",marginBottom:10}}>Select the category that best fits</span>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:16,maxHeight:280,overflowY:"auto"}}>
                  {BUSINESS_TYPES.map(t=>(
                    <button key={t} onClick={()=>setForm(p=>({...p,type:t}))} style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${form.type===t?G[600]:"var(--color-border-tertiary)"}`,background:form.type===t?G[50]:"var(--color-background-primary)",color:form.type===t?G[800]:"var(--color-text-secondary)",fontWeight:form.type===t?500:400,fontSize:13,cursor:"pointer",textAlign:"left"}}>
                      {t}
                    </button>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <GhostBtn onClick={()=>setStep(1)}><i className="ti ti-arrow-left" style={{fontSize:14}}/>Back</GhostBtn>
                  <PrimaryBtn onClick={()=>setStep(3)} disabled={!valid[2]}>Continue <i className="ti ti-arrow-right" style={{fontSize:14}}/></PrimaryBtn>
                </div>
              </div>
            )}
            {step===3&&(
              <div>
                <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:14}}>Review your details</div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
                  {[["ti-bulb","Business idea",form.idea.length>80?form.idea.slice(0,80)+"...":form.idea],["ti-map-pin","Location",`${form.city}, ${form.state}`],["ti-briefcase","Business type",form.type],["ti-home","Setup",form.location==="home"?"Home-based":"Physical location"]].map(([icon,label,val])=>(
                    <div key={label} style={{display:"flex",gap:10,padding:"10px 12px",borderRadius:8,background:"var(--color-background-secondary)"}}>
                      <div style={{width:30,height:30,borderRadius:6,background:G[50],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <i className={`ti ${icon}`} style={{fontSize:15,color:G[600]}}/>
                      </div>
                      <div>
                        <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:1}}>{label}</div>
                        <div style={{fontSize:13,lineHeight:1.4}}>{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <GhostBtn onClick={()=>setStep(2)}><i className="ti ti-arrow-left" style={{fontSize:14}}/>Back</GhostBtn>
                  <PrimaryBtn onClick={handleGenerate}>
                    <i className="ti ti-sparkles" style={{fontSize:15}}/>Generate my report
                  </PrimaryBtn>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );

  if(phase==="report"&&report) {
    const compLevel=report?.competition?.level||"Medium";
    const cm=compMeta[compLevel]||compMeta.Medium;
    const doneCount=Object.values(checked).filter(Boolean).length;
    const total=(report.checklist||[]).reduce((a,c)=>a+c.items.length,0);
    const score=report.feasibility?.score||0;
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} onShowAuth={()=>setShowAuth(true)} onShowDashboard={()=>setShowDashboard(true)} onHome={goHome}/>
        <div style={{background:"var(--color-background-secondary)",minHeight:"calc(100vh - 60px)"}}>
          <div style={{maxWidth:1100,margin:"0 auto",padding:"2rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",flexWrap:"wrap",gap:12}}>
              <div>
                <h1 style={{fontSize:20,fontWeight:500,margin:"0 0 4px"}}>{form.idea.length>60?form.idea.slice(0,60)+"...":form.idea}</h1>
                <div style={{fontSize:13,color:"var(--color-text-tertiary)"}}>{form.type} · {form.city}, {form.state}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                {user&&<div style={{fontSize:12,background:G[50],color:G[800],padding:"5px 12px",borderRadius:20,display:"flex",alignItems:"center",gap:5,fontWeight:500}}><i className="ti ti-check" style={{fontSize:12}}/>Report saved</div>}
                <button onClick={goHome} style={{fontSize:13,padding:"8px 16px",borderRadius:8,background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-secondary)",color:"var(--color-text-secondary)",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  <i className="ti ti-refresh" style={{fontSize:14}}/>New report
                </button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:"1.5rem"}}>
              {[
                {label:"Feasibility score",value:`${score}/10`,color:score>=7?G[600]:score>=5?G.a400:G.r400,bg:score>=7?G[50]:score>=5?G.a50:G.r50,icon:"ti-star"},
                {label:"Competition level",value:compLevel,color:cm.color,bg:cm.bg,icon:"ti-trophy"},
                {label:"Tasks completed",value:`${doneCount}/${total}`,color:G[600],bg:G[50],icon:"ti-checklist"},
                {label:"Min. budget",value:`$${(report.costs?.total_low||0).toLocaleString()}`,color:G[600],bg:G[50],icon:"ti-currency-dollar"},
              ].map(m=>(
                <Card key={m.label} style={{padding:"1rem"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{width:28,height:28,borderRadius:6,background:m.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <i className={`ti ${m.icon}`} style={{fontSize:14,color:m.color}}/>
                    </div>
                    <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{m.label}</div>
                  </div>
                  <div style={{fontSize:18,fontWeight:500,color:m.color}}>{m.value}</div>
                </Card>
              ))}
            </div>
            <Card>
              <div style={{display:"flex",gap:6,marginBottom:"1.25rem",flexWrap:"wrap"}}>
                {TABS.map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 16px",borderRadius:20,border:`1.5px solid ${tab===t.id?G[600]:"var(--color-border-tertiary)"}`,background:tab===t.id?G[600]:"transparent",color:tab===t.id?"#fff":"var(--color-text-secondary)",fontWeight:tab===t.id?500:400,fontSize:13,cursor:"pointer"}}>
                    <i className={`ti ${t.icon}`} style={{fontSize:13}}/>{t.label}
                  </button>
                ))}
              </div>
              {tab===0&&<div><SectionLabel>Feasibility rating</SectionLabel><ScoreRing score={score} summary={report.feasibility?.summary||""}/></div>}
              {tab===1&&(
                <div>
                  <SectionLabel>Competition in {form.city}</SectionLabel>
                  <div style={{display:"inline-flex",alignItems:"center",gap:6,background:cm.bg,color:cm.text,fontSize:12,fontWeight:500,padding:"4px 12px",borderRadius:20,marginBottom:14}}>{compLevel} competition</div>
                  <p style={{fontSize:14,color:"var(--color-text-secondary)",lineHeight:1.75,marginBottom:14}}>{report.competition?.summary||""}</p>
                  <div style={{fontSize:12,fontWeight:500,marginBottom:8}}>Likely competitors nearby</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                    {(report.competition?.competitors||[]).map((c,i)=><span key={i} style={{background:G[50],color:G[800],fontSize:12,fontWeight:500,padding:"3px 10px",borderRadius:20}}>{c}</span>)}
                  </div>
                  <div style={{background:G[50],borderRadius:8,padding:"10px 14px",display:"flex",gap:8}}>
                    <i className="ti ti-bulb" style={{fontSize:15,color:G[600],flexShrink:0,marginTop:1}}/>
                    <div style={{fontSize:13,color:G[800],lineHeight:1.6}}><strong>Market gap:</strong> {report.competition?.gap||""}</div>
                  </div>
                </div>
              )}
              {tab===2&&(
                <div>
                  <SectionLabel>Challenges to expect</SectionLabel>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {(report.challenges||[]).map((c,i)=>(
                      <div key={i} style={{display:"flex",gap:12,padding:"12px",background:"var(--color-background-secondary)",borderRadius:8}}>
                        <div style={{width:28,height:28,borderRadius:6,background:G.a50,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                          <span style={{fontSize:12,fontWeight:500,color:G.a800}}>{i+1}</span>
                        </div>
                        <div>
                          <div style={{fontWeight:500,fontSize:14,marginBottom:3}}>{c.title}</div>
                          <div style={{color:"var(--color-text-secondary)",fontSize:13,lineHeight:1.6}}>{c.detail}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tab===3&&(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <SectionLabel>Launch checklist — {form.state}</SectionLabel>
                    <span style={{fontSize:12,color:doneCount===total&&total>0?G[600]:"var(--color-text-tertiary)",fontWeight:500}}>{doneCount}/{total} done</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                    {(report.checklist||[]).map((cat,ci)=>(
                      <div key={ci}>
                        <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{cat.category}</div>
                        <div style={{display:"flex",flexDirection:"column",gap:4}}>
                          {cat.items.map((item,ii)=>{
                            const k=`${ci}-${ii}`;const done=checked[k];
                            return (
                              <div key={ii} onClick={()=>setChecked(p=>({...p,[k]:!p[k]}))} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 10px",borderRadius:8,background:done?G[50]:"var(--color-background-secondary)",cursor:"pointer",border:`0.5px solid ${done?G[100]:"transparent"}`}}>
                                <div style={{width:17,height:17,borderRadius:4,border:`1.5px solid ${done?G[600]:"var(--color-border-secondary)"}`,background:done?G[600]:"transparent",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                                  {done&&<i className="ti ti-check" style={{fontSize:10,color:"#fff"}}/>}
                                </div>
                                <span style={{fontSize:13,color:done?G[800]:"var(--color-text-primary)",textDecoration:done?"line-through":"none",lineHeight:1.5}}>{item}</span>
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
                  <SectionLabel>Estimated cost to first sale</SectionLabel>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                    <div style={{background:G[50],borderRadius:10,padding:"14px",textAlign:"center"}}>
                      <div style={{fontSize:11,color:G[600],fontWeight:500,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Minimum</div>
                      <div style={{fontSize:24,fontWeight:500,color:G[800]}}>${(report.costs?.total_low||0).toLocaleString()}</div>
                    </div>
                    <div style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"14px",textAlign:"center"}}>
                      <div style={{fontSize:11,color:"var(--color-text-tertiary)",fontWeight:500,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Comfortable</div>
                      <div style={{fontSize:24,fontWeight:500}}>${(report.costs?.total_high||0).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{borderRadius:8,overflow:"hidden",border:"0.5px solid var(--color-border-tertiary)"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",padding:"8px 12px",background:"var(--color-background-secondary)",gap:8}}>
                      <span style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)"}}>EXPENSE</span>
                      <span style={{fontSize:11,fontWeight:500,color:G[600],textAlign:"right"}}>LOW</span>
                      <span style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textAlign:"right"}}>HIGH</span>
                    </div>
                    {(report.costs?.breakdown||[]).map((row,i)=>(
                      <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px",padding:"10px 12px",borderTop:"0.5px solid var(--color-border-tertiary)",gap:8,alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:13}}>{row.item}</div>
                          {row.note&&<div style={{fontSize:11,color:"var(--color-text-tertiary)",marginTop:1}}>{row.note}</div>}
                        </div>
                        <div style={{fontSize:13,color:G[600],textAlign:"right",fontWeight:500}}>${row.low.toLocaleString()}</div>
                        <div style={{fontSize:13,color:"var(--color-text-secondary)",textAlign:"right",fontWeight:500}}>${row.high.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </>
    );
  }
  return null;
}
