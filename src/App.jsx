import React, { useState, useRef, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: "thermopro-ca00a.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const USER_ID = "pierre";

async function sauvegarder(col, data) {
  try {
    await setDoc(doc(db, "thermopro", USER_ID, col, "data"), { value: JSON.stringify(data) });
  } catch(e) { console.error("Erreur sauvegarde:", e); }
}

async function charger(col) {
  try {
    const d = await getDoc(doc(db, "thermopro", USER_ID, col, "data"));
    if(d.exists()) return JSON.parse(d.data().value);
  } catch(e) { console.error("Erreur chargement:", e); }
  return null;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@300;600;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --bg:#0d1117;--surface:#161b27;--surface2:#1c2334;--border:#252d42;
    --accent:#f97316;--accent2:#fb923c;--text:#e2e8f0;--muted:#64748b;
    --success:#22c55e;--danger:#ef4444;--warning:#f59e0b;--info:#3b82f6;
    --radius:14px;--font-head:'Fraunces',serif;--font-body:'DM Sans',sans-serif;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:var(--font-body);background:var(--bg);color:var(--text);min-height:100vh;}
  .app{display:flex;min-height:100vh;}
  .sidebar{width:230px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;}
  .sidebar-brand{padding:24px 22px 20px;border-bottom:1px solid var(--border);}
  .sidebar-brand h1{font-family:var(--font-head);font-size:1.4rem;font-weight:900;color:var(--accent);}
  .sidebar-brand p{font-size:0.72rem;color:var(--muted);margin-top:3px;}
  .nav{padding:12px 0;flex:1;}
  .nav-item{display:flex;align-items:center;gap:10px;padding:11px 22px;cursor:pointer;color:var(--muted);font-size:0.875rem;font-weight:500;border-left:3px solid transparent;transition:all .15s;}
  .nav-item:hover{color:var(--text);background:var(--surface2);}
  .nav-item.active{color:var(--accent);border-left-color:var(--accent);background:#f9731610;}
  .main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .topbar{padding:16px 28px;border-bottom:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
  .topbar h2{font-family:var(--font-head);font-size:1.5rem;font-weight:600;}
  .content{flex:1;overflow-y:auto;padding:24px 28px;}
  .btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:9px;font-family:var(--font-body);font-size:0.85rem;font-weight:600;cursor:pointer;border:none;transition:all .15s;}
  .btn-primary{background:var(--accent);color:#fff;}
  .btn-primary:hover{background:var(--accent2);transform:translateY(-1px);}
  .btn-secondary{background:var(--surface2);color:var(--text);border:1px solid var(--border);}
  .btn-secondary:hover{border-color:var(--accent);color:var(--accent);}
  .btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--border);}
  .btn-ghost:hover{color:var(--text);}
  .btn-danger{background:#ef444420;color:var(--danger);border:1px solid #ef444435;}
  .btn-success{background:#22c55e20;color:var(--success);border:1px solid #22c55e35;}
  .btn-gmail{background:#ea433520;color:#ea4335;border:1px solid #ea433540;}
  .btn-gmail:hover{background:#ea433530;}
  .btn-sm{padding:6px 12px;font-size:0.78rem;border-radius:7px;}
  .btn-lg{padding:13px 24px;font-size:0.95rem;border-radius:11px;}
  .btn:disabled{opacity:.4;cursor:not-allowed;}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;}
  .card-title{font-family:var(--font-head);font-size:1rem;font-weight:600;margin-bottom:16px;}
  .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:22px;}
  .stat{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;}
  .stat-label{font-size:0.72rem;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;}
  .stat-value{font-family:var(--font-head);font-size:2rem;font-weight:900;margin-top:4px;color:var(--accent);}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:0.71rem;font-weight:600;}
  .badge-success{background:#22c55e18;color:var(--success);}
  .badge-warning{background:#f59e0b18;color:var(--warning);}
  .badge-danger{background:#ef444418;color:var(--danger);}
  .badge-info{background:#3b82f618;color:#60a5fa;}
  .badge-neutral{background:var(--surface2);color:var(--muted);border:1px solid var(--border);}
  .badge-accent{background:#f9731618;color:var(--accent);}
  .table-wrap{overflow-x:auto;}
  table{width:100%;border-collapse:collapse;font-size:0.85rem;}
  th{text-align:left;padding:10px 14px;color:var(--muted);font-size:0.72rem;text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--border);font-weight:600;}
  td{padding:11px 14px;border-bottom:1px solid #ffffff06;vertical-align:middle;}
  tr:last-child td{border-bottom:none;}
  tr:hover td{background:var(--surface2);}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .form-group{display:flex;flex-direction:column;gap:6px;}
  .form-group.full{grid-column:1/-1;}
  label{font-size:0.75rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;}
  input,select,textarea{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-family:var(--font-body);font-size:0.875rem;outline:none;transition:border-color .15s;width:100%;}
  input:focus,select:focus,textarea:focus{border-color:var(--accent);}
  textarea{resize:vertical;min-height:68px;}
  select option{background:var(--surface2);}
  .form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid var(--border);}
  .modal-overlay{position:fixed;inset:0;background:#00000090;display:flex;align-items:center;justify-content:center;z-index:200;padding:16px;backdrop-filter:blur(3px);}
  .modal{background:var(--surface);border:1px solid var(--border);border-radius:18px;width:100%;max-width:660px;max-height:94vh;overflow-y:auto;padding:28px;box-shadow:0 24px 80px #00000060;}
  .modal-xl{max-width:840px;}
  .modal-title{font-family:var(--font-head);font-size:1.4rem;font-weight:900;margin-bottom:20px;color:var(--accent);}
  .search-row{display:flex;gap:10px;margin-bottom:18px;}
  .search-row input{flex:1;}
  .tabs{display:flex;gap:4px;margin-bottom:20px;flex-wrap:wrap;}
  .tab{padding:8px 16px;border-radius:8px;font-size:0.82rem;font-weight:600;cursor:pointer;color:var(--muted);background:transparent;border:1px solid transparent;transition:all .15s;}
  .tab.active{background:var(--surface2);color:var(--accent);border-color:var(--border);}
  .empty{text-align:center;padding:40px 20px;color:var(--muted);}
  .empty .icon{font-size:2.5rem;margin-bottom:10px;}
  .client-list{display:flex;flex-direction:column;gap:10px;}
  .client-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 20px;display:flex;align-items:center;justify-content:space-between;transition:all .15s;cursor:pointer;}
  .client-card:hover{border-color:var(--accent);transform:translateX(3px);}
  .client-detail-header{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:22px 26px;margin-bottom:20px;}
  .agenda-view-toggle{display:flex;gap:4px;background:var(--surface2);border-radius:9px;padding:3px;}
  .agenda-view-btn{padding:6px 14px;border-radius:7px;font-size:0.8rem;font-weight:600;cursor:pointer;color:var(--muted);transition:all .15s;border:none;background:transparent;}
  .agenda-view-btn.active{background:var(--accent);color:#fff;}
  .cal-header{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:3px;}
  .cal-header span{text-align:center;font-size:0.68rem;color:var(--muted);font-weight:600;text-transform:uppercase;padding:5px 0;}
  .cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:18px;}
  .cal-day{background:var(--surface);border:1px solid var(--border);border-radius:9px;min-height:78px;padding:6px;cursor:pointer;transition:all .15s;}
  .cal-day:hover{border-color:var(--accent);}
  .cal-day.today{border-color:var(--accent);background:#f9731608;}
  .cal-day.selected{border-color:var(--accent);border-width:2px;}
  .cal-day.other-month{opacity:.28;}
  .cal-day-num{font-size:0.72rem;font-weight:600;color:var(--muted);margin-bottom:3px;}
  .cal-day-num.today-c{color:var(--accent);}
  .cal-chip{font-size:0.6rem;padding:2px 5px;border-radius:4px;background:#f9731620;color:var(--accent);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .week-grid{display:grid;grid-template-columns:48px repeat(7,1fr);border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:18px;background:var(--surface);}
  .week-header{background:var(--surface2);padding:8px 4px;text-align:center;border-bottom:1px solid var(--border);border-right:1px solid var(--border);}
  .week-header-day{font-size:0.7rem;font-weight:700;color:var(--muted);text-transform:uppercase;}
  .week-header-date{font-size:1rem;font-family:var(--font-head);font-weight:900;margin-top:2px;}
  .week-header-date.today-c{color:var(--accent);}
  .week-time-col{font-size:0.62rem;color:var(--muted);padding:0;border-right:1px solid var(--border);}
  .week-time-slot{height:52px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;padding:3px 4px;font-size:0.6rem;color:var(--muted);}
  .week-day-col{border-right:1px solid var(--border);position:relative;min-height:780px;}
  .week-day-col:last-child{border-right:none;}
  .week-slot{height:52px;border-bottom:1px solid #ffffff05;cursor:pointer;}
  .week-slot:hover{background:#f9731608;}
  .week-event{position:absolute;left:2px;right:2px;border-radius:5px;background:#f9731625;border-left:3px solid var(--accent);padding:3px 6px;font-size:0.65rem;cursor:pointer;overflow:hidden;}
  .week-event:hover{background:#f9731640;}
  .rdv-panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;margin-bottom:16px;}
  .rdv-row{display:flex;justify-content:space-between;align-items:flex-start;padding:12px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;gap:10px;}
  .rdv-row:hover{border-color:var(--accent);}
  .checks-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
  .check-item{display:flex;align-items:center;justify-content:space-between;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:9px 12px;gap:8px;}
  .check-label{font-size:0.8rem;flex:1;}
  .check-btns{display:flex;gap:4px;}
  .check-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.75rem;font-weight:700;background:var(--surface);color:var(--muted);transition:all .12s;}
  .check-btn.ok{background:#22c55e20;color:var(--success);border-color:#22c55e40;}
  .check-btn.nok{background:#ef444420;color:var(--danger);border-color:#ef444440;}
  .check-btn.na{background:#64748b20;color:var(--muted);border-color:#64748b40;}
  .wizard-step{margin-bottom:20px;}
  .wizard-step-title{font-family:var(--font-head);font-size:1rem;font-weight:600;margin-bottom:12px;color:var(--accent);display:flex;align-items:center;gap:8px;}
  .wizard-step-num{width:24px;height:24px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;color:white;flex-shrink:0;}
  .inter-header{background:var(--surface2);border-radius:10px;padding:14px 18px;margin-bottom:18px;display:flex;align-items:center;gap:12px;}
  .action-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:20px;}
  .action-card{background:var(--surface);border:2px solid var(--border);border-radius:var(--radius);padding:18px 14px;cursor:pointer;transition:all .18s;text-align:center;}
  .action-card:hover{border-color:var(--accent);background:#f9731608;transform:translateY(-2px);}
  .ac-icon{font-size:1.8rem;margin-bottom:7px;}
  .ac-title{font-family:var(--font-head);font-size:0.9rem;font-weight:600;}
  .ac-desc{font-size:0.72rem;color:var(--muted);margin-top:3px;}
  .sig-container{border:2px dashed var(--border);border-radius:12px;overflow:hidden;position:relative;background:#f8fafc;touch-action:none;}
  .sig-container.active{border-color:var(--accent);}
  .sig-label{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:0.72rem;color:#aaa;pointer-events:none;white-space:nowrap;}
  .doc-preview{background:#fff;color:#1a1a2e;border-radius:12px;padding:38px 42px;font-family:'DM Sans',sans-serif;font-size:12px;line-height:1.6;max-width:780px;margin:0 auto;box-shadow:0 8px 48px #00000040;}
  .doc-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;padding-bottom:16px;border-bottom:3px solid #f97316;}
  .doc-company-name{font-size:22px;font-family:'Fraunces',serif;font-weight:900;color:#f97316;}
  .doc-company-info{font-size:10px;color:#666;margin-top:4px;line-height:1.8;}
  .doc-ref-type{font-size:18px;font-family:'Fraunces',serif;font-weight:900;color:#1a1a2e;text-align:right;}
  .doc-ref-info{font-size:10.5px;color:#888;text-align:right;margin-top:3px;}
  .doc-section-title{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#aaa;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #eee;}
  .doc-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px;}
  .doc-field{display:flex;flex-direction:column;margin-bottom:5px;}
  .doc-field-label{font-size:9.5px;color:#aaa;text-transform:uppercase;letter-spacing:.06em;}
  .doc-field-value{font-size:11.5px;font-weight:600;border-bottom:1px dotted #ddd;padding-bottom:2px;margin-top:2px;min-height:18px;}
  .doc-items{width:100%;border-collapse:collapse;margin:10px 0;}
  .doc-items th{background:#1a1a2e;color:#fff;padding:7px 10px;font-size:9.5px;text-align:left;}
  .doc-items td{padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:11px;}
  .doc-sig-row{display:flex;gap:16px;margin-top:20px;}
  .doc-sig-box{flex:1;border:1px solid #ddd;border-radius:7px;padding:10px 14px;text-align:center;}
  .doc-sig-box p{font-size:9.5px;color:#aaa;margin-bottom:5px;}
  .doc-footer{border-top:1px solid #eee;padding-top:10px;margin-top:16px;font-size:9px;color:#bbb;text-align:center;line-height:1.9;}
  .doc-check-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px 14px;}
  .doc-check-item{display:flex;align-items:center;gap:5px;font-size:10px;}
  .doc-check-box{width:12px;height:12px;border:1.5px solid #ccc;border-radius:2px;display:inline-flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0;}
  .doc-check-box.ok{background:#22c55e;border-color:#22c55e;color:white;}
  .doc-check-box.nok{background:#ef4444;border-color:#ef4444;color:white;}
  .mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);z-index:100;padding:6px 0 max(6px,env(safe-area-inset-bottom));}
  .mobile-nav-inner{display:flex;justify-content:space-around;}
  .mobile-nav-item{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 10px;cursor:pointer;color:var(--muted);font-size:0.58rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;border-radius:10px;transition:all .15s;min-width:52px;}
  .mobile-nav-item .mn-icon{font-size:1.25rem;}
  .mobile-nav-item.active{color:var(--accent);}
  @media print{
    body{background:#fff!important;}
    .no-print,.sidebar,.topbar,.mobile-nav{display:none!important;}
    .modal-overlay{position:static!important;background:none!important;padding:0!important;display:block!important;}
    .modal{box-shadow:none!important;border:none!important;border-radius:0!important;padding:0!important;max-width:100%!important;max-height:none!important;overflow:visible!important;}
    .doc-preview{box-shadow:none!important;border-radius:0!important;max-width:100%!important;}
    .a4page{padding:10mm 12mm!important;max-width:100%!important;box-shadow:none!important;}
    .a4-g2{grid-template-columns:1fr 1fr!important;}
    .a4-g4{grid-template-columns:1fr 1fr 1fr 1fr!important;}
    .a4-checks{grid-template-columns:1fr 1fr!important;}
  }
  @media(max-width:768px){
    .sidebar{display:none;}
    .main{padding-bottom:68px;}
    .form-grid{grid-template-columns:1fr;}
    .checks-grid,.doc-check-grid,.doc-2col{grid-template-columns:1fr;}
    .content{padding:14px;}
    .mobile-nav{display:block;}
    .topbar{padding:12px 16px;}
    .topbar h2{font-size:1.2rem;}
    .modal{padding:20px;border-radius:18px 18px 0 0;position:fixed;bottom:0;left:0;right:0;max-height:94vh;max-width:100%;}
    .modal-overlay{align-items:flex-end;padding:0;}
    .doc-preview{padding:18px;font-size:10.5px;}
    .doc-sig-row{flex-direction:column;}
    .a4page{max-width:100%!important;width:100%!important;padding:14px!important;font-size:7.5pt;}
    .a4-g2{grid-template-columns:1fr!important;}
    .a4-g4{grid-template-columns:1fr 1fr!important;}
    .a4-checks{grid-template-columns:1fr!important;}
    .a4-sig{grid-template-columns:1fr!important;}
    .a4-comb{flex-wrap:wrap;}
    .a4-ci{min-width:28%;}
  }
`;

const TODAY = new Date();
const fmt = d => { if(!d) return ""; const [y,m,j]=d.split("-"); return `${j}/${m}/${y}`; };
const money = n => Number(n||0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
const newId = arr => arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1;
const todayStr = () => TODAY.toISOString().slice(0,10);
const ds = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const JOURS_FULL = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const HOURS = Array.from({length:14},(_,i)=>`${String(i+7).padStart(2,"0")}:00`);

function getDays(y,m){
  const days=[]; let dow=new Date(y,m,1).getDay(); dow=dow===0?6:dow-1;
  for(let i=0;i<dow;i++) days.push({date:new Date(y,m,1-(dow-i)),cur:false});
  const tot=new Date(y,m+1,0).getDate();
  for(let i=1;i<=tot;i++) days.push({date:new Date(y,m,i),cur:true});
  while(days.length%7!==0){const l=days[days.length-1].date;days.push({date:new Date(l.getTime()+86400000),cur:false});}
  return days;
}
function getWeekDays(date){
  const d=new Date(date); let dow=d.getDay(); dow=dow===0?6:dow-1;
  const mon=new Date(d); mon.setDate(d.getDate()-dow);
  return Array.from({length:7},(_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return x;});
}

const CHECKS_GAZ = ["Étanchéité circuit gaz","Contrôle flamme / allumage","Nettoyage brûleur","Nettoyage échangeur","Contrôle pressostat","Vérification circulateur","Pression circuit hydraulique","Purge radiateurs","Vase d'expansion","Soupape de sécurité","Mesure combustion (CO, CO₂, O₂)","Contrôle tirage fumée","Conduit d'évacuation","Régulation / thermostat","Test sécurité générale","Nettoyage filtre","Raccords et joints","VMC si présente"];
const CHECKS_FIOUL = ["Niveau fioul","Démontage et nettoyage gicleur","Nettoyage filtre pompe fioul","Nettoyage pot filtre (si présent)","Nettoyage chambre combustion","Contrôle pompe à fioul","Réglage électrode d'allumage","Vérification circulateur","Pression circuit hydraulique","Contrôle et réglage brûleur","Mesure combustion (CO, CO₂, indice fumée)","Contrôle tirage fumée","Conduit d'évacuation","Régulation / thermostat","Test sécurité générale","Vase d'expansion","Soupape de sécurité","Raccords et joints","Vérification cuve / circuit fioul"];
const CHECKS_CLIM = ["Nettoyage filtres unité intérieure","Nettoyage évaporateur","Nettoyage condenseur unité extérieure","Nettoyage bac et évacuation condensats","Contrôle connexions électriques","Vérification télécommande / programmation","Test fonctionnement mode froid","Test fonctionnement mode chaud","Mesure température soufflage / reprise","Vérification étanchéité liaisons frigorifiques","Contrôle isolation liaisons frigorifiques","Test sécurités haute / basse pression","Contrôle fixations unités int. et ext.","Niveau sonore anormal","État général de l'installation","Désinfection / traitement antifongique"];

const MARQUES_CHAUDIERE = ["Viessmann","Atlantic","Saunier Duval","De Dietrich","Bosch","Vaillant","Chaffoteaux","Elm Leblanc","Frisquet","Chappée","Remeha","Wolf","Autre"];
const MARQUES_CLIM = ["Daikin","Mitsubishi Electric","Mitsubishi Heavy","Atlantic","Hitachi","Toshiba","Fujitsu","Samsung","LG","Panasonic","Gree","Carrier","Airwell","Thermor","Autre"];
const MARQUES_PAC = ["Atlantic","Mitsubishi Electric","Daikin","Hitachi","Viessmann","De Dietrich","Bosch","Vaillant","Saunier Duval","Thermor","Ariston","Chaffoteaux","Autre"];
const TYPES_EQUIP = ["Chaudière gaz","Chaudière fioul","Chauffe-eau gaz","Climatisation","Pompe à chaleur","Poêle à bois"];
const TYPES_CLIM = ["Simple split","Bi-split","Tri-split","Gainable","Multi-split","Cassette"];
const MARQUES_GICLEUR = ["Steinen","Danfoss","Delavan","Fluidix","Autre"];
const ANGLES_GICLEUR = ["45°","60°","80°","90°","120°"];
const SPECTRES_GICLEUR = ["S (solide)","B (creux)","H (mi-creux)","NS (semi-solide)","PL (plat)"];

const newEquip = (type="Chaudière gaz") => ({
  id: Date.now()+Math.random(), type,
  gaz:"Gaz naturel", marque:"", modele:"", numSerie:"", puissance:"", annee:"",
  typeBruleur:"", marqueBruleur:"", modeleBruleur:"",
  conduit:"Ventouse",
  marqueGicleur:"Steinen", debitGicleur:"", angleGicleur:"60°", spectreGicleur:"S (solide)",
  marqueClim:"", typeClim:"Simple split", numSerieClim:"", puissanceClim:"", anneeClim:"",
  marquePac:"", modelePac:"", numSeriePac:"", puissancePac:"", anneePac:"", copPac:"",
  contrat:"", numContrat:"", echeanceContrat:"", notes:"",
});

const fullAddr = c => [c.adresse, c.codePostal, c.ville].filter(Boolean).join(", ");
const mapsUrl = c => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddr(c))}`;
const AddrLink = ({client, style}) => (
  <a href={mapsUrl(client)} target="_blank" rel="noopener noreferrer"
    style={{color:"var(--info)",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4,...style}}>
    📍 {fullAddr(client)} <span style={{fontSize:"0.7em",opacity:.7}}>↗</span>
  </a>
);

const EQUIP_ICON = t => t==="Chaudière gaz"?"🔥":t==="Chaudière fioul"?"🛢️":t==="Chauffe-eau gaz"?"💧":t==="Climatisation"?"❄️":t==="Pompe à chaleur"?"♨️":"🪵";

const INIT_CLIENTS = [
  {id:1,nom:"Dupont",prenom:"Jean",adresse:"12 rue des Lilas",codePostal:"75012",ville:"Paris",tel:"06 12 34 56 78",email:"jean.dupont@email.fr",type:"Particulier",photos:[],
   equipements:[{...newEquip("Chaudière gaz"),gaz:"Gaz naturel",marque:"Viessmann",modele:"Vitopend 100",numSerie:"VS2019-1234",puissance:"24 kW",annee:"2019",typeBruleur:"Atmosphérique",conduit:"Ventouse"}],notes:"RAS"},
  {id:2,nom:"Martin",prenom:"Sophie",adresse:"8 allée des Chênes",codePostal:"69003",ville:"Lyon",tel:"07 98 76 54 32",email:"s.martin@email.fr",type:"Particulier",photos:[],
   equipements:[{...newEquip("Chaudière fioul"),marque:"Atlantic",modele:"Naneo PMC-M2",puissance:"28 kW",annee:"2018",conduit:"Cheminée non gainée",marqueBruleur:"Riello",modeleBruleur:"40 G",marqueGicleur:"Steinen",debitGicleur:"0.85",angleGicleur:"60°",spectreGicleur:"S (solide)"},{...newEquip("Climatisation"),marqueClim:"Daikin",typeClim:"Bi-split",anneeClim:"2021"}],notes:"Chaudière + clim salon/chambre"},
  {id:3,nom:"SCI Les Pins",prenom:"",adresse:"45 avenue Foch",codePostal:"06000",ville:"Nice",tel:"04 93 11 22 33",email:"contact@lespins.fr",type:"Professionnel",photos:[],
   equipements:[{...newEquip("Chaudière gaz"),gaz:"Gaz naturel",marque:"Saunier Duval",modele:"Thema Condens",puissance:"35 kW",annee:"2020",typeBruleur:"Prémélangé",conduit:"Ventouse",contrat:"Contrat entretien",numContrat:"3094",echeanceContrat:"2027-01-13"}],notes:"3 chaudières immeuble"},
];
const INIT_RDV = [
  {id:1,clientId:1,date:todayStr(),heure:"09:00",type:"Entretien annuel",statut:"Confirmé",notes:""},
  {id:2,clientId:2,date:todayStr(),heure:"14:30",type:"Dépannage",statut:"Confirmé",notes:"Problème allumage"},
  {id:3,clientId:3,date:new Date(TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate()+2).toISOString().slice(0,10),heure:"10:00",type:"Entretien annuel",statut:"En attente",notes:""},
];
const INIT_SOCIETE = {nom:"Votre Entreprise",technicien:"Pierre",siret:"000 000 000 00000",adresse:"1 rue de l'Exemple, 75000 Paris",tel:"01 23 45 67 89",email:"contact@votre-entreprise.fr",tvaIntra:"FR00000000000",rge:"",logo:"",iban:""};
const INIT_CATALOGUE = [
  {id:1,categorie:"Entretien chaudière gaz",designation:"Entretien chaudière gaz atmosphérique (contrat)",pu:135,tva:10,unite:"Forfait"},
  {id:2,categorie:"Entretien chaudière gaz",designation:"Entretien chaudière gaz condensation (contrat)",pu:145,tva:10,unite:"Forfait"},
  {id:3,categorie:"Entretien chaudière gaz",designation:"Entretien chaudière gaz (sans contrat)",pu:115,tva:10,unite:"Forfait"},
  {id:4,categorie:"Entretien chaudière fioul",designation:"Entretien chaudière fioul (contrat)",pu:185,tva:10,unite:"Forfait"},
  {id:5,categorie:"Entretien chaudière fioul",designation:"Entretien chaudière fioul haut rendement",pu:235,tva:10,unite:"Forfait"},
  {id:6,categorie:"Entretien chaudière fioul",designation:"Entretien chaudière fioul (sans contrat)",pu:165,tva:10,unite:"Forfait"},
  {id:7,categorie:"Climatisation / PAC",designation:"Entretien climatisation simple split",pu:140,tva:10,unite:"Forfait"},
  {id:8,categorie:"Climatisation / PAC",designation:"Entretien climatisation bi-split",pu:180,tva:10,unite:"Forfait"},
  {id:9,categorie:"Climatisation / PAC",designation:"Entretien climatisation tri-split",pu:220,tva:10,unite:"Forfait"},
  {id:10,categorie:"Climatisation / PAC",designation:"Entretien pompe à chaleur",pu:185,tva:10,unite:"Forfait"},
  {id:11,categorie:"Dépannage / main d'œuvre",designation:"Forfait déplacement",pu:35,tva:20,unite:"Forfait"},
  {id:12,categorie:"Dépannage / main d'œuvre",designation:"Main d'œuvre technicien",pu:50,tva:10,unite:"h"},
  {id:13,categorie:"Fournitures / pièces",designation:"Filtre fioul",pu:12,tva:20,unite:"pièce"},
  {id:14,categorie:"Fournitures / pièces",designation:"Gicleur fioul Steinen",pu:18,tva:20,unite:"pièce"},
  {id:15,categorie:"Fournitures / pièces",designation:"Électrode d'allumage",pu:22,tva:20,unite:"pièce"},
];

const genNumero = (type, docs, devis) => {
  const year = new Date().getFullYear();
  if(type==="devis") { const nb=(devis||[]).filter(d=>d.numero?.includes(year)).length+1; return `DEV-${year}-${String(nb).padStart(3,"0")}`; }
  const nb=(docs||[]).filter(d=>["Facture"].includes(d.type)&&d.numero?.includes(year)).length+1;
  return `FAC-${year}-${String(nb).padStart(3,"0")}`;
};

function sendGmail(to, subject, body) {
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,"_blank");
}

function SignaturePad({label, onSave, existingSig}) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasSig, setHasSig] = useState(!!existingSig);
  const [saved, setSaved] = useState(!!existingSig);
  useEffect(()=>{
    if(existingSig && canvasRef.current) {
      const ctx=canvasRef.current.getContext("2d");
      const img=new Image(); img.onload=()=>ctx.drawImage(img,0,0); img.src=existingSig;
      setHasSig(true); setSaved(true);
    }
  },[]);
  const getPos=(e,canvas)=>{const r=canvas.getBoundingClientRect();const sx=canvas.width/r.width,sy=canvas.height/r.height;if(e.touches)return{x:(e.touches[0].clientX-r.left)*sx,y:(e.touches[0].clientY-r.top)*sy};return{x:(e.clientX-r.left)*sx,y:(e.clientY-r.top)*sy};};
  const start=e=>{e.preventDefault();drawing.current=true;setSaved(false);const p=getPos(e,canvasRef.current);const ctx=canvasRef.current.getContext("2d");ctx.beginPath();ctx.moveTo(p.x,p.y);};
  const draw=e=>{e.preventDefault();if(!drawing.current)return;const p=getPos(e,canvasRef.current);const ctx=canvasRef.current.getContext("2d");ctx.lineWidth=2.5;ctx.lineCap="round";ctx.strokeStyle="#1a1a2e";ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);setHasSig(true);};
  const stop=e=>{e.preventDefault();drawing.current=false;};
  const clear=()=>{const ctx=canvasRef.current.getContext("2d");ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);setHasSig(false);setSaved(false);onSave(null);};
  const save=()=>{onSave(canvasRef.current.toDataURL("image/png"));setSaved(true);};
  return (
    <div>
      <div style={{fontSize:"0.75rem",fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>{label}</div>
      <div className={`sig-container${hasSig?" active":""}`} style={{height:120}}>
        <canvas ref={canvasRef} width={560} height={120} style={{width:"100%",height:"100%",display:"block"}}
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}/>
        {!hasSig&&<div className="sig-label">✍️ Signez ici</div>}
      </div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button className="btn btn-ghost btn-sm" onClick={clear}>🗑 Effacer</button>
        {hasSig&&!saved&&<button className="btn btn-success btn-sm" onClick={save}>✓ Valider</button>}
        {saved&&<span style={{fontSize:"0.78rem",color:"var(--success)",display:"flex",alignItems:"center",gap:5}}>✓ Enregistrée</span>}
      </div>
    </div>
  );
}

function DocWrapper({title, onClose, onMail, children}) {
  const ref = useRef(null);
  const [generating, setGenerating] = useState(false);

  const handlePDF = async () => {
    setGenerating(true);
    try {
      await Promise.all([
        new Promise(resolve => {
          if(window.html2canvas){resolve();return;}
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload=resolve; document.head.appendChild(s);
        }),
        new Promise(resolve => {
          if(window.jspdf){resolve();return;}
          const s=document.createElement("script");
          s.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          s.onload=resolve; document.head.appendChild(s);
        })
      ]);

      // Créer un conteneur A4 temporaire hors écran
      const A4_PX = 750;
      const wrapper = document.createElement("div");
      wrapper.style.cssText = `position:fixed;left:-9999px;top:0;width:${A4_PX}px;background:#fff;z-index:-1;`;
      wrapper.innerHTML = ref.current.innerHTML;
      // Forcer les styles A4 sur la page
      const style = document.createElement("style");
      style.textContent = `
        .a4page{width:${A4_PX}px!important;max-width:${A4_PX}px!important;padding:30px 36px!important;font-size:8pt!important;}
        .a4-g2{display:grid!important;grid-template-columns:1fr 1fr!important;gap:12px!important;}
        .a4-g4{display:grid!important;grid-template-columns:1fr 1fr 1fr 1fr!important;gap:8px!important;}
        .a4-checks{display:grid!important;grid-template-columns:1fr 1fr!important;gap:5px!important;}
        .a4-sig{display:grid!important;grid-template-columns:1fr 1fr!important;gap:12px!important;}
        .a4-comb{display:flex!important;flex-wrap:wrap!important;gap:6px!important;}
        .a4-ci{flex:1!important;min-width:80px!important;}
        .a4-rend{display:grid!important;grid-template-columns:1fr 1fr!important;}
      `;
      wrapper.appendChild(style);
      document.body.appendChild(wrapper);

      await new Promise(r => setTimeout(r, 300));

      const canvas = await window.html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: A4_PX,
        windowWidth: A4_PX
      });

      document.body.removeChild(wrapper);

      const {jsPDF} = window.jspdf;
      const pdf = new jsPDF({orientation:"portrait", unit:"mm", format:"a4"});
      const pdfW = 210; // mm
      const pdfH = 297; // mm
      const imgW = canvas.width;
      const imgH = canvas.height;
      // Hauteur en mm d'une page A4 en pixels
      const pageHeightPx = imgW * (pdfH / pdfW);
      let yPx = 0;
      let page = 0;
      while(yPx < imgH) {
        const sliceH = Math.min(pageHeightPx, imgH - yPx);
        const tmp = document.createElement("canvas");
        tmp.width = imgW;
        tmp.height = sliceH;
        tmp.getContext("2d").drawImage(canvas, 0, yPx, imgW, sliceH, 0, 0, imgW, sliceH);
        if(page > 0) pdf.addPage();
        pdf.addImage(tmp.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, pdfW, sliceH * pdfW / imgW);
        yPx += sliceH;
        page++;
      }
      const nom = title.replace(/[^a-zA-Z0-9]/g, "-");
      pdf.save(`${nom}.pdf`);
    } catch(e) {
      alert("Erreur PDF : " + e.message);
    }
    setGenerating(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-xl">
        <div className="no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <span className="modal-title" style={{marginBottom:0}}>{title}</span>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {onMail&&<button className="btn btn-gmail btn-sm" onClick={onMail}>✉️ Gmail</button>}
            <button className="btn btn-primary btn-sm" onClick={handlePDF} disabled={generating}>
              {generating ? "⏳ Génération..." : "📄 PDF / Imprimer"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
          </div>
        </div>
        <div ref={ref}>
          {children}
        </div>
      </div>
    </div>
  );
}

function DocLignes({lignes}) {
  const tvaMap={};
  lignes.forEach(l=>{const ht=Number(l.qte)*Number(l.pu);const t=Number(l.tva||10);if(!tvaMap[t])tvaMap[t]={taux:t,ht:0,tva:0};tvaMap[t].ht+=ht;tvaMap[t].tva+=ht*t/100;});
  const totalHT=lignes.reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const totalTVA=Object.values(tvaMap).reduce((s,t)=>s+t.tva,0);
  const totalTTC=totalHT+totalTVA;
  return (
    <>
      <table className="doc-items">
        <thead><tr><th style={{width:"45%"}}>Désignation</th><th style={{width:"8%"}}>Qté</th><th style={{width:"8%"}}>Unité</th><th style={{width:"12%",textAlign:"right"}}>P.U. HT</th><th style={{width:"8%",textAlign:"right"}}>TVA</th><th style={{width:"12%",textAlign:"right"}}>Total HT</th></tr></thead>
        <tbody>
          {lignes.map((l,i)=>(
            <tr key={i}><td>{l.designation||l.desc}</td><td style={{textAlign:"center"}}>{l.qte}</td><td style={{textAlign:"center"}}>{l.unite}</td><td style={{textAlign:"right"}}>{money(l.pu)}</td><td style={{textAlign:"right"}}>{l.tva}%</td><td style={{textAlign:"right",fontWeight:600}}>{money(Number(l.qte)*Number(l.pu))}</td></tr>
          ))}
        </tbody>
      </table>
      <div style={{display:"flex",justifyContent:"flex-end",gap:32,marginTop:8}}>
        <div style={{minWidth:260}}>
          {Object.values(tvaMap).map(t=>(
            <div key={t.taux} style={{display:"flex",justifyContent:"space-between",gap:24,fontSize:11,marginBottom:3}}><span style={{color:"#888"}}>TVA {t.taux}%</span><span>{money(t.tva)}</span></div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",gap:24,fontSize:11,marginBottom:3,paddingTop:4,borderTop:"1px solid #eee"}}><span style={{color:"#888"}}>Total HT</span><span>{money(totalHT)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",gap:24,fontSize:14,fontWeight:700,color:"#f97316",paddingTop:6,borderTop:"2px solid #f97316",marginTop:4}}><span>Total TTC</span><span>{money(totalTTC)}</span></div>
        </div>
      </div>
    </>
  );
}

function DocEntete({societe, client, type, numero, date, dateEcheance, validite}) {
  return (
    <>
      <div className="doc-head">
        <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
          {societe.logo&&<img src={societe.logo} alt="Logo" style={{height:64,maxWidth:140,objectFit:"contain",flexShrink:0}}/>}
          <div>
            <div className="doc-company-name">{societe.nom}</div>
            <div className="doc-company-info">{societe.adresse}<br/>Tél : {societe.tel} · {societe.email}<br/>SIRET : {societe.siret}</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div className="doc-ref-type">{type}</div>
          <div className="doc-ref-info">N° {numero}</div>
          <div className="doc-ref-info">Date : {fmt(date)}</div>
          {dateEcheance&&<div className="doc-ref-info">Échéance : {fmt(dateEcheance)}</div>}
          {validite&&<div className="doc-ref-info">Validité : {fmt(validite)}</div>}
        </div>
      </div>
      <div className="doc-2col" style={{marginBottom:16}}>
        <div><h4>Émetteur</h4><strong>{societe.nom}</strong><br/>{societe.adresse}<br/>SIRET : {societe.siret}</div>
        <div><h4>Client</h4><strong>{client?.prenom} {client?.nom}</strong><br/>{fullAddr(client)}<br/>{client?.tel}</div>
      </div>
    </>
  );
}

function DocDevis({doc, client, societe, onClose, onTransform}) {
  const ttc=(doc.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*(1+Number(l.tva||10)/100),0);
  const mailBody=`Bonjour ${client?.prenom} ${client?.nom},\n\nVotre devis N° ${doc.numero} du ${fmt(doc.date)} d'un montant de ${money(ttc)} TTC.\nValidité : ${fmt(doc.validite)}.\n\nCordialement,\n${societe.technicien}\n${societe.nom}\n${societe.tel}`;
  return (
    <DocWrapper title="Devis" onClose={onClose} onMail={client?.email?()=>sendGmail(client.email,`Devis ${doc.numero} — ${societe.nom}`,mailBody):null}>
      <div className="no-print" style={{marginBottom:12}}>
        {doc.statut==="Accepté"?<span className="badge badge-success" style={{fontSize:"0.85rem",padding:"6px 14px"}}>✓ Accepté</span>:doc.statut==="Refusé"?<span className="badge badge-danger" style={{fontSize:"0.85rem",padding:"6px 14px"}}>✗ Refusé</span>:<span className="badge badge-warning" style={{fontSize:"0.85rem",padding:"6px 14px"}}>En attente</span>}
        {doc.statut!=="Refusé"&&doc.statut!=="Facturé"&&onTransform&&<button className="btn btn-primary btn-sm" style={{marginLeft:10}} onClick={onTransform}>🧾 → Facture</button>}
      </div>
      <div className="doc-preview">
        <DocEntete societe={societe} client={client} type="DEVIS" numero={doc.numero} date={doc.date} validite={doc.validite}/>
        {doc.objet&&<div style={{marginBottom:12,fontSize:12}}><strong>Objet :</strong> {doc.objet}</div>}
        <DocLignes lignes={doc.lignes||[]}/>
        <div className="doc-sig-row">
          <div className="doc-sig-box"><p>Signature entreprise</p><div style={{height:60,borderBottom:"1px solid #ddd"}}/></div>
          <div className="doc-sig-box"><p>Bon pour accord — client</p><div style={{height:60,borderBottom:"1px solid #ddd"}}/></div>
        </div>
        <div className="doc-footer">{societe.nom} — SIRET {societe.siret} — {societe.tel} — {societe.email}</div>
      </div>
    </DocWrapper>
  );
}

function DocFacture({doc, client, societe, onClose}) {
  const totalHT=(doc.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const totalTVA=(doc.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*Number(l.tva||10)/100,0);
  const totalTTC=totalHT+totalTVA;
  const mailBody=`Bonjour ${client?.prenom} ${client?.nom},\n\nVotre facture N° ${doc.numero} du ${fmt(doc.date)} d'un montant de ${money(totalTTC)} TTC.\n\nCordialement,\n${societe.technicien}\n${societe.nom}`;
  return (
    <DocWrapper title="Facture" onClose={onClose} onMail={client?.email?()=>sendGmail(client.email,`Facture ${doc.numero} — ${societe.nom}`,mailBody):null}>
      <div className="doc-preview">
        <DocEntete societe={societe} client={client} type="FACTURE" numero={doc.numero} date={doc.date} dateEcheance={doc.dateEcheance}/>
        {doc.objet&&<div style={{marginBottom:12,fontSize:12}}><strong>Objet :</strong> {doc.objet}</div>}
        <DocLignes lignes={doc.lignes||[]}/>
        <div style={{marginTop:12,fontSize:11,color:"#555"}}>Paiement à réception · {doc.modePaiement||"Chèque, Virement, Espèces, Carte bancaire"}</div>
        <div className="doc-sig-row" style={{marginTop:16}}>
          <div className="doc-sig-box"><p>Signature technicien</p>{doc.sigTech?<img src={doc.sigTech} alt="sig" style={{height:55}}/>:<div style={{height:55,borderBottom:"1px solid #ddd"}}/>}</div>
          <div className="doc-sig-box"><p>Acquitté — client</p>{doc.sigClient?<img src={doc.sigClient} alt="sig" style={{height:55}}/>:<div style={{height:55,borderBottom:"1px solid #ddd"}}/>}</div>
        </div>
        <div className="doc-footer">{societe.nom} — SIRET {societe.siret} — {societe.tel} — {societe.email}</div>
      </div>
    </DocWrapper>
  );
}

function DocBon({doc, client, societe, onClose}) {
  const ht=(doc.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const ttc=ht*(1+(doc.tva||10)/100);
  const equip=doc.equip||{};
  const CSS_A4=`
    .a4page{font-family:'DM Sans',sans-serif;font-size:8pt;color:#111;background:#fff;padding:11mm 13mm;max-width:210mm;margin:0 auto;}
    .a4-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5mm;padding-bottom:3mm;border-bottom:2px solid #1a56db;}
    .a4-company{font-size:7pt;line-height:1.6;color:#333;}.a4-company strong{font-size:9.5pt;color:#111;display:block;}
    .a4-logo{font-size:15pt;font-weight:800;color:#1a56db;line-height:1.1;text-align:right;}
    .a4-title{background:#1a56db;color:#fff;text-align:center;padding:3px 0;font-size:9.5pt;font-weight:700;letter-spacing:1px;margin-bottom:4mm;border-radius:3px;}
    .a4-sec{margin-bottom:3mm;}.a4-sec-t{font-size:7pt;font-weight:700;color:#1a56db;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #1a56db30;padding-bottom:2px;margin-bottom:2mm;}
    .a4-g2{display:grid;grid-template-columns:1fr 1fr;gap:3mm;}.a4-g4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:2mm;}
    .a4-f{display:flex;flex-direction:column;gap:1px;}.a4-f label{font-size:6pt;color:#888;text-transform:uppercase;font-weight:600;}
    .a4-f .v{border-bottom:1px solid #ccc;min-height:13px;font-size:7.5pt;padding:1px 2px;color:#111;font-weight:500;}
    .a4-box{background:#f7f9ff;border:1px solid #dce8ff;border-radius:4px;padding:2.5mm;}
    .a4-travaux{border:1px solid #ddd;border-radius:3px;padding:2mm;min-height:14mm;font-size:7.5pt;color:#333;white-space:pre-wrap;}
    .a4-sig{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin-top:3mm;}
    .a4-sig-box{border:1px solid #ddd;border-radius:4px;padding:2.5mm;min-height:18mm;display:flex;flex-direction:column;}
    .a4-sig-label{font-size:6.5pt;color:#888;margin-bottom:2mm;font-weight:600;}
    .a4-sig-line{margin-top:auto;border-top:1px dashed #ccc;padding-top:2px;font-size:6pt;color:#aaa;}
    .a4-footer{margin-top:3mm;padding-top:2mm;border-top:1px solid #eee;text-align:center;font-size:6pt;color:#aaa;}
    .a4-badge{display:inline-block;background:#e8f5e9;color:#2e7d32;border:1px solid #4caf50;border-radius:3px;padding:1px 6px;font-size:7pt;font-weight:700;}
  `;
  return (
    <DocWrapper title="Bon d'intervention" onClose={onClose} onMail={()=>sendGmail(client?.email||"",`Bon d'intervention ${doc.numero} — ${societe.nom}`,`Bon d'intervention N° ${doc.numero} du ${fmt(doc.date)}.\n${doc.observations||""}`)}>
      <style>{CSS_A4}</style>
      <div className="a4page">
        <div className="a4-header">
          <div className="a4-company">
            {societe.logo&&<img src={societe.logo} alt="Logo" style={{height:36,maxWidth:120,objectFit:"contain",marginBottom:4,display:"block"}}/>}
            <strong>{societe.nom}</strong>
            {societe.adresse}<br/>Tél : {societe.tel}<br/>{societe.email}<br/>SIRET : {societe.siret}
          </div>
          <div><div className="a4-logo">🔥 {societe.nom}</div><div style={{fontSize:"6.5pt",color:"#888",textAlign:"right",marginTop:2}}>Chauffagiste certifié</div></div>
        </div>
        <div className="a4-title">BON D'INTERVENTION</div>
        <div className="a4-g2" style={{marginBottom:"3mm"}}>
          <div className="a4-box">
            <div className="a4-sec-t">Intervention</div>
            <div className="a4-g2" style={{gap:"2mm"}}>
              <div className="a4-f"><label>N° Document</label><div className="v">{doc.numero}</div></div>
              <div className="a4-f"><label>Date</label><div className="v">{fmt(doc.date)}</div></div>
              <div className="a4-f"><label>Heure arrivée</label><div className="v">{doc.heureArrivee||"—"}</div></div>
              <div className="a4-f"><label>Heure départ</label><div className="v">{doc.heureDepart||"—"}</div></div>
              <div className="a4-f" style={{gridColumn:"1/-1"}}><label>Type d'intervention</label><div className="v">{doc.typeIntervention}</div></div>
            </div>
          </div>
          <div className="a4-box">
            <div className="a4-sec-t">Client</div>
            <div className="a4-f" style={{marginBottom:"2mm"}}><label>Nom</label><div className="v">{client?.prenom} {client?.nom}</div></div>
            <div className="a4-f" style={{marginBottom:"2mm"}}><label>Adresse</label><div className="v">{fullAddr(client)}</div></div>
            <div className="a4-f"><label>Téléphone</label><div className="v">{client?.tel}</div></div>
          </div>
        </div>
        <div className="a4-sec">
          <div className="a4-sec-t">Équipement</div>
          <div className="a4-g4">
            <div className="a4-f"><label>Type</label><div className="v">{equip.type||"—"}</div></div>
            <div className="a4-f"><label>Marque / Modèle</label><div className="v">{equip.marque||equip.marqueClim||"—"} {equip.modele||""}</div></div>
            <div className="a4-f"><label>N° de série</label><div className="v">{equip.numSerie||equip.numSerieClim||"—"}</div></div>
            <div className="a4-f"><label>Puissance</label><div className="v">{equip.puissance||equip.puissanceClim||"—"}</div></div>
            <div className="a4-f"><label>Énergie / Type</label><div className="v">{equip.gaz||equip.type||"—"}</div></div>
            <div className="a4-f"><label>Conduit évacuation</label><div className="v">{equip.conduit||"—"}</div></div>
            <div className="a4-f"><label>Année</label><div className="v">{equip.annee||equip.anneeClim||"—"}</div></div>
            <div className="a4-f"><label>État général</label><div className="v"><span className="a4-badge">✓ Bon état</span></div></div>
          </div>
        </div>
        <div className="a4-g2" style={{marginBottom:"3mm"}}>
          <div className="a4-sec"><div className="a4-sec-t">Travaux réalisés</div><div className="a4-travaux">{doc.observations||""}</div></div>
          <div className="a4-sec"><div className="a4-sec-t">Pièces changées</div><div className="a4-travaux">{doc.piecesChangees||""}</div></div>
        </div>
        {(doc.lignes||[]).length>0&&<div className="a4-sec">
          <div className="a4-sec-t">Facturation</div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"7.5pt"}}>
            <thead><tr style={{background:"#1a56db",color:"#fff"}}><th style={{padding:"3px 6px",textAlign:"left"}}>Désignation</th><th style={{padding:"3px 6px"}}>Qté</th><th style={{padding:"3px 6px",textAlign:"right"}}>P.U. HT</th><th style={{padding:"3px 6px",textAlign:"right"}}>Total HT</th></tr></thead>
            <tbody>{doc.lignes.map((l,i)=><tr key={i} style={{borderBottom:"1px solid #eee"}}><td style={{padding:"3px 6px"}}>{l.desc||l.designation}</td><td style={{padding:"3px 6px",textAlign:"center"}}>{l.qte}</td><td style={{padding:"3px 6px",textAlign:"right"}}>{money(l.pu)}</td><td style={{padding:"3px 6px",textAlign:"right"}}>{money(l.qte*l.pu)}</td></tr>)}</tbody>
          </table>
          <div style={{textAlign:"right",fontWeight:700,fontSize:"8.5pt",color:"#1a56db",marginTop:4}}>Total TTC : {money(ttc)}</div>
        </div>}
        <div className="a4-box" style={{marginBottom:"3mm"}}>
          <div className="a4-sec-t">Règlement</div>
          <div className="a4-g4">
            <div className="a4-f"><label>Montant reçu</label><div className="v">{ttc>0?money(ttc):"—"}</div></div>
            <div className="a4-f"><label>Mode de règlement</label><div className="v">{doc.modePaiement||"—"}</div></div>
            <div className="a4-f"><label>Temps passé</label><div className="v">{doc.tempsPasse||"—"}</div></div>
            <div className="a4-f"><label>Référence</label><div className="v">{doc.reference||"—"}</div></div>
          </div>
        </div>
        <div className="a4-sig">
          <div className="a4-sig-box">
            <div className="a4-sig-label">Signature du technicien</div>
            {doc.sigTech?<img src={doc.sigTech} alt="sig" style={{maxHeight:50,objectFit:"contain"}}/>:<div style={{flex:1}}/>}
            <div className="a4-sig-line">{societe.technicien} — {societe.nom}</div>
          </div>
          <div className="a4-sig-box">
            <div className="a4-sig-label">Signature et cachet du client</div>
            {doc.sigClient?<img src={doc.sigClient} alt="sig" style={{maxHeight:50,objectFit:"contain"}}/>:<div style={{flex:1}}/>}
            <div className="a4-sig-line">Bon pour accord</div>
          </div>
        </div>
        <div className="a4-footer">{societe.nom} — SIRET {societe.siret} — APE 4322B — {societe.tel} — {societe.email}</div>
      </div>
    </DocWrapper>
  );
}

function DocAttestation({doc, client, societe, onClose}) {
  const isFioul=doc.combustible==="Fioul"||doc.type==="Attestation Fioul";
  const isClim=doc.type==="Attestation Clim";
  const isPac=doc.type==="Attestation PAC";
  const checkList=isClim?CHECKS_CLIM:isFioul?CHECKS_FIOUL:CHECKS_GAZ;
  const checks=doc.checks||{};
  const equip=doc.equip||{};
  const nonConf=(doc.nonConformites||[]).filter(n=>n.trim());
  const comb=doc.combustion||{};
  const typeLabel=isClim?"CLIMATISATION":isPac?"POMPE À CHALEUR":isFioul?"CHAUDIÈRE FIOUL":"CHAUDIÈRE GAZ";
  const CSS_A4=`
    .a4page{font-family:'DM Sans',sans-serif;font-size:8pt;color:#111;background:#fff;padding:11mm 13mm;max-width:210mm;margin:0 auto;}
    .a4-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5mm;padding-bottom:3mm;border-bottom:2px solid #1a56db;}
    .a4-company{font-size:7pt;line-height:1.6;color:#333;}.a4-company strong{font-size:9.5pt;color:#111;display:block;}
    .a4-logo{font-size:15pt;font-weight:800;color:#1a56db;line-height:1.1;text-align:right;}
    .a4-title{background:#1a56db;color:#fff;text-align:center;padding:3px 0;font-size:9.5pt;font-weight:700;letter-spacing:1px;margin-bottom:4mm;border-radius:3px;}
    .a4-sec{margin-bottom:3mm;}.a4-sec-t{font-size:7pt;font-weight:700;color:#1a56db;text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid #1a56db30;padding-bottom:2px;margin-bottom:2mm;}
    .a4-g2{display:grid;grid-template-columns:1fr 1fr;gap:3mm;}
    .a4-f{display:flex;flex-direction:column;gap:1px;}.a4-f label{font-size:6pt;color:#888;text-transform:uppercase;font-weight:600;}
    .a4-f .v{border-bottom:1px solid #ccc;min-height:13px;font-size:7.5pt;padding:1px 2px;color:#111;font-weight:500;}
    .a4-box{background:#f7f9ff;border:1px solid #dce8ff;border-radius:4px;padding:2.5mm;}
    .a4-comb{display:flex;gap:2mm;flex-wrap:wrap;}
    .a4-ci{background:#f7f9ff;border:1px solid #dce8ff;border-radius:3px;padding:2px 5px;text-align:center;flex:1;min-width:22mm;}
    .a4-ci .cl{font-size:5.5pt;color:#888;text-transform:uppercase;}
    .a4-ci .cv{font-size:8.5pt;font-weight:700;color:#1a56db;}
    .a4-ci .cu{font-size:5.5pt;color:#aaa;}
    .a4-checks{display:grid;grid-template-columns:1fr 1fr;gap:1.2mm;}
    .a4-chk{display:flex;align-items:center;gap:3px;font-size:7pt;}
    .a4-chkbox{width:10px;height:10px;border:1px solid #aaa;border-radius:2px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font-size:7px;font-weight:700;}
    .a4-chkbox.ok{background:#e8f5e9;border-color:#4caf50;color:#2e7d32;}
    .a4-chkbox.nok{background:#ffebee;border-color:#f44336;color:#c62828;}
    .a4-chkbox.na{background:#f5f5f5;border-color:#bbb;color:#777;}
    .a4-travaux{border:1px solid #ddd;border-radius:3px;padding:2mm;min-height:12mm;font-size:7.5pt;color:#333;white-space:pre-wrap;}
    .a4-rend{border:1px solid #1a56db30;border-radius:3px;padding:2mm;display:grid;grid-template-columns:1fr 1fr;gap:2mm;}
    .a4-rend label{font-size:6pt;color:#888;text-transform:uppercase;font-weight:600;display:block;}
    .a4-rend .v{font-size:8pt;font-weight:700;color:#1a56db;border-bottom:1px solid #ccc;padding:1px 2px;}
    .a4-classif{width:100%;border-collapse:collapse;font-size:6.5pt;margin-top:1mm;}
    .a4-classif th{background:#1a56db;color:#fff;padding:2px 4px;text-align:left;font-weight:600;}
    .a4-classif td{padding:2px 4px;border-bottom:1px solid #eee;}
    .a4-classif tr:nth-child(even) td{background:#f7f9ff;}
    .a4-badge-cls{display:inline-block;background:#1a56db;color:#fff;border-radius:2px;padding:0 4px;font-weight:700;font-size:8pt;}
    .a4-nonconf{border:1px solid #ddd;border-radius:3px;background:#fafafa;padding:2mm;}
    .a4-nonconf-t{font-size:7pt;font-weight:700;margin-bottom:1mm;}
    .a4-nonconf-txt{font-size:7pt;color:#333;line-height:1.5;}
    .a4-sig{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin-top:3mm;}
    .a4-sig-box{border:1px solid #ddd;border-radius:4px;padding:2.5mm;min-height:18mm;display:flex;flex-direction:column;}
    .a4-sig-label{font-size:6.5pt;color:#888;margin-bottom:2mm;font-weight:600;}
    .a4-sig-line{margin-top:auto;border-top:1px dashed #ccc;padding-top:2px;font-size:6pt;color:#aaa;}
    .a4-footer{margin-top:3mm;padding-top:2mm;border-top:1px solid #eee;text-align:center;font-size:6pt;color:#aaa;}
    .a4-etat{display:inline-block;background:#e8f5e9;color:#2e7d32;border:1px solid #4caf50;border-radius:3px;padding:1px 6px;font-size:7pt;font-weight:700;}
  `;
  return (
    <DocWrapper title={`Attestation — ${typeLabel}`} onClose={onClose} onMail={()=>sendGmail(client?.email||"",`Attestation ${doc.numero} — ${societe.nom}`,`Attestation d'entretien N° ${doc.numero} du ${fmt(doc.date)}.`)}>
      <style>{CSS_A4}</style>
      <div className="a4page">
        <div className="a4-header">
          <div className="a4-company">
            {societe.logo&&<img src={societe.logo} alt="Logo" style={{height:36,maxWidth:120,objectFit:"contain",marginBottom:4,display:"block"}}/>}
            <strong>{societe.nom}</strong>
            {societe.adresse}<br/>Tél : {societe.tel} — {societe.email}<br/>SIRET : {societe.siret}
          </div>
          <div><div className="a4-logo">🔥 {societe.nom}</div></div>
        </div>

        <div className="a4-title">ATTESTATION D'ENTRETIEN — {typeLabel}</div>

        {/* CLIENT + APPAREIL */}
        <div className="a4-g2" style={{marginBottom:"2.5mm"}}>
          <div className="a4-box">
            <div className="a4-sec-t">Client</div>
            <div className="a4-f" style={{marginBottom:"1.5mm"}}><label>Nom</label><div className="v">{client?.prenom} {client?.nom}</div></div>
            <div className="a4-f"><label>Adresse</label><div className="v">{fullAddr(client)}</div></div>
          </div>
          <div className="a4-box">
            <div className="a4-sec-t">Appareil</div>
            <div className="a4-f" style={{marginBottom:"1.5mm"}}><label>Marque / Modèle</label><div className="v">{equip.marque||equip.marqueClim||equip.marquePac||"—"} {equip.modele||equip.modelePac||""}</div></div>
            <div className="a4-f" style={{marginBottom:"1.5mm"}}><label>N° Série</label><div className="v">{equip.numSerie||equip.numSerieClim||equip.numSeriePac||"—"}</div></div>
            <div className="a4-g2" style={{gap:"2mm"}}>
              <div className="a4-f"><label>Puissance</label><div className="v">{equip.puissance||equip.puissanceClim||equip.puissancePac||"—"}</div></div>
              <div className="a4-f"><label>{isClim||isPac?"Fluide":"Type gaz"}</label><div className="v">{equip.gaz||equip.fluide||"—"}</div></div>
            </div>
          </div>
        </div>

        {/* DATE + ÉTAT */}
        <div className="a4-g2" style={{marginBottom:"2.5mm"}}>
          <div className="a4-f"><label>Date d'entretien</label><div className="v">{fmt(doc.date)}</div></div>
          <div className="a4-f"><label>État général</label><div className="v"><span className="a4-etat">✓ Bon état de fonctionnement</span></div></div>
        </div>

        {/* LAYOUT 2 COLONNES */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3mm",marginBottom:"2.5mm"}}>

          {/* COLONNE GAUCHE : Checks + Travaux */}
          <div style={{display:"flex",flexDirection:"column",gap:"2mm"}}>
            <div className="a4-sec">
              <div className="a4-sec-t">Points de vérification</div>
              <div className="a4-checks">
                {checkList.map((c,i)=>(
                  <div key={i} className="a4-chk">
                    <div className={`a4-chkbox${checks[i]==="ok"?" ok":checks[i]==="nok"?" nok":checks[i]==="na"?" na":""}`}>
                      {checks[i]==="ok"?"✓":checks[i]==="nok"?"✗":checks[i]==="na"?"–":""}
                    </div>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="a4-sec">
              <div className="a4-sec-t">Travaux réalisés & Observations</div>
              <div className="a4-travaux">{doc.observations||""}</div>
            </div>
          </div>

          {/* COLONNE DROITE : Mesures + Rendement + Classif + Non-conf */}
          <div style={{display:"flex",flexDirection:"column",gap:"2mm"}}>

            {!isClim&&!isPac&&<div className="a4-sec">
              <div className="a4-sec-t">Mesures de combustion{isFioul?" & Brûleur":""}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.5mm",marginBottom:"1.5mm"}}>
                <div className="a4-ci"><div className="cl">CO Amb.</div><div className="cv">{comb.coAmbiant||"—"}</div><div className="cu">ppm</div></div>
                <div className="a4-ci"><div className="cl">CO Fum.</div><div className="cv">{comb.coFumees||"—"}</div><div className="cu">ppm</div></div>
                <div className="a4-ci"><div className="cl">CO₂</div><div className="cv">{comb.co2||"—"}</div><div className="cu">%</div></div>
                <div className="a4-ci"><div className="cl">O₂</div><div className="cv">{comb.o2||"—"}</div><div className="cu">%</div></div>
                <div className="a4-ci"><div className="cl">T. fumées</div><div className="cv">{comb.tempFumees||"—"}</div><div className="cu">°C</div></div>
                <div className="a4-ci"><div className="cl">Air comb.</div><div className="cv">{comb.tempAir||"—"}</div><div className="cu">°C</div></div>
                <div className="a4-ci"><div className="cl">Rdt PCI</div><div className="cv">{comb.rendement||"—"}</div><div className="cu">%</div></div>
                <div className="a4-ci"><div className="cl">NOx</div><div className="cv">{comb.nox||"—"}</div><div className="cu">mg/kWh</div></div>
                {isFioul&&<><div className="a4-ci"><div className="cl">Gicleur</div><div className="cv">{comb.gicleur||equip.debitGicleur||"—"}</div><div className="cu">{equip.angleGicleur||""}</div></div>
                <div className="a4-ci"><div className="cl">P. pompe</div><div className="cv">{comb.pressionPompe||"—"}</div><div className="cu">bar</div></div></>}
              </div>
            </div>}

            {(isClim||isPac)&&<div className="a4-sec">
              <div className="a4-sec-t">Mesures</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5mm"}}>
                {isClim&&<><div className="a4-ci"><div className="cl">T. soufflage</div><div className="cv">{comb.tempSoufflage||"—"}</div><div className="cu">°C</div></div>
                <div className="a4-ci"><div className="cl">T. reprise</div><div className="cv">{comb.tempReprise||"—"}</div><div className="cu">°C</div></div>
                <div className="a4-ci"><div className="cl">Écart ΔT</div><div className="cv">{comb.tempSoufflage&&comb.tempReprise?Math.abs(Number(comb.tempReprise)-Number(comb.tempSoufflage)):"—"}</div><div className="cu">°C</div></div></>}
                {isPac&&<><div className="a4-ci"><div className="cl">T. départ</div><div className="cv">{comb.tempDepart||"—"}</div><div className="cu">°C</div></div>
                <div className="a4-ci"><div className="cl">T. retour</div><div className="cv">{comb.tempRetour||"—"}</div><div className="cu">°C</div></div>
                <div className="a4-ci"><div className="cl">Pression</div><div className="cv">{comb.pression||"—"}</div><div className="cu">bar</div></div></>}
              </div>
            </div>}

            {!isClim&&!isPac&&<div className="a4-sec">
              <div className="a4-sec-t">Rendement PCI & NOx</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5mm",marginBottom:"1.5mm"}}>
                <div><div style={{fontSize:"5.5pt",color:"#888",textTransform:"uppercase",fontWeight:600}}>Rdt évalué</div><div style={{fontSize:"7.5pt",fontWeight:700,color:"#1a56db",borderBottom:"1px solid #ccc",padding:"1px 2px"}}>{comb.rendement||"—"} %</div></div>
                <div><div style={{fontSize:"5.5pt",color:"#888",textTransform:"uppercase",fontWeight:600}}>Rdt référence</div><div style={{fontSize:"7.5pt",fontWeight:700,color:"#1a56db",borderBottom:"1px solid #ccc",padding:"1px 2px"}}>{isFioul?"85,0":"93,0"} %</div></div>
                <div><div style={{fontSize:"5.5pt",color:"#888",textTransform:"uppercase",fontWeight:600}}>NOx évalués</div><div style={{fontSize:"7.5pt",fontWeight:700,color:"#1a56db",borderBottom:"1px solid #ccc",padding:"1px 2px"}}>{comb.nox||"—"} mg/kWh</div></div>
                <div><div style={{fontSize:"5.5pt",color:"#888",textTransform:"uppercase",fontWeight:600}}>NOx référence</div><div style={{fontSize:"7.5pt",fontWeight:700,color:"#1a56db",borderBottom:"1px solid #ccc",padding:"1px 2px"}}>35 mg/kWh</div></div>
              </div>
            </div>}

            {!isClim&&!isPac&&<div className="a4-sec">
              <div className="a4-sec-t">Classification énergétique (avant sept. 2015)</div>
              <table className="a4-classif">
                <thead><tr><th>Classe</th><th>Fabrication</th><th>Énergie</th></tr></thead>
                <tbody>
                  <tr><td>Standard / basse T°</td><td>Avant 2005</td><td><span className="a4-badge-cls">D</span></td></tr>
                  <tr><td>Standard / basse T°</td><td>Après 2005</td><td><span className="a4-badge-cls">C</span></td></tr>
                  <tr><td>Condensation</td><td>Avant 2005</td><td><span className="a4-badge-cls">B</span></td></tr>
                  <tr><td>Condensation</td><td>Après 2005</td><td><span className="a4-badge-cls" style={{background:"#2e7d32"}}>A</span></td></tr>
                </tbody>
              </table>
            </div>}

            {/* NON-CONFORMITÉS dans colonne droite */}
            <div className="a4-sec">
              <div className="a4-sec-t">Non-conformités éventuelles</div>
              <div className="a4-nonconf">
                {nonConf.length>0
                  ? <><div className="a4-nonconf-t" style={{color:"#c62828"}}>⚠ Anomalie(s) détectée(s)</div>{nonConf.map((n,i)=><div key={i} className="a4-nonconf-txt">• {n}</div>)}</>
                  : <><div className="a4-nonconf-t" style={{color:"#2e7d32"}}>✓ Aucune non-conformité détectée</div><div className="a4-nonconf-txt">L'installation est conforme aux exigences réglementaires en vigueur.</div></>
                }
              </div>
            </div>

          </div>
        </div>

        {/* SIGNATURES en bas sur toute la largeur */}
        <div className="a4-sig">
          <div className="a4-sig-box">
            <div className="a4-sig-label">Technicien</div>
            {doc.sigTech?<img src={doc.sigTech} alt="sig" style={{maxHeight:40,objectFit:"contain"}}/>:<div style={{flex:1}}/>}
            <div className="a4-sig-line">{societe.technicien} — {societe.nom}</div>
          </div>
          <div className="a4-sig-box">
            <div className="a4-sig-label">Client — Bon pour accord</div>
            {doc.sigClient?<img src={doc.sigClient} alt="sig" style={{maxHeight:40,objectFit:"contain"}}/>:<div style={{flex:1}}/>}
            <div className="a4-sig-line">Date et signature</div>
          </div>
        </div>
        <div className="a4-footer">
          {isClim||isPac
            ? `Attestation délivrée conformément au décret n°2020-912 du 28 juillet 2020 — ${societe.nom} — SIRET ${societe.siret}`
            : `Attestation délivrée conformément à l'arrêté du 15 septembre 2009 — ${societe.nom} — SIRET ${societe.siret}`
          }
        </div>
      </div>
    </DocWrapper>
  );
}

function EquipForm({equip, onChange, onDelete, index}) {
  const s=(k,v)=>onChange({...equip,[k]:v});
  const isClim=equip.type==="Climatisation";
  const isPac=equip.type==="Pompe à chaleur";
  const isFioul=equip.type==="Chaudière fioul";
  const isGaz=equip.type==="Chaudière gaz"||equip.type==="Chauffe-eau gaz";
  const isChaud=isGaz||isFioul;
  return (
    <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:16,marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontWeight:700,fontSize:"0.85rem",color:"var(--accent)"}}>{EQUIP_ICON(equip.type)} Équipement {index+1} — {equip.type}</div>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>🗑️ Supprimer</button>
      </div>
      <div className="form-grid">
        <div className="form-group full"><label>Type</label><select value={equip.type} onChange={e=>onChange({...equip,type:e.target.value})}>{TYPES_EQUIP.map(t=><option key={t}>{t}</option>)}</select></div>
        {isClim&&<><div className="form-group"><label>Marque</label><select value={equip.marqueClim||""} onChange={e=>s("marqueClim",e.target.value)}><option value="">—</option>{MARQUES_CLIM.map(m=><option key={m}>{m}</option>)}</select></div><div className="form-group"><label>Type</label><select value={equip.typeClim||"Simple split"} onChange={e=>s("typeClim",e.target.value)}>{TYPES_CLIM.map(t=><option key={t}>{t}</option>)}</select></div><div className="form-group"><label>Modèle</label><input value={equip.modele||""} onChange={e=>s("modele",e.target.value)}/></div><div className="form-group"><label>N° série</label><input value={equip.numSerieClim||""} onChange={e=>s("numSerieClim",e.target.value)}/></div><div className="form-group"><label>Puissance (kW)</label><input value={equip.puissanceClim||""} onChange={e=>s("puissanceClim",e.target.value)}/></div><div className="form-group"><label>Année</label><input value={equip.anneeClim||""} onChange={e=>s("anneeClim",e.target.value)}/></div></>}
        {isPac&&<><div className="form-group"><label>Marque</label><select value={equip.marquePac||""} onChange={e=>s("marquePac",e.target.value)}><option value="">—</option>{MARQUES_PAC.map(m=><option key={m}>{m}</option>)}</select></div><div className="form-group"><label>Modèle</label><input value={equip.modelePac||""} onChange={e=>s("modelePac",e.target.value)}/></div><div className="form-group"><label>N° série</label><input value={equip.numSeriePac||""} onChange={e=>s("numSeriePac",e.target.value)}/></div><div className="form-group"><label>Puissance (kW)</label><input value={equip.puissancePac||""} onChange={e=>s("puissancePac",e.target.value)}/></div><div className="form-group"><label>COP</label><input value={equip.copPac||""} onChange={e=>s("copPac",e.target.value)}/></div><div className="form-group"><label>Année</label><input value={equip.anneePac||""} onChange={e=>s("anneePac",e.target.value)}/></div></>}
        {isChaud&&<><div className="form-group"><label>Marque</label><select value={equip.marque||""} onChange={e=>s("marque",e.target.value)}><option value="">—</option>{MARQUES_CHAUDIERE.map(m=><option key={m}>{m}</option>)}</select></div><div className="form-group"><label>Modèle</label><input value={equip.modele||""} onChange={e=>s("modele",e.target.value)}/></div><div className="form-group"><label>N° série</label><input value={equip.numSerie||""} onChange={e=>s("numSerie",e.target.value)}/></div><div className="form-group"><label>Puissance</label><input value={equip.puissance||""} onChange={e=>s("puissance",e.target.value)}/></div><div className="form-group"><label>Année</label><input value={equip.annee||""} onChange={e=>s("annee",e.target.value)}/></div><div className="form-group"><label>Conduit</label><input value={equip.conduit||""} onChange={e=>s("conduit",e.target.value)}/></div></>}
        {isFioul&&<><div className="form-group"><label>Marque brûleur</label><input value={equip.marqueBruleur||""} onChange={e=>s("marqueBruleur",e.target.value)}/></div><div className="form-group"><label>Modèle brûleur</label><input value={equip.modeleBruleur||""} onChange={e=>s("modeleBruleur",e.target.value)}/></div><div className="form-group"><label>Marque gicleur</label><select value={equip.marqueGicleur||"Steinen"} onChange={e=>s("marqueGicleur",e.target.value)}>{MARQUES_GICLEUR.map(m=><option key={m}>{m}</option>)}</select></div><div className="form-group"><label>Débit (gal/h)</label><input value={equip.debitGicleur||""} onChange={e=>s("debitGicleur",e.target.value)}/></div><div className="form-group"><label>Angle</label><select value={equip.angleGicleur||"60°"} onChange={e=>s("angleGicleur",e.target.value)}>{ANGLES_GICLEUR.map(a=><option key={a}>{a}</option>)}</select></div><div className="form-group"><label>Spectre</label><select value={equip.spectreGicleur||"S (solide)"} onChange={e=>s("spectreGicleur",e.target.value)}>{SPECTRES_GICLEUR.map(sp=><option key={sp}>{sp}</option>)}</select></div></>}
        <div style={{gridColumn:"1/-1",marginTop:6,fontSize:"0.75rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",borderTop:"1px solid var(--border)",paddingTop:12}}>📄 Contrat</div>
        <div className="form-group"><label>Type contrat</label><select value={equip.contrat||""} onChange={e=>s("contrat",e.target.value)}><option value="">Aucun</option><option>Contrat entretien</option><option>Contrat pièces et MO</option><option>Autre</option></select></div>
        {equip.contrat&&<><div className="form-group"><label>N° contrat</label><input value={equip.numContrat||""} onChange={e=>s("numContrat",e.target.value)}/></div><div className="form-group"><label>Échéance</label><input type="date" value={equip.echeanceContrat||""} onChange={e=>s("echeanceContrat",e.target.value)}/></div></>}
        <div className="form-group full"><label>Notes</label><textarea value={equip.notes||""} onChange={e=>s("notes",e.target.value)} style={{minHeight:44}}/></div>
      </div>
    </div>
  );
}

function ModalClient({client, onSave, onClose}) {
  const blank={nom:"",prenom:"",adresse:"",codePostal:"",ville:"",tel:"",email:"",type:"Particulier",equipements:[newEquip("Chaudière gaz")],notes:"",photos:[]};
  const [f,setF]=useState(client?{...client,equipements:client.equipements||[newEquip("Chaudière gaz")],photos:client.photos||[]}:blank);
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const addEquip=(type)=>setF(p=>({...p,equipements:[...p.equipements,newEquip(type)]}));
  const updateEquip=(i,e)=>setF(p=>{const eq=[...p.equipements];eq[i]=e;return{...p,equipements:eq};});
  const delEquip=(i)=>setF(p=>({...p,equipements:p.equipements.filter((_,j)=>j!==i)}));
  const photoInputRef=useRef(null);
  const handlePhoto=e=>{const files=Array.from(e.target.files);if((f.photos||[]).length+files.length>5){alert("Max 5 photos");return;}files.forEach(file=>{const r=new FileReader();r.onload=ev=>setF(p=>({...p,photos:[...(p.photos||[]),{url:ev.target.result,name:file.name,date:new Date().toISOString().slice(0,10)}]}));r.readAsDataURL(file);});};
  const delPhoto=i=>setF(p=>({...p,photos:p.photos.filter((_,j)=>j!==i)}));
  return (
    <div className="modal-overlay"><div className="modal modal-xl">
      <div className="modal-title">{client?"Modifier le client":"Nouveau client"}</div>
      <div className="form-grid">
        <div className="form-group"><label>Prénom</label><input value={f.prenom} onChange={e=>s("prenom",e.target.value)}/></div>
        <div className="form-group"><label>Nom *</label><input value={f.nom} onChange={e=>s("nom",e.target.value)}/></div>
        <div className="form-group full"><label>Adresse</label><input value={f.adresse} onChange={e=>s("adresse",e.target.value)}/></div>
        <div className="form-group"><label>Code postal</label><input value={f.codePostal||""} onChange={e=>s("codePostal",e.target.value)}/></div>
        <div className="form-group"><label>Ville</label><input value={f.ville||""} onChange={e=>s("ville",e.target.value)}/></div>
        <div className="form-group"><label>Téléphone</label><input value={f.tel} onChange={e=>s("tel",e.target.value)}/></div>
        <div className="form-group"><label>Email</label><input value={f.email} onChange={e=>s("email",e.target.value)}/></div>
        <div className="form-group"><label>Type</label><select value={f.type} onChange={e=>s("type",e.target.value)}><option>Particulier</option><option>Professionnel</option><option>Copropriété</option></select></div>
        <div className="form-group full"><label>Notes</label><textarea value={f.notes||""} onChange={e=>s("notes",e.target.value)} style={{minHeight:44}}/></div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0 10px"}}>
        <div style={{fontSize:"0.8rem",fontWeight:600,color:"var(--accent)"}}>📷 Photos ({(f.photos||[]).length}/5)</div>
        {(f.photos||[]).length<5&&<button className="btn btn-secondary btn-sm" onClick={()=>photoInputRef.current?.click()}>📷 Ajouter</button>}
      </div>
      <input ref={photoInputRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handlePhoto}/>
      {(f.photos||[]).length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}}>{f.photos.map((p,i)=><div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",aspectRatio:"1",border:"1px solid var(--border)"}}><img src={p.url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/><button onClick={()=>delPhoto(i)} style={{position:"absolute",top:4,right:4,width:22,height:22,borderRadius:"50%",background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",fontSize:"0.7rem"}}>✕</button></div>)}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"16px 0 12px"}}>
        <div style={{fontSize:"0.8rem",fontWeight:600,color:"var(--accent)"}}>Équipements ({f.equipements.length})</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{TYPES_EQUIP.map(t=><button key={t} className="btn btn-secondary btn-sm" onClick={()=>addEquip(t)}>{EQUIP_ICON(t)} +</button>)}</div>
      </div>
      {f.equipements.map((eq,i)=><EquipForm key={eq.id||i} equip={eq} index={i} onChange={e=>updateEquip(i,e)} onDelete={()=>delEquip(i)}/>)}
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={()=>onSave(f)} disabled={!f.nom}>Enregistrer</button>
      </div>
    </div></div>
  );
}

function ModalRdv({rdv, clients, onSave, onClose}) {
  const [f,setF]=useState(rdv||{clientId:"",date:todayStr(),heure:"08:00",type:"Entretien annuel",statut:"En attente",notes:""});
  const [clientSearch,setClientSearch]=useState(()=>{if(rdv?.clientId){const c=clients.find(x=>x.id===rdv.clientId);return c?`${c.prenom} ${c.nom}`:"";} return "";});
  const [showDrop,setShowDrop]=useState(false);
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const clientFiltered=clientSearch.length>0?clients.filter(c=>`${c.prenom} ${c.nom} ${c.ville||""} ${c.tel}`.toLowerCase().includes(clientSearch.toLowerCase())):clients.slice(0,8);
  const selectClient=c=>{s("clientId",c.id);setClientSearch(`${c.prenom} ${c.nom} — ${c.ville||""}`);setShowDrop(false);};
  return (
    <div className="modal-overlay"><div className="modal">
      <div className="modal-title">{rdv?"Modifier RDV":"Nouveau rendez-vous"}</div>
      <div className="form-grid">
        <div className="form-group full" style={{position:"relative"}}>
          <label>Client</label>
          <input value={clientSearch} onChange={e=>{setClientSearch(e.target.value);setShowDrop(true);s("clientId","");}} onFocus={()=>setShowDrop(true)} placeholder="🔍 Rechercher…"/>
          {showDrop&&clientFiltered.length>0&&<div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,zIndex:300,maxHeight:220,overflowY:"auto",boxShadow:"0 8px 24px #00000060",marginTop:4}}>
            {clientFiltered.map(c=><div key={c.id} onClick={()=>selectClient(c)} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)"}} onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><div style={{fontWeight:600,fontSize:"0.875rem"}}>{c.prenom} {c.nom}</div><div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{fullAddr(c)}</div></div>)}
          </div>}
          {f.clientId&&<div style={{fontSize:"0.75rem",color:"var(--success)",marginTop:4}}>✓ Sélectionné</div>}
        </div>
        <div className="form-group"><label>Date</label><input type="date" value={f.date} onChange={e=>s("date",e.target.value)}/></div>
        <div className="form-group"><label>Heure</label><input type="time" value={f.heure} onChange={e=>s("heure",e.target.value)}/></div>
        <div className="form-group"><label>Type</label><select value={f.type} onChange={e=>s("type",e.target.value)}><option>Entretien annuel</option><option>Dépannage</option><option>Installation</option><option>Diagnostic</option><option>Autre</option></select></div>
        <div className="form-group"><label>Statut</label><select value={f.statut} onChange={e=>s("statut",e.target.value)}><option>En attente</option><option>Confirmé</option><option>Réalisé</option><option>Annulé</option></select></div>
        <div className="form-group full"><label>Notes</label><textarea value={f.notes} onChange={e=>s("notes",e.target.value)}/></div>
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={()=>onSave(f)} disabled={!f.clientId||!f.date}>Enregistrer</button>
      </div>
    </div></div>
  );
}

function WizardAgenda({rdv, client, docs, catalogue, onSave, onClose}) {
  const [step,setStep]=useState(1);
  const [typeDoc,setTypeDoc]=useState(null);
  const [selectedEquipIdx,setSelectedEquipIdx]=useState(0);
  const [sigTech,setSigTech]=useState(null);
  const [sigClient,setSigClient]=useState(null);
  const numAuto=`${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`;
  const equips=client.equipements||[];
  const selEquip=equips[selectedEquipIdx]||{};
  const isSelClim=selEquip.type==="Climatisation";
  const [f,setF]=useState({clientId:client.id,numero:numAuto,date:rdv.date,tva:10,statut:"Émise",lignes:[],observations:"",piecesChangees:"",heureArrivee:"",heureDepart:"",typeIntervention:rdv.type,combustible:selEquip.type==="Chaudière fioul"?"Fioul":"Gaz",checks:{}});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const setCheck=(i,v)=>setF(p=>({...p,checks:{...p.checks,[i]:p.checks[i]===v?undefined:v}}));
  const checkList=typeDoc==="Attestation Clim"?CHECKS_CLIM:f.combustible==="Fioul"?CHECKS_FIOUL:CHECKS_GAZ;
  const isAtt=typeDoc?.startsWith("Attestation");
  const isClim=typeDoc==="Attestation Clim";
  const [docTab,setDocTab]=useState("facture");
  const [docLignes,setDocLignes]=useState([]);
  const [docObjet,setDocObjet]=useState("");
  const [showCatWizard,setShowCatWizard]=useState(false);
  const docHT=docLignes.reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const docTVAmt=docLignes.reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*Number(l.tva||10)/100,0);
  const docTTC=docHT+docTVAmt;
  const addDocLine=()=>setDocLignes(p=>[...p,{designation:"",qte:1,pu:0,tva:10,unite:"Forfait"}]);
  const addFromCatWizard=item=>setDocLignes(p=>[...p,{designation:item.designation,qte:1,pu:item.pu,tva:item.tva,unite:item.unite}]);
  const setDocLine=(i,k,v)=>setDocLignes(p=>{const l=[...p];l[i]={...l[i],[k]:v};return l;});
  const delDocLine=i=>setDocLignes(p=>p.filter((_,j)=>j!==i));
  const handleSave=()=>{
    const newDocs=[];
    newDocs.push({type:typeDoc==="Dépannage"?"Dépannage":"Bon d'intervention",typeIntervention:rdv.type,numero:`BI-${f.numero}`,date:f.date,clientId:client.id,rdvId:rdv.id,tva:f.tva,statut:"Émise",lignes:f.lignes,observations:f.observations,piecesChangees:f.piecesChangees,heureArrivee:f.heureArrivee,heureDepart:f.heureDepart,equip:selEquip,sigTech,sigClient});
    if(isAtt) newDocs.push({type:typeDoc,numero:`ATT-${f.numero}`,date:f.date,clientId:client.id,rdvId:rdv.id,statut:"Émise",combustible:f.combustible,equip:selEquip,checks:f.checks,observations:f.observations,sigTech,sigClient,combustion:{coAmbiant:f.coAmbiant,coFumees:f.coFumees,co2:f.co2,o2:f.o2,tempFumees:f.tempFumees,tempAir:f.tempAir,rendement:f.rendement,nox:f.nox,gicleur:f.gicleur,pressionPompe:f.pressionPompe,tempSoufflage:f.tempSoufflage,tempReprise:f.tempReprise,tempDepart:f.tempDepart,tempRetour:f.tempRetour,pression:f.pression},nonConformites:f.nonConformites||[]});
    if(docTab!=="aucun"&&docLignes.length>0) newDocs.push({type:docTab==="devis"?"Devis":"Facture",numero:`${docTab==="devis"?"DEV":"FAC"}-${f.numero}`,date:f.date,clientId:client.id,rdvId:rdv.id,objet:docObjet||f.typeIntervention,statut:docTab==="devis"?"En attente":"En attente de règlement",lignes:docLignes,dateEcheance:f.date,modePaiement:"Chèque, Virement, Espèces, Carte bancaire",acompte:0,sigTech,sigClient});
    onSave(newDocs);
  };
  return (
    <div className="modal-overlay"><div className="modal modal-xl" style={{maxWidth:820}}>
      <div className="no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div className="modal-title" style={{marginBottom:0}}>{step===1?"Démarrer":step===2?"Saisie":step===3?"Devis / Facture":"Signatures"}</div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
      </div>
      <div className="inter-header">
        <span style={{fontSize:"1.4rem"}}>👤</span>
        <div style={{flex:1}}>
          <div style={{fontWeight:700}}>{client.prenom} {client.nom}</div>
          <div style={{fontSize:"0.78rem",color:"var(--muted)"}}><AddrLink client={client} style={{fontSize:"0.78rem"}}/> · {client.tel}</div>
          <div style={{fontSize:"0.75rem",color:"var(--muted)",marginTop:2}}>📅 {fmt(rdv.date)} à {rdv.heure} · {rdv.type}</div>
        </div>
      </div>

      {step===1&&<>
        {equips.length>1&&<div style={{marginBottom:16}}>
          <div style={{fontSize:"0.8rem",fontWeight:600,color:"var(--muted)",marginBottom:8,textTransform:"uppercase"}}>Équipement concerné</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{equips.map((e,i)=><button key={i} className={`btn btn-sm ${selectedEquipIdx===i?"btn-primary":"btn-secondary"}`} onClick={()=>setSelectedEquipIdx(i)}>{EQUIP_ICON(e.type)} {e.type} {e.marque||e.marqueClim||""}</button>)}</div>
        </div>}
        <div className="action-grid">
          {[{id:"Entretien",icon:"🔧",title:"Bon d'intervention",desc:"Sans attestation"},...(!isSelClim?[{id:"Attestation Gaz",icon:"🔥",title:"Attestation Gaz",desc:"Chaudière gaz"},{id:"Attestation Fioul",icon:"🛢️",title:"Attestation Fioul",desc:"Chaudière fioul"}]:[]),...(isSelClim?[{id:"Attestation Clim",icon:"❄️",title:"Attestation Clim",desc:"Climatisation"}]:[]),{id:"Dépannage",icon:"⚠️",title:"Dépannage",desc:"Avec facturation"}].map(t=>(
            <div key={t.id} className="action-card" onClick={()=>{setTypeDoc(t.id);setStep(2);}}>
              <div className="ac-icon">{t.icon}</div><div className="ac-title">{t.title}</div><div className="ac-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </>}

      {step===2&&<>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setStep(1)}>← Retour</button>
          <span className="badge badge-accent">{typeDoc}</span>
        </div>
        <div className="wizard-step">
          <div className="wizard-step-title"><div className="wizard-step-num">1</div>Infos générales</div>
          <div className="form-grid">
            <div className="form-group"><label>N° document</label><input value={f.numero} onChange={e=>s("numero",e.target.value)}/></div>
            <div className="form-group"><label>Date</label><input type="date" value={f.date} onChange={e=>s("date",e.target.value)}/></div>
            <div className="form-group"><label>Heure arrivée</label><input type="time" value={f.heureArrivee} onChange={e=>s("heureArrivee",e.target.value)}/></div>
            <div className="form-group"><label>Heure départ</label><input type="time" value={f.heureDepart} onChange={e=>s("heureDepart",e.target.value)}/></div>
          </div>
        </div>
        {isAtt&&!isClim&&<div className="wizard-step">
          <div className="wizard-step-title"><div className="wizard-step-num">2</div>Combustible</div>
          <div className="form-grid"><div className="form-group"><label>Combustible</label><select value={f.combustible} onChange={e=>s("combustible",e.target.value)}><option>Gaz</option><option>Fioul</option></select></div></div>
        </div>}
        {isAtt&&<div className="wizard-step">
          <div className="wizard-step-title"><div className="wizard-step-num">{isClim?"2":"3"}</div>Mesures combustion</div>
          <div className="form-grid">
            <div className="form-group"><label>CO ambiant (ppm)</label><input type="number" value={f.coAmbiant||""} onChange={e=>s("coAmbiant",e.target.value)}/></div>
            <div className="form-group"><label>CO fumées (ppm)</label><input type="number" value={f.coFumees||""} onChange={e=>s("coFumees",e.target.value)}/></div>
            <div className="form-group"><label>CO₂ (%)</label><input type="number" step="0.1" value={f.co2||""} onChange={e=>s("co2",e.target.value)}/></div>
            <div className="form-group"><label>O₂ (%)</label><input type="number" step="0.1" value={f.o2||""} onChange={e=>s("o2",e.target.value)}/></div>
            <div className="form-group"><label>Temp. fumées (°C)</label><input type="number" value={f.tempFumees||""} onChange={e=>s("tempFumees",e.target.value)}/></div>
            <div className="form-group"><label>Rendement (%)</label><input type="number" step="0.1" value={f.rendement||""} onChange={e=>s("rendement",e.target.value)}/></div>
          </div>
        </div>}
        {isAtt&&<div className="wizard-step">
          <div className="wizard-step-title"><div className="wizard-step-num">{isClim?"3":"4"}</div>Points de vérification</div>
          <div className="checks-grid">
            {checkList.map((c,i)=>(
              <div key={i} className="check-item" style={{background:f.checks[i]==="nok"?"#ef444410":""}}>
                <span className="check-label">{c}</span>
                <div className="check-btns">
                  <div className={`check-btn${f.checks[i]==="ok"?" ok":""}`} onClick={()=>setCheck(i,"ok")}>✓</div>
                  <div className={`check-btn${f.checks[i]==="nok"?" nok":""}`} onClick={()=>setCheck(i,"nok")}>✗</div>
                  <div className={`check-btn${f.checks[i]==="na"?" na":""}`} onClick={()=>setCheck(i,"na")}>—</div>
                </div>
              </div>
            ))}
          </div>
        </div>}
        <div className="wizard-step">
          <div className="wizard-step-title"><div className="wizard-step-num">{isAtt?(isClim?"4":"5"):"2"}</div>Travaux & Observations</div>
          <div className="form-grid">
            <div className="form-group full"><label>Travaux réalisés</label><textarea value={f.observations} onChange={e=>s("observations",e.target.value)}/></div>
            <div className="form-group full"><label>Pièces changées</label><textarea value={f.piecesChangees} onChange={e=>s("piecesChangees",e.target.value)} style={{minHeight:48}}/></div>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-lg" onClick={()=>setStep(3)}>Devis / Facture →</button>
        </div>
      </>}

      {step===3&&<>
        <div style={{display:"flex",gap:8,marginBottom:16}}><button className="btn btn-ghost btn-sm" onClick={()=>setStep(2)}>← Retour</button></div>
        <div style={{display:"flex",gap:8,marginBottom:16,background:"var(--surface2)",borderRadius:10,padding:4}}>
          {[["facture","🧾 Facture"],["devis","📋 Devis"],["aucun","⏭ Passer"]].map(item=>(
            <button key={item[0]} onClick={()=>setDocTab(item[0])} className={`btn${docTab===item[0]?" btn-primary":" btn-ghost"}`} style={{flex:1,justifyContent:"center"}}>{item[1]}</button>
          ))}
        </div>
        {docTab!=="aucun"&&<>
          <div className="form-group" style={{marginBottom:14}}><label>Objet</label><input value={docObjet} onChange={e=>setDocObjet(e.target.value)} placeholder="Ex: Entretien annuel chaudière"/></div>
          <button className="btn btn-secondary btn-sm" onClick={()=>setShowCatWizard(p=>!p)} style={{marginBottom:10}}>📚 {showCatWizard?"Masquer":"Bibliothèque"}</button>
          {showCatWizard&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:6,maxHeight:160,overflowY:"auto",marginBottom:10}}>
            {catalogue.map(item=><div key={item.id} onClick={()=>addFromCatWizard(item)} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}><div style={{fontWeight:600,fontSize:"0.8rem"}}>{item.designation}</div><div style={{fontSize:"0.72rem",color:"var(--muted)"}}>{money(item.pu)} · TVA {item.tva}%</div></div>)}
          </div>}
          {docLignes.length>0&&<div style={{background:"var(--surface2)",borderRadius:10,padding:10,marginBottom:10}}>
            {docLignes.map((l,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"2.5fr 0.5fr 0.8fr 0.8fr auto",gap:6,marginBottom:6,alignItems:"center",background:"var(--surface)",borderRadius:8,padding:"7px 10px"}}>
                <input value={l.designation||""} onChange={e=>setDocLine(i,"designation",e.target.value)} placeholder="Désignation"/>
                <input type="number" value={l.qte||1} onChange={e=>setDocLine(i,"qte",e.target.value)} min={0}/>
                <input type="number" value={l.pu||0} onChange={e=>setDocLine(i,"pu",e.target.value)} min={0}/>
                <select value={l.tva||10} onChange={e=>setDocLine(i,"tva",Number(e.target.value))}><option value={0}>0%</option><option value={5.5}>5.5%</option><option value={10}>10%</option><option value={20}>20%</option></select>
                <button className="btn btn-danger btn-sm" onClick={()=>delDocLine(i)}>✕</button>
              </div>
            ))}
          </div>}
          <button className="btn btn-secondary btn-sm" onClick={addDocLine} style={{marginBottom:14}}>+ Ligne manuelle</button>
          {docLignes.length>0&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><div style={{background:"var(--surface2)",borderRadius:10,padding:"10px 16px",minWidth:220,textAlign:"right"}}><div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:3}}>HT : {money(docHT)} · TVA : {money(docTVAmt)}</div><div style={{fontSize:"1rem",fontWeight:700,color:"var(--accent)"}}>TTC : {money(docTTC)}</div></div></div>}
        </>}
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-lg" onClick={()=>setStep(4)}>Signatures →</button>
        </div>
      </>}

      {step===4&&<>
        <div style={{display:"flex",gap:8,marginBottom:18}}><button className="btn btn-ghost btn-sm" onClick={()=>setStep(3)}>← Retour</button></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:20}}>
          <div className="card"><div className="card-title">✍️ Technicien</div><SignaturePad label="Signez ici" onSave={setSigTech} existingSig={sigTech}/></div>
          <div className="card" style={{borderColor:"#3b82f640"}}><div className="card-title" style={{color:"#60a5fa"}}>✍️ Client</div><SignaturePad label="Signez ici" onSave={setSigClient} existingSig={sigClient}/></div>
        </div>
        <div className="form-actions" style={{marginTop:18}}>
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={!sigTech||!sigClient}>✓ Valider</button>
        </div>
        {(!sigTech||!sigClient)&&<div style={{textAlign:"center",fontSize:"0.78rem",color:"var(--muted)",marginTop:8}}>Les deux signatures sont requises</div>}
      </>}
    </div></div>
  );
}

function PageDashboard({clients,rdvs,docs}) {
  const auj=todayStr();
  const rdvAuj=rdvs.filter(r=>r.date===auj).length;
  const rdvAV=rdvs.filter(r=>r.date>=auj).length;
  const caM=docs.filter(d=>d.statut==="Payée"&&d.date?.slice(0,7)===auj.slice(0,7)).reduce((s,d)=>{const ht=(d.lignes||[]).reduce((a,l)=>a+l.qte*l.pu,0);return s+ht*(1+(d.tva||10)/100);},0);
  const imp=docs.filter(d=>["Bon d'intervention","Dépannage"].includes(d.type)&&d.statut!=="Payée"&&d.statut!=="Annulée").length;
  return (
    <div className="content">
      <div className="stats-grid">
        <div className="stat"><div className="stat-label">Clients</div><div className="stat-value" style={{color:"#60a5fa"}}>{clients.length}</div></div>
        <div className="stat"><div className="stat-label">RDV aujourd'hui</div><div className="stat-value" style={{color:"var(--success)"}}>{rdvAuj}</div><div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{rdvAV} à venir</div></div>
        <div className="stat"><div className="stat-label">CA ce mois</div><div className="stat-value">{money(caM)}</div></div>
        <div className="stat"><div className="stat-label">À facturer</div><div className="stat-value" style={{color:imp>0?"var(--warning)":"var(--success)"}}>{imp}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card"><div className="card-title">📅 RDV à venir</div>{rdvs.filter(r=>r.date>=auj).slice(0,5).map(r=>{const c=clients.find(x=>x.id===r.clientId);return(<div key={r.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}><div><div style={{fontWeight:600,fontSize:"0.875rem"}}>{c?.prenom} {c?.nom}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{r.type} · {fmt(r.date)} {r.heure}</div></div><span className={`badge badge-${r.statut==="Confirmé"?"success":r.statut==="Réalisé"?"info":"warning"}`}>{r.statut}</span></div>);})}</div>
        <div className="card"><div className="card-title">📄 Derniers documents</div>{docs.length===0&&<div style={{color:"var(--muted)",fontSize:"0.85rem"}}>Aucun document</div>}{docs.slice(-5).reverse().map(d=>{const c=clients.find(x=>x.id===d.clientId);return(<div key={d.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}><div><div style={{fontWeight:600,fontSize:"0.875rem"}}>{d.type} · {d.numero}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{c?.prenom} {c?.nom} · {fmt(d.date)}</div></div><span className="badge badge-success">{d.statut}</span></div>);})}</div>
      </div>
    </div>
  );
}

function PageAgenda({rdvs, setRdvs, clients, docs, setDocs, catalogue}) {
  const [viewMode,setViewMode]=useState("jour");
  const [year,setYear]=useState(TODAY.getFullYear());
  const [month,setMonth]=useState(TODAY.getMonth());
  const [weekDate,setWeekDate]=useState(new Date(TODAY));
  const [dayDate,setDayDate]=useState(new Date(TODAY));
  const [selected,setSelected]=useState(todayStr());
  const [modalRdv,setModalRdv]=useState(null);
  const [wizard,setWizard]=useState(null);
  const [preview,setPreview]=useState(null);
  const days=getDays(year,month);
  const weekDays=getWeekDays(weekDate);
  const todStr=todayStr();
  const prevMonth=()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);};
  const nextMonth=()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);};
  const prevWeek=()=>{const d=new Date(weekDate);d.setDate(d.getDate()-7);setWeekDate(d);};
  const nextWeek=()=>{const d=new Date(weekDate);d.setDate(d.getDate()+7);setWeekDate(d);};
  const prevDay=()=>{const d=new Date(dayDate);d.setDate(d.getDate()-1);setDayDate(d);setSelected(ds(d));};
  const nextDay=()=>{const d=new Date(dayDate);d.setDate(d.getDate()+1);setDayDate(d);setSelected(ds(d));};
  const goToday=()=>{setDayDate(new Date(TODAY));setSelected(todayStr());};
  const rdvsDay=d=>rdvs.filter(r=>r.date===ds(d));
  const selRdvs=selected?rdvs.filter(r=>r.date===selected):[];
  const saveRdv=f=>{if(modalRdv.mode==="new")setRdvs(p=>[...p,{...f,id:newId(p)}]);else setRdvs(p=>p.map(r=>r.id===modalRdv.rdv.id?{...f,id:r.id}:r));setModalRdv(null);};
  const delRdv=id=>{if(confirm("Supprimer ?"))setRdvs(p=>p.filter(r=>r.id!==id));};
  const openWizard=rdv=>{const c=clients.find(x=>x.id===rdv.clientId);if(c)setWizard({rdv,client:c});};
  const saveIntervention=newDocs=>{const rdvId=wizard?.rdv?.id;setDocs(p=>{let base=[...p];newDocs.forEach(d=>{base=[...base,{...d,rdvId,id:newId(base)}];});return base;});if(rdvId)setRdvs(p=>p.map(r=>r.id===rdvId?{...r,statut:"Réalisé"}:r));setWizard(null);};
  const openPreview=doc=>{const c=clients.find(x=>x.id===doc.clientId);setPreview({doc,client:c});};
  const isAtt=t=>t?.startsWith("Attestation");
  const heureToPx=h=>{const [hh,mm]=h.split(":").map(Number);return((hh-7)*60+mm)/60*52;};
  const weekLabel=()=>{const first=weekDays[0],last=weekDays[6];return `${first.getDate()} – ${last.getDate()} ${MOIS[last.getMonth()]} ${last.getFullYear()}`;};
  return (
    <div className="content">
      {modalRdv&&<ModalRdv rdv={modalRdv.rdv} clients={clients} onSave={saveRdv} onClose={()=>setModalRdv(null)}/>}
      {wizard&&<WizardAgenda rdv={wizard.rdv} client={wizard.client} docs={docs} catalogue={catalogue} onSave={saveIntervention} onClose={()=>setWizard(null)}/>}
      {preview&&isAtt(preview.doc.type)&&<DocAttestation doc={preview.doc} client={preview.client} societe={INIT_SOCIETE} onClose={()=>setPreview(null)}/>}
      {preview&&!isAtt(preview.doc.type)&&<DocBon doc={preview.doc} client={preview.client} societe={INIT_SOCIETE} onClose={()=>setPreview(null)}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
          <div className="agenda-view-toggle">
            <button className={`agenda-view-btn${viewMode==="jour"?" active":""}`} onClick={()=>setViewMode("jour")}>📋 Jour</button>
            <button className={`agenda-view-btn${viewMode==="mois"?" active":""}`} onClick={()=>setViewMode("mois")}>📅 Mois</button>
            <button className={`agenda-view-btn${viewMode==="semaine"?" active":""}`} onClick={()=>setViewMode("semaine")}>📆 Semaine</button>
          </div>
          {viewMode==="jour"&&<div style={{display:"flex",alignItems:"center",gap:8}}>
            <button className="btn btn-ghost btn-sm" onClick={prevDay}>‹</button>
            <span style={{fontFamily:"var(--font-head)",fontWeight:600,minWidth:200,textAlign:"center",fontSize:"0.95rem"}}>{JOURS_FULL[(dayDate.getDay()+6)%7]} {dayDate.getDate()} {MOIS[dayDate.getMonth()]} {dayDate.getFullYear()}</span>
            <button className="btn btn-ghost btn-sm" onClick={nextDay}>›</button>
            {ds(dayDate)!==todStr&&<button className="btn btn-ghost btn-sm" onClick={goToday}>Aujourd'hui</button>}
          </div>}
          {viewMode==="mois"&&<div style={{display:"flex",alignItems:"center",gap:8}}>
            <button className="btn btn-ghost btn-sm" onClick={prevMonth}>‹</button>
            <span style={{fontFamily:"var(--font-head)",fontWeight:600,minWidth:160,textAlign:"center"}}>{MOIS[month]} {year}</span>
            <button className="btn btn-ghost btn-sm" onClick={nextMonth}>›</button>
          </div>}
          {viewMode==="semaine"&&<div style={{display:"flex",alignItems:"center",gap:8}}>
            <button className="btn btn-ghost btn-sm" onClick={prevWeek}>‹</button>
            <span style={{fontFamily:"var(--font-head)",fontWeight:600,minWidth:200,textAlign:"center",fontSize:"0.9rem"}}>{weekLabel()}</span>
            <button className="btn btn-ghost btn-sm" onClick={nextWeek}>›</button>
          </div>}
        </div>
        <button className="btn btn-primary" onClick={()=>setModalRdv({mode:"new"})}>+ Nouveau RDV</button>
      </div>

      {viewMode==="jour"&&(()=>{
        const dayStr=ds(dayDate);
        const dayRdvs=rdvs.filter(r=>r.date===dayStr).sort((a,b)=>a.heure?.localeCompare(b.heure));
        const isToday=dayStr===todStr;
        const now=new Date();
        const nowPx=isToday?((now.getHours()-7)*60+now.getMinutes())/60*64:null;
        return (
          <div>
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"14px",padding:"12px 18px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div><span style={{fontWeight:700,fontSize:"1rem"}}>{dayRdvs.length} RDV</span><span style={{color:"var(--muted)",fontSize:"0.85rem",marginLeft:10}}>{dayRdvs.filter(r=>r.statut==="Réalisé").length} réalisé(s)</span></div>
              {isToday&&<span className="badge badge-accent">Aujourd'hui</span>}
            </div>
            <div style={{position:"relative",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"14px",overflow:"hidden"}}>
              {HOURS.map((h,hi)=>(
                <div key={h} style={{display:"flex",borderBottom:"1px solid var(--border)",minHeight:64,position:"relative"}}>
                  <div style={{width:52,flexShrink:0,padding:"4px 8px",fontSize:"0.7rem",color:"var(--muted)",fontWeight:600,borderRight:"1px solid var(--border)",background:"var(--surface2)",paddingTop:6}}>{h}</div>
                  <div style={{flex:1,position:"relative",minHeight:64}}>
                    {dayRdvs.filter(r=>{const rh=r.heure?.split(":")[0];return rh===String(hi+7).padStart(2,"0");}).map(r=>{
                      const c=clients.find(x=>x.id===r.clientId);
                      const rdvDocs=docs.filter(d=>d.rdvId===r.id);
                      const isRealise=r.statut==="Réalisé";
                      const isConfirme=r.statut==="Confirmé";
                      return (
                        <div key={r.id} style={{margin:"4px 8px",background:isRealise?"#22c55e15":isConfirme?"#f9731615":"#f59e0b15",border:`1px solid ${isRealise?"var(--success)":isConfirme?"var(--accent)":"var(--warning)"}`,borderLeft:`4px solid ${isRealise?"var(--success)":isConfirme?"var(--accent)":"var(--warning)"}`,borderRadius:8,padding:"8px 12px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
                            <div style={{flex:1}}>
                              <div style={{fontWeight:700,fontSize:"0.95rem"}}>⏰ {r.heure} — {c?.prenom} {c?.nom}</div>
                              <div style={{fontSize:"0.82rem",color:"var(--muted)",marginTop:3}}>{r.type}</div>
                              <div style={{fontSize:"0.8rem",marginTop:3}}><AddrLink client={c} style={{fontSize:"0.8rem"}}/></div>
                              {c?.tel&&<div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:2}}>📞 <a href={`tel:${c.tel.replace(/\s/g,"")}`} style={{color:"var(--info)",textDecoration:"none"}}>{c.tel}</a></div>}
                              {rdvDocs.length>0&&<div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>{rdvDocs.map(d=><button key={d.id} className="btn btn-success btn-sm" onClick={()=>openPreview(d)}>👁 {d.type}</button>)}</div>}
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0,alignItems:"flex-end"}}>
                              <span className={`badge badge-${isRealise?"success":isConfirme?"accent":"warning"}`}>{r.statut}</span>
                              {!isRealise&&r.statut!=="Annulé"&&<button className="btn btn-primary btn-sm" onClick={()=>openWizard(r)}>▶ Démarrer</button>}
                              <div style={{display:"flex",gap:5}}>
                                <button className="btn btn-secondary btn-sm" onClick={()=>setModalRdv({mode:"edit",rdv:r})}>✏️</button>
                                <button className="btn btn-danger btn-sm" onClick={()=>delRdv(r.id)}>🗑️</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {nowPx!==null&&nowPx>0&&nowPx<14*64&&<div style={{position:"absolute",left:52,right:0,top:nowPx,height:2,background:"var(--danger)",zIndex:10,pointerEvents:"none"}}><div style={{position:"absolute",left:-6,top:-4,width:10,height:10,borderRadius:"50%",background:"var(--danger)"}}/></div>}
            </div>
            {dayRdvs.length===0&&<div className="empty" style={{marginTop:14}}><div className="icon">📅</div><p>Aucun RDV ce jour</p></div>}
          </div>
        );
      })()}

      {viewMode==="mois"&&<>
        <div className="cal-header">{JOURS_FULL.map(j=><span key={j}>{j}</span>)}</div>
        <div className="cal-grid">
          {days.map((d,i)=>{const dStr=ds(d.date),isT=dStr===todStr,isSel=dStr===selected;return(<div key={i} className={`cal-day${!d.cur?" other-month":""}${isT?" today":""}${isSel?" selected":""}`} onClick={()=>setSelected(dStr)}><div className={`cal-day-num${isT?" today-c":""}`}>{d.date.getDate()}</div>{rdvsDay(d.date).map(r=>{const c=clients.find(x=>x.id===r.clientId);return <div key={r.id} className="cal-chip">{r.heure} {c?.nom}</div>;})}</div>);})}
        </div>
      </>}

      {viewMode==="semaine"&&<div style={{overflowX:"auto"}}>
        <div className="week-grid">
          <div className="week-header" style={{background:"var(--surface2)",borderRight:"1px solid var(--border)"}}></div>
          {weekDays.map((d,i)=>{const dStr=ds(d),isT=dStr===todStr;return(<div key={i} className="week-header"><div className="week-header-day">{JOURS_FULL[i]}</div><div className={`week-header-date${isT?" today-c":""}`}>{d.getDate()}</div></div>);})}
          <div className="week-time-col">{HOURS.map(h=><div key={h} className="week-time-slot">{h}</div>)}</div>
          {weekDays.map((d,di)=>{const dStr=ds(d);const dayRdvs=rdvs.filter(r=>r.date===dStr);return(<div key={di} className="week-day-col" onClick={()=>setSelected(dStr)}>{HOURS.map(h=><div key={h} className="week-slot"/>)}{dayRdvs.map(r=>{const c=clients.find(x=>x.id===r.clientId);const top=heureToPx(r.heure);return(<div key={r.id} className="week-event" style={{top:top+1}} onClick={e=>{e.stopPropagation();setSelected(dStr);}}><div style={{fontWeight:700}}>{r.heure}</div><div>{c?.nom}</div></div>);})}</div>);})}
        </div>
      </div>}

      {selected&&viewMode!=="jour"&&<div className="rdv-panel">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontFamily:"var(--font-head)",fontWeight:600,fontSize:"1rem"}}>📅 {fmt(selected)}</div>
          <button className="btn btn-secondary btn-sm" onClick={()=>setModalRdv({mode:"new"})}>+ RDV</button>
        </div>
        {selRdvs.length===0&&<div style={{color:"var(--muted)",fontSize:"0.85rem"}}>Aucun RDV ce jour</div>}
        {selRdvs.map(r=>{
          const c=clients.find(x=>x.id===r.clientId);
          const rdvDocs=docs.filter(d=>d.rdvId===r.id||(d.clientId===r.clientId&&!d.rdvId&&d.date===r.date));
          return(<div key={r.id} className="rdv-row">
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:"0.9rem"}}>⏰ {r.heure} — {c?.prenom} {c?.nom}</div>
              <div style={{fontSize:"0.78rem",color:"var(--muted)",marginTop:2}}>{r.type} · <AddrLink client={c} style={{fontSize:"0.78rem"}}/></div>
              {rdvDocs.length>0&&<div style={{marginTop:7,display:"flex",gap:6,flexWrap:"wrap"}}>{rdvDocs.map(d=><button key={d.id} className="btn btn-success btn-sm" onClick={e=>{e.stopPropagation();openPreview(d);}}>👁 {d.type}</button>)}</div>}
            </div>
            <div style={{display:"flex",gap:7,flexShrink:0,alignItems:"center",flexWrap:"wrap"}}>
              <span className={`badge badge-${r.statut==="Confirmé"?"success":r.statut==="Réalisé"?"info":r.statut==="Annulé"?"danger":"warning"}`}>{r.statut}</span>
              {r.statut!=="Réalisé"&&r.statut!=="Annulé"&&<button className="btn btn-primary btn-sm" onClick={e=>{e.stopPropagation();openWizard(r);}}>▶ Démarrer</button>}
              <button className="btn btn-secondary btn-sm" onClick={e=>{e.stopPropagation();setModalRdv({mode:"edit",rdv:r});}}>✏️</button>
              <button className="btn btn-danger btn-sm" onClick={e=>{e.stopPropagation();delRdv(r.id);}}>🗑️</button>
            </div>
          </div>);
        })}
      </div>}
    </div>
  );
}

function PageClients({clients, setClients, docs, setDocs, rdvs, societe}) {
  const [search,setSearch]=useState("");
  const [filterEquip,setFilterEquip]=useState("Tous");
  const [modal,setModal]=useState(null);
  const [detail,setDetail]=useState(null);
  const [preview,setPreview]=useState(null);
  const equipFilters=["Tous","Chaudière gaz","Chaudière fioul","Climatisation","Pompe à chaleur"];
  const filtered=clients.filter(c=>{
    const txt=`${c.prenom} ${c.nom} ${c.tel} ${fullAddr(c)} ${(c.equipements||[]).map(e=>`${e.marque||""} ${e.marqueClim||""} ${e.type}`).join(" ")}`.toLowerCase();
    const matchSearch=txt.includes(search.toLowerCase());
    const matchFilter=filterEquip==="Tous"||(c.equipements||[]).some(e=>e.type===filterEquip);
    return matchSearch&&matchFilter;
  });
  const saveClient=f=>{if(modal?.mode==="new")setClients(p=>[...p,{...f,id:newId(p)}]);else setClients(p=>p.map(c=>c.id===modal.client.id?{...f,id:c.id}:c));setModal(null);};
  const delClient=id=>{if(confirm("Supprimer ?"))setClients(p=>p.filter(c=>c.id!==id));if(detail?.id===id)setDetail(null);};
  const isAtt=t=>t?.startsWith("Attestation");
  const openPreview=doc=>{const c=clients.find(x=>x.id===doc.clientId);setPreview({doc,client:c});};

  if(preview) {
    const {doc,client}=preview;
    return isAtt(doc.type)
      ? <DocAttestation doc={doc} client={client} societe={societe} onClose={()=>setPreview(null)}/>
      : <DocBon doc={doc} client={client} societe={societe} onClose={()=>setPreview(null)}/>;
  }

  if(detail) {
    const clientDocs=docs.filter(d=>d.clientId===detail.id);
    const clientRdvs=rdvs.filter(r=>r.clientId===detail.id);
    const equips=detail.equipements||[];
    return (
      <div className="content">
        {modal&&<ModalClient client={modal.client} onSave={saveClient} onClose={()=>setModal(null)}/>}
        {preview&&isAtt(preview.doc.type)&&<DocAttestation doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)}/>}
        {preview&&!isAtt(preview.doc.type)&&<DocBon doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)}/>}
        <button className="btn btn-ghost btn-sm" style={{marginBottom:14}} onClick={()=>setDetail(null)}>← Retour</button>
        <div className="client-detail-header">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontFamily:"var(--font-head)",fontSize:"1.7rem",fontWeight:900}}>{detail.prenom} {detail.nom}</div>
              <div style={{fontSize:"0.83rem",color:"var(--muted)",marginTop:6}}><AddrLink client={detail}/><br/>📞 {detail.tel} · ✉️ {detail.email}</div>
              {detail.notes&&<div style={{fontSize:"0.78rem",color:"var(--muted)",marginTop:3}}>📝 {detail.notes}</div>}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-secondary btn-sm" onClick={()=>setModal({mode:"edit",client:detail})}>✏️ Modifier</button>
              <button className="btn btn-danger btn-sm" onClick={()=>delClient(detail.id)}>🗑️</button>
            </div>
          </div>
          <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:"0.75rem",fontWeight:600,color:"var(--muted)",textTransform:"uppercase",marginBottom:10}}>Équipements ({equips.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
              {equips.map((e,i)=>(
                <div key={i} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:9,padding:"12px 14px"}}>
                  <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:8,color:"var(--accent)"}}>{EQUIP_ICON(e.type)} {e.type}</div>
                  {e.type==="Climatisation"&&<><div style={{fontSize:"0.78rem"}}>{e.marqueClim} — {e.typeClim}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{e.modele} · {e.puissanceClim} · {e.anneeClim}</div></>}
                  {(e.type==="Chaudière gaz"||e.type==="Chauffe-eau gaz"||e.type==="Chaudière fioul")&&<><div style={{fontSize:"0.78rem"}}>{e.marque} {e.modele}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{e.puissance} · {e.annee} · {e.conduit}</div>{e.numSerie&&<div style={{fontSize:"0.75rem",color:"var(--muted)"}}>N° {e.numSerie}</div>}{e.contrat&&<div style={{fontSize:"0.75rem",marginTop:4}}><span className="badge badge-info" style={{fontSize:"0.65rem"}}>{e.contrat}</span></div>}</>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-title">📜 Historique</div>
          {clientRdvs.length===0&&clientDocs.length===0&&<div className="empty"><div className="icon">📜</div><p>Aucun historique</p></div>}
          {[...clientRdvs.map(r=>({date:r.date,kind:"rdv",data:r})),...clientDocs.map(d=>({date:d.date,kind:"doc",data:d}))].sort((a,b)=>b.date?.localeCompare(a.date)).map((item,i)=>{
            if(item.kind==="rdv"){const r=item.data;const rdvDocs=clientDocs.filter(d=>d.rdvId===r.id);return(<div key={r.id} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:700}}>📅 {fmt(r.date)} {r.heure&&`à ${r.heure}`}</div><div style={{fontSize:"0.85rem",color:"var(--muted)"}}>{r.type}</div></div><span className={`badge badge-${r.statut==="Réalisé"?"success":r.statut==="Confirmé"?"info":"warning"}`}>{r.statut}</span></div>{rdvDocs.length>0&&<div style={{marginTop:8,display:"flex",gap:7,flexWrap:"wrap"}}>{rdvDocs.map(d=><button key={d.id} className="btn btn-secondary btn-sm" onClick={()=>openPreview(d)}>👁 {d.type} {d.numero}</button>)}</div>}</div>);}
            const d=item.data;const ht=(d.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);const ttc=ht*(1+(d.tva||10)/100);
            return(<div key={d.id} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:700}}>📄 {fmt(d.date)} — {d.type} {d.numero}</div>{d.objet&&<div style={{fontSize:"0.85rem",color:"var(--muted)"}}>{d.objet}</div>}</div><div style={{display:"flex",gap:8,alignItems:"center"}}>{ttc>0&&<span style={{fontWeight:700,color:"var(--accent)"}}>{money(ttc)}</span>}<button className="btn btn-secondary btn-sm" onClick={()=>openPreview(d)}>👁</button></div></div></div>);
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      {modal&&<ModalClient client={modal.client} onSave={saveClient} onClose={()=>setModal(null)}/>}
      <div className="search-row">
        <input placeholder="🔍 Nom, adresse, téléphone…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <button className="btn btn-primary" onClick={()=>setModal({mode:"new"})}>+ Nouveau client</button>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {equipFilters.map(f=>(<button key={f} className={`btn btn-sm ${filterEquip===f?"btn-primary":"btn-ghost"}`} onClick={()=>setFilterEquip(f)}>{f}</button>))}
        <span style={{marginLeft:"auto",fontSize:"0.78rem",color:"var(--muted)",display:"flex",alignItems:"center"}}>{filtered.length} client(s)</span>
      </div>
      <div className="client-list">
        {filtered.length===0&&<div className="empty"><div className="icon">👥</div><p>Aucun client</p></div>}
        {filtered.map(c=>{
          const equips=c.equipements||[];
          return(<div key={c.id} className="client-card" onClick={()=>setDetail(c)}>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:"0.95rem"}}>{c.prenom} {c.nom} <span className="badge badge-neutral" style={{marginLeft:6,fontSize:"0.68rem"}}>{c.type}</span></div>
              <div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:3}}><AddrLink client={c}/> · 📞 {c.tel}</div>
              <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>{equips.map((e,i)=><span key={i} className="badge badge-accent" style={{fontSize:"0.65rem"}}>{EQUIP_ICON(e.type)} {e.marque||e.marqueClim||e.type}</span>)}</div>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0}} onClick={e=>e.stopPropagation()}>
              <button className="btn btn-secondary btn-sm" onClick={()=>setModal({mode:"edit",client:c})}>✏️</button>
              <button className="btn btn-danger btn-sm" onClick={()=>delClient(c.id)}>🗑️</button>
            </div>
          </div>);
        })}
      </div>
    </div>
  );
}

function PageDocuments({docs, setDocs, clients, societe}) {
  const [tab,setTab]=useState("Tous");
  const [preview,setPreview]=useState(null);
  const tabs=["Tous","Bon d'intervention","Dépannage","Attestation Gaz","Attestation Fioul","Attestation Clim"];
  const filtered=tab==="Tous"?docs:docs.filter(d=>d.type===tab);
  const del=id=>{if(confirm("Supprimer ?"))setDocs(p=>p.filter(d=>d.id!==id));};
  const open=doc=>{const c=clients.find(x=>x.id===doc.clientId);setPreview({doc,client:c});};
  const isAtt=t=>t?.startsWith("Attestation");
  return (
    <div className="content">
      {preview&&isAtt(preview.doc.type)&&<DocAttestation doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)}/>}
      {preview&&!isAtt(preview.doc.type)&&<DocBon doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)}/>}
      <div className="tabs">{tabs.map(t=><div key={t} className={`tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t}</div>)}</div>
      <div className="card"><div className="table-wrap"><table>
        <thead><tr><th>N°</th><th>Type</th><th>Client</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.length===0&&<tr><td colSpan={6}><div className="empty"><div className="icon">📄</div><p>Aucun document</p></div></td></tr>}
          {filtered.map(d=>{const c=clients.find(x=>x.id===d.clientId);return(<tr key={d.id}><td style={{fontWeight:600,color:"var(--accent)"}}>{d.numero}</td><td><span className="badge badge-info">{d.type}</span></td><td>{c?.prenom} {c?.nom}</td><td>{fmt(d.date)}</td><td><span className="badge badge-success">{d.statut}</span></td><td><div style={{display:"flex",gap:6}}><button className="btn btn-secondary btn-sm" onClick={()=>open(d)}>👁 Voir</button><button className="btn btn-danger btn-sm" onClick={()=>del(d.id)}>🗑️</button></div></td></tr>);})}
        </tbody>
      </table></div></div>
    </div>
  );
}

function ModalDevisFacture({type, doc, clients, docs, devis, catalogue, societe, onSave, onClose}) {
  const isDevis=type==="devis";
  const validiteDefault=new Date(); validiteDefault.setMonth(validiteDefault.getMonth()+1);
  const [f,setF]=useState(doc||{clientId:"",objet:"",date:todayStr(),validite:isDevis?ds(validiteDefault):"",dateEcheance:todayStr(),modePaiement:"Chèque, Virement, Espèces, Carte bancaire",acompte:0,lignes:[],notes:"",statut:isDevis?"En attente":"En attente de règlement"});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const [showCat,setShowCat]=useState(false);
  const addFromCat=item=>setF(p=>({...p,lignes:[...p.lignes,{designation:item.designation,qte:1,pu:item.pu,tva:item.tva,unite:item.unite}]}));
  const addLine=()=>setF(p=>({...p,lignes:[...p.lignes,{designation:"",qte:1,pu:0,tva:10,unite:"Forfait"}]}));
  const setLine=(i,k,v)=>setF(p=>{const l=[...p.lignes];l[i]={...l[i],[k]:v};return{...p,lignes:l};});
  const delLine=i=>setF(p=>({...p,lignes:p.lignes.filter((_,j)=>j!==i)}));
  const totalHT=f.lignes.reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const totalTVA=f.lignes.reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*Number(l.tva||10)/100,0);
  const totalTTC=totalHT+totalTVA;
  return (
    <div className="modal-overlay"><div className="modal modal-xl" style={{maxWidth:900}}>
      <div className="modal-title">{doc?"Modifier":"Nouveau"} {isDevis?"devis":"facture"}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        <div className="form-group full"><label>Client *</label><select value={f.clientId} onChange={e=>s("clientId",Number(e.target.value))}><option value="">— Sélectionner —</option>{clients.map(c=><option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}</select></div>
        <div className="form-group full"><label>Objet</label><input value={f.objet} onChange={e=>s("objet",e.target.value)}/></div>
        <div className="form-group"><label>Date</label><input type="date" value={f.date} onChange={e=>s("date",e.target.value)}/></div>
        {isDevis&&<div className="form-group"><label>Validité</label><input type="date" value={f.validite} onChange={e=>s("validite",e.target.value)}/></div>}
        {!isDevis&&<div className="form-group"><label>Échéance</label><input type="date" value={f.dateEcheance} onChange={e=>s("dateEcheance",e.target.value)}/></div>}
        <div className="form-group"><label>Statut</label><select value={f.statut} onChange={e=>s("statut",e.target.value)}>{isDevis?["En attente","Accepté","Refusé","Expiré"].map(s=><option key={s}>{s}</option>):["En attente de règlement","Payée","Partiellement payée"].map(s=><option key={s}>{s}</option>)}</select></div>
      </div>
      <div style={{marginBottom:14}}><button className="btn btn-secondary btn-sm" onClick={()=>setShowCat(p=>!p)}>📚 {showCat?"Masquer":"Bibliothèque"}</button>
        {showCat&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:6,maxHeight:200,overflowY:"auto",marginTop:10}}>{catalogue.map(item=><div key={item.id} onClick={()=>addFromCat(item)} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}><div style={{fontWeight:600,fontSize:"0.8rem"}}>{item.designation}</div><div style={{fontSize:"0.72rem",color:"var(--muted)"}}>{money(item.pu)} · TVA {item.tva}%</div></div>)}</div>}
      </div>
      <div style={{background:"var(--surface2)",borderRadius:10,padding:12,marginBottom:10}}>
        {f.lignes.length===0&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:"0.85rem",padding:"16px 0"}}>Aucune ligne</div>}
        {f.lignes.map((l,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"3fr 0.5fr 1fr 0.7fr auto",gap:6,marginBottom:6,alignItems:"center",background:"var(--surface)",borderRadius:8,padding:"8px 10px"}}>
            <input value={l.designation||""} onChange={e=>setLine(i,"designation",e.target.value)} placeholder="Désignation"/>
            <input type="number" value={l.qte||1} onChange={e=>setLine(i,"qte",e.target.value)} min={0}/>
            <input type="number" value={l.pu||0} onChange={e=>setLine(i,"pu",e.target.value)} min={0}/>
            <select value={l.tva||10} onChange={e=>setLine(i,"tva",Number(e.target.value))}><option value={0}>0%</option><option value={5.5}>5.5%</option><option value={10}>10%</option><option value={20}>20%</option></select>
            <button className="btn btn-danger btn-sm" onClick={()=>delLine(i)}>✕</button>
          </div>
        ))}
      </div>
      <button className="btn btn-secondary btn-sm" onClick={addLine} style={{marginBottom:16}}>+ Ligne</button>
      {f.lignes.length>0&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}><div style={{background:"var(--surface2)",borderRadius:10,padding:"12px 18px",minWidth:250}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:4}}><span style={{color:"var(--muted)"}}>Total HT</span><span>{money(totalHT)}</span></div><div style={{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:6}}><span style={{color:"var(--muted)"}}>Total TVA</span><span>{money(totalTVA)}</span></div><div style={{display:"flex",justifyContent:"space-between",fontSize:"1rem",fontWeight:700,color:"var(--accent)",paddingTop:6,borderTop:"1px solid var(--border)"}}><span>Total TTC</span><span>{money(totalTTC)}</span></div></div></div>}
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={()=>onSave(f)} disabled={!f.clientId||f.lignes.length===0}>✓ Enregistrer</button>
      </div>
    </div></div>
  );
}

function PageDevisFactures({clients, docs, setDocs, devis, setDevis, societe, catalogue}) {
  const [tab,setTab]=useState("devis");
  const [modal,setModal]=useState(null);
  const [preview,setPreview]=useState(null);
  const saveDevis=f=>{const numero=f.numero||genNumero("devis",docs,devis);if(modal.doc)setDevis(p=>p.map(d=>d.id===modal.doc.id?{...f,numero,id:d.id}:d));else setDevis(p=>[...p,{...f,numero,id:newId(p)}]);setModal(null);};
  const saveFacture=f=>{const numero=f.numero||genNumero("facture",docs,devis);if(modal.doc)setDocs(p=>p.map(d=>d.id===modal.doc.id?{...f,numero,type:"Facture",id:d.id}:d));else setDocs(p=>[...p,{...f,numero,type:"Facture",id:newId(p)}]);setModal(null);};
  const transformDevis=dev=>{const numero=genNumero("facture",docs,devis);setDocs(p=>[...p,{...dev,id:newId(p),type:"Facture",numero,refDevis:dev.numero,statut:"En attente de règlement",dateEcheance:todayStr()}]);setDevis(p=>p.map(d=>d.id===dev.id?{...d,statut:"Facturé"}:d));setPreview(null);};
  const delDevis=id=>{if(confirm("Supprimer ?"))setDevis(p=>p.filter(d=>d.id!==id));};
  const delFacture=id=>{if(confirm("Supprimer ?"))setDocs(p=>p.filter(d=>d.id!==id));};
  const factures=docs.filter(d=>d.type==="Facture");
  const caTotal=factures.filter(f=>f.statut==="Payée").reduce((s,f)=>{const ht=(f.lignes||[]).reduce((a,l)=>a+Number(l.qte)*Number(l.pu),0);const tva=(f.lignes||[]).reduce((a,l)=>a+Number(l.qte)*Number(l.pu)*Number(l.tva||10)/100,0);return s+ht+tva;},0);
  const impayees=factures.filter(f=>f.statut==="En attente de règlement");
  const openPreview=(type,doc)=>{const c=clients.find(x=>x.id===doc.clientId);setPreview({type,doc,client:c});};
  return (
    <div className="content">
      {modal&&modal.type==="devis"&&<ModalDevisFacture type="devis" doc={modal.doc} clients={clients} docs={docs} devis={devis} catalogue={catalogue} societe={societe} onSave={saveDevis} onClose={()=>setModal(null)}/>}
      {modal&&modal.type==="facture"&&<ModalDevisFacture type="facture" doc={modal.doc} clients={clients} docs={docs} devis={devis} catalogue={catalogue} societe={societe} onSave={saveFacture} onClose={()=>setModal(null)}/>}
      {preview&&preview.type==="devis"&&<DocDevis doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)} onTransform={()=>transformDevis(preview.doc)}/>}
      {preview&&preview.type==="facture"&&<DocFacture doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)}/>}
      <div className="stats-grid">
        <div className="stat"><div className="stat-label">Devis en cours</div><div className="stat-value" style={{color:"var(--info)"}}>{devis.filter(d=>d.statut==="En attente").length}</div></div>
        <div className="stat"><div className="stat-label">Factures impayées</div><div className="stat-value" style={{color:"var(--warning)"}}>{impayees.length}</div></div>
        <div className="stat"><div className="stat-label">CA encaissé</div><div className="stat-value">{money(caTotal)}</div></div>
        <div className="stat"><div className="stat-label">Total factures</div><div className="stat-value" style={{color:"var(--muted)"}}>{factures.length}</div></div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div className="tabs" style={{marginBottom:0}}>
          <div className={`tab${tab==="devis"?" active":""}`} onClick={()=>setTab("devis")}>📋 Devis ({devis.length})</div>
          <div className={`tab${tab==="factures"?" active":""}`} onClick={()=>setTab("factures")}>🧾 Factures ({factures.length})</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {tab==="devis"&&<button className="btn btn-secondary" onClick={()=>setModal({type:"devis"})}>+ Nouveau devis</button>}
          {tab==="factures"&&<button className="btn btn-primary" onClick={()=>setModal({type:"facture"})}>+ Nouvelle facture</button>}
        </div>
      </div>
      {tab==="devis"&&<div className="card"><div className="table-wrap"><table>
        <thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Montant TTC</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {devis.length===0&&<tr><td colSpan={6}><div className="empty"><div className="icon">📋</div><p>Aucun devis</p></div></td></tr>}
          {devis.map(d=>{const c=clients.find(x=>x.id===d.clientId);const ttc=(d.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*(1+Number(l.tva||10)/100),0);return(<tr key={d.id}><td style={{fontWeight:600,color:"var(--accent)"}}>{d.numero}</td><td>{c?.prenom} {c?.nom}</td><td>{fmt(d.date)}</td><td style={{fontWeight:600}}>{money(ttc)}</td><td><span className={`badge badge-${d.statut==="Accepté"?"success":d.statut==="Refusé"?"danger":"warning"}`}>{d.statut}</span></td><td><div style={{display:"flex",gap:5}}><button className="btn btn-secondary btn-sm" onClick={()=>openPreview("devis",d)}>👁</button><button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"devis",doc:d})}>✏️</button>{d.statut!=="Refusé"&&d.statut!=="Facturé"&&<button className="btn btn-primary btn-sm" onClick={()=>transformDevis(d)}>🧾</button>}<button className="btn btn-danger btn-sm" onClick={()=>delDevis(d.id)}>🗑️</button></div></td></tr>);})}
        </tbody>
      </table></div></div>}
      {tab==="factures"&&<div className="card"><div className="table-wrap"><table>
        <thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Montant TTC</th><th>Statut</th><th>Actions</th></tr></thead>
        <tbody>
          {factures.length===0&&<tr><td colSpan={6}><div className="empty"><div className="icon">🧾</div><p>Aucune facture</p></div></td></tr>}
          {factures.map(f=>{const c=clients.find(x=>x.id===f.clientId);const ttc=(f.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*(1+Number(l.tva||10)/100),0);return(<tr key={f.id}><td style={{fontWeight:600,color:"var(--accent)"}}>{f.numero}</td><td>{c?.prenom} {c?.nom}</td><td>{fmt(f.date)}</td><td style={{fontWeight:600}}>{money(ttc)}</td><td><span className={`badge badge-${f.statut==="Payée"?"success":"warning"}`}>{f.statut}</span></td><td><div style={{display:"flex",gap:5}}><button className="btn btn-secondary btn-sm" onClick={()=>openPreview("facture",f)}>👁</button><button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"facture",doc:f})}>✏️</button>{f.statut==="En attente de règlement"&&<button className="btn btn-success btn-sm" onClick={()=>setDocs(p=>p.map(d=>d.id===f.id?{...d,statut:"Payée"}:d))}>✓</button>}<button className="btn btn-danger btn-sm" onClick={()=>delFacture(f.id)}>🗑️</button></div></td></tr>);})}
        </tbody>
      </table></div></div>}
    </div>
  );
}

const DELAI_RELANCE=11;
const EQUIP_RELANCE=["Chaudière gaz","Chaudière fioul","Chauffe-eau gaz","Climatisation","Pompe à chaleur","Poêle à bois"];
function getLastEntretien(clientId,docs){return docs.filter(d=>d.clientId===clientId&&["Attestation Gaz","Attestation Fioul","Attestation Clim","Bon d'intervention","Dépannage"].includes(d.type)).sort((a,b)=>b.date?.localeCompare(a.date))[0]?.date||null;}
function moisDepuis(dateStr){if(!dateStr)return 999;const d=new Date(dateStr),now=new Date();return(now.getFullYear()-d.getFullYear())*12+(now.getMonth()-d.getMonth());}

function PageRelances({clients,docs,rdvs,setRdvs}) {
  const relances=[];
  clients.forEach(client=>{
    (client.equipements||[]).forEach(equip=>{
      if(!EQUIP_RELANCE.includes(equip.type))return;
      const lastDate=getLastEntretien(client.id,docs);
      const mois=moisDepuis(lastDate);
      if(mois>=DELAI_RELANCE)relances.push({client,equip,lastDate,mois});
    });
  });
  relances.sort((a,b)=>b.mois-a.mois);
  const createRdv=client=>{const d=new Date();d.setDate(d.getDate()+7);setRdvs(p=>[...p,{id:newId(p),clientId:client.id,date:ds(d),heure:"09:00",type:"Entretien annuel",statut:"En attente",notes:"Relance entretien annuel"}]);alert(`✓ RDV créé pour ${client.prenom} ${client.nom}`);};
  return (
    <div className="content">
      <div className="stats-grid">
        <div className="stat"><div className="stat-label">À relancer</div><div className="stat-value" style={{color:"var(--warning)"}}>{relances.length}</div></div>
        <div className="stat"><div className="stat-label">🔴 Urgents +13 mois</div><div className="stat-value" style={{color:"var(--danger)"}}>{relances.filter(r=>r.mois>=13).length}</div></div>
      </div>
      {relances.length===0&&<div className="empty"><div className="icon">🎉</div><p>Tous vos clients sont à jour !</p></div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {relances.map((r,i)=>{
          const isUrgent=r.mois>=13;
          return(<div key={i} style={{background:"var(--surface)",border:`1px solid ${isUrgent?"var(--danger)":"var(--warning)"}`,borderRadius:"14px",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,flexWrap:"wrap"}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}><span>{isUrgent?"🔴":"🟠"}</span><div style={{fontWeight:700}}>{r.client.prenom} {r.client.nom}</div><span className={`badge badge-${isUrgent?"danger":"warning"}`}>{r.mois} mois</span></div>
              <div style={{fontSize:"0.8rem",color:"var(--muted)"}}><AddrLink client={r.client} style={{fontSize:"0.8rem"}}/> · 📞 {r.client.tel}</div>
              <div style={{fontSize:"0.8rem",color:"var(--muted)"}}>{EQUIP_ICON(r.equip.type)} {r.equip.type} · {r.lastDate?`Dernier : ${fmt(r.lastDate)}`:"⚠️ Aucun entretien"}</div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {r.client.tel&&<a href={`tel:${r.client.tel.replace(/\s/g,"")}`} className="btn btn-secondary btn-sm" style={{textDecoration:"none"}}>📞 Appeler</a>}
              <button className="btn btn-primary btn-sm" onClick={()=>createRdv(r.client)}>📅 RDV</button>
            </div>
          </div>);
        })}
      </div>
    </div>
  );
}

function PageSettings({societe, setSociete, allData, onImport}) {
  const [f,setF]=useState({...societe});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const saved=JSON.stringify(f)===JSON.stringify(societe);
  const logoRef=useRef(null);
  const importRef=useRef(null);
  const handleLogo=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>s("logo",ev.target.result);r.readAsDataURL(file);e.target.value="";};
  const handleExport=()=>{
    const data=JSON.stringify({...allData,exportDate:new Date().toISOString(),version:"ThermoPro-v9"},null,2);
    const blob=new Blob([data],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`thermopro-sauvegarde-${new Date().toISOString().slice(0,10)}.json`;
    a.click();URL.revokeObjectURL(url);
  };
  const handleImport=e=>{
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();
    r.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        if(confirm("Importer cette sauvegarde ? Les données actuelles seront remplacées."))onImport(data);
      }catch{alert("Fichier invalide");}
    };
    r.readAsText(file);e.target.value="";
  };
  return (
    <div className="content"><div className="card" style={{maxWidth:580}}>
      <div className="card-title">⚙️ Informations de la société</div>
      <div style={{marginBottom:16}}>
        {f.logo?<img src={f.logo} alt="Logo" style={{height:80,maxWidth:200,objectFit:"contain",borderRadius:8,border:"1px solid var(--border)",background:"#fff",padding:6}}/>:<div style={{width:120,height:80,border:"2px dashed var(--border)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)",fontSize:"0.8rem"}}>Pas de logo</div>}
        <button className="btn btn-secondary btn-sm" style={{marginTop:8}} onClick={()=>logoRef.current?.click()}>{f.logo?"🔄 Changer":"📁 Importer"}</button>
        <input ref={logoRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleLogo}/>
      </div>
      <div className="form-grid">
        <div className="form-group full"><label>Nom de l'entreprise</label><input value={f.nom} onChange={e=>s("nom",e.target.value)}/></div>
        <div className="form-group full"><label>Adresse</label><input value={f.adresse} onChange={e=>s("adresse",e.target.value)}/></div>
        <div className="form-group"><label>Téléphone</label><input value={f.tel} onChange={e=>s("tel",e.target.value)}/></div>
        <div className="form-group"><label>Email</label><input value={f.email} onChange={e=>s("email",e.target.value)}/></div>
        <div className="form-group"><label>SIRET</label><input value={f.siret} onChange={e=>s("siret",e.target.value)}/></div>
        <div className="form-group"><label>TVA Intracommunautaire</label><input value={f.tvaIntra} onChange={e=>s("tvaIntra",e.target.value)}/></div>
        <div className="form-group"><label>Nom du technicien</label><input value={f.technicien||""} onChange={e=>s("technicien",e.target.value)}/></div>
        <div className="form-group"><label>N° RGE</label><input value={f.rge||""} onChange={e=>s("rge",e.target.value)}/></div>
        <div className="form-group full"><label>IBAN</label><input value={f.iban||""} onChange={e=>s("iban",e.target.value)}/></div>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" disabled={saved} onClick={()=>setSociete(f)}>{saved?"✓ À jour":"Enregistrer"}</button>
      </div>
      <div style={{marginTop:24,paddingTop:20,borderTop:"1px solid var(--border)"}}>
        <div className="card-title">💾 Sauvegarde des données</div>
        <p style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:16}}>Exportez régulièrement vos données pour les sauvegarder sur votre PC ou Google Drive.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <button className="btn btn-success" onClick={handleExport}>⬇️ Exporter sauvegarde</button>
          <button className="btn btn-secondary" onClick={()=>importRef.current?.click()}>⬆️ Importer sauvegarde</button>
          <input ref={importRef} type="file" accept=".json" style={{display:"none"}} onChange={handleImport}/>
        </div>
      </div>
    </div></div>
  );
}

const NAV=[
  {id:"dashboard",label:"Accueil",icon:"🏠"},
  {id:"agenda",label:"Agenda",icon:"📅"},
  {id:"clients",label:"Clients",icon:"👥"},
  {id:"devis",label:"Devis/Fact.",icon:"🧾"},
  {id:"relances",label:"Relances",icon:"🔔"},
  {id:"documents",label:"Docs",icon:"📄"},
  {id:"settings",label:"Réglages",icon:"⚙️"},
];
const LABELS={dashboard:"Tableau de bord",agenda:"Agenda",clients:"Carnet clients",devis:"Devis & Factures",relances:"Relances",documents:"Documents",settings:"Paramètres"};
const MOT_DE_PASSE="chachou34500";

function LoginScreen({onLogin}) {
  const [pwd,setPwd]=useState("");
  const [error,setError]=useState(false);
  const [show,setShow]=useState(false);
  const handleLogin=()=>{if(pwd===MOT_DE_PASSE){onLogin();}else{setError(true);setPwd("");setTimeout(()=>setError(false),2000);}};
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #0d1117 0%, #161b27 50%, #1a1f2e 100%)"}}>
      <div style={{background:"#161b27",border:"1px solid #252d42",borderRadius:20,padding:"48px 40px",width:"100%",maxWidth:380,textAlign:"center",boxShadow:"0 24px 64px #00000080"}}>
        <div style={{fontSize:"3rem",marginBottom:8}}>🔥</div>
        <div style={{fontFamily:"serif",fontSize:"1.8rem",fontWeight:900,color:"#f97316",marginBottom:4}}>ThermoPro</div>
        <div style={{fontSize:"0.85rem",color:"#64748b",marginBottom:32}}>Rouvet Chauffage — Accès sécurisé</div>
        <div style={{position:"relative",marginBottom:16}}>
          <input type={show?"text":"password"} value={pwd} onChange={e=>{setPwd(e.target.value);setError(false);}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="Mot de passe"
            style={{width:"100%",padding:"14px 48px 14px 16px",borderRadius:12,border:`1px solid ${error?"#ef4444":"#252d42"}`,background:"#0d1117",color:"#e2e8f0",fontSize:"1rem",outline:"none",boxSizing:"border-box"}} autoFocus/>
          <button onClick={()=>setShow(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:"1.1rem"}}>{show?"🙈":"👁"}</button>
        </div>
        {error&&<div style={{color:"#ef4444",fontSize:"0.82rem",marginBottom:12}}>❌ Mot de passe incorrect</div>}
        <button onClick={handleLogin} style={{width:"100%",padding:"14px",borderRadius:12,background:"linear-gradient(135deg, #f97316, #ea580c)",border:"none",color:"#fff",fontSize:"1rem",fontWeight:700,cursor:"pointer"}}>Se connecter</button>
        <div style={{fontSize:"0.72rem",color:"#334155",marginTop:20}}>ThermoPro v9 — Usage professionnel exclusif</div>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [page,setPage]=useState("agenda");
  const [clients,setClients]=useState(INIT_CLIENTS);
  const [rdvs,setRdvs]=useState(INIT_RDV);
  const [docs,setDocs]=useState([]);
  const [devis,setDevis]=useState([]);
  const [catalogue,setCatalogue]=useState(INIT_CATALOGUE);
  const [societe,setSociete]=useState(INIT_SOCIETE);
  const [loaded,setLoaded]=useState(false);

  // Chargement initial Firebase
  useEffect(()=>{
    const load=async()=>{
      const c=await charger("clients"); if(c) setClients(c);
      const r=await charger("rdvs"); if(r) setRdvs(r);
      const d=await charger("docs"); if(d) setDocs(d);
      const dv=await charger("devis"); if(dv) setDevis(dv);
      const s=await charger("societe"); if(s) setSociete(s);
      const cat=await charger("catalogue"); if(cat) setCatalogue(cat);
      setLoaded(true);
    };
    load();
  },[]);

  // Sauvegarde auto — seulement après chargement complet
  useEffect(()=>{ if(loaded) sauvegarder("clients",clients); },[clients]);
  useEffect(()=>{ if(loaded) sauvegarder("rdvs",rdvs); },[rdvs]);
  useEffect(()=>{ if(loaded) sauvegarder("docs",docs); },[docs]);
  useEffect(()=>{ if(loaded) sauvegarder("devis",devis); },[devis]);
  useEffect(()=>{ if(loaded) sauvegarder("societe",societe); },[societe]);
  useEffect(()=>{ if(loaded) sauvegarder("catalogue",catalogue); },[catalogue]);

  if(!loggedIn) return <><style>{CSS}</style><LoginScreen onLogin={()=>setLoggedIn(true)}/></>;

  const nbRelances=clients.reduce((total,client)=>total+(client.equipements||[]).filter(equip=>{if(!EQUIP_RELANCE.includes(equip.type))return false;return moisDepuis(getLastEntretien(client.id,docs))>=DELAI_RELANCE;}).length,0);
  const nbImpayees=docs.filter(d=>d.type==="Facture"&&d.statut==="En attente de règlement").length;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-brand">
            {societe.logo&&<img src={societe.logo} alt="Logo" style={{height:36,maxWidth:160,objectFit:"contain",marginBottom:8,display:"block"}}/>}
            <h1>🔥 ThermoPro</h1>
            <p>{societe.nom}</p>
          </div>
          <nav className="nav">
            {NAV.map(n=>(
              <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
                <span style={{width:20,textAlign:"center"}}>{n.icon}</span>{n.label}
                {n.id==="relances"&&nbRelances>0&&<span style={{marginLeft:"auto",background:"var(--danger)",color:"#fff",borderRadius:20,fontSize:"0.65rem",fontWeight:700,padding:"2px 7px"}}>{nbRelances}</span>}
                {n.id==="devis"&&nbImpayees>0&&<span style={{marginLeft:"auto",background:"var(--warning)",color:"#fff",borderRadius:20,fontSize:"0.65rem",fontWeight:700,padding:"2px 7px"}}>{nbImpayees}</span>}
              </div>
            ))}
          </nav>
        </aside>
        <div className="main">
          <div className="topbar">
            <h2>{LABELS[page]}</h2>
            <div style={{fontSize:"0.8rem",color:"var(--muted)"}}>{societe.nom}</div>
          </div>
          {page==="dashboard"&&<PageDashboard clients={clients} rdvs={rdvs} docs={docs}/>}
          {page==="agenda"&&<PageAgenda rdvs={rdvs} setRdvs={setRdvs} clients={clients} docs={docs} setDocs={setDocs} catalogue={catalogue}/>}
          {page==="clients"&&<PageClients clients={clients} setClients={setClients} docs={docs} setDocs={setDocs} rdvs={rdvs} societe={societe}/>}
          {page==="devis"&&<PageDevisFactures clients={clients} docs={docs} setDocs={setDocs} devis={devis} setDevis={setDevis} societe={societe} catalogue={catalogue} setCatalogue={setCatalogue}/>}
          {page==="relances"&&<PageRelances clients={clients} docs={docs} rdvs={rdvs} setRdvs={setRdvs}/>}
          {page==="documents"&&<PageDocuments docs={docs} setDocs={setDocs} clients={clients} societe={societe}/>}
          {page==="settings"&&<PageSettings societe={societe} setSociete={setSociete} allData={{clients,rdvs,docs,devis,catalogue,societe}} onImport={data=>{if(data.clients)setClients(data.clients);if(data.rdvs)setRdvs(data.rdvs);if(data.docs)setDocs(data.docs);if(data.devis)setDevis(data.devis);if(data.catalogue)setCatalogue(data.catalogue);if(data.societe)setSociete(data.societe);alert("✓ Sauvegarde importée avec succès !");}}/>}
        </div>
        <nav className="mobile-nav">
          <div className="mobile-nav-inner">
            {NAV.map(n=>(
              <div key={n.id} className={`mobile-nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)} style={{position:"relative"}}>
                <span className="mn-icon">{n.icon}</span>
                <span>{n.label}</span>
                {n.id==="relances"&&nbRelances>0&&<span style={{position:"absolute",top:2,right:4,background:"var(--danger)",color:"#fff",borderRadius:20,fontSize:"0.55rem",fontWeight:700,padding:"1px 5px"}}>{nbRelances}</span>}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
