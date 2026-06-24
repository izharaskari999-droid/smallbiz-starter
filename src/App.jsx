import { useState, useRef, useEffect } from "react";

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

const P = {
  p50:"#EEEDFE",p100:"#CECBF6",p200:"#AFA9EC",p400:"#7F77DD",p600:"#534AB7",p800:"#3C3489",
  t50:"#E1F5EE",t100:"#9FE1CB",t400:"#1D9E75",t600:"#0F6E56",t800:"#085041",
  a50:"#FAEEDA",a400:"#BA7517",a800:"#633806",
  r50:"#FCEBEB",r400:"#E24B4A",r800:"#791F1F",
};

const compMeta = {
  Low:{color:P.t600,bg:P.t50,text:P.t800},
  Medium:{color:P.a400,bg:P.a50,text:P.a800},
  High:{color:P.r400,bg:P.r50,text:P.r800}
};

function Logo({size=44}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{flexShrink:0,borderRadius:14}}>
      <circle cx="50" cy="50" r="50" fill={P.p600}/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>
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

function BrandHeader() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"2rem"}}>
      <Logo size={44}/>
      <div>
        <div style={{fontSize:18,fontWeight:500,color:"var(--color-text-primary)",lineHeight:1.2}}>SmallBiz Starter</div>
        <div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>AI-powered Business Feasibility Reports</div>
      </div>
    </div>
  );
}

function StepDots({step,total=4}) {
  return (
    <div style={{display:"flex",gap:6,marginBottom:"1.75rem"}}>
      {Array.from({length:total}).map((_,i)=>(
        <div key={i} style={{height:4,borderRadius:4,flex:i===step?2:1,background:i<=step?P.p600:"var(--color-border-tertiary)",transition:"all 0.3s"}}/>
      ))}
    </div>
  );
}

function Card({children,style={}}) {
  return <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:16,padding:"1.5rem",...style}}>{children}</div>;
}

function PrimaryBtn({onClick,disabled,children,style={}}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{padding:"11px 22px",borderRadius:10,background:disabled?"var(--color-background-secondary)":P.p600,color:disabled?"var(--color-text-tertiary)":"#fff",border:"none",fontWeight:500,fontSize:14,cursor:disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",gap:7,transition:"opacity 0.15s",...style}}>
      {children}
    </button>
  );
}

function GhostBtn({onClick,children,style={}}) {
  return (
    <button onClick={onClick} style={{padding:"11px 18px",borderRadius:10,background:"transparent",color:"var(--color-text-secondary)",border:"0.5px solid var(--color-border-secondary)",fontWeight:400,fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,...style}}>
      {children}
    </button>
  );
}

function Pill({children,active,onClick}) {
  return (
    <button onClick={onClick} style={{padding:"9px 14px",borderRadius:10,border:`1.5px solid ${active?P.p600:"var(--color-border-tertiary)"}`,background:active?P.p50:"var(--color-background-primary)",color:active?P.p800:"var(--color-text-secondary)",fontWeight:active?500:400,fontSize:13,cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
      {children}
    </button>
  );
}

function ScoreRing({score,summary}) {
  const r=40,cx=50,cy=50,circ=2*Math.PI*r;
  const pct=score/10;
  const col=score>=7?P.t400:score>=5?P.a400:P.r400;
  const label=score>=7?"Strong":score>=5?"Moderate":"Challenging";
  return (
    <div style={{display:"flex",gap:"1.5rem",alignItems:"center"}}>
      <div style={{flexShrink:0}}>
        <svg width={100} height={100}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--color-border-tertiary)" strokeWidth={7}/>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={col} strokeWidth={7} strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}/>
          <text x={cx} y={cy-4} textAnchor="middle" style={{fontSize:22,fontWeight:500,fill:col}}>{score}</text>
          <text x={cx} y={cy+12} textAnchor="middle" style={{fontSize:10,fill:"var(--color-text-tertiary)"}}>/ 10</text>
        </svg>
      </div>
      <div>
        <div style={{display:"inline-block",background:score>=7?P.t50:score>=5?P.a50:P.r50,color:score>=7?P.t800:score>=5?P.a800:P.r800,fontSize:12,fontWeight:500,padding:"3px 10px",borderRadius:20,marginBottom:8}}>{label}</div>
        <p style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.7,margin:0}}>{summary}</p>
      </div>
    </div>
  );
}

function SectionLabel({children}) {
  return <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>{children}</div>;
}

function Loader() {
  const msgs=["Researching your market...","Checking local competition...","Building your checklist...","Estimating startup costs..."];
  const [idx,setIdx]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%msgs.length),2000);return()=>clearInterval(t);},[]);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"5rem 2rem",gap:"2rem"}}>
      <div style={{position:"relative",width:64,height:64}}>
        <div style={{width:64,height:64,border:`3px solid ${P.p100}`,borderTop:`3px solid ${P.p600}`,borderRadius:"50%",animation:"spin 0.9s linear infinite"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
          <Logo size={36}/>
        </div>
      </div>
      <div style={{textAlign:"center",maxWidth:280}}>
        <div style={{fontSize:16,fontWeight:500,marginBottom:6}}>Generating your report</div>
        <div style={{fontSize:13,color:"var(--color-text-tertiary)",minHeight:20}}>{msgs[idx]}</div>
      </div>
      <div style={{display:"flex",gap:6}}>
        {msgs.map((_,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:i===idx?P.p600:"var(--color-border-tertiary)",transition:"background 0.3s"}}/>)}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function EmailGate({onSubmit,onCancel}) {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [err,setErr]=useState("");
  function go(){
    if(!name.trim()){setErr("Please enter your name.");return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setErr("Please enter a valid email.");return;}
    onSubmit(name,email);
  }
  return (
    <div style={{maxWidth:480,margin:"0 auto",padding:"2rem 1rem"}}>
      <BrandHeader/>
      <Card>
        <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
          <div style={{width:52,height:52,borderRadius:16,background:P.p50,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
            <i className="ti ti-mail" style={{fontSize:24,color:P.p600}}/>
          </div>
          <div style={{fontSize:17,fontWeight:500,marginBottom:4}}>Almost ready</div>
          <div style={{fontSize:13,color:"var(--color-text-tertiary)"}}>Enter your details to receive your Business Feasibility Report</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:"1.25rem"}}>
          <div>
            <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Your name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sarah Johnson" style={{width:"100%",boxSizing:"border-box",fontSize:14}}/>
          </div>
          <div>
            <label style={{fontSize:12,color:"var(--color-text-secondary)",display:"block",marginBottom:4}}>Email address</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="e.g. sarah@email.com" type="email" style={{width:"100%",boxSizing:"border-box",fontSize:14}}/>
          </div>
          {err&&<div style={{fontSize:12,color:P.r400,display:"flex",alignItems:"center",gap:5}}><i className="ti ti-alert-circle" style={{fontSize:13}}/>{err}</div>}
        </div>
        <div style={{background:P.p50,borderRadius:10,padding:"10px 14px",marginBottom:"1.25rem",display:"flex",gap:8,alignItems:"flex-start"}}>
          <i className="ti ti-shield-check" style={{fontSize:15,color:P.p600,marginTop:1,flexShrink:0}}/>
          <div style={{fontSize:12,color:P.p800,lineHeight:1.6}}>Your information is safe with us. We never spam or sell your data.</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <GhostBtn onClick={onCancel} style={{flex:1,justifyContent:"center"}}>Back</GhostBtn>
          <PrimaryBtn onClick={go} style={{flex:2,justifyContent:"center"}}>
            <i className="ti ti-sparkles" style={{fontSize:15}}/>Generate my report
          </PrimaryBtn>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [phase,setPhase]=useState("form");
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({idea:"",state:"",city:"",type:"",location:"home"});
  const [report,setReport]=useState(null);
  const [tab,setTab]=useState(0);
  const [chat,setChat]=useState([]);
  const [chatIn,setChatIn]=useState("");
  const [chatLoad,setChatLoad]=useState(false);
  const [checked,setChecked]=useState({});
  const [showGate,setShowGate]=useState(false);
  const [userInfo,setUserInfo]=useState({name:"",email:""});
  const chatRef=useRef(null);

  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[chat]);

  const valid=[form.idea.trim().length>10,form.state&&form.city.trim(),form.type,true];

  async function analyze(name,email) {
    setUserInfo({name,email});
    setShowGate(false);
    setPhase("loading");
    const prompt=`You are a small business advisor. Return ONLY a valid JSON object, no markdown:
{"feasibility":{"score":<1-10>,"summary":"<2-3 sentences>"},"competition":{"level":"<Low|Medium|High>","summary":"<2-3 sentences about ${form.city}, ${form.state}>","competitors":["<type1>","<type2>","<type3>"],"gap":"<one sentence>"},"challenges":[{"title":"<title>","detail":"<1-2 sentences>"},{"title":"<title>","detail":"<1-2 sentences>"},{"title":"<title>","detail":"<1-2 sentences>"},{"title":"<title>","detail":"<1-2 sentences>"}],"checklist":[{"category":"Legal & registration","items":["<step>","<step>","<step>"]},{"category":"Financial setup","items":["<step>","<step>"]},{"category":"Operations","items":["<step>","<step>","<step>"]},{"category":"Marketing & launch","items":["<step>","<step>"]}],"costs":{"total_low":<number>,"total_high":<number>,"breakdown":[{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"},{"item":"<name>","low":<number>,"high":<number>,"note":"<brief>"}]}}
Business: ${form.idea} | State: ${form.state} | City: ${form.city} | Type: ${form.type} | ${form.location==="home"?"Home-based":"Physical location"}`;
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})});
      const data=await res.json();
      const txt=data.content.find(b=>b.type==="text")?.text||"";
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setReport(parsed);
      setChat([{role:"assistant",content:`Hi ${name}! Your Business Feasibility Report is ready. I've assessed your ${form.type} idea in ${form.city}, ${form.state} — covering feasibility, local competition, a state-specific checklist, and budget estimates. What would you like to explore first?`}]);
      setPhase("report");
    } catch{alert("Analysis failed. Please try again.");setPhase("form");}
  }

  async function sendChat() {
    if(!chatIn.trim()||chatLoad)return;
    const msg=chatIn.trim();setChatIn("");
    const next=[...chat,{role:"user",content:msg}];
    setChat(next);setChatLoad(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:400,system:`You are a friendly small business advisor. The user wants to start a ${form.type} in ${form.city}, ${form.state}. Idea: "${form.idea}". Give simple, encouraging advice in 2-4 sentences.`,messages:next.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      setChat([...next,{role:"assistant",content:data.content[0]?.text||"Try again!"}]);
    } catch{setChat([...next,{role:"assistant",content:"Sorry, couldn't respond. Try again!"}]);}
    setChatLoad(false);
  }

  if(phase==="loading") return <Loader/>;
  if(showGate) return <EmailGate onSubmit={analyze} onCancel={()=>setShowGate(false)}/>;

  if(phase==="form") return (
    <div style={{maxWidth:520,margin:"0 auto",padding:"2rem 1rem"}}>
      <BrandHeader/>
      <StepDots step={step}/>

      {step===0&&(
        <Card>
          <label style={{fontSize:13,fontWeight:500,display:"block",marginBottom:4}}>What's your business idea?</label>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)",display:"block",marginBottom:8}}>Describe your idea in a sentence or two</span>
          <textarea value={form.idea} onChange={e=>setForm(p=>({...p,idea:e.target.value}))} placeholder="e.g. A home-based bakery specialising in custom cakes and desserts for weddings and events..." rows={4} style={{width:"100%",resize:"vertical",fontSize:14,padding:"10px 12px",borderRadius:10,border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",boxSizing:"border-box",lineHeight:1.6}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
            <div style={{fontSize:12,color:form.idea.length>10?P.t400:"var(--color-text-tertiary)",display:"flex",alignItems:"center",gap:5}}>
              {form.idea.length>10&&<i className="ti ti-check" style={{fontSize:13}}/>}
              {form.idea.length>10?"Ready to continue":"At least 10 characters"}
            </div>
            <PrimaryBtn onClick={()=>setStep(1)} disabled={!valid[0]}>
              Continue <i className="ti ti-arrow-right" style={{fontSize:14}}/>
            </PrimaryBtn>
          </div>
        </Card>
      )}

      {step===1&&(
        <Card>
          <label style={{fontSize:13,fontWeight:500,display:"block",marginBottom:4}}>Where are you located?</label>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)",display:"block",marginBottom:12}}>Your location determines your legal checklist and cost estimates</span>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1.25rem"}}>
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
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1.25rem"}}>
            {[["home","ti-home","Home-based","Operate from home"],["physical","ti-building","Physical location","Storefront or office"]].map(([val,icon,title,sub])=>(
              <button key={val} onClick={()=>setForm(p=>({...p,location:val}))} style={{padding:"14px 12px",borderRadius:12,border:`1.5px solid ${form.location===val?P.p600:"var(--color-border-tertiary)"}`,background:form.location===val?P.p50:"var(--color-background-primary)",cursor:"pointer",textAlign:"left"}}>
                <i className={`ti ${icon}`} style={{fontSize:20,color:form.location===val?P.p600:"var(--color-text-tertiary)",display:"block",marginBottom:6}}/>
                <div style={{fontSize:13,fontWeight:500,color:form.location===val?P.p800:"var(--color-text-primary)",marginBottom:2}}>{title}</div>
                <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{sub}</div>
              </button>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <GhostBtn onClick={()=>setStep(0)}><i className="ti ti-arrow-left" style={{fontSize:14}}/>Back</GhostBtn>
            <PrimaryBtn onClick={()=>setStep(2)} disabled={!valid[1]}>Continue <i className="ti ti-arrow-right" style={{fontSize:14}}/></PrimaryBtn>
          </div>
        </Card>
      )}

      {step===2&&(
        <Card>
          <label style={{fontSize:13,fontWeight:500,display:"block",marginBottom:4}}>What type of business?</label>
          <span style={{fontSize:12,color:"var(--color-text-tertiary)",display:"block",marginBottom:12}}>Select the category that best fits your idea</span>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:"1.25rem",maxHeight:300,overflowY:"auto",paddingRight:4}}>
            {BUSINESS_TYPES.map(t=>(
              <Pill key={t} active={form.type===t} onClick={()=>setForm(p=>({...p,type:t}))}>{t}</Pill>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <GhostBtn onClick={()=>setStep(1)}><i className="ti ti-arrow-left" style={{fontSize:14}}/>Back</GhostBtn>
            <PrimaryBtn onClick={()=>setStep(3)} disabled={!valid[2]}>Continue <i className="ti ti-arrow-right" style={{fontSize:14}}/></PrimaryBtn>
          </div>
        </Card>
      )}

      {step===3&&(
        <Card>
          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"1rem"}}>Review your details</div>
          <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:"1.5rem"}}>
            {[["ti-bulb","Business idea",form.idea.length>80?form.idea.slice(0,80)+"...":form.idea],["ti-map-pin","Location",`${form.city}, ${form.state}`],["ti-briefcase","Business type",form.type],["ti-home","Setup",form.location==="home"?"Home-based":"Physical location"]].map(([icon,label,val])=>(
              <div key={label} style={{display:"flex",gap:12,padding:"12px",borderRadius:10,background:"var(--color-background-secondary)"}}>
                <div style={{width:32,height:32,borderRadius:8,background:P.p50,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <i className={`ti ${icon}`} style={{fontSize:16,color:P.p600}}/>
                </div>
                <div>
                  <div style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:2}}>{label}</div>
                  <div style={{fontSize:13,color:"var(--color-text-primary)",lineHeight:1.5}}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <GhostBtn onClick={()=>setStep(2)}><i className="ti ti-arrow-left" style={{fontSize:14}}/>Back</GhostBtn>
            <PrimaryBtn onClick={()=>setShowGate(true)}>
              <i className="ti ti-sparkles" style={{fontSize:15}}/>Generate my report
            </PrimaryBtn>
          </div>
        </Card>
      )}
    </div>
  );

  if(phase==="report"&&report) {
    const compLevel=report?.competition?.level||"Medium";
    const cm=compMeta[compLevel]||compMeta.Medium;
    const doneCount=Object.values(checked).filter(Boolean).length;
    const total=(report.checklist||[]).reduce((a,c)=>a+c.items.length,0);
    const score=report.feasibility?.score||0;

    return (
      <div style={{maxWidth:660,margin:"0 auto",padding:"1.5rem 1rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.5rem",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <Logo size={44}/>
            <div>
              <div style={{fontSize:15,fontWeight:500,lineHeight:1.3}}>{form.idea.length>50?form.idea.slice(0,50)+"...":form.idea}</div>
              <div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>{form.type} · {form.city}, {form.state}{userInfo.name?` · ${userInfo.name}`:""}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>{setPhase("form");setStep(0);setReport(null);setChecked({});}} style={{fontSize:13,padding:"8px 14px",borderRadius:10,background:"transparent",border:"0.5px solid var(--color-border-secondary)",color:"var(--color-text-secondary)",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              <i className="ti ti-refresh" style={{fontSize:14}}/>New report
            </button>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:"1.5rem"}}>
          {[
            {label:"Feasibility",value:`${score}/10`,color:score>=7?P.t600:score>=5?P.a400:P.r400,bg:score>=7?P.t50:score>=5?P.a50:P.r50,icon:"ti-star"},
            {label:"Competition",value:compLevel,color:cm.color,bg:cm.bg,icon:"ti-trophy"},
            {label:"Progress",value:`${doneCount}/${total} tasks`,color:P.p600,bg:P.p50,icon:"ti-checklist"},
            {label:"Min. budget",value:`$${(report.costs?.total_low||0).toLocaleString()}`,color:P.t600,bg:P.t50,icon:"ti-currency-dollar"},
          ].map(m=>(
            <div key={m.label} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:28,height:28,borderRadius:8,background:m.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <i className={`ti ${m.icon}`} style={{fontSize:14,color:m.color}}/>
                </div>
                <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{m.label}</div>
              </div>
              <div style={{fontSize:15,fontWeight:500,color:m.color}}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:6,marginBottom:"1.25rem",flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:24,border:`1.5px solid ${tab===t.id?P.p600:"var(--color-border-tertiary)"}`,background:tab===t.id?P.p600:"transparent",color:tab===t.id?"#fff":"var(--color-text-secondary)",fontWeight:tab===t.id?500:400,fontSize:13,cursor:"pointer"}}>
              <i className={`ti ${t.icon}`} style={{fontSize:14}}/>{t.label}
            </button>
          ))}
        </div>

        <Card style={{marginBottom:"1.25rem",minHeight:200}}>
          {tab===0&&(
            <div>
              <SectionLabel>Feasibility rating</SectionLabel>
              <ScoreRing score={score} summary={report.feasibility?.summary||""}/>
            </div>
          )}
          {tab===1&&(
            <div>
              <SectionLabel>Competition in {form.city}</SectionLabel>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:cm.bg,color:cm.text,fontSize:12,fontWeight:500,padding:"5px 12px",borderRadius:20,marginBottom:"1rem"}}>
                <i className="ti ti-chart-bar" style={{fontSize:13}}/>{compLevel} competition
              </div>
              <p style={{fontSize:14,color:"var(--color-text-secondary)",lineHeight:1.75,margin:"0 0 1rem"}}>{report.competition?.summary||""}</p>
              <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",marginBottom:8}}>Likely competitors nearby</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:"1rem"}}>
                {(report.competition?.competitors||[]).map((c,i)=>(
                  <span key={i} style={{background:P.p50,color:P.p800,fontSize:12,fontWeight:500,padding:"4px 12px",borderRadius:20}}>{c}</span>
                ))}
              </div>
              <div style={{background:P.t50,borderRadius:10,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                <i className="ti ti-bulb" style={{fontSize:16,color:P.t600,marginTop:1,flexShrink:0}}/>
                <div style={{fontSize:13,color:P.t800,lineHeight:1.65}}><strong>Market gap:</strong> {report.competition?.gap||""}</div>
              </div>
            </div>
          )}
          {tab===2&&(
            <div>
              <SectionLabel>Challenges to expect</SectionLabel>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {(report.challenges||[]).map((c,i)=>(
                  <div key={i} style={{display:"flex",gap:12,padding:"14px",background:"var(--color-background-secondary)",borderRadius:10}}>
                    <div style={{width:30,height:30,borderRadius:8,background:P.a50,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span style={{fontSize:13,fontWeight:500,color:P.a800}}>{i+1}</span>
                    </div>
                    <div>
                      <div style={{fontWeight:500,fontSize:14,marginBottom:3}}>{c.title}</div>
                      <div style={{color:"var(--color-text-secondary)",fontSize:13,lineHeight:1.65}}>{c.detail}</div>
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
                <span style={{fontSize:12,color:doneCount===total&&total>0?P.t600:"var(--color-text-tertiary)",fontWeight:500}}>{doneCount}/{total} done</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"1.25rem"}}>
                {(report.checklist||[]).map((cat,ci)=>(
                  <div key={ci}>
                    <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>{cat.category}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {cat.items.map((item,ii)=>{
                        const k=`${ci}-${ii}`;const done=checked[k];
                        return (
                          <div key={ii} onClick={()=>setChecked(p=>({...p,[k]:!p[k]}))} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",borderRadius:10,background:done?P.t50:"var(--color-background-secondary)",cursor:"pointer",border:`0.5px solid ${done?P.t100:"transparent"}`}}>
                            <div style={{width:18,height:18,borderRadius:5,border:`1.5px solid ${done?P.t400:"var(--color-border-secondary)"}`,background:done?P.t400:"transparent",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                              {done&&<i className="ti ti-check" style={{fontSize:11,color:"#fff"}}/>}
                            </div>
                            <span style={{fontSize:13,color:done?P.t800:"var(--color-text-primary)",textDecoration:done?"line-through":"none",lineHeight:1.5}}>{item}</span>
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
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:"1.25rem"}}>
                <div style={{background:P.t50,borderRadius:12,padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:11,color:P.t600,fontWeight:500,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Minimum</div>
                  <div style={{fontSize:26,fontWeight:500,color:P.t800}}>${(report.costs?.total_low||0).toLocaleString()}</div>
                </div>
                <div style={{background:P.p50,borderRadius:12,padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:11,color:P.p600,fontWeight:500,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.05em"}}>Comfortable</div>
                  <div style={{fontSize:26,fontWeight:500,color:P.p800}}>${(report.costs?.total_high||0).toLocaleString()}</div>
                </div>
              </div>
              <div style={{borderRadius:10,overflow:"hidden",border:"0.5px solid var(--color-border-tertiary)"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 72px 72px",padding:"8px 14px",background:"var(--color-background-secondary)",gap:8}}>
                  <span style={{fontSize:11,fontWeight:500,color:"var(--color-text-tertiary)"}}>EXPENSE</span>
                  <span style={{fontSize:11,fontWeight:500,color:P.t600,textAlign:"right"}}>LOW</span>
                  <span style={{fontSize:11,fontWeight:500,color:P.p600,textAlign:"right"}}>HIGH</span>
                </div>
                {(report.costs?.breakdown||[]).map((row,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 72px 72px",padding:"11px 14px",borderTop:"0.5px solid var(--color-border-tertiary)",gap:8,alignItems:"center",background:i%2===0?"var(--color-background-primary)":"var(--color-background-secondary)"}}>
                    <div>
                      <div style={{fontSize:13}}>{row.item}</div>
                      {row.note&&<div style={{fontSize:11,color:"var(--color-text-tertiary)",marginTop:1}}>{row.note}</div>}
                    </div>
                    <div style={{fontSize:13,color:P.t600,textAlign:"right",fontWeight:500}}>${row.low.toLocaleString()}</div>
                    <div style={{fontSize:13,color:P.p600,textAlign:"right",fontWeight:500}}>${row.high.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1rem"}}>
            <div style={{width:34,height:34,borderRadius:10,background:P.p50,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <i className="ti ti-message-circle" style={{fontSize:17,color:P.p600}}/>
            </div>
            <div>
              <div style={{fontWeight:500,fontSize:14}}>Ask your AI advisor</div>
              <div style={{fontSize:12,color:"var(--color-text-tertiary)"}}>Get plain-English answers about your business</div>
            </div>
          </div>
          <div ref={chatRef} style={{maxHeight:220,overflowY:"auto",marginBottom:"1rem",display:"flex",flexDirection:"column",gap:8}}>
            {chat.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"80%",padding:"10px 14px",borderRadius:12,background:m.role==="user"?P.p600:"var(--color-background-secondary)",color:m.role==="user"?"#fff":"var(--color-text-primary)",fontSize:13,lineHeight:1.65,borderBottomRightRadius:m.role==="user"?4:12,borderBottomLeftRadius:m.role==="assistant"?4:12}}>
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoad&&(
              <div style={{display:"flex",gap:5,padding:"10px 14px",width:"fit-content",background:"var(--color-background-secondary)",borderRadius:12,borderBottomLeftRadius:4}}>
                {[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"var(--color-text-tertiary)",animation:`dot 0.9s ease ${i*0.18}s infinite`}}/>)}
              </div>
            )}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:8}}>
            <input value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask anything about your business..." style={{fontSize:13,borderRadius:10}}/>
            <button onClick={sendChat} disabled={!chatIn.trim()||chatLoad} style={{padding:"0 18px",borderRadius:10,background:chatIn.trim()&&!chatLoad?P.p600:"var(--color-background-secondary)",color:chatIn.trim()&&!chatLoad?"#fff":"var(--color-text-tertiary)",border:"none",fontWeight:500,fontSize:13,cursor:chatIn.trim()&&!chatLoad?"pointer":"not-allowed"}}>Send</button>
          </div>
          <style>{`@keyframes dot{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
        </Card>
      </div>
    );
  }
  return null;
}
