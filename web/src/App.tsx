import { useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronRight, Clipboard, ExternalLink, FileSearch, FileText, FolderOpen, Layers, LockKeyhole, Menu, PanelRightClose, Search, ShieldCheck, X } from 'lucide-react';
import { chapters, evidence } from './data';
import type { ChapterId, Evidence } from './types';

const ENDPOINT: string = (import.meta.env.VITE_ANALYTICS_ENDPOINT || '').trim();
type Consent = 'yes' | 'no' | null;
const progressKey = 'forensic-room-progress-v1';
const consentKey = 'forensic-room-consent-v1';

function readProgress(): string[] {
 try { const value: unknown = JSON.parse(localStorage.getItem(progressKey) || '[]'); return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []; } catch { return []; }
}
function readConsent(): Consent {
 try { const stored = localStorage.getItem(consentKey); return stored === 'yes' || stored === 'no' ? stored : null; } catch { return null; }
}
function initialChapter(): ChapterId {
 const id = location.hash.replace('#room/', '');
 return chapters.some(c => c.id === id) ? id as ChapterId : 'brief';
}
function Diagram({ id }: { id: ChapterId }) {
 const labels: Record<ChapterId, string> = {
  brief:'Evidence confidence layers',timeline:'Incident timeline and block order',authorization:'EIP-7702 account delegation',execution:'Receipt and transfer-log analysis',tracing:'Source and destination evidence graph',attribution:'Separation between on-chain evidence and attribution',assessment:'A defensible forensic conclusion'
 };
 const stroke = '#adbaac', gold = '#c3aa7b', gray = '#536478';
 return <figure className="diagram">
  <div className="figure-head"><span>Fig. {chapters.findIndex(c=>c.id===id)+1}</span><span>{labels[id]}</span></div>
  <svg viewBox="0 0 680 248" role="img" aria-label={labels[id]} className="diagram-svg">
   <defs><pattern id="tinygrid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#415062" strokeOpacity=".22" strokeWidth=".7"/></pattern></defs>
   <rect width="680" height="248" rx="3" fill="#121b25"/>
   <rect width="680" height="248" fill="url(#tinygrid)"/>
   {id==='brief' && <g>
    {[0,1,2].map((n)=><g key={n}><rect x={40+n*213} y="55" width="175" height="125" rx="3" fill="#1a2531" stroke={n===0?stroke:gray}/><text x={56+n*213} y="86" fill={n===0?gold:'#bec7cc'} fontSize="16" fontFamily="Georgia">{['Observed','Reported','Unknown'][n]}</text><path d={`M${56+n*213} 103h143`} stroke={gray}/><text x={56+n*213} y="129" fontSize="12" fill="#8998a8">{['Transactions and logs','Public disclosures','Initial access details'][n]}</text><text x={56+n*213} y="147" fontSize="12" fill="#8998a8">{['Block inclusion','Investigator assessments','Specific human operator'][n]}</text></g>)}
    <text x="39" y="218" fill="#9caabd" fontSize="11">A reported statement is not independently verified by a block explorer.</text>
   </g>}
   {id==='timeline' && <g>
    <path d="M66 129H611" stroke={gold} strokeWidth="2"/>
    {[[84,'28 OCT','Staging'],[254,'20:05','Outflows'],[414,'20:20:59','Authorization'],[584,'20:24:23','Sweep']].map(([x,t,l])=><g key={t}><circle cx={x} cy="129" r="6" fill={gold}/><path d={`M${x} 117V103`} stroke={gold}/><text x={x} y="88" textAnchor="middle" fill="#e8e7e0" fontSize="15" fontFamily="Georgia">{t}</text><text x={x} y="159" textAnchor="middle" fill="#a6b3bf" fontSize="12">{l}</text></g>)}
    <text x="62" y="216" fontSize="12" fill="#9caabd">UTC · chronology combines public Ethereum blocks and attributed reporting</text>
   </g>}
   {id==='authorization' && <g>
    <rect x="26" y="61" width="193" height="126" fill="#1b2733" stroke={gray}/><rect x="247" y="61" width="184" height="126" fill="#1b2733" stroke={gold}/><rect x="460" y="61" width="194" height="126" fill="#1b2733" stroke={gray}/>
    <path d="M221 124h22m-8-6 8 6-8 6M433 124h23m-8-6 8 6-8 6" fill="none" stroke={gold} strokeWidth="1.5"/>
    <text x="42" y="95" fill="#e7e8e4" fontSize="17" fontFamily="Georgia">Type 0x04</text><text x="42" y="124" fill="#b8c3cb" fontSize="12">Signed authorizations</text><text x="42" y="146" fill="#a3b0be" fontSize="12">chain · nonce · sig</text>
    <text x="261" y="95" fill="#e7e8e4" fontSize="17" fontFamily="Georgia">Account code</text><text x="261" y="124" fill={gold} fontSize="13">0xef0100</text><text x="261" y="146" fill="#a3b0be" fontSize="12">+ delegate address</text>
    <text x="476" y="95" fill="#e7e8e4" fontSize="17" fontFamily="Georgia">Execution context</text><text x="476" y="124" fill="#b8c3cb" fontSize="12">Delegated runtime</text><text x="476" y="146" fill="#a3b0be" fontSize="12">Account authority</text>
   </g>}
   {id==='execution' && <g>
    <rect x="36" y="40" width="280" height="169" rx="3" fill="#1b2733" stroke={gray}/><rect x="362" y="40" width="280" height="169" rx="3" fill="#1b2733" stroke={gray}/>
    <text x="54" y="68" fontFamily="Georgia" fontSize="17" fill="#e7e8e4">Transaction envelope</text>
    {['type: 0x04','block: 26,300,753','authorization_list: […]'].map((l,i)=><text x="54" y={101+i*27} fontSize="13" fontFamily="monospace" fill={i===1?gold:'#abb7c4'} key={l}>{l}</text>)}
    <text x="380" y="68" fontFamily="Georgia" fontSize="17" fill="#e7e8e4">Subsequent receipt</text>
    {['block: 26,300,770','status: inspect receipt','logs: inspect transfers'].map((l,i)=><text x="380" y={101+i*27} fontSize="13" fontFamily="monospace" fill={i===0?gold:'#abb7c4'} key={l}>{l}</text>)}
   </g>}
   {id==='tracing' && <g>
    <circle cx="106" cy="126" r="40" fill="#1e2d36" stroke={gold}/><circle cx="356" cy="69" r="31" fill="#1e2d36" stroke={gray}/><circle cx="360" cy="190" r="31" fill="#1e2d36" stroke={gray}/><circle cx="586" cy="126" r="40" fill="#1e2d36" stroke={gray}/>
    <path d="M147 119 324 77 M145 139 327 181 M389 75 546 119 M390 181 547 140" stroke={gold} strokeWidth="1.4" fill="none"/>
    <text x="106" y="131" textAnchor="middle" fill="#e3e3df" fontSize="12">Source</text><text x="356" y="74" textAnchor="middle" fill="#b9c3cd" fontSize="12">DEX</text><text x="360" y="195" textAnchor="middle" fill="#b9c3cd" fontSize="12">Bridge</text><text x="586" y="131" textAnchor="middle" fill="#e3e3df" fontSize="12">Recipient</text>
    <text x="38" y="235" fill="#9caabd" fontSize="11">Illustrative topology; not a full map of actual stolen-fund routes.</text>
   </g>}
   {id==='attribution' && <g>
    <rect x="40" y="51" width="261" height="140" fill="#1b2733" stroke={gray}/><rect x="379" y="51" width="261" height="140" fill="#1b2733" stroke={gray}/>
    <text x="58" y="83" fill="#e6e6e2" fontFamily="Georgia" fontSize="18">Public chain</text><text x="58" y="112" fill="#abb7c4" fontSize="13">Transactions / receipts</text><text x="58" y="142" fill={gold} fontSize="13">Directly observable</text>
    <text x="397" y="83" fill="#e6e6e2" fontFamily="Georgia" fontSize="18">External intelligence</text><text x="397" y="112" fill="#abb7c4" fontSize="13">Statements / attribution</text><text x="397" y="142" fill={gold} fontSize="13">Source-dependent</text>
    <path d="M306 119h68" stroke={gray} strokeDasharray="5 8"/><text x="340" y="107" fill="#bdc8d1" fontSize="11" textAnchor="middle">≠</text>
   </g>}
   {id==='assessment' && <g>
    {['OBSERVE','ATTRIBUTE','QUALIFY'].map((n,i)=><g key={n}><rect x={34+i*215} y="55" width="190" height="135" fill="#192631" stroke={i===2?gold:gray}/><text x={51+i*215} y="94" fill={gold} fontSize="18" fontFamily="Georgia">{n}</text><text x={51+i*215} y="128" fill="#a7b8c7" fontSize="12">{['What does the chain show?','Who reported the claim?','What remains unknown?'][i]}</text></g>)}
   </g>}
  </svg>
  <figcaption>Original explanatory figure · not a recovered artifact</figcaption>
 </figure>;
}
function EvidenceItem({item}: {item: Evidence}) {
 const [copied, setCopied] = useState(false);
 async function copy(){ try { await navigator.clipboard.writeText(item.address);setCopied(true);window.setTimeout(()=>setCopied(false),1500);}catch{setCopied(false);} }
 return <article className="evidence-item"><div className="evidence-heading"><span className="refid">{item.id}</span><span className="classification">{item.classification}</span></div><h4>{item.title}</h4><code className="hash">{item.address}</code><p>{item.note}</p><div className="evidence-actions"><button type="button" onClick={copy} aria-label={`Copy ${item.id} identifier`}>{copied?<Check size={14}/>:<Clipboard size={14}/>} {copied?'Copied':'Copy ID'}</button><a href={item.url} target="_blank" rel="noopener noreferrer">Explorer <ExternalLink size={14}/></a></div></article>;
}
export default function App() {
 const [active,setActive] = useState<ChapterId>(initialChapter);
 const [passed,setPassed] = useState<string[]>(readProgress);
 const [answer,setAnswer] = useState<Record<string,number>>({});
 const [desk,setDesk] = useState(true);
 const [mobileMenu,setMobileMenu] = useState(false);
 const [filter,setFilter] = useState('');
 const [consent,setConsent] = useState<Consent>(readConsent);
 const [privacyOpen,setPrivacyOpen] = useState(false);
 const [allEvidence,setAllEvidence] = useState(false);
 const [showExplanation,setShowExplanation] = useState(false);
 const contentRef=useRef<HTMLElement>(null);
 const chapter=chapters.find(c=>c.id===active) || chapters[0];
 const ix=chapters.indexOf(chapter);
 const pct=Math.round((chapters.filter(c=>passed.includes(c.id)).length/chapters.length)*100);
 const listed=useMemo(()=>chapters.filter(c=>(c.title+' '+c.subtitle).toLowerCase().includes(filter.toLowerCase())),[filter]);
 const visibleEvidence=allEvidence ? evidence : evidence.filter(e=>chapter.evidence.includes(e.id));
 function navigate(id:ChapterId) {setActive(id);location.hash=`room/${id}`;setMobileMenu(false);setShowExplanation(false);contentRef.current?.scrollTo({top:0,behavior:'smooth'});}
 function choose(value:number) {setAnswer(prev=>({...prev,[active]:value}));setShowExplanation(true);if(chapter.question && value===chapter.question.correct&&!passed.includes(active)){setPassed(prev=>{const next=[...prev,active];try{localStorage.setItem(progressKey,JSON.stringify(next));}catch{/* storage unavailable */}return next;});}}
 function setTracking(value: Consent) {
  setConsent(value);
  if(value){try{localStorage.setItem(consentKey,value);}catch{/* ignore */}}
  if(value==='yes' && ENDPOINT){
    const marker='forensic-event-sent';
    let already=false;
    try{already=sessionStorage.getItem(marker)==='yes';}catch{/* unavailable */}
    if(!already){const visitId=crypto.randomUUID();fetch(ENDPOINT.replace(/\/$/,'')+'/v1/visit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({consent:true,visitId,event:'case_opened'}),mode:'cors',credentials:'omit',keepalive:false}).then(r=>{if(r.ok)try{sessionStorage.setItem(marker,'yes');}catch{/* unavailable */}}).catch(()=>{});}
  }
 }
 useEffect(()=>{function onHash(){const id=location.hash.replace('#room/',''); if(chapters.some(c=>c.id===id))setActive(id as ChapterId);}window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash);},[]);
 useEffect(()=>{function onKey(e:KeyboardEvent){if(e.altKey||e.ctrlKey||e.metaKey||(e.target instanceof HTMLElement && ['INPUT','TEXTAREA','BUTTON'].includes(e.target.tagName)))return;if(e.key==='ArrowRight'&&ix<chapters.length-1)navigate(chapters[ix+1].id);if(e.key==='ArrowLeft'&&ix>0)navigate(chapters[ix-1].id);}window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);},[ix]);
 return <>
 <div className="room-shell">
  <aside className={`room-sidebar ${mobileMenu?'mobile-open':''}`} aria-label="Case sections">
   <div className="brand"><span className="brand-mark"><Layers size={20}/></span><span><strong>Case study</strong><small>Digital asset forensics</small></span><button className="menu-close" onClick={()=>setMobileMenu(false)} aria-label="Close navigation"><X size={18}/></button></div>
   <div className="sidebar-head"><span>CASE MATERIAL</span><span>October 2026</span></div>
   <div className="searchbox"><Search size={15}/><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Find a section" aria-label="Filter sections"/></div>
   <nav className="chapter-nav" aria-label="Chapters">{listed.map(ch=>{const n=chapters.indexOf(ch)+1;return <button key={ch.id} type="button" aria-current={ch.id===active?'step':undefined} className={`chapter-link ${ch.id===active?'selected':''}`} onClick={()=>navigate(ch.id)}><span className="number">{String(n).padStart(2,'0')}</span><span className="chapter-name"><strong>{ch.title}</strong><small>{ch.subtitle}</small></span>{passed.includes(ch.id)?<CheckCircle2 size={16} className="done"/>:<ChevronRight size={16} className="chevron"/>}</button>})}</nav>
   <div className="sidebar-bottom"><div className="progress-text"><span>Knowledge check progress</span><strong>{pct}%</strong></div><div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{width:`${pct}%`}}/></div><small>{passed.length} of {chapters.length} assessments passed</small><a href="https://github.com/am3rix/binance-hot-wallet-incident-2026" target="_blank" rel="noopener noreferrer"><FolderOpen size={15}/> Source repository <ArrowUpRight size={15}/></a></div>
  </aside>
  <div className="room-main">
   <header className="room-topbar"><button className="iconbutton mobile-menu" onClick={()=>setMobileMenu(true)} aria-label="Open sections"><Menu size={20}/></button><div className="location"><span>Binance hot-wallet incident</span><ChevronRight size={14}/><strong>{chapter.title}</strong></div><div className="topbar-actions"><span className="read-only"><LockKeyhole size={14}/> Read-only lab</span><button type="button" className="iconbutton" onClick={()=>setDesk(v=>!v)} aria-label={desk?'Hide evidence panel':'Show evidence panel'} title={desk?'Hide evidence panel':'Show evidence panel'}><PanelRightClose size={18}/></button></div></header>
   <div className="work-area">
    <main id="content" ref={contentRef} className="paper" tabIndex={-1}>
     <div className="paper-inner">
      <div className="chapter-meta"><span>SECTION {String(ix+1).padStart(2,'0')} OF {String(chapters.length).padStart(2,'0')}</span><span><BookOpen size={14}/> {chapter.reading} read</span></div>
      <div className="paper-intro"><p className="overline">{chapter.kicker}</p><h1>{chapter.heading}</h1><p className="subtitle">{chapter.subtitle}</p></div>
      <Diagram id={active}/>
      <section className="research-text" aria-label="Research notes">{chapter.paragraphs.map((p,i)=><p key={i}>{p}</p>)}</section>
      <section className="notes" aria-labelledby="notes-heading"><div className="section-heading"><FileText size={17}/><h2 id="notes-heading">Working notes</h2></div>{chapter.takeaways.map((t,i)=><div className="note" key={t.heading}><span className="note-index">{String(i+1).padStart(2,'0')}</span><div><h3>{t.heading}</h3><p>{t.body}</p></div></div>)}</section>
      <section className="references" aria-labelledby="references-heading"><div className="section-heading"><FileSearch size={17}/><h2 id="references-heading">Sources for this section</h2></div>{chapter.sources.map((s,i)=><a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"><span>{i+1}. {s.label}</span><ArrowUpRight size={15}/></a>)}</section>
      {chapter.question&&<section className="check-section" aria-labelledby="exercise-heading"><div className="section-heading"><ShieldCheck size={17}/><h2 id="exercise-heading">Check your understanding</h2></div><p className="question">{chapter.question.text}</p><fieldset><legend className="sr-only">Choose the most accurate answer</legend>{chapter.question.options.map((opt,i)=><label key={i} className={`option ${answer[active]===i?'picked':''}`}><input type="radio" name={`quiz-${active}`} checked={answer[active]===i} onChange={()=>choose(i)}/><span>{opt}</span></label>)}</fieldset>{showExplanation&&answer[active]!==undefined&&<p className={`feedback ${answer[active]===chapter.question.correct?'correct':'incorrect'}`} role="status"><strong>{answer[active]===chapter.question.correct?'Correct.':'Review the evidence.'}</strong> {chapter.question.explanation}</p>}<small className="quiz-caption">Progress is stored only in this browser. A section is passed after a correct answer.</small></section>}
      <footer className="chapter-footer"><button disabled={ix===0} onClick={()=>navigate(chapters[ix-1].id)} className="secondary-button"><ArrowLeft size={16}/> Previous section</button><button disabled={ix===chapters.length-1} onClick={()=>navigate(chapters[ix+1].id)} className="primary-button">Next section <ArrowRight size={16}/></button></footer>
     </div>
    </main>
    {desk&&<aside className="evidence-panel" aria-label="Evidence desk"><div className="desk-head"><div><p>Evidence desk</p><span>Reference material for the current section</span></div><button className="iconbutton" onClick={()=>setDesk(false)} aria-label="Close evidence desk"><X size={16}/></button></div><button className="evidence-mode" onClick={()=>setAllEvidence(v=>!v)} aria-pressed={allEvidence}><span>{allEvidence?'All public references':'Related references'}</span><ChevronDown size={15}/></button><div className="evidence-scroll">{visibleEvidence.map(e=><EvidenceItem key={e.id} item={e}/>)}</div><div className="desk-foot"><ShieldCheck size={15}/><p>No external request is sent until you open an explorer link. References do not reveal how access was obtained.</p></div></aside>}
   </div>
  </div>
 </div>
 <div className="mobile-desk"><Dialog.Root><Dialog.Trigger asChild><button className="primary-button"><FileSearch size={17}/> Open evidence desk</button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="dialog-overlay"/><Dialog.Content className="dialog-content"><Dialog.Title>Evidence desk</Dialog.Title><Dialog.Description>Direct references linked to this research section.</Dialog.Description><Dialog.Close className="dialog-close" aria-label="Close evidence desk"><X size={18}/></Dialog.Close><div className="modal-scroll">{visibleEvidence.map(e=><EvidenceItem key={e.id} item={e}/>)}</div></Dialog.Content></Dialog.Portal></Dialog.Root></div>
 {consent===null&&<div className="consent-card" role="region" aria-label="Privacy preference"><div className="consent-title"><LockKeyhole size={16}/><strong>Privacy preference</strong></div><p>Reading and exercise progress stay in your browser. Optional anonymous visit statistics are only sent if you allow them. No analytics cookies are required.</p><div className="consent-actions"><button className="secondary-button" onClick={()=>setTracking('no')}>Decline</button><button className="primary-button" onClick={()=>setTracking('yes')}>Allow analytics</button></div><button className="privacy-link" onClick={()=>setPrivacyOpen(true)}>What information is used?</button></div>}
 <Dialog.Root open={privacyOpen} onOpenChange={setPrivacyOpen}><Dialog.Portal><Dialog.Overlay className="dialog-overlay"/><Dialog.Content className="dialog-content privacy-modal"><Dialog.Title>Privacy and site analytics</Dialog.Title><Dialog.Description>The content can be read without creating an account.</Dialog.Description><Dialog.Close className="dialog-close" aria-label="Close"><X size={18}/></Dialog.Close><p>Answers and chapter completion are saved locally in your browser. If optional analytics are accepted and an analytics endpoint is configured, the site sends one visit event for this browser session. The optional server records an aggregate country code and a pseudonymous daily deduplication key; it does not store visitor IP addresses. Declining sends no analytics event.</p><p>GitHub Pages and any other infrastructure provider may retain routine network logs under their own policies. This site cannot control those records.</p><button className="secondary-button" onClick={()=>{setPrivacyOpen(false);setConsent(null);try{localStorage.removeItem(consentKey)}catch{/* unavailable */}}}>Change my choice</button></Dialog.Content></Dialog.Portal></Dialog.Root>
 </>;
}
