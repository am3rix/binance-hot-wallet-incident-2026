import { Hono } from 'hono';
type Bindings = {
  DB: D1Database;
  ALLOWED_ORIGIN: string;
  ADMIN_TOKEN: string;
};
type Env = { Bindings: Bindings };
const app = new Hono<Env>();

app.use('*',async(c,next)=>{
  await next();
  c.header('Cache-Control','no-store');
  c.header('X-Content-Type-Options','nosniff');
  c.header('Referrer-Policy','no-referrer');
});

app.options('/v1/visit',(c)=>{
 const origin=c.req.header('Origin');
 if(origin!==c.env.ALLOWED_ORIGIN)return c.text('Origin not allowed',403);
 c.header('Access-Control-Allow-Origin',origin);
 c.header('Access-Control-Allow-Methods','POST, OPTIONS');
 c.header('Access-Control-Allow-Headers','Content-Type');
 c.header('Access-Control-Max-Age','600');
 return c.body(null,204);
});

app.post('/v1/visit',async c=>{
 const origin=c.req.header('Origin');
 if(origin!==c.env.ALLOWED_ORIGIN)return c.json({error:'Origin not allowed'},403);
 c.header('Access-Control-Allow-Origin',origin);
 const type=c.req.header('Content-Type')||'';
 if(!type.toLowerCase().startsWith('application/json'))return c.json({error:'Expected JSON'},415);
 const raw=await c.req.text();
 if(raw.length>1024)return c.json({error:'Payload too large'},413);
 let input:unknown;
 try{input=JSON.parse(raw);}catch{return c.json({error:'Invalid JSON'},400);}
 if(!input||typeof input!=='object')return c.json({error:'Invalid payload'},400);
 const obj=input as Record<string,unknown>;
 if(obj.consent!==true || obj.event!=='case_opened' || typeof obj.visitId!=='string' || !/^[0-9a-f-]{36}$/i.test(obj.visitId)) return c.json({error:'Consent or identifier missing'},400);
 const day=new Date().toISOString().slice(0,10);
 const cf=c.req.raw.cf as {country?:string}|undefined;
 const rawCountry=cf?.country||'ZZ';
 const country=/^[A-Z]{2}$/.test(rawCountry)?rawCountry:'ZZ';
 // Store only a pseudonymous session event. No raw IP, User-Agent or cookies are stored.
 // The primary key deduplicates multiple requests from the same session/day.
 await c.env.DB.prepare('INSERT OR IGNORE INTO visits (visit_id,day,country,created_at) VALUES (?,?,?,?)')
   .bind(obj.visitId,day,country,new Date().toISOString()).run();
 return c.json({ok:true});
});

app.get('/v1/summary',async c=>{
 const expected=c.env.ADMIN_TOKEN;
 const provided=c.req.header('x-admin-token')||'';
 // Never publish ADMIN_TOKEN or place it in frontend code.
 if(!expected || provided.length!==expected.length)return c.json({error:'Unauthorized'},401);
 let difference=0;for(let i=0;i<expected.length;i++)difference|=provided.charCodeAt(i)^expected.charCodeAt(i);
 if(difference!==0)return c.json({error:'Unauthorized'},401);
 const results=await c.env.DB.prepare("SELECT day,country,COUNT(*) AS visits FROM visits WHERE day>=date('now','-30 days') GROUP BY day,country ORDER BY day DESC,country").all();
 const counts=(results.results as Array<Record<string,unknown>>).map(row=>{
  const code=String(row.country||'ZZ');
  const flag=/^[A-Z]{2}$/.test(code)&&code!=='ZZ'
    ? String.fromCodePoint(...[...code].map(char=>127397+char.charCodeAt(0)))
    : '—';
  return {...row,flag};
 });
 return c.json({measure:'opt-in sessions only',counts});
});

app.get('/health',c=>c.json({service:'analytics',ok:true}));

export default {
  fetch: app.fetch,
  async scheduled(_event:ScheduledEvent,env:Bindings) {
    await env.DB.prepare("DELETE FROM visits WHERE day < date('now','-30 days')").run();
  }
};
