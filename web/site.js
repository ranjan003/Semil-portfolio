/* Semil site runtime v2: central content, shared header/footer, search, transitions, forms and page modules.
   Edit SEMIL below to change businesses, statuses, people, details and timeline everywhere at once. */
(function(){
'use strict';
const SEMIL_CONFIG={ formEndpoint:"", aiEndpoint:"" }; // set to a secure form service URL to receive enquiries
const SEMIL={
  company:{name:"Semil Retail Industries Private Limited",short:"Semil",cin:"U47912TZ2025PTC035227",incorporated:"4 July 2025",
    address:["101/57 A, Kalidhasar Street","Narayanan Nagar, Salem","Tamil Nadu 636015, India"],
    verified:{address:false,cin:false,incorporation:false,designations:false}},
  statuses:{
    tbc:{label:"Status to be confirmed",cls:"tbc"},
    planning:{label:"In Planning",cls:""},
    development:{label:"In Development",cls:"dev"},
    upcoming:{label:"Upcoming",cls:"up"},
    launched:{label:"Launched",cls:"live"}
  },
  businesses:[
    {id:"neutags",href:"businesses/neutags.html",name:"Neutags",cat:"Digital Commerce",tags:["commerce"],status:"tbc",game:"memory",
      short:"A multi-vendor e-commerce marketplace connecting brands, sellers and customers.",
      desc:"A multi-vendor e-commerce marketplace connecting brands, sellers and customers through a convenient online shopping experience."},
    {id:"food",href:"businesses/food-delivery.html",name:"Semil Food Delivery",cat:"Food & Technology",tags:["consumer"],status:"planning",game:"sequence",
      short:"A planned platform connecting customers, restaurants and delivery partners.",
      desc:"A planned food delivery platform designed to connect customers, restaurants and delivery partners through a convenient digital experience."},
    {id:"matrimony",href:"businesses/matrimony.html",name:"Semil Matrimony",cat:"Matchmaking",tags:["consumer"],status:"planning",game:"pairs",
      short:"A planned matrimonial platform helping individuals and families find compatible matches.",
      desc:"A planned matrimonial platform designed to help individuals and families discover compatible matches through a thoughtful digital experience."},
    {id:"logistics",href:"businesses/logistics.html",name:"Semil Logistical Services",cat:"Logistics & Supply Chain",tags:["logistics"],status:"tbc",game:"parcel",
      short:"A logistics initiative for delivery operations, transportation and supply chains.",
      desc:"A logistics initiative focused on delivery operations, transportation and supply-chain services."},
    {id:"payments",href:"upcoming-projects/payment-gateway.html",name:"Semil Payment Gateway",cat:"Financial Technology",tags:["fintech","ventures"],status:"upcoming",project:true,game:"checkout",
      short:"A proposed payment technology initiative, subject to regulatory requirements.",
      desc:"A proposed payment technology initiative exploring digital payment acceptance, merchant services, payouts and payment infrastructure."}
  ],
  /* In-depth pages. Concept descriptions only; nothing here claims a feature is live. */
  detail:{
    neutags:{tagline:"Where sellers and customers meet.",
      overview:["Neutags is a multi-vendor e-commerce marketplace. Instead of one shop selling its own goods, many brands and sellers present their products in one place, and customers browse them together.","Within Semil, Neutags is the Digital Commerce business. Its role is to connect sellers with customers, support product discovery and enable digital commerce."],
      who:[["Brands","Present products to customers through a shared marketplace."],["Sellers","Reach customers without building a separate online store."],["Customers","Find products from different sellers in one convenient place."]],
      journeyTitle:"How a multi-vendor marketplace works (concept)",
      journey:[["List","A brand or seller adds products to the marketplace."],["Discover","A customer finds products by searching and browsing."],["Order","The customer chooses a product and places an order."],["Fulfil","The seller prepares and dispatches the order."],["Receive","The customer receives the order and can share feedback."]],
      caps:[["Multi-vendor marketplace","Many sellers, one shopping experience.","Core concept"],["Product discovery","Helping customers find what they are looking for.","Core concept"],["Seller and customer connection","Bringing both sides of commerce together.","Core concept"]],
      principles:["Convenience for the customer","Fair visibility for sellers","Clear, honest product presentation"],
      faq:[["What is Neutags?","A multi-vendor e-commerce marketplace that connects brands, sellers and customers."],["Can I shop on Neutags now?","The latest operating status is being confirmed for this site. Please visit neutags.com for the current state of the marketplace."],["I am a seller. How do I get in touch?","Use the seller enquiry on this page, or visit neutags.com."],["How is Neutags related to Semil?","Neutags is one of the businesses in the Semil ecosystem, in the Digital Commerce category."]],
      demo:"shop",external:{label:"Visit Neutags",href:"https://neutags.com"},enq:["Seller enquiry","Seller or merchant enquiry"],
      note:"The current operational status of Neutags will be shown once the latest status is confirmed. No marketplace statistics are published on this site."},
    food:{tagline:"Good food, connected by technology.",
      overview:["Semil Food Delivery is a planned platform that would connect customers, restaurants and delivery partners through one convenient digital experience.","The long-term vision covers restaurant partnerships, customer convenience and well-coordinated delivery operations. It has not launched."],
      who:[["Customers","Discover restaurants and menus and order with ease."],["Restaurants","Reach customers and manage orders digitally."],["Delivery partners","Receive and complete deliveries in an organised way."]],
      journeyTitle:"The planned delivery journey",
      journey:[["Discover","The customer browses restaurants and digital menus."],["Order","The customer places an order."],["Prepare","The restaurant accepts and prepares the order."],["Pick up","A delivery partner collects the order."],["Deliver","The order reaches the customer."]],
      caps:[["Restaurant discovery","Finding restaurants that suit the moment.","Planned"],["Digital menus","Menus presented clearly on screen.","Planned"],["Delivery journeys","Orders followed from kitchen to doorstep.","Planned"],["Restaurant partnerships","A long-term relationship with restaurant partners.","Planned"],["Electric mobility","A design theme for modern, cleaner delivery.","Design direction"]],
      principles:["Convenience for customers","Fair partnerships with restaurants","Reliable delivery operations"],
      faq:[["Is Semil Food Delivery available?","No. It is a planned platform and has not launched."],["I run a restaurant. Can I register interest?","Yes. Use the partner enquiry and tell us about your restaurant."],["Will you hire delivery partners?","Nothing has been announced. Use the enquiry form if you would like to be kept in mind."]],
      demo:"food",enq:["Partner enquiry","Business partnership"],
      note:"This platform has not launched. Everything described here is planned, and the previews are illustrations, not live functionality."},
    matrimony:{tagline:"A thoughtful way to find a match.",
      overview:["Semil Matrimony is a planned matrimonial platform designed to help individuals and families discover compatible matches.","It is meant to feel trustworthy and considered rather than casual. It has not launched."],
      who:[["Individuals","People looking for a compatible life partner."],["Families","Parents and relatives who take part in the search."]],
      journeyTitle:"The planned matching journey",
      journey:[["Share","A person shares their preferences."],["Discover","Compatible profiles are suggested."],["Involve","Family can take part when the person wishes."],["Connect","Introductions happen respectfully."]],
      caps:[["Compatibility-led discovery","Matches shaped by what matters to people.","Planned"],["Family-friendly experience","A service families can trust and take part in.","Planned"],["Refined, trustworthy design","An elegant interface that is not a casual dating app.","Design direction"]],
      principles:["Privacy and consent first","Respect for individuals and families","A trustworthy, calm atmosphere"],
      faq:[["Is Semil Matrimony live?","No. It is planned."],["Are the profiles on this page real?","No. They are interface illustrations with no real people."],["How can I stay informed?","Send a general enquiry and we will note your interest."]],
      demo:"match",enq:["General enquiry","General corporate enquiry"],
      note:"This service has not launched. The previews are interface illustrations and contain no real profiles."},
    logistics:{tagline:"Reliable movement, coordinated end to end.",
      overview:["Semil Logistical Services is a logistics initiative focused on delivery operations, transportation and supply-chain services.","It aims to communicate reliability, coordination and operational efficiency."],
      who:[["Businesses and sellers","Move goods to customers and between locations."],["Partner platforms","Platforms that need dependable delivery."],["Customers","People who receive what they ordered."]],
      journeyTitle:"A package journey (concept)",
      journey:[["Book","A delivery is requested."],["Collect","The package is collected from the sender."],["Hub","It is sorted at a hub or warehouse."],["Transport","It travels on a planned route."],["Deliver","It reaches its destination."]],
      caps:[["Delivery operations","Coordinating deliveries from pickup to doorstep.","Initiative focus"],["Transportation","Moving goods on planned routes.","Initiative focus"],["Supply-chain services","Linking warehouses, transport and delivery.","Initiative focus"]],
      principles:["Reliability","Coordination","Operational efficiency"],
      faq:[["Can I track a parcel here?","No. This site shows no live tracking and none is claimed."],["Is the service operating?","The status is being confirmed and will be shown here."],["How do I discuss logistics needs?","Use the logistics enquiry on this page."]],
      demo:"logistics",enq:["Logistics enquiry","Business partnership"],
      note:"The current status of this initiative will be shown once confirmed. The network is an illustration and shows no real-time tracking data."},
    payments:{tagline:"Exploring the future of payments.",
      overview:["Semil Payment Gateway is a proposed payment technology initiative. It is exploring digital payment acceptance, merchant services, payouts and payment infrastructure.","It is an upcoming initiative and is subject to applicable regulatory requirements, approvals and partnerships."],
      who:[["Merchants","Businesses that want to accept digital payments."],["Sellers","Online sellers who need to receive payouts."],["Platform partners","Platforms that need payment infrastructure."]],
      journeyTitle:"A proposed payment flow (concept)",
      journey:[["Pay","A customer chooses to pay a merchant."],["Checkout","The merchant presents a payment option."],["Process","Payment details move through payment infrastructure."],["Confirm","The merchant learns the result."],["Payout","Funds are settled to the merchant."]],
      caps:[["Digital payment acceptance","Letting merchants take payments online.","Proposed"],["Merchant services","Supporting merchants who use the service.","Proposed"],["Payouts","Moving funds to merchants.","Proposed"],["Payment infrastructure","The technology behind a payment.","Proposed"]],
      principles:["Security","Regulatory compliance","Transparent partnerships"],
      faq:[["Is Semil an authorised payment operator?","Semil does not claim to be an authorised payment system operator or payment aggregator. Any such activity would require applicable approvals."],["Can I make payments with it today?","No. It is an upcoming initiative."],["How can a merchant or partner get in touch?","Use the partnership enquiry on this page."]],
      demo:"payflow",enq:["Partnership enquiry","Technology partnership"],
      note:"Subject to applicable regulatory requirements, approvals and partnerships. This initiative is not a launched service."}
  },
  filters:[["all","All Businesses"],["commerce","Digital Commerce"],["consumer","Consumer Services"],["logistics","Logistics"],["fintech","Financial Technology"],["ventures","Upcoming Ventures"]],
  roadmap:[
    {stage:"In Planning",items:[{n:"Semil Food Delivery",id:"food"},{n:"Semil Matrimony",id:"matrimony"}]},
    {stage:"In Development",items:[]},
    {stage:"Upcoming",items:[{n:"Semil Payment Gateway",id:"payments"}]},
    {stage:"Launched",items:[]}
  ],
  timeline:[
    {d:"4 July 2025",t:"Company incorporation",p:"Semil Retail Industries Private Limited is incorporated in India as a private limited company.",ok:true},
    {d:"Unpublished",t:"Business development milestones"},{d:"Unpublished",t:"Product launches"},{d:"Unpublished",t:"Partnerships"}
  ],
  directors:[
    {name:"Sriram Sanjay Santhakumar",role:"Director",ini:"SS",photo:null,bio:null,appointed:null,focus:null},
    {name:"Gopperundevi",role:"Director",ini:"G",photo:null,bio:null,appointed:null,focus:null}
  ],
  values:[["Innovation","Explore new ideas and practical solutions."],["Integrity","Build trust through honesty, accountability and responsible business practices."],["Sustainable growth","Develop strong foundations for long-term progress."],["Customer focus","Understand real needs and create useful experiences."],["Continuous improvement","Keep learning, adapting and improving."]],
  openings:[] // add confirmed roles: {id,title,category,location,type,summary}
};
window.SEMIL=SEMIL;window.SEMIL_CONFIG=SEMIL_CONFIG;

const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const ROOT=document.body.dataset.root||'';
const PAGE=document.body.dataset.page||'';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const url=h=>h==='index.html'?(location.protocol==='file:'?ROOT+h:(ROOT||'./')):ROOT+h;
const biz=id=>SEMIL.businesses.find(b=>b.id===id);
const badge=k=>{const s=SEMIL.statuses[k];return `<span class="badge ${s.cls}"><i></i>${s.label}</span>`};
const slug=t=>t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
window.SemilUtil={$,$$,esc,url,biz,badge,RM,FINE};

/* ---------- illustrations ---------- */
const MONO='<path d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z" fill="none" stroke="url(#mgl)" stroke-width="5" stroke-linejoin="round"/><path d="M66 36 C66 28 34 26 34 40 C34 54 66 46 66 60 C66 74 34 72 34 64" fill="none" stroke="url(#mgl)" stroke-width="7" stroke-linecap="round"/>';
const monoSvg=(cls='')=>`<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="mgl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#315EFB"/><stop offset="1" stop-color="#A78BFA"/></linearGradient></defs>${MONO}</svg>`;
window.monoSvg=monoSvg;
function art(id){
  const W=(bg,inner)=>`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${bg}</defs>${inner}</svg>`;
  if(id==='neutags'){
    let t='';[[40,50],[150,70],[260,40],[40,170],[150,190],[260,160]].forEach((p,i)=>{t+=`<g class="bob" style="animation-delay:${i*.35}s"><rect x="${p[0]}" y="${p[1]}" width="100" height="100" rx="16" fill="#fff" stroke="#DCE6FF"/><rect x="${p[0]+10}" y="${p[1]+10}" width="80" height="52" rx="10" fill="${['#DCE8FF','#D9F3FD','#E9E1FF'][i%3]}"/><rect x="${p[0]+12}" y="${p[1]+72}" width="46" height="6" rx="3" fill="#CBD5E8"/><rect x="${p[0]+12}" y="${p[1]+84}" width="28" height="6" rx="3" fill="#315EFB"/></g>`});
    return W('<linearGradient id="a1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF3FF"/><stop offset="1" stop-color="#F5EFFF"/></linearGradient>',`<rect width="400" height="300" fill="url(#a1)"/>${t}<circle cx="352" cy="46" r="20" fill="#315EFB"/><path d="M344 46h16M352 38v16" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`);
  }
  if(id==='food'){
    return W('<linearGradient id="a2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4E8"/><stop offset="1" stop-color="#EEF3FF"/></linearGradient>',`<rect width="400" height="300" fill="url(#a2)"/><circle cx="130" cy="150" r="82" fill="#fff" stroke="#FFE0C2"/><circle cx="130" cy="150" r="58" fill="#FFEBD6"/><circle cx="130" cy="150" r="24" fill="#F59E4B"/><path id="fp" class="flowl" d="M210 230 C260 160 300 250 340 140" style="stroke:#F59E4B"/><circle r="7" fill="#315EFB"><animateMotion dur="4.5s" repeatCount="indefinite"><mpath href="#fp"/></animateMotion></circle><rect x="270" y="40" width="100" height="56" rx="14" fill="#fff" stroke="#E4EAF5"/><rect x="282" y="54" width="52" height="6" rx="3" fill="#CBD5E8"/><rect x="282" y="68" width="34" height="6" rx="3" fill="#F59E4B"/><circle cx="340" cy="140" r="10" fill="none" stroke="#315EFB" stroke-width="3"/>`);
  }
  if(id==='matrimony'){
    return W('<linearGradient id="a3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1F6"/><stop offset="1" stop-color="#EFE9FF"/></linearGradient>',`<rect width="400" height="300" fill="url(#a3)"/><g class="spin" fill="none" stroke="#E76F9B" stroke-opacity=".35">${[0,45,90,135].map(a=>`<ellipse cx="200" cy="150" rx="120" ry="44" transform="rotate(${a} 200 150)"/>`).join('')}</g><circle cx="176" cy="150" r="52" fill="rgba(231,111,155,.14)" stroke="#E76F9B" stroke-width="3"/><circle cx="224" cy="150" r="52" fill="rgba(167,139,250,.16)" stroke="#A78BFA" stroke-width="3"/><circle cx="200" cy="150" r="4" fill="#D9A441"/>`);
  }
  if(id==='logistics'){
    const n=[[60,70],[170,110],[330,60],[90,210],[230,220],[340,170]],e=[[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5]];
    return W('<linearGradient id="a4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EAF8FE"/><stop offset="1" stop-color="#EEF3FF"/></linearGradient>',`<rect width="400" height="300" fill="url(#a4)"/>${e.map(([a,b])=>`<line class="flowl" x1="${n[a][0]}" y1="${n[a][1]}" x2="${n[b][0]}" y2="${n[b][1]}"/>`).join('')}${n.map((p,i)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${i%2?9:13}" fill="#fff" stroke="#315EFB" stroke-width="3"/>`).join('')}<rect width="14" height="14" rx="3" fill="#315EFB" x="-7" y="-7"><animateMotion dur="6s" repeatCount="indefinite" path="M60 70 L170 110 L230 220 L340 170"/></rect>`);
  }
  if(id==='payments'){
    return W('<linearGradient id="a5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF3FF"/><stop offset="1" stop-color="#F3EEFF"/></linearGradient><linearGradient id="a5b" x1="0" x2="1"><stop offset="0" stop-color="#315EFB"/><stop offset="1" stop-color="#48C8F5"/></linearGradient>',`<rect width="400" height="300" fill="url(#a5)"/>${[60,110,160,240,290,340].map((x,i)=>`<path class="flowl" style="animation-delay:${-i*.3}s" d="M${x} 20 V120"/>`).join('')}<g class="bob"><rect x="90" y="120" width="220" height="130" rx="20" fill="url(#a5b)"/><rect x="90" y="152" width="220" height="24" fill="rgba(255,255,255,.28)"/><rect x="112" y="204" width="70" height="9" rx="4" fill="rgba(255,255,255,.8)"/><circle cx="270" cy="210" r="14" fill="rgba(255,255,255,.85)"/></g>`);
  }
  return W('<linearGradient id="a7" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF3FF"/><stop offset="1" stop-color="#F3EEFF"/></linearGradient>',`<rect width="400" height="300" fill="url(#a7)"/>`);
}
/* Animated headquarters scene for the home hero (pure SVG + HTML layers, no libraries) */
function heroScene(){
  let wins='';
  for(let r=0;r<12;r++)for(let c=0;c<4;c++){wins+=`<rect class="win" style="animation-delay:${((r*7+c*13)%17)*.37}s" x="${212+c*26}" y="${118+r*22}" width="16" height="12" rx="2"/>`}
  let wins2='';for(let r=0;r<7;r++)for(let c=0;c<3;c++){wins2+=`<rect class="win" style="animation-delay:${((r*5+c*11)%13)*.41}s" x="${118+c*22}" y="${272+r*20}" width="13" height="10" rx="2"/>`}
  let wins3='';for(let r=0;r<5;r++)for(let c=0;c<3;c++){wins3+=`<rect class="win" style="animation-delay:${((r*3+c*9)%11)*.43}s" x="${352+c*22}" y="${300+r*20}" width="13" height="10" rx="2"/>`}
  const lab=[["Neutags",6,24,"#315EFB","businesses/neutags.html"],["Food Delivery",66,14,"#F59E4B","businesses/food-delivery.html"],["Matrimony",2,64,"#E76F9B","businesses/matrimony.html"],["Logistics",64,70,"#48C8F5","businesses/logistics.html"]];
  return `<div class="scene">
    <div class="layer" data-depth="10"><div class="sun"></div></div>
    <div class="layer clouds" data-depth="20"><i style="top:12%;left:6%;width:150px"></i><i style="top:26%;left:62%;width:190px;animation-delay:-7s"></i><i style="top:58%;left:14%;width:120px;animation-delay:-3s"></i></div>
    <div class="layer" data-depth="35"><svg viewBox="0 0 600 600" class="sky" aria-hidden="true"><g fill="#E6EEFF" stroke="#D3E0FF">${[[20,330,60,200],[90,380,50,150],[470,340,70,190],[545,390,45,140]].map(b=>`<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="6"/>`).join('')}</g></svg></div>
    <div class="layer" data-depth="55"><svg viewBox="0 0 600 600" class="hq" role="img" aria-label="Illustration of the Semil headquarters">
      <defs><linearGradient id="gl1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCE8FF"/></linearGradient><linearGradient id="gl2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3EEFF"/><stop offset="1" stop-color="#D9CCFF"/></linearGradient><linearGradient id="gl3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EAF9FF"/><stop offset="1" stop-color="#BDEBFB"/></linearGradient><linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#48C8F5" stop-opacity=".5"/><stop offset="1" stop-color="#48C8F5" stop-opacity="0"/></linearGradient></defs>
      <ellipse cx="300" cy="500" rx="250" ry="42" fill="#DDE7FF" opacity=".7"/><ellipse class="ring" cx="300" cy="500" rx="250" ry="42" fill="none" stroke="#48C8F5" stroke-width="2" stroke-dasharray="6 12"/>
      <rect x="196" y="96" width="120" height="404" rx="10" fill="url(#gl1)" stroke="#315EFB" stroke-width="2"/>${wins}
      <rect x="100" y="250" width="86" height="250" rx="10" fill="url(#gl2)" stroke="#A78BFA" stroke-width="2"/>${wins2}
      <rect x="326" y="280" width="104" height="220" rx="10" fill="url(#gl3)" stroke="#48C8F5" stroke-width="2"/>${wins3}
      <rect x="236" y="0" width="40" height="96" fill="url(#beam)"/>
      <svg x="226" y="28" width="60" height="60" viewBox="0 0 100 100"><defs><linearGradient id="mg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#315EFB"/><stop offset="1" stop-color="#A78BFA"/></linearGradient></defs><path d="M50 6 L88 28 L88 72 L50 94 L12 72 L12 28 Z" fill="#fff" stroke="url(#mg2)" stroke-width="6" stroke-linejoin="round"/><path d="M66 36 C66 28 34 26 34 40 C34 54 66 46 66 60 C66 74 34 72 34 64" fill="none" stroke="url(#mg2)" stroke-width="8" stroke-linecap="round"/></svg>
      <g fill="none" stroke="#48C8F5" stroke-width="1.6">${[[256,96,86,150],[256,96,508,150],[256,96,60,330],[256,96,530,350]].map((l,i)=>`<path class="flowl" id="cp${i}" d="M${l[0]} ${l[1]} Q ${(l[0]+l[2])/2} ${Math.min(l[1],l[3])-60} ${l[2]} ${l[3]}"/>`).join('')}</g>
      ${[0,1,2,3].map(i=>`<circle r="4.5" fill="#315EFB"><animateMotion dur="${3.4+i*.5}s" repeatCount="indefinite" begin="${i*.4}s"><mpath href="#cp${i}"/></animateMotion></circle>`).join('')}
    </svg></div>
    <div class="layer" data-depth="90">${lab.map((l,i)=>`<a class="flab" style="left:${l[1]}%;top:${l[2]}%;--c:${l[3]};animation-delay:${-i*1.3}s" href="${url(l[4])}"><i></i>${l[0]}</a>`).join('')}</div>
    <div class="layer pts" data-depth="40">${Array.from({length:18},(_,i)=>`<b style="left:${(i*37)%100}%;top:${(i*53)%100}%;animation-delay:${-(i%7)*1.1}s"></b>`).join('')}</div>
  </div>`;
}

/* ---------- header / footer ---------- */
const NAV=[["home","Home","index.html"],["about","About","about.html"],["businesses","Businesses","businesses.html",true],["upcoming","Upcoming","upcoming-projects.html"],["leadership","Leadership","leadership.html"],["play","Play","play.html"],["careers","Careers","careers.html"],["contact","Contact","contact.html"]];
function buildHeader(){
  const cur=PAGE.startsWith('business')?'businesses':PAGE.startsWith('upcoming')?'upcoming':PAGE==='company'?'about':PAGE;
  const items=NAV.map(([k,l,h,dd])=>{
    if(!dd) return `<a href="${url(h)}" class="${cur===k?'act':''}" ${cur===k?'aria-current="page"':''}>${l}</a>`;
    return `<div class="dd" id="bdd"><button type="button" aria-expanded="false" aria-haspopup="true" aria-controls="mega" class="${cur===k?'act':''}">${l}<span class="cv">⌄</span></button>
      <div class="mega" id="mega">${SEMIL.businesses.filter(b=>!b.project).map(b=>`<a href="${url(b.href)}"><div class="th">${art(b.id)}</div><div><b>${esc(b.name)}</b><p>${esc(b.short)}</p>${badge(b.status)}</div></a>`).join('')}<a class="all" href="${url(h)}">View all businesses →</a></div></div>`;
  }).join('');
  const h=document.createElement('header');h.className='nav';
  h.innerHTML=`<div class="bar"><a class="logo" href="${url('index.html')}" aria-label="Semil home">${monoSvg()}SEMIL</a>
    <nav class="menu" aria-label="Primary">${items}</nav>
    <div class="tools"><button class="ibtn" id="sbtn" type="button" aria-label="Search the site"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></button>
    <a class="btn primary cta mag" href="${url('contact.html')}" style="padding:11px 20px">Let's Connect <span class="ar">→</span></a>
    <button class="ibtn burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></div><div id="prog" aria-hidden="true"></div>`;
  document.body.prepend(h);
  const dr=document.createElement('div');dr.className='drawer';dr.id='drawer';dr.setAttribute('aria-hidden','true');
  dr.innerHTML=`<div class="shade"></div><div class="panel" role="dialog" aria-label="Menu"><button class="ibtn" id="dclose" type="button" aria-label="Close menu" style="align-self:flex-end">✕</button>
    ${NAV.map(([k,l,h2,dd])=>`<a href="${url(h2)}">${l}</a>${dd?SEMIL.businesses.filter(b=>!b.project).map(b=>`<a class="sub" href="${url(b.href)}">${esc(b.name)}</a>`).join(''):''}`).join('')}
    <a class="sub" href="${url('company.html')}">Company details</a>
    <a class="btn primary" style="margin-top:18px;justify-content:center;font-size:16px;letter-spacing:0;border:0" href="${url('contact.html')}">Let's Connect</a></div>`;
  document.body.appendChild(dr);
  addEventListener('scroll',()=>h.classList.toggle('s',scrollY>20),{passive:true});
  const dd=$('#bdd'),btn=$('button',dd);
  const set=o=>{dd.classList.toggle('open',o);btn.setAttribute('aria-expanded',o)};
  btn.addEventListener('click',e=>{e.stopPropagation();set(FINE?true:!dd.classList.contains('open'))});
  if(FINE){let t;dd.addEventListener('mouseenter',()=>{clearTimeout(t);set(true)});dd.addEventListener('mouseleave',()=>{t=setTimeout(()=>set(false),160)})}
  document.addEventListener('click',e=>{if(!dd.contains(e.target))set(false)});
  dd.addEventListener('focusout',e=>{if(!dd.contains(e.relatedTarget))set(false)});
  const openD=o=>{dr.classList.toggle('open',o);dr.setAttribute('aria-hidden',!o);$('#burger').setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
  $('#burger').onclick=()=>openD(true);$('#dclose').onclick=()=>openD(false);$('.shade',dr).onclick=()=>openD(false);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){set(false);openD(false);closeSearch()}});
  $('#sbtn').onclick=openSearch;
}
function buildFooter(){
  const c=SEMIL.company,v=c.verified;
  const f=document.createElement('footer');
  f.innerHTML=`<div class="wrap"><div class="fg">
    <div><a class="logo" href="${url('index.html')}">${monoSvg()}SEMIL</a><p style="margin-top:18px;max-width:30ch;font-size:14.5px">Building Today for a Brighter Tomorrow.</p><p style="margin-top:14px;font-size:13px;color:#8FA2C9">ONE COMPANY. MANY POSSIBILITIES.</p></div>
    <div><h5>Explore</h5><ul>${NAV.filter(n=>!n[3]).map(n=>`<li><a href="${url(n[2])}">${n[1]}</a></li>`).join('')}<li><a href="${url('company.html')}">Company details</a></li></ul></div>
    <div><h5>Businesses</h5><ul>${SEMIL.businesses.map(b=>`<li><a href="${url(b.href)}">${esc(b.name)}</a></li>`).join('')}<li><a href="https://neutags.com" target="_blank" rel="noopener">neutags.com ↗</a></li></ul></div>
    <div><h5>Registered office</h5><address><b style="color:#fff">${esc(c.name)}</b><br>${c.address.map(esc).join('<br>')}${v.address?'':'<br><span class="tag-ver" style="margin-top:8px">Pending verification</span>'}<br><span style="font-size:13px;color:#8FA2C9">Official email: to be supplied</span></address></div>
  </div>
  <div class="fl"><span>© 2026 ${esc(c.name)}. All rights reserved.</span><span>CIN: ${esc(c.cin)}${v.cin?'':' (pending verification)'}</span><span><a href="${url('privacy.html')}">Privacy policy</a> · <a href="${url('terms.html')}">Terms and conditions</a></span></div></div>`;
  document.body.appendChild(f);
}

/* ---------- search ---------- */
const SITE_INDEX=()=>[
  ...NAV.filter(n=>!n[3]).map(n=>({t:n[1],k:"Page",h:n[2],x:n[1]})),
  {t:"Company details",k:"Page",h:"company.html",x:"registered office cin incorporation company details"},
  {t:"All businesses",k:"Page",h:"businesses.html",x:"businesses ecosystem portfolio"},
  ...SEMIL.businesses.map(b=>({t:b.name,k:b.project?"Upcoming project":"Business",h:b.href,x:b.cat+' '+b.desc})),
  ...SEMIL.directors.map(d=>({t:d.name,k:"Director",h:"leadership.html",x:"director leadership"})),
  {t:"Brain games",k:"Play",h:"play.html",x:"games puzzle memory brain play"},
  {t:"Privacy policy",k:"Legal",h:"privacy.html",x:"privacy data"},{t:"Terms and conditions",k:"Legal",h:"terms.html",x:"terms legal"},
  {t:"Neutags website",k:"External",h:"https://neutags.com",x:"neutags marketplace shop",ext:true}
];
let sel=0;
function buildSearch(){
  const s=document.createElement('div');s.className='sbox';s.id='sbox';
  s.innerHTML=`<div class="in" role="dialog" aria-modal="true" aria-label="Search"><input id="sq" type="search" placeholder="Search pages, businesses and people" autocomplete="off" aria-label="Search"><div class="sres" id="sres" role="listbox"></div></div>`;
  document.body.appendChild(s);
  s.addEventListener('click',e=>{if(e.target===s)closeSearch()});
  $('#sq').addEventListener('input',renderSearch);
  $('#sq').addEventListener('keydown',e=>{const a=$$('#sres a');if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(a.length-1,sel+1);hl()}else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);hl()}else if(e.key==='Enter'&&a[sel]){a[sel].click()}});
  document.addEventListener('keydown',e=>{if((e.key==='k'&&(e.ctrlKey||e.metaKey))||(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))){e.preventDefault();openSearch()}});
}
function hl(){$$('#sres a').forEach((a,i)=>a.classList.toggle('sel',i===sel))}
function renderSearch(){
  const q=$('#sq').value.trim().toLowerCase();sel=0;
  const r=SITE_INDEX().filter(i=>!q||(i.t+' '+i.x).toLowerCase().includes(q));
  $('#sres').innerHTML=r.length?r.map(i=>`<a href="${i.ext?i.h:url(i.h)}" ${i.ext?'target="_blank" rel="noopener"':''}><span>${esc(i.t)}</span><small>${i.k}</small></a>`).join(''):`<div class="empty" style="grid-column:auto;border:0">No pages or businesses match "${esc(q)}".</div>`;
  hl();
}
function openSearch(){$('#sbox').classList.add('open');$('#sq').value='';renderSearch();setTimeout(()=>$('#sq').focus(),30)}
function closeSearch(){const s=$('#sbox');s&&s.classList.remove('open')}

/* ---------- page transition ---------- */
function transitions(){
  const v=document.createElement('div');v.id='veil';v.innerHTML=`<div class="vm">${monoSvg()}</div>`;document.body.appendChild(v);
  addEventListener('pageshow',()=>v.classList.remove('on'));
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0||a.target==='_blank')return;
    const h=a.getAttribute('href');if(!h||h[0]==='#'||/^(https?:|mailto:|tel:)/.test(h))return;
    if(RM)return;
    e.preventDefault();v.classList.add('on');setTimeout(()=>{location.href=a.href},340);
  });
}
function cursor(){
  if(!FINE||RM)return;const c=document.createElement('div');c.id='cur';document.body.appendChild(c);
  let x=0,y=0,tx=0,ty=0;addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;c.classList.add('on');c.classList.toggle('big',!!e.target.closest('a,button,.pcard,.node,.gpad'))},{passive:true});
  document.addEventListener('mouseleave',()=>c.classList.remove('on'));
  (function f(){x+=(tx-x)*.2;y+=(ty-y)*.2;c.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(f)})();
}

/* ---------- shared renderers ---------- */
const cardHTML=b=>`<a class="bcard glow" href="${url(b.href)}" data-tags="${b.tags.join(' ')}"><div class="th">${art(b.id)}</div><div class="bd"><span class="cat">${esc(b.cat)}</span><h3>${esc(b.name)}</h3><p>${esc(b.desc)}</p><div class="ft">${badge(b.status)}<span>${b.project?'Explore project':'Explore Business'} →</span></div></div></a>`;
function crumbs(trail){const el=$('[data-mount=crumbs]');if(!el)return;el.innerHTML=`<nav class="crumbs" aria-label="Breadcrumb"><a href="${url('index.html')}">Home</a>${trail.map((t,i)=>`<span>/</span>${i<trail.length-1?`<a href="${url(t[1])}">${t[0]}</a>`:`<span aria-current="page">${t[0]}</span>`}`).join('')}</nav>`}
const GNAME={memory:'Marketplace Match',sequence:'Order Relay',pairs:'Find the Match',parcel:'Parcel Sequence',checkout:'Quick Checkout'};

const MOUNT={
  crumbs(){const t=document.body.dataset.crumbs;if(!t)return;crumbs(JSON.parse(t))},
  status(el){el.innerHTML=badge(biz(el.dataset.id).status)},
  cards(el){const only=el.dataset.only;el.innerHTML=SEMIL.businesses.filter(b=>!only||only.split(',').includes(b.id)).map(cardHTML).join('')},
  browse(el){
    el.innerHTML=`<div class="filters" role="group" aria-label="Filter businesses">${SEMIL.filters.map((f,i)=>`<button type="button" data-f="${f[0]}" aria-pressed="${i===0}">${f[1]}</button>`).join('')}</div><div class="grid" id="bgrid" aria-live="polite">${SEMIL.businesses.map(cardHTML).join('')}<div class="empty" id="bempty" hidden>Nothing in this category yet. New ventures appear here once they are approved.</div></div>`;
    const apply=f=>{let n=0;$$('.bcard',el).forEach(c=>{const ok=f==='all'||c.dataset.tags.split(' ').includes(f);c.classList.toggle('hide',!ok);if(ok)n++});$('#bempty').hidden=n>0;$$('.filters button',el).forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===f))};
    $$('.filters button',el).forEach(b=>b.onclick=()=>apply(b.dataset.f));
  },
  heroscene(el){el.innerHTML=heroScene()},
  eco(el){
    const pos=[[18,24],[82,24],[18,76],[82,76]];const list=SEMIL.businesses.filter(b=>!b.project);
    el.innerHTML=`<svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${list.map((b,i)=>`<path class="line" data-l="${b.id}" d="M50 50 L${pos[i][0]} ${pos[i][1]}"/><path class="flow" d="M50 50 L${pos[i][0]} ${pos[i][1]}"/>`).join('')}</svg>
      <div class="core"><div>${monoSvg()}<b>SEMIL</b></div></div>
      ${list.map((b,i)=>`<a class="node" data-n="${b.id}" style="left:${pos[i][0]}%;top:${pos[i][1]}%" href="${url(b.href)}"><div class="th">${art(b.id)}</div><b>${esc(b.name)}</b><p>${esc(b.short)}</p><div style="margin-top:8px">${badge(b.status)}</div></a>`).join('')}`;
    $$('.node',el).forEach(n=>{const on=o=>$(`.line[data-l=${n.dataset.n}]`,el).classList.toggle('hl',o);n.addEventListener('pointerenter',()=>on(true));n.addEventListener('pointerleave',()=>on(false));n.addEventListener('focus',()=>on(true));n.addEventListener('blur',()=>on(false))});
    if(FINE&&!RM)el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$$('.node',el).forEach((n,i)=>{n.style.marginLeft=(-x*14*(i%2?1:-1))+'px';n.style.marginTop=(-y*10)+'px'});$('.core',el).style.marginLeft=(x*10)+'px'});
  },
  ecom(el){el.innerHTML=SEMIL.businesses.filter(b=>!b.project).map(cardHTML).join('')},
  marquee(el){
    const w=[...SEMIL.businesses.map(b=>b.name),...SEMIL.values.map(v=>v[0])];
    const row=w.map(x=>`<span>${esc(x)}</span><i></i>`).join('');
    el.innerHTML=`<div class="mq" aria-hidden="true"><div class="mqi">${row}${row}</div></div>`;
  },
  stats(el){
    const s=[[SEMIL.businesses.filter(b=>!b.project).length,"Businesses in the ecosystem"],[SEMIL.businesses.filter(b=>b.project).length,"Proposed initiative"],[SEMIL.values.length,"Core values"],[SEMIL.directors.length,"Directors"],[2025,"Year of incorporation"]];
    el.className='stats';el.innerHTML=s.map(x=>`<div class="stat rv"><b data-count="${x[0]}">${x[0]}</b><span>${x[1]}</span></div>`).join('');
  },
  roadmap(el){
    el.innerHTML=`<div class="road" role="tablist" aria-label="Roadmap stages">${SEMIL.roadmap.map((s,i)=>`<button type="button" class="st" role="tab" aria-selected="${i===2}" data-i="${i}"><div class="n">${i+1}</div><b>${esc(s.stage)}</b></button>`).join('')}</div><div class="rpanel" id="rpanel" aria-live="polite"></div>`;
    const sel=i=>{$$('.st',el).forEach((b,j)=>b.setAttribute('aria-selected',j===i));const it=SEMIL.roadmap[i].items;
      $('#rpanel').innerHTML=it.length?it.map(x=>`<div><b>${esc(x.n)}</b>${badge(biz(x.id).status)}<a href="${url(biz(x.id).href)}" style="font-weight:700;color:var(--cobalt);text-decoration:none">View details →</a></div>`).join(''):`<div class="none">Nothing is assigned to this stage yet. Projects appear here after their status is confirmed.</div>`};
    $$('.st',el).forEach(b=>b.onclick=()=>sel(+b.dataset.i));sel(2);
  },
  timeline(el){
    el.className='tl';el.innerHTML='<div class="tlline"><i id="tlfill"></i></div>'+SEMIL.timeline.map((e,i)=>e.ok?`<button class="row" type="button" aria-expanded="${i===0}"><span class="d">${esc(e.d)}</span><span><b style="font-size:19px">${esc(e.t)}</b><p>${esc(e.p)}</p>${SEMIL.company.verified.incorporation?'':'<span class="tag-ver" style="margin-top:8px">Subject to verification against company records</span>'}</span></button>`:`<div class="row ghost"><span class="d">${esc(e.d)}</span><span class="slate"><b>${esc(e.t)}</b></span></div>`).join('');
    $$('button.row',el).forEach(b=>b.onclick=()=>b.setAttribute('aria-expanded',b.getAttribute('aria-expanded')!=='true'));
  },
  values(el){el.className='vgrid';el.innerHTML=SEMIL.values.map(v=>`<div class="tile glow"><h3>${esc(v[0])}</h3><p>${esc(v[1])}</p></div>`).join('')},
  people(el){
    const v=SEMIL.company.verified.designations;
    el.className='dirs';el.innerHTML=SEMIL.directors.map(d=>`<article class="dir rv">
      <div class="dl"><div class="pt">${d.photo?`<img src="${d.photo}" alt="${esc(d.name)}" style="width:100%;height:100%;object-fit:cover">`:monoSvg()}<span>${d.photo?'':'Approved portrait to be supplied'}</span></div></div>
      <div class="dr"><p class="eyebrow">${esc(SEMIL.company.name)}</p><h2 style="font-size:clamp(30px,4vw,54px);margin-top:12px">${esc(d.name)}</h2><p style="margin-top:12px;font-weight:700;color:var(--cobalt);font-size:18px">${esc(d.role)}</p>${v?'':'<p style="margin-top:10px"><span class="tag-ver">Designation pending verification</span></p>'}
      <dl class="kv" style="margin-top:28px"><dt>Role</dt><dd>${esc(d.role)} of ${esc(SEMIL.company.short)}</dd><dt>Appointed</dt><dd>${d.appointed?esc(d.appointed):'<span class="slate">Awaiting company records</span>'}</dd><dt>Areas of focus</dt><dd>${d.focus?esc(d.focus):'<span class="slate">Awaiting company approval</span>'}</dd><dt>Biography</dt><dd>${d.bio?esc(d.bio):'<span class="slate">Awaiting company approval</span>'}</dd></dl></div></article>`).join('');
  },
  corp(el){const c=SEMIL.company,v=c.verified;const t=x=>x?'':' <span class="tag-ver">Pending verification</span>';
    el.innerHTML=`<dt>Company name</dt><dd>${esc(c.name)}</dd><dt>Type</dt><dd>Indian private limited company</dd><dt>Incorporated</dt><dd>${esc(c.incorporated)}${t(v.incorporation)}</dd><dt>CIN</dt><dd>${esc(c.cin)}${t(v.cin)}</dd><dt>Registered office</dt><dd>${c.address.map(esc).join(', ')}${t(v.address)}</dd>`},
  focus(el){
    el.className='cols3';el.innerHTML=[["Digital commerce","Neutags, a multi-vendor marketplace.","neutags"],["Food & technology","A planned food delivery platform.","food"],["Matchmaking","A planned matrimonial platform.","matrimony"],["Logistics","A logistics initiative covering delivery, transport and supply chains.","logistics"],["Financial technology","A proposed payment initiative, subject to regulatory approvals.","payments"]].map(f=>`<a class="tile glow" style="text-decoration:none" href="${url(biz(f[2]).href)}"><h4>${f[0]}</h4><p>${f[1]}</p><p style="margin-top:12px">${badge(biz(f[2]).status)}</p></a>`).join('');
  },
  evo(el){
    const st=[["An idea","Every business starts from a real need.",1],["A first business","Build, learn and improve in the open.",2],["Connected services","Businesses begin to support each other.",3],["An ecosystem","Growth with care and long-term thinking.",5]];
    const pts=[[70,150],[160,90],[160,210],[250,150],[340,90]];
    el.innerHTML=`<div class="evo"><div class="evol"><svg viewBox="0 0 420 300" aria-hidden="true">${[[0,1],[0,2],[1,3],[2,3],[3,4]].map(e=>`<path class="evoe" data-k="${Math.max(e[0],e[1])+1}" d="M${pts[e[0]][0]} ${pts[e[0]][1]} L${pts[e[1]][0]} ${pts[e[1]][1]}"/>`).join('')}${pts.map((p,i)=>`<circle class="evon" data-k="${i+1}" cx="${p[0]}" cy="${p[1]}" r="${i===0?16:14}"/>`).join('')}</svg></div>
    <div class="evor">${st.map((s,i)=>`<div class="evos" data-n="${s[2]}"><span class="eyebrow">Stage ${i+1}</span><h3>${s[0]}</h3><p class="slate">${s[1]}</p></div>`).join('')}</div></div>`;
  },
  future(el){el.innerHTML=[0,1,2].map(i=>`<div class="tile" style="border-style:dashed;box-shadow:none;background:linear-gradient(160deg,#F5F1FF,#fff)"><h4 style="color:var(--lav)">Reserved</h4><p class="slate">${i?'Open for a confirmed initiative.':'A future venture appears here once it is approved and its status is confirmed.'}</p></div>`).join('')},
  statuses(el){el.innerHTML=Object.keys(SEMIL.statuses).filter(k=>k!=='tbc').map(k=>badge(k)).join(' ')},
  openings(el){
    const o=SEMIL.openings,cats=[...new Set(o.map(x=>x.category))];
    el.innerHTML=`<div class="filters" role="group" aria-label="Job categories"><button type="button" data-c="all" aria-pressed="true">All roles</button>${cats.map(c=>`<button type="button" data-c="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}</div>
    <div class="jobs" id="jobs">${o.length?o.map(j=>`<button class="job" type="button" data-c="${esc(j.category)}" data-id="${esc(j.id)}"><span><b>${esc(j.title)}</b><br><span class="slate" style="font-size:14px">${esc(j.location||'')} ${esc(j.type||'')}</span></span><span style="font-weight:700;color:var(--cobalt)">View role →</span></button>`).join(''):`<div class="empty" style="grid-column:auto">There are no approved openings right now. Roles are listed here only once they are confirmed. You can still introduce yourself with the form below.</div>`}</div><div id="jobdetail"></div>`;
    $$('.filters button',el).forEach(b=>b.onclick=()=>{$$('.filters button',el).forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.job',el).forEach(j=>j.hidden=b.dataset.c!=='all'&&j.dataset.c!==b.dataset.c)});
    $$('.job',el).forEach(j=>j.onclick=()=>{const r=o.find(x=>x.id===j.dataset.id);$('#jobdetail').innerHTML=`<div class="tile" style="margin-top:14px"><h4>${esc(r.title)}</h4><p>${esc(r.summary||'')}</p><p style="margin-top:12px"><a class="btn primary" href="#apply">Apply for this role</a></p></div>`;$('#a-role')&&($('#a-role').value=r.title)});
  },
  playhub(el){
    el.innerHTML=SEMIL.businesses.map(b=>`<section class="gsec" id="g-${b.id}"><div class="ghead"><div><p class="eyebrow">${esc(b.name)}</p><h2 style="font-size:clamp(26px,3.4vw,44px);margin-top:10px">${GNAME[b.game]}</h2></div><a class="btn" href="${url(b.href)}">About ${esc(b.name)} →</a></div><div class="game" data-game="${b.game}"></div></section>`).join('');
  },
  bizpage(el){
    const id=el.dataset.id,b=biz(id),d=SEMIL.detail[id],gname=GNAME[b.game];
    const acts=[];
    if(d.external)acts.push(`<a class="btn primary mag" href="${d.external.href}" target="_blank" rel="noopener">${esc(d.external.label)} <span class="ar">↗</span></a>`);
    acts.push(`<a class="btn ${d.external?'':'primary'} mag" href="${url('contact.html')}#type-${slug(d.enq[1])}">${esc(d.enq[0])} <span class="ar">→</span></a>`);
    acts.push(`<a class="btn mag" href="#brain">Play a brain game</a>`);
    el.innerHTML=`
    <section class="dhero"><div class="mesh"><div class="blob" style="width:360px;height:360px;background:#BFD3FF;right:5%;top:8%"></div><div class="blob" style="width:300px;height:300px;background:#DCCBFF;left:0;top:35%;animation-delay:-6s"></div></div>
    <div class="wrap"><div><div data-mount="crumbs"></div><p class="eyebrow">${esc(b.cat)}</p>
    <h1 class="xl split" style="margin-top:18px;font-size:clamp(40px,6.4vw,92px)">${esc(b.name)}</h1><p style="margin-top:20px">${badge(b.status)}</p>
    <p class="lede" style="font-size:clamp(20px,2.2vw,28px);font-weight:600;color:var(--ink);margin-top:20px">${esc(d.tagline)}</p><p class="lede" style="margin-top:12px">${esc(b.desc)}</p>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:30px">${acts.join('')}</div></div>
    <div class="vis" data-depthbox>${art(id)}</div></div></section>
    <section class="facts"><div class="wrap factrow"><div><small>Category</small><b>${esc(b.cat)}</b></div><div><small>Status</small><b>${esc(SEMIL.statuses[b.status].label)}</b></div><div><small>Part of</small><b>${esc(SEMIL.company.short)} ecosystem</b></div><div><small>Brain break</small><b>${gname}</b></div></div></section>
    <section class="sec"><div class="wrap"><div class="two2"><div><p class="eyebrow rv">Overview</p><h2 class="lg rv" style="margin-top:16px;font-size:clamp(30px,4.4vw,60px)">What it is.</h2></div><div>${d.overview.map(p=>`<p class="lede rv" style="margin-top:0;margin-bottom:18px;color:#334155">${esc(p)}</p>`).join('')}</div></div>
    <p class="eyebrow rv" style="margin-top:70px">Who it serves</p><div class="cols3">${d.who.map(w=>`<div class="tile glow"><h4>${esc(w[0])}</h4><p>${esc(w[1])}</p></div>`).join('')}</div></div></section>
    <section class="sec alt"><div class="wrap"><p class="eyebrow rv">${esc(d.journeyTitle)}</p><h2 class="lg rv" style="margin-top:16px;font-size:clamp(30px,4.4vw,60px)">Step by step.</h2>
    <div class="jny" id="jny"><svg class="jline" viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 H1000" stroke="#DCE6FF" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/><path id="jdraw" d="M0 6 H1000" stroke="#315EFB" stroke-width="3" fill="none" pathLength="1" vector-effect="non-scaling-stroke"/></svg>
    <div class="jsteps">${d.journey.map((s,i)=>`<button class="jstep" type="button" aria-pressed="${i===0}" data-i="${i}"><span class="jn">${i+1}</span><b>${esc(s[0])}</b></button>`).join('')}</div><p class="sdesc" id="jdesc">${esc(d.journey[0][1])}</p></div></div></section>
    <section class="sec"><div class="wrap"><p class="eyebrow rv">Capabilities and focus</p><h2 class="lg rv" style="margin-top:16px;font-size:clamp(30px,4.4vw,60px)">What it covers.</h2>
    <div class="cols3">${d.caps.map(c=>`<div class="tile glow"><span class="chip" style="margin-bottom:14px">${esc(c[2])}</span><h3 style="font-size:20px;letter-spacing:-.02em">${esc(c[0])}</h3><p class="slate" style="margin-top:8px;font-size:14.5px">${esc(c[1])}</p></div>`).join('')}</div>
    <p class="eyebrow rv" style="margin-top:60px">Guiding principles</p><div class="pillars">${d.principles.map(p=>`<span class="chip">${esc(p)}</span>`).join('')}</div></div></section>
    <section class="sec alt"><div class="wrap"><p class="eyebrow rv">Interface preview</p><div class="demo rv" data-demo="${d.demo}"></div><p class="note" style="margin-top:28px">${esc(d.note)}</p></div></section>
    <section class="sec" id="brain"><div class="wrap"><p class="eyebrow rv">Brain break</p><h2 class="lg rv" style="margin-top:16px;font-size:clamp(30px,4.4vw,60px)">${gname}.</h2><p class="lede rv">A quick game inspired by ${esc(b.name)}. Your best score is saved in this browser only.</p><div class="game" data-game="${b.game}"></div><p style="margin-top:24px"><a class="btn" href="${url('play.html')}">All brain games →</a></p></div></section>
    <section class="sec alt"><div class="wrap"><p class="eyebrow rv">Questions</p><h2 class="lg rv" style="margin-top:16px;font-size:clamp(30px,4.4vw,60px)">Good to know.</h2><div class="faq">${d.faq.map((f,i)=>`<div class="fq"><button type="button" aria-expanded="${i===0}"><span>${esc(f[0])}</span><i>+</i></button><div class="fa"><p>${esc(f[1])}</p></div></div>`).join('')}</div></div></section>`;
    const jd=$('#jdraw',el);jd.style.strokeDasharray=1;jd.style.strokeDashoffset=1-1/d.journey.length;
    $$('.jstep',el).forEach(s=>s.onclick=()=>{$$('.jstep',el).forEach(x=>x.setAttribute('aria-pressed',x===s));$('#jdesc').textContent=d.journey[+s.dataset.i][1];jd.style.strokeDashoffset=1-(+s.dataset.i+1)/d.journey.length});
    $$('.fq button',el).forEach(bt=>bt.onclick=()=>bt.setAttribute('aria-expanded',bt.getAttribute('aria-expanded')!=='true'));
  }
};

/* ---------- interface demos ---------- */
const DEMO={
  shop(el){
    const items=[["Everyday carry",'#DCE8FF',"Accessories"],["Home studio",'#E9E1FF',"Home"],["Weekend wear",'#D9F3FD',"Fashion"],["Kitchen set",'#FFE9D6',"Kitchen"],["Desk setup",'#DDF3E8',"Workspace"],["Gift picks",'#FFE3EC',"Gifts"]];
    el.innerHTML=`<div class="lab"><b>Product discovery preview</b><span class="badge tbc"><i></i>Interface illustration, not live listings</span></div>
    <div class="ctl" id="shopf"><button type="button" aria-pressed="true" data-c="all">All</button>${[...new Set(items.map(i=>i[2]))].map(c=>`<button type="button" aria-pressed="false" data-c="${c}">${c}</button>`).join('')}</div>
    <div class="pgrid" id="shopg">${items.map(i=>`<button class="pcard" type="button" aria-pressed="false" data-c="${i[2]}"><div class="im" style="background:linear-gradient(135deg,${i[1]},#fff)"></div><b>${i[0]}</b><div class="slate" style="font-size:12.5px">${i[2]} · Seller name</div></button>`).join('')}</div>
    <p class="sdesc" id="shopd">Select a card to see how a seller listing could connect to a customer.</p>`;
    $$('#shopf button').forEach(b=>b.onclick=()=>{$$('#shopf button').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('#shopg .pcard').forEach(c=>c.hidden=b.dataset.c!=='all'&&c.dataset.c!==b.dataset.c)});
    $$('#shopg .pcard').forEach(c=>c.onclick=()=>{$$('#shopg .pcard').forEach(x=>x.setAttribute('aria-pressed',x===c));$('#shopd').textContent=`A seller lists "${$('b',c).textContent}" in the ${c.dataset.c} category. A customer finds it through search and category browsing, and the marketplace connects the two.`});
  },
  food(el){
    const rs=[["Restaurant name","Cuisine",'#FFE9D6'],["Restaurant name","Cuisine",'#FFF1C9'],["Restaurant name","Cuisine",'#E9E1FF']];
    el.innerHTML=`<div class="lab"><b>Delivery route preview</b><span class="badge"><i></i>Planned capability, not live</span></div>
    <div class="pgrid">${rs.map(r=>`<div class="pcard" style="cursor:default"><div class="im" style="background:linear-gradient(135deg,${r[2]},#fff)"></div><b>${r[0]}</b><div class="slate" style="font-size:12.5px">${r[1]} · illustrative</div></div>`).join('')}</div>
    <svg viewBox="0 0 800 130" style="margin-top:26px" aria-label="Animated delivery route from restaurant to customer"><path id="rt" class="flowl" d="M60 80 C200 10 320 130 460 60 S700 30 740 70" style="stroke:#F59E4B"/><circle cx="60" cy="80" r="14" fill="#fff" stroke="#F59E4B" stroke-width="3"/><circle cx="740" cy="70" r="14" fill="#fff" stroke="#315EFB" stroke-width="3"/><circle r="9" fill="#315EFB"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#rt"/></animateMotion></circle><text x="60" y="118" font-size="13" text-anchor="middle" fill="#64748B" font-family="Manrope">Restaurant</text><text x="740" y="112" font-size="13" text-anchor="middle" fill="#64748B" font-family="Manrope">Customer</text></svg>`;
  },
  match(el){
    const prefs=["Values","Languages","Family preferences","Lifestyle"];
    el.innerHTML=`<div class="lab"><b>Matching interface preview</b><span class="badge"><i></i>Interface preview only, no real profiles</span></div>
    <div class="ctl" id="mp">${prefs.map((p,i)=>`<button type="button" aria-pressed="${i===0}">${p}</button>`).join('')}</div>
    <div class="pgrid">${[0,1,2].map(i=>`<div class="pcard" style="cursor:default"><div class="im" style="background:linear-gradient(135deg,${['#FFE3EC','#EFE9FF','#FFF3D9'][i]},#fff);display:grid;place-items:center;color:#B58AA0;font-weight:800">Profile ${i+1}</div><b>Placeholder profile</b><div class="slate" style="font-size:12.5px">Illustrative layout, not a real person</div></div>`).join('')}</div>
    <p class="sdesc" id="mpd">Preferences guide a thoughtful search for compatibility. Families can take part in the process.</p>`;
    const d={Values:"Shared values are a starting point for compatibility.",Languages:"Language and community preferences help narrow a search.","Family preferences":"Families can be involved in the process when the individuals wish.",Lifestyle:"Lifestyle and goals help people look for a comfortable fit."};
    $$('#mp button').forEach(b=>b.onclick=()=>{$$('#mp button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#mpd').textContent=d[b.textContent]});
  },
  logistics(el){
    const modes=[["Delivery operations","Coordinating how goods move the last mile, from pickup to doorstep."],["Transportation","Moving goods between locations on planned routes."],["Supply chain","Linking warehouses, transport and delivery into one coordinated network."]];
    const n=[[80,70,"Origin"],[260,150,"Hub"],[460,60,"Warehouse"],[640,150,"Delivery point"]];
    el.innerHTML=`<div class="lab"><b>Network concept</b><span class="badge tbc"><i></i>Illustration, no live tracking data</span></div>
    <div class="ctl" id="lm">${modes.map((m,i)=>`<button type="button" aria-pressed="${i===0}">${m[0]}</button>`).join('')}</div>
    <svg viewBox="0 0 720 220" aria-label="Illustrated logistics route network"><path class="flowl" d="M80 70 L260 150 L460 60 L640 150"/>${n.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="16" fill="#fff" stroke="#315EFB" stroke-width="3"/><text x="${p[0]}" y="${p[1]+38}" text-anchor="middle" font-size="13" fill="#64748B" font-family="Manrope">${p[2]}</text>`).join('')}<rect width="16" height="16" rx="4" fill="#315EFB" x="-8" y="-8"><animateMotion dur="6s" repeatCount="indefinite" path="M80 70 L260 150 L460 60 L640 150"/></rect></svg>
    <p class="sdesc" id="lmd">${modes[0][1]}</p>`;
    $$('#lm button').forEach((b,i)=>b.onclick=()=>{$$('#lm button').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#lmd').textContent=modes[i][1]});
  },
  payflow(el){
    const s=[["Customer","A customer chooses to pay a merchant online."],["Merchant checkout","The merchant presents a payment option at checkout."],["Payment infrastructure","Payment details move through the payment network."],["Confirmation","The merchant is told the payment result."],["Payout","Funds are settled to the merchant."]];
    el.innerHTML=`<div class="lab"><b>Proposed payment flow</b><span class="badge up"><i></i>Concept, subject to regulatory approvals</span></div>
    <svg viewBox="0 0 800 110" aria-label="Animated payment flow concept"><path class="flowl" d="M70 55 H730"/>${s.map((x,i)=>`<circle class="pn" data-i="${i}" cx="${70+i*165}" cy="55" r="18" fill="#fff" stroke="#315EFB" stroke-width="3"/>`).join('')}<circle r="7" fill="#48C8F5"><animateMotion dur="5s" repeatCount="indefinite" path="M70 55 H730"/></circle></svg>
    <div class="flowrow" id="ps">${s.map((x,i)=>`<button class="step" type="button" data-i="${i}" aria-current="${i===0}"><small>Stage ${i+1}</small><b>${x[0]}</b></button>`).join('')}</div><p class="sdesc" id="pd">${s[0][1]}</p>`;
    const set=i=>{$$('#ps .step').forEach((x,j)=>x.setAttribute('aria-current',j===i));$$('.pn',el).forEach((c,j)=>c.setAttribute('fill',j===i?'#315EFB':'#fff'));$('#pd').textContent=s[i][1]};
    $$('#ps .step').forEach(b=>b.onclick=()=>set(+b.dataset.i));set(0);
  }
};

/* ---------- forms ---------- */
function forms(){
  $$('form[data-form]').forEach(form=>{
    const stat=$('.fstat',form),btn=$('button[type=submit]',form);
    const R={name:v=>v.trim().length>=2||'Enter your name.',email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||'Enter a valid work email.',message:v=>v.trim().length>=20||'Write at least 20 characters.',category:v=>!!v||'Choose an enquiry type.'};
    const chk=el=>{const r=R[el.name];if(!r)return true;const ok=r(el.value),f=el.closest('.f');f.classList.toggle('bad',ok!==true);$('.err',f).textContent=ok===true?'':ok;return ok===true};
    $$('input,select,textarea',form).forEach(el=>el.addEventListener('blur',()=>{if(el.value||el.required)chk(el)}));
    form.addEventListener('submit',async e=>{
      e.preventDefault();stat.className='fstat';
      const bad=$$('input:not(.hp),select,textarea',form).filter(el=>R[el.name]&&!chk(el));if(bad.length){bad[0].focus();return}
      const data=Object.fromEntries(new FormData(form));if(data.website)return;data.form=form.dataset.form;
      btn.classList.add('busy');btn.disabled=true;
      try{
        if(window.semilFirebaseReady) await window.semilFirebaseReady;
        if(window.SemilFirebase && window.SemilFirebase.saveSubmission){
          const collectionName = data.form === 'careers' ? 'career_applications' : 'contact_enquiries';
          await window.SemilFirebase.saveSubmission(collectionName, data);
        } else if(SEMIL_CONFIG.formEndpoint){
          const r=await fetch(SEMIL_CONFIG.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
          if(!r.ok)throw new Error('http');
        } else {
          throw new Error('not-configured');
        }
        stat.className='fstat show ok';stat.textContent='Thank you. Your message has been sent successfully.';form.reset();
      }catch(err){
        stat.className='fstat show err';
        stat.textContent=err.message==='not-configured'?'Your details are valid, but the database connection is not initialized yet.':'Your message could not be sent. Please check your connection and try again.';
      }
      btn.classList.remove('busy');btn.disabled=false;
    });
  });
  const sl=$('#f-cat'),hh=location.hash.replace('#type-','');
  if(sl&&location.hash.indexOf('#type-')===0){const o=[...sl.options].find(x=>slug(x.value)===hh);if(o)sl.value=o.value}
  $$('[data-cat]').forEach(b=>b.onclick=()=>{if(sl){sl.value=b.dataset.cat;$$('[data-cat]').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#f-name')&&$('#f-name').focus()}});
}

/* ---------- boot ---------- */
buildHeader();buildFooter();buildSearch();transitions();cursor();
$$('[data-mount]').forEach(el=>{const f=MOUNT[el.dataset.mount];f&&f(el)});
$$('[data-mount=crumbs]').forEach(el=>{if(!el.innerHTML)MOUNT.crumbs(el)});
$$('[data-demo]').forEach(el=>{const f=DEMO[el.dataset.demo];f&&f(el)});
forms();
document.dispatchEvent(new Event('semil:ready'));
})();
