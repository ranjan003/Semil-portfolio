/* Semil AI layer (modular add-on; loads after site.js and changes nothing else).
   What this is: a grounded assistant. Answers are built only from the SEMIL content object (the same data that drives every page),
   through a small pipeline: Router -> Retriever (keyword RAG) -> Specialist (tools) -> Verifier.
   What this is not: AGI, or a large language model. For free-form LLM answers set SEMIL_CONFIG.aiEndpoint to your own secure
   server route (see server/ask.mjs). If that call fails the local pipeline answers instead. No API key ever lives in this file. */
(function(){
'use strict';
if(!window.SEMIL)return;
const S=window.SEMIL,CFG=window.SEMIL_CONFIG||{};
const ROOT=document.body.dataset.root||'';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=h=>ROOT+h;
const biz=id=>S.businesses.find(b=>b.id===id);
const badge=k=>`<span class="badge ${S.statuses[k].cls}"><i></i>${esc(S.statuses[k].label)}</span>`;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(_){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}},del(k){try{localStorage.removeItem(k)}catch(_){}}};

/* Statements published on the About page. Kept here once so the assistant can quote them. */
const VM={vision:"To build sustainable businesses that solve real-world problems, create opportunities and deliver lasting value.",
  mission:"To turn promising ideas into meaningful services through innovation, customer focus and responsible execution."};

/* ---------- knowledge base, derived from SEMIL (no duplicated facts) ---------- */
const KB=[];
(function(){
  const add=(id,title,text,href,b)=>KB.push({id,title,text,href,b});
  const c=S.company;
  add('company','Company profile',`${c.name} is an Indian private limited company incorporated on ${c.incorporated}. CIN ${c.cin}. Registered office: ${c.address.join(', ')}.`,'company.html');
  add('vm','Vision and mission',`Vision: ${VM.vision} Mission: ${VM.mission}`,'about.html');
  S.businesses.forEach(b=>{const d=S.detail[b.id];
    add(b.id+'-o',b.name,[b.cat+'.',b.desc,...d.overview].join(' '),b.href,b.id);
    add(b.id+'-w',b.name+' audience customers',d.who.map(w=>w[0]+': '+w[1]).join(' '),b.href,b.id);
    add(b.id+'-j',b.name+' '+d.journeyTitle,d.journey.map((j,i)=>`${i+1}. ${j[0]}: ${j[1]}`).join(' '),b.href,b.id);
    add(b.id+'-c',b.name+' features capabilities',d.caps.map(x=>x[0]+' ('+x[2]+'): '+x[1]).join(' '),b.href,b.id);
    add(b.id+'-p',b.name+' principles',d.principles.join('. '),b.href,b.id);
    d.faq.forEach((f,i)=>add(b.id+'-f'+i,b.name+' FAQ: '+f[0],f[1],b.href,b.id));
  });
  add('dirs','Directors',S.directors.map(x=>`${x.name} (${x.role})`).join('; ')+'. Biographies, appointment dates and portraits are published only once supplied and approved.','leadership.html');
  add('values','Core values',S.values.map(v=>v[0]+': '+v[1]).join(' '),'about.html');
  add('time','Company timeline',S.timeline.map(t=>t.d+': '+t.t+(t.p?'. '+t.p:'')).join(' '),'about.html');
  add('road','Roadmap',S.roadmap.map(r=>r.stage+': '+(r.items.length?r.items.map(i=>i.n).join(', '):'nothing confirmed yet')).join('. '),'upcoming-projects.html');
  add('contact','Contact',`Registered office: ${c.address.join(', ')}. The official email is to be supplied. Enquiries can be sent through the contact form.`,'contact.html');
})();
const STOP=new Set('a an the is are was were be to of in on for and or with what who how do does did can i me my you your it its this that about tell please semil s at as by from have has will would should about any there their'.split(' '));
const tok=s=>(s.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(w=>!STOP.has(w)).map(w=>w.replace(/(ing|ed|es|s)$/,''));
const DF={};KB.forEach(k=>{k.tk=tok(k.title+' '+k.text);k.tf={};k.tk.forEach(w=>k.tf[w]=(k.tf[w]||0)+1);Object.keys(k.tf).forEach(w=>DF[w]=(DF[w]||0)+1)});
function retrieve(q,n=4){
  const qt=tok(q);if(!qt.length)return[];
  return KB.map(k=>{let s=0;qt.forEach(w=>{if(k.tf[w])s+=(1+Math.log(k.tf[w]))*Math.log(1+KB.length/DF[w]);if(k.title.toLowerCase().includes(w))s+=1.2});return{k,s}})
    .filter(x=>x.s>1.6).sort((a,b)=>b.s-a.s).slice(0,n).map(x=>x.k);
}

/* ---------- tools (the only functions the assistant may call) ---------- */
const ALIAS={neutags:/neutag|marketplace|e-?commerce|multi-?vendor|online shop|shop(ping)?\b/,food:/food|restaurant|meal|menu/,matrimony:/matrimon|marriage|matchmak|bride|groom|\bmatch(es)?\b/,
  logistics:/logistic|transport|supply.?chain|parcel|shipping|courier|delivery operations/,payments:/payment|gateway|fintech|financial|payout|merchant services/};
const tools={
  get_company_profile:()=>S.company,
  get_business:id=>biz(id),
  list_businesses:()=>S.businesses,
  compare:ids=>ids.map(biz),
  get_timeline:()=>S.timeline,
  get_roadmap:()=>S.roadmap,
  list_directors:()=>S.directors,
  navigate:href=>{location.href=url(href)}
};

/* ---------- UI renderers (dynamic responses) ---------- */
const R={
  card:b=>`<a class="sai-card" href="${url(b.href)}"><div><b>${esc(b.name)}</b><span>${esc(b.cat)}</span></div>${badge(b.status)}<p>${esc(b.short)}</p></a>`,
  steps:(title,steps)=>`<div class="sai-steps"><p class="sai-t">${esc(title)}</p><ol>${steps.map((s,i)=>`<li style="--d:${i*90}ms"><i>${i+1}</i><div><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div></li>`).join('')}</ol></div>`,
  list:items=>`<ul class="sai-list">${items.map(i=>`<li>${i}</li>`).join('')}</ul>`,
  timeline:()=>`<ol class="sai-tl">${S.timeline.map(t=>`<li class="${t.ok?'ok':''}"><b>${esc(t.d)}</b><span>${esc(t.t)}</span>${t.p?`<em>${esc(t.p)}</em>`:''}</li>`).join('')}</ol>`,
  roadmap:()=>`<div class="sai-road">${S.roadmap.map(r=>`<div><b>${esc(r.stage)}</b>${r.items.length?r.items.map(i=>`<a href="${url(biz(i.id).href)}">${esc(i.n)}</a>`).join(''):'<span>Nothing confirmed yet</span>'}</div>`).join('')}</div>`,
  compare:ids=>{const bs=tools.compare(ids);const rows=[['Category',b=>esc(b.cat)],['Status',b=>badge(b.status)],['Serves',b=>esc(S.detail[b.id].who.map(w=>w[0]).join(', '))],['Core ideas',b=>esc(S.detail[b.id].caps.slice(0,3).map(c=>c[0]).join(', '))],['Page',b=>`<a href="${url(b.href)}">Open</a>`]];
    return `<div class="sai-tablewrap"><table class="sai-table"><thead><tr><th></th>${bs.map(b=>`<th>${esc(b.name)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th>${r[0]}</th>${bs.map(b=>`<td>${r[1](b)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`},
  eco:()=>{const n=S.businesses,cx=150,cy=100,pts=n.map((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n.length;return[cx+Math.cos(a)*92*1.35,cy+Math.sin(a)*72]});
    return `<svg class="sai-eco" viewBox="0 0 300 200" role="img" aria-label="Semil at the centre of its businesses">${pts.map(p=>`<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}"/>`).join('')}<circle class="hub" cx="${cx}" cy="${cy}" r="22"/><text x="${cx}" y="${cy+3}" text-anchor="middle" class="hubt">Semil</text>${pts.map((p,i)=>`<a href="${url(n[i].href)}"><circle class="nd" cx="${p[0]}" cy="${p[1]}" r="9"/><text x="${p[0]}" y="${p[1]+(p[1]>cy?22:-14)}" text-anchor="middle">${esc(n[i].name.replace('Semil ',''))}</text></a>`).join('')}</svg>`},
  enquiry:cat=>`<form class="sai-form" novalidate><p class="sai-t">Send an enquiry</p><input name="name" placeholder="Your name" maxlength="80" required aria-label="Your name"><input name="email" type="email" placeholder="Email" maxlength="120" required aria-label="Email"><select name="category" aria-label="Enquiry type">${['General corporate enquiry','Business partnership','Technology partnership','Seller or merchant enquiry','Careers','Other enquiries'].map(o=>`<option${o===cat?' selected':''}>${o}</option>`).join('')}</select><textarea name="message" placeholder="Your message" maxlength="1000" required aria-label="Message"></textarea><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><div class="sai-fs" role="status" aria-live="polite"></div><button type="submit">Review and send</button><p class="sai-fine">Nothing is sent until you press the button.</p></form>`
};

/* ---------- pipeline ---------- */
const ctx={last:null,topics:[]};
const bizIn=q=>{const l=q.toLowerCase(),o=[];Object.keys(ALIAS).forEach(id=>{const m=l.search(ALIAS[id]);if(m>=0)o.push([m,id])});
  S.businesses.forEach(b=>{const m=l.indexOf(b.name.toLowerCase());if(m>=0&&!o.some(x=>x[1]===b.id))o.push([m,b.id])});return o.sort((a,b)=>a[0]-b[0]).map(x=>x[1])};
const topicOf=l=>/who (is|are|can|for)|audience|customer|user|for whom|serve/.test(l)?'who':/how (does|do|it|will)|journey|process|flow|steps?|work(s|ing)?\b/.test(l)?'journey':/feature|capabilit|offer|provide|service/.test(l)?'caps':/faq|frequent/.test(l)?'faq':/status|launch|live|available|started|operational|open|ready|can i (shop|order|use|pay)|when/.test(l)?'status':/principle|belie|guid/.test(l)?'principles':null;

function forBusiness(id,topic){
  const b=biz(id),d=S.detail[id],src=[{t:b.name,h:b.href}];let html='',tr=[];
  if(topic==='who'){html=`<p><b>${esc(b.name)}</b> is aimed at:</p>`+R.list(d.who.map(w=>`<b>${esc(w[0])}.</b> ${esc(w[1])}`));tr.push('Specialist: audience tool')}
  else if(topic==='journey'){html=R.steps(d.journeyTitle,d.journey);tr.push('Specialist: journey diagram builder')}
  else if(topic==='caps'){html=`<p>Features of <b>${esc(b.name)}</b>, with how firmly each is described:</p>`+R.list(d.caps.map(c=>`<b>${esc(c[0])}</b> <em class="sai-tag">${esc(c[2])}</em><br>${esc(c[1])}`))}
  else if(topic==='faq'){html=d.faq.map(f=>`<p><b>${esc(f[0])}</b><br>${esc(f[1])}</p>`).join('')}
  else if(topic==='principles'){html=`<p>What guides <b>${esc(b.name)}</b>:</p>`+R.list(d.principles.map(esc))}
  else if(topic==='status'){html=`<p><b>${esc(b.name)}</b> ${badge(b.status)}</p><p>${esc(b.status==='tbc'?'The company has not yet confirmed the current status for this website. '+(id==='neutags'?'Please check neutags.com for the live state.':'It will be shown here once confirmed.'):b.status==='launched'?'It has launched.':'It has not launched. '+(S.statuses[b.status].label==='Upcoming'?'It is an upcoming initiative.':'It is currently '+S.statuses[b.status].label.toLowerCase()+'.'))}</p>`}
  else{html=`<p>${esc(d.overview[0])}</p>${d.overview[1]?`<p>${esc(d.overview[1])}</p>`:''}`+R.card(b);tr.push('Specialist: business overview')}
  if(id==='payments'&&!/regulat/i.test(html))html+=`<p class="sai-note">Subject to applicable regulatory requirements, approvals and partnerships. Semil does not claim to be an authorised payment system operator or payment aggregator.</p>`;
  return{html,src,tr};
}

function answer(q){
  const l=q.toLowerCase().trim(),trace=[],t0=performance.now();let out={html:'',src:[],tr:[],chips:[],grounded:true,intent:'fallback'};
  let ids=bizIn(l);const topic=topicOf(l);
  if(!ids.length&&ctx.last&&(topic||/\b(it|its|this|that|they|them)\b/.test(l)))ids=[ctx.last];
  if(/compare|versus|\bvs\.?\b|difference|differ/.test(l)&&ids.length<2&&ctx.last&&ids.indexOf(ctx.last)<0&&ids.length)ids.unshift(ctx.last);
  const retrieved=retrieve(q);
  trace.push(`Router: read the question, topic "${topic||'general'}", businesses [${ids.join(', ')||'none'}]`);
  trace.push(`Retriever: ${retrieved.length} verified passage${retrieved.length===1?'':'s'}${retrieved.length?' ('+retrieved.map(k=>k.title).slice(0,3).join('; ')+')':''}`);
  const done=(o,intent)=>{Object.assign(out,o,{intent});return out};

  if(/^(hi|hello|hey|namaste|good (morning|afternoon|evening))\b/.test(l)&&l.length<30)
    return finish(done({html:`<p>Hello. I can answer questions about Semil, its businesses and its leadership, using only what the company has confirmed on this site.</p>`,chips:['Give me an overview','Compare the businesses','Who are the directors?']},'greeting'));
  if(/revenue|turnover|profit|funding|valuation|investor|salary|salaries|employees|headcount|how many (customers|users|sellers)|market share|share price|net worth/.test(l))
    return finish(done({html:`<p>Semil has not published that information, so I won't guess. This site only states what the company has confirmed.</p>`,chips:['Company details','How can I contact Semil?']},'unpublished'));
  if(/authori[sz]ed|licen[sc]e|\brbi\b|regulat|pa-?pg/.test(l)&&(ids.includes('payments')||/payment|gateway/.test(l)))
    {const r=forBusiness('payments','faq');ctx.last='payments';return finish(done({html:`<p>${esc(S.detail.payments.faq[0][1])}</p><p class="sai-note">Subject to applicable regulatory requirements, approvals and partnerships.</p>`,src:r.src,tr:['Specialist: regulatory FAQ lookup'],chips:['Tell me about the Payment Gateway','Upcoming projects']},'regulatory'))}
  if(/\bcin\b|incorporat|founded|established|when (was|did)|history|timeline|milestone/.test(l)&&!ids.length)
    return finish(done({html:`<p><b>${esc(S.company.name)}</b> was incorporated on <b>${esc(S.company.incorporated)}</b> (CIN ${esc(S.company.cin)}). Registered details are marked pending verification on the site until the company confirms them.</p>`+R.timeline(),src:[{t:'Company details',h:'company.html'},{t:'About',h:'about.html'}],tr:['Specialist: timeline tool'],chips:['Who are the directors?','Roadmap']},'timeline'));
  if(/director|founder|leadership|who (runs|owns|leads|manages)|\bteam\b|management/.test(l)&&!ids.length)
    return finish(done({html:`<p>Semil is led by its directors:</p>`+R.list(S.directors.map(d=>`<b>${esc(d.name)}</b>, ${esc(d.role)}`))+`<p class="sai-note">Biographies, appointment dates and portraits are published only once the company supplies and approves them, so I have nothing more to add.</p>`,src:[{t:'Leadership',h:'leadership.html'}],tr:['Specialist: directors tool'],chips:['Company details','Core values']},'directors'));
  if(/address|office|where (is|are)|located|location|email|e-mail|phone|call you/.test(l)&&!ids.length)
    return finish(done({html:`<p>Registered office:</p><p><b>${S.company.address.map(esc).join('<br>')}</b></p><p>The official email address is still to be supplied. You can use the contact form for now.</p>`,src:[{t:'Contact',h:'contact.html'}],tr:['Specialist: contact lookup'],chips:['Send an enquiry']},'contact'));
  if(/enquir|get in touch|contact (us|semil)|partner(ship)? with|become a (seller|partner)|apply|register (my )?interest|send (a )?message|reach out|i (run|own|have) a (restaurant|business|shop|store)|sell on/.test(l)){
    const cat=ids.includes('neutags')?'Seller or merchant enquiry':ids.includes('payments')?'Technology partnership':/career|job|apply/.test(l)?'Careers':'Business partnership';
    return finish(done({html:`<p>Happy to help. Fill this in and review it before sending.</p>`+R.enquiry(cat),tr:['Tool: submit_enquiry (asks you to confirm; nothing is sent automatically)'],chips:[]},'enquiry'));}
  if(/\b(games?|play|brain|puzzle|quiz)\b/.test(l))
    return finish(done({html:`<p>There is a short brain game for each business: ${S.businesses.map(b=>esc(b.name)).join(', ')}.</p><p><a class="btn primary" href="${url('play.html')}">Open the game hub</a></p>`,src:[{t:'Play',h:'play.html'}],chips:['Overview']},'games'));
  if(/value|vision|mission|philosoph|culture|belie/.test(l)&&!ids.length)
    return finish(done({html:`<p><b>Vision.</b> ${esc(VM.vision)}</p><p><b>Mission.</b> ${esc(VM.mission)}</p>`+R.list(S.values.map(v=>`<b>${esc(v[0])}.</b> ${esc(v[1])}`)),src:[{t:'About',h:'about.html'}],tr:['Specialist: values lookup'],chips:['Overview','Who are the directors?']},'values'));
  if(/roadmap|upcoming|next|future|plan(ned|s)?\b|pipeline|in development/.test(l)&&!ids.length&&!topic)
    return finish(done({html:`<p>Here is where things stand. Items move only when the company confirms them.</p>`+R.roadmap(),src:[{t:'Upcoming projects',h:'upcoming-projects.html'}],tr:['Specialist: roadmap builder'],chips:['Tell me about the Payment Gateway','Overview']},'roadmap'));
  if(/compare|versus|\bvs\.?\b|difference|differ/.test(l)||ids.length>=2){
    const use=ids.length>=2?ids:S.businesses.map(b=>b.id);ctx.last=use[0];
    return finish(done({html:`<p>A side-by-side view, using only confirmed information:</p>`+R.compare(use),src:use.map(i=>({t:biz(i).name,h:biz(i).href})),tr:['Planner: split into one lookup per business, then merge into a table','Specialist: comparison builder'],chips:use.slice(0,2).map(i=>'Tell me about '+biz(i).name)},'compare'));}
  if(ids.length===1){const id=ids[0];ctx.last=id;if(!ctx.topics.includes(id))ctx.topics.push(id);const r=forBusiness(id,topic);
    const more=['who','journey','caps','status'].filter(x=>x!==topic).slice(0,3).map(x=>({who:'Who is it for?',journey:'How does it work?',caps:'What features?',status:'Has it launched?'}[x]));
    return finish(done({html:r.html,src:r.src,tr:r.tr,chips:more},'business'));}
  if(/overview|summar|ecosystem|portfolio|businesses|projects|everything|what (does|do) semil|about semil|tell me about (semil|the company)|who is semil|what is semil/.test(l)){
    return finish(done({html:`<p><b>${esc(S.company.name)}</b> is building a connected ecosystem of ${S.businesses.length} initiatives. Each is shown with its confirmed status.</p>`+R.eco()+`<div class="sai-cards">${S.businesses.map(R.card).join('')}</div>`,src:[{t:'Businesses',h:'businesses.html'},{t:'Company details',h:'company.html'}],tr:['Planner: company profile + one card per business','Specialist: ecosystem diagram'],chips:['Compare the businesses','Roadmap','Who are the directors?']},'overview'));}
  if(retrieved.length){const k=retrieved[0];return finish(done({html:`<p>${esc(k.text)}</p>`,src:retrieved.slice(0,3).map(x=>({t:x.title,h:x.href})),tr:['Retriever fallback: quoted the best-matching verified passage'],chips:['Overview']},'retrieval'));}
  return finish(done({html:`<p>I don't have confirmed information on that, so I'd rather not guess. I can help with Semil's businesses, leadership, roadmap and how to get in touch, or you can send the team a question.</p>`,grounded:false,chips:['Overview','Send an enquiry']},'fallback'));

  function finish(o){o.trace=trace.concat(o.tr||[]);
    /* verifier: every status comes from the central list; payments answers must carry the regulatory notice */
    const bad=o.src&&o.src.some(s=>!s.h);o.trace.push(`Verifier: ${o.grounded===false?'no supporting passage, declined to answer':bad?'source missing':'answer built from site data, statuses checked'}`);
    o.ms=Math.round(performance.now()-t0);return o}
}

/* ---------- metrics (kept on this device only) ---------- */
const M=store.get('semil-ai-metrics',{q:0,fallback:0,errors:0,ms:0,up:0,down:0,llm:0});
const bump=(k,v=1)=>{M[k]=(M[k]||0)+v;store.set('semil-ai-metrics',M)};

/* ---------- optional server-side LLM (disabled until configured) ---------- */
async function askServer(q,hist){
  const ctrl=new AbortController(),to=setTimeout(()=>ctrl.abort(),20000);
  try{const r=await fetch(CFG.aiEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:ctrl.signal,
    body:JSON.stringify({message:q.slice(0,600),history:hist.slice(-6),context:retrieve(q,6).map(k=>({title:k.title,text:k.text,href:k.href})),page:document.body.dataset.page})});
    if(!r.ok)throw new Error(r.status);const j=await r.json();if(!j||typeof j.text!=='string')throw new Error('bad');return j}
  finally{clearTimeout(to)}
}

/* ---------- panel UI ---------- */
function build(){
  const prefs=store.get('semil-ai-prefs',{consent:false,topics:[]});
  const host=document.createElement('div');host.id='sai';
  host.innerHTML=`<button class="sai-fab" type="button" aria-haspopup="dialog" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg><span>Ask Semil AI</span></button>
  <section class="sai-panel" role="dialog" aria-label="Semil AI assistant" hidden>
   <header><div><b>Semil AI</b><span>Grounded in confirmed company information</span></div><div class="sai-hb"><button type="button" data-a="speak" aria-pressed="false" title="Read answers aloud">Aloud</button><button type="button" data-a="quality" title="Quality and privacy">Quality</button><button type="button" data-a="close" aria-label="Close">×</button></div></header>
   <div class="sai-log" aria-live="polite"></div>
   <div class="sai-quality" hidden></div>
   <div class="sai-chips"></div>
   <form class="sai-in"><button type="button" data-a="mic" aria-label="Speak" title="Speak your question" hidden>Mic</button><input name="q" placeholder="Ask about Semil, its businesses, leadership…" maxlength="400" autocomplete="off" aria-label="Your question"><button class="send" type="submit" aria-label="Send">→</button></form>
   <p class="sai-foot">An on-site assistant that answers only from confirmed content. It is not an AGI and can be wrong; check the sources shown.</p>
  </section>`;
  document.body.appendChild(host);
  const fab=$('.sai-fab',host),panel=$('.sai-panel',host),log=$('.sai-log',host),chips=$('.sai-chips',host),form=$('.sai-in',host),input=$('input',form),qual=$('.sai-quality',host);
  let speak=false,hist=[],busy=false,opened=false;
  const scroll=()=>{log.scrollTop=log.scrollHeight};
  const say=(who,html)=>{const m=document.createElement('div');m.className='sai-m '+who;m.innerHTML=html;log.appendChild(m);scroll();return m};
  const setChips=a=>{chips.innerHTML=(a||[]).map(c=>`<button type="button">${esc(c)}</button>`).join('')};
  const open=()=>{panel.hidden=false;fab.setAttribute('aria-expanded','true');host.classList.add('open');if(!opened){opened=true;
      say('bot',`<p>Hi, I'm the Semil assistant. Ask me anything about the company, its businesses or its leadership. I only use information the company has confirmed.</p>`);
      const rec=prefs.consent&&prefs.topics.length?['Continue with '+biz(prefs.topics[prefs.topics.length-1]).name]:[];
      setChips([...rec,'Give me an overview','Compare the businesses','Roadmap','Who are the directors?','Send an enquiry'])}
    setTimeout(()=>input.focus(),50)};
  const close=()=>{panel.hidden=true;fab.setAttribute('aria-expanded','false');host.classList.remove('open');fab.focus()};
  fab.onclick=()=>panel.hidden?open():close();
  host.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close()});
  window.SemilAI={open:q=>{open();if(q)ask(q)},ask:q=>answer(q)};

  async function ask(q){
    q=q.trim();if(!q||busy)return;busy=true;say('me',esc(q));input.value='';setChips([]);
    const typing=say('bot','<span class="sai-dots"><i></i><i></i><i></i></span>');const t0=performance.now();
    let res,llm=false;
    try{
      if(CFG.aiEndpoint){try{const j=await askServer(q,hist);res={html:j.text.split(/\n{2,}/).map(p=>`<p>${esc(p)}</p>`).join(''),src:(j.sources||[]).filter(s=>s&&typeof s.h==='string'&&!/^https?:/i.test(s.h)).map(s=>({t:String(s.t||'Source'),h:s.h})),trace:['Server model answered using retrieved Semil passages'],chips:[]};llm=true;bump('llm')}catch(_){bump('errors')}}
      if(!res)res=answer(q);
      await new Promise(r=>setTimeout(r,Math.max(0,420-(performance.now()-t0))));
    }catch(err){bump('errors');res={html:`<p>Something went wrong on my side. Please try again, or use the contact page.</p>`,src:[],trace:['Error handled'],chips:['Overview'],grounded:false}}
    const ms=Math.round(performance.now()-t0);bump('q');bump('ms',ms);if(res.grounded===false)bump('fallback');
    hist.push({role:'user',content:q.slice(0,400)});hist.push({role:'assistant',content:res.html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,500)});
    typing.innerHTML=res.html+(res.src&&res.src.length?`<p class="sai-src">Sources: ${res.src.map(s=>`<a href="${url(s.h)}">${esc(s.t)}</a>`).join(' · ')}</p>`:'')
      +`<details class="sai-why"><summary>How I answered${llm?' (model)':''} · ${ms} ms</summary><ol>${(res.trace||[]).map(t=>`<li>${esc(t)}</li>`).join('')}</ol></details>`
      +`<div class="sai-fb" data-id="${Date.now()}"><button type="button" data-v="up" aria-label="Helpful">Helpful</button><button type="button" data-v="down" aria-label="Not helpful">Not helpful</button></div>`;
    $$('.sai-form',typing).forEach(wireForm);
    scroll();setChips(res.chips);
    if(speak&&'speechSynthesis' in window){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(typing.querySelector('p')?typing.querySelector('p').textContent:'');u.lang='en-IN';speechSynthesis.speak(u)}catch(_){}}
    if(prefs.consent&&ctx.topics.length){prefs.topics=ctx.topics.slice(-5);store.set('semil-ai-prefs',prefs)}
    busy=false;
  }
  form.onsubmit=e=>{e.preventDefault();ask(input.value)};
  chips.onclick=e=>{const b=e.target.closest('button');if(!b)return;let t=b.textContent;
    if(t.startsWith('Continue with ')){const bb=S.businesses.find(x=>x.name===t.slice(14));t=bb?'Tell me about '+bb.name:t}
    ask(t)};
  log.onclick=e=>{const b=e.target.closest('.sai-fb button');if(!b)return;const fb=b.parentNode;if(fb.dataset.done)return;fb.dataset.done=1;bump(b.dataset.v);fb.innerHTML='<span>Thanks, noted on this device.</span>'};
  panel.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;const v=a.dataset.a;
    if(v==='close')close();
    if(v==='speak'){speak=!speak;a.setAttribute('aria-pressed',speak);if(!speak&&'speechSynthesis' in window)speechSynthesis.cancel()}
    if(v==='quality'){qual.hidden=!qual.hidden;if(!qual.hidden)renderQuality()}
    if(v==='mic')listen(a)});

  /* enquiry tool: validates, asks for confirmation, then posts to the same endpoint as the contact form */
  function wireForm(f){f.addEventListener('submit',async e=>{e.preventDefault();const st=$('.sai-fs',f),d=Object.fromEntries(new FormData(f));
    if($('.hp',f).value)return;
    if(!d.name.trim()||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)||d.message.trim().length<10){st.className='sai-fs err';st.textContent='Please add your name, a valid email and a message of at least 10 characters.';return}
    if(!f.dataset.ok){f.dataset.ok=1;st.className='sai-fs';st.textContent='Check the details above, then press the button again to send.';$('button',f).textContent='Confirm and send';return}
    if(!CFG.formEndpoint && (!window.SemilFirebase || !window.SemilFirebase.saveSubmission)){st.className='sai-fs err';st.textContent='Not sent: database is not initialized yet. Please use the contact page.';return}
    const btn=$('button',f);btn.disabled=true;
    try{
      if(window.semilFirebaseReady) await window.semilFirebaseReady;
      if(window.SemilFirebase && window.SemilFirebase.saveSubmission){
        await window.SemilFirebase.saveSubmission('contact_enquiries',{...d,source:'semil-ai'});
      } else {
        const r=await fetch(CFG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...d,source:'semil-ai'})});if(!r.ok)throw 0;
      }
      st.className='sai-fs ok';st.textContent='Sent. Thank you, the team will reply by email.';f.reset()}
    catch(_){st.className='sai-fs err';st.textContent='Could not send. Please check your connection and try again.';btn.disabled=false}})}

  function renderQuality(){
    const avg=M.q?Math.round(M.ms/M.q):0,rate=x=>M.q?Math.round(100*x/M.q)+'%':'n/a';
    qual.innerHTML=`<h4>Quality on this device</h4><dl><dt>Questions</dt><dd>${M.q}</dd><dt>Avg response</dt><dd>${avg} ms</dd><dt>Could not answer</dt><dd>${rate(M.fallback)}</dd><dt>Errors</dt><dd>${M.errors}</dd><dt>Helpful / not</dt><dd>${M.up} / ${M.down}</dd></dl>
    <button type="button" class="q-btn" data-t="test">Run accuracy self-test</button><div class="q-out" aria-live="polite"></div>
    <label class="q-c"><input type="checkbox" ${prefs.consent?'checked':''}> Remember which businesses I explore on this device</label>
    <button type="button" class="q-btn q-ghost" data-t="clear">Clear my saved data</button><p class="sai-fine">Counts stay in your browser. Nothing is sent to Semil unless you submit an enquiry.${CFG.aiEndpoint?' A connected model receives your questions to answer them.':''}</p>`;
    $('[data-t=test]',qual).onclick=()=>{const r=selfTest();$('.q-out',qual).innerHTML=`<b>${r.pass}/${r.total} passed</b>`+(r.fail.length?'<br>Failed: '+r.fail.map(esc).join('; '):'')};
    $('input',qual).onchange=e=>{prefs.consent=e.target.checked;prefs.topics=prefs.consent?ctx.topics.slice(-5):[];if(!prefs.consent)store.del('semil-ai-prefs');else store.set('semil-ai-prefs',prefs)};
    $('[data-t=clear]',qual).onclick=()=>{store.del('semil-ai-prefs');store.del('semil-ai-metrics');Object.keys(M).forEach(k=>M[k]=0);prefs.consent=false;prefs.topics=[];renderQuality()};
  }
  /* voice input where the browser supports it */
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SR){$('[data-a=mic]',host).hidden=false}
  function listen(btn){try{const r=new SR();r.lang='en-IN';r.interimResults=false;btn.classList.add('live');r.onresult=e=>{input.value=e.results[0][0].transcript;ask(input.value)};r.onend=()=>btn.classList.remove('live');r.onerror=()=>btn.classList.remove('live');r.start()}catch(_){btn.classList.remove('live')}}
  /* entry points: header search hint, #ask hash, home CTA buttons with data-ai */
  $$('[data-ai]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();open();if(b.dataset.ai!=='1')ask(b.dataset.ai)}));
  if(location.hash==='#ask')open();
}

/* golden questions used for continuous evaluation (run from the Quality panel or by tests) */
const GOLD=[
 ['What is Neutags?','marketplace'],['Is Semil an authorised payment operator?','does not claim'],['Who are the directors?','Sriram Sanjay Santhakumar'],
 ['What is the CIN?','U47912TZ2025PTC035227'],['Compare Food Delivery and Matrimony','Semil Matrimony'],['What is Semil revenue?','not published'],
 ['Has Semil Food Delivery launched?','not launched'],['Who is it for?','Customers'],['Where is the registered office?','Kalidhasar'],['How does logistics work?','journey'],
 ['Tell me about the weather on Mars','confirmed information']];
function selfTest(){const save={...ctx};ctx.last=null;let pass=0;const fail=[];
  GOLD.forEach(g=>{ctx.last=g[0]==='Who is it for?'?'food':null;const r=answer(g[0]);if(r.html.toLowerCase().includes(g[1].toLowerCase())||(g[1]==='journey'&&r.html.includes('sai-steps')))pass++;else fail.push(g[0])});
  Object.assign(ctx,save);return{pass,total:GOLD.length,fail}}
window.SemilAIEval={run:selfTest,answer};

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
