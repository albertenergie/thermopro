import React, { useState, useRef, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot } from "firebase/firestore";

// ─── Firebase Config ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBRSSuNVYZ9aQ5ikGeengrt7jPcO3IXl50",
  authDomain: "thermopro-ca00a.firebaseapp.com",
  projectId: "thermopro-ca00a",
  storageBucket: "thermopro-ca00a.firebasestorage.app",
  messagingSenderId: "819219960008",
  appId: "1:819219960008:web:496bd1c21bbcf4467515fd",
  measurementId: "G-5QW9KQ0DYM"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ─── Fonctions Firebase ───────────────────────────────────────────────────────
const USER_ID = "pierre"; // identifiant unique

async function sauvegarder(collection, data) {
  try {
    await setDoc(doc(db, "thermopro", USER_ID, collection, "data"), { value: JSON.stringify(data) });
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
  .topbar-right{font-size:0.8rem;color:var(--muted);}
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
  .stat-sub{font-size:0.75rem;color:var(--muted);margin-top:2px;}
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
  .form-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
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

  /* Agenda */
  .agenda-view-toggle{display:flex;gap:4px;background:var(--surface2);border-radius:9px;padding:3px;}
  .agenda-view-btn{padding:6px 14px;border-radius:7px;font-size:0.8rem;font-weight:600;cursor:pointer;color:var(--muted);transition:all .15s;border:none;background:transparent;}
  .agenda-view-btn.active{background:var(--accent);color:#fff;}

  /* Vue mois */
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

  /* Vue semaine */
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

  /* RDV panel */
  .rdv-panel{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;margin-bottom:16px;}
  .rdv-row{display:flex;justify-content:space-between;align-items:flex-start;padding:12px 14px;background:var(--surface2);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;gap:10px;}
  .rdv-row:hover{border-color:var(--accent);}

  /* Checks */
  .checks-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
  .check-item{display:flex;align-items:center;justify-content:space-between;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:9px 12px;gap:8px;}
  .check-label{font-size:0.8rem;flex:1;}
  .check-btns{display:flex;gap:4px;}
  .check-btn{width:28px;height:28px;border-radius:6px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.75rem;font-weight:700;background:var(--surface);color:var(--muted);transition:all .12s;}
  .check-btn.ok{background:#22c55e20;color:var(--success);border-color:#22c55e40;}
  .check-btn.nok{background:#ef444420;color:var(--danger);border-color:#ef444440;}
  .check-btn.na{background:#64748b20;color:var(--muted);border-color:#64748b40;}

  /* Checkbox custom */
  .checkbox-row{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.85rem;}
  .checkbox-row input[type=checkbox]{width:16px;height:16px;accent-color:var(--accent);}

  /* Wizard */
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

  /* Signature */
  .sig-container{border:2px dashed var(--border);border-radius:12px;overflow:hidden;position:relative;background:#f8fafc;touch-action:none;}
  .sig-container.active{border-color:var(--accent);}
  .sig-label{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:0.72rem;color:#aaa;pointer-events:none;white-space:nowrap;}

  /* Doc print */
  .doc-preview{background:#fff;color:#1a1a2e;border-radius:12px;padding:38px 42px;font-family:'DM Sans',sans-serif;font-size:12px;line-height:1.6;max-width:780px;margin:0 auto;box-shadow:0 8px 48px #00000040;}
  .doc-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;padding-bottom:16px;border-bottom:3px solid #f97316;}
  .doc-company-name{font-size:22px;font-family:'Fraunces',serif;font-weight:900;color:#f97316;}
  .doc-company-info{font-size:10px;color:#666;margin-top:4px;line-height:1.8;}
  .doc-ref-type{font-size:18px;font-family:'Fraunces',serif;font-weight:900;color:#1a1a2e;text-align:right;}
  .doc-ref-info{font-size:10.5px;color:#888;text-align:right;margin-top:3px;}
  .doc-section{margin-bottom:14px;}
  .doc-section-title{font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#aaa;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #eee;}
  .doc-2col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:14px;}
  .doc-3col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:14px;}
  .doc-field{display:flex;flex-direction:column;margin-bottom:5px;}
  .doc-field-label{font-size:9.5px;color:#aaa;text-transform:uppercase;letter-spacing:.06em;}
  .doc-field-value{font-size:11.5px;font-weight:600;border-bottom:1px dotted #ddd;padding-bottom:2px;margin-top:2px;min-height:18px;}
  .doc-checkbox-row{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:8px;}
  .doc-checkbox{display:flex;align-items:center;gap:5px;font-size:10.5px;}
  .doc-check-box{width:12px;height:12px;border:1.5px solid #ccc;border-radius:2px;display:inline-flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0;}
  .doc-check-box.ok{background:#22c55e;border-color:#22c55e;color:white;}
  .doc-check-box.nok{background:#ef4444;border-color:#ef4444;color:white;}
  .doc-items{width:100%;border-collapse:collapse;margin:10px 0;}
  .doc-items th{background:#1a1a2e;color:#fff;padding:7px 10px;font-size:9.5px;text-align:left;}
  .doc-items td{padding:7px 10px;border-bottom:1px solid #f0f0f0;font-size:11px;}
  .doc-totals{display:flex;flex-direction:column;align-items:flex-end;gap:3px;margin:10px 0;}
  .doc-total-row{display:flex;gap:40px;font-size:11px;}
  .doc-total-row.ttc{font-weight:700;font-size:13px;color:#f97316;margin-top:3px;}
  .doc-sig-row{display:flex;gap:16px;margin-top:20px;}
  .doc-sig-box{flex:1;border:1px solid #ddd;border-radius:7px;padding:10px 14px;text-align:center;}
  .doc-sig-box p{font-size:9.5px;color:#aaa;margin-bottom:5px;}
  .doc-sig-box img{max-width:100%;height:65px;object-fit:contain;}
  .doc-footer{border-top:1px solid #eee;padding-top:10px;margin-top:16px;font-size:9px;color:#bbb;text-align:center;line-height:1.9;}
  .doc-historique{width:100%;border-collapse:collapse;margin-bottom:10px;font-size:10px;}
  .doc-historique th{background:#f5f5f5;color:#666;padding:5px 8px;text-align:left;font-size:9px;}
  .doc-historique td{padding:5px 8px;border-bottom:1px solid #f0f0f0;}
  .doc-att-center{text-align:center;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #f97316;}
  .doc-att-title{font-family:'Fraunces',serif;font-size:20px;font-weight:900;color:#1a1a2e;}
  .doc-att-sub{font-size:10.5px;color:#888;margin-top:3px;}
  .doc-check-grid{display:grid;grid-template-columns:1fr 1fr;gap:3px 14px;}
  .doc-check-item{display:flex;align-items:center;gap:5px;font-size:10px;}

  /* Mobile nav */
  .mobile-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);z-index:100;padding:6px 0 max(6px,env(safe-area-inset-bottom));}
  .mobile-nav-inner{display:flex;justify-content:space-around;}
  .mobile-nav-item{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 10px;cursor:pointer;color:var(--muted);font-size:0.58rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;border-radius:10px;transition:all .15s;min-width:52px;}
  .mobile-nav-item .mn-icon{font-size:1.25rem;}
  .mobile-nav-item.active{color:var(--accent);}

  @media print{body{background:#fff!important;}.no-print{display:none!important;}.doc-preview{box-shadow:none!important;border-radius:0!important;max-width:100%!important;}}
  @media(max-width:768px){
    .sidebar{display:none;}
    .main{padding-bottom:68px;}
    .form-grid,.form-grid-3{grid-template-columns:1fr;}
    .checks-grid,.doc-check-grid,.doc-2col,.doc-3col{grid-template-columns:1fr;}
    .content{padding:14px;}
    .mobile-nav{display:block;}
    .topbar{padding:12px 16px;}
    .topbar h2{font-size:1.2rem;}
    .modal{padding:20px;border-radius:18px 18px 0 0;position:fixed;bottom:0;left:0;right:0;max-height:94vh;max-width:100%;}
    .modal-overlay{align-items:flex-end;padding:0;}
    .doc-preview{padding:18px;font-size:10.5px;}
    .doc-sig-row{flex-direction:column;}
    .week-grid{grid-template-columns:36px repeat(7,1fr);}
    .week-header-day{font-size:0.6rem;}
    .week-header-date{font-size:0.85rem;}
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TODAY = new Date();
const fmt = d => { if(!d) return ""; const [y,m,j]=d.split("-"); return `${j}/${m}/${y}`; };
const money = n => Number(n||0).toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
const newId = arr => arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1;
const todayStr = () => TODAY.toISOString().slice(0,10);
const ds = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const JOURS_SHORT = ["L","M","M","J","V","S","D"];
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
const CHECKS_FIOUL = ["Niveau fioul","Démontage et nettoyage gicleur","Remplacement filtre fioul","Nettoyage chambre combustion","Contrôle pompe à fioul","Réglage électrode d'allumage","Nettoyage échangeur","Contrôle pressostat","Vérification circulateur","Pression circuit hydraulique","Contrôle et réglage brûleur","Mesure combustion (CO, CO₂, indice fumée)","Contrôle tirage fumée","Conduit d'évacuation","Régulation / thermostat","Test sécurité générale","Vase d'expansion","Soupape de sécurité","Raccords et joints","Vérification cuve / circuit fioul"];
const CHECKS_CLIM = ["Nettoyage filtres unité intérieure","Nettoyage évaporateur","Nettoyage condenseur unité extérieure","Nettoyage bac et évacuation condensats","Contrôle connexions électriques","Vérification télécommande / programmation","Test fonctionnement mode froid","Test fonctionnement mode chaud","Mesure température soufflage / reprise","Vérification étanchéité liaisons frigorifiques","Contrôle isolation liaisons frigorifiques","Test sécurités haute / basse pression","Contrôle fixations unités int. et ext.","Niveau sonore anormal","État général de l'installation","Désinfection / traitement antifongique"];
const CHECKS_PAC = ["Contrôle unité extérieure (évaporateur)","Contrôle unité intérieure (condenseur)","Vérification niveaux et pression circuit","Contrôle circulateur primaire","Contrôle circulateur secondaire","Pression circuit hydraulique","Purge circuit chauffage","Vase d'expansion","Soupape de sécurité","Vérification thermostat / régulation","Test sécurités haute / basse pression","Contrôle connexions électriques","Mesure COP (estimation)","Contrôle résistance d'appoint","Vérification plancher chauffant / radiateurs","Contrôle des raccords frigorifiques","Filtres et crépines","État général de l'installation"];

const MARQUES_CHAUDIERE = ["Viessmann","Atlantic","Saunier Duval","De Dietrich","Bosch","Vaillant","Chaffoteaux","Elm Leblanc","Frisquet","Chappée","Remeha","Wolf","Autre"];
const MARQUES_CLIM = ["Daikin","Mitsubishi Electric","Mitsubishi Heavy","Atlantic","Hitachi","Toshiba","Fujitsu","Samsung","LG","Panasonic","Gree","Carrier","Airwell","Thermor","Autre"];
const MARQUES_PAC = ["Atlantic","Mitsubishi Electric","Daikin","Hitachi","Viessmann","De Dietrich","Bosch","Vaillant","Saunier Duval","Thermor","Ariston","Chaffoteaux","Autre"];
const GAZ_TYPES = ["Gaz naturel","Propane","Butane"];
const TYPES_EQUIP = ["Chaudière gaz","Chaudière fioul","Chauffe-eau gaz","Climatisation","Pompe à chaleur","Poêle à bois"];
const TYPES_CLIM = ["Simple split","Bi-split","Tri-split","Gainable","Multi-split","Cassette"];
const TYPES_PAC = ["Air/Eau"];
const CONDUITS = ["Ventouse","Cheminée non gainée","Gainage","VMC Gaz","Autre"];
const MARQUES_GICLEUR = ["Steinen","Danfoss","Delavan","Fluidix","Autre"];
const ANGLES_GICLEUR = ["45°","60°","80°","90°","120°"];
const SPECTRES_GICLEUR = ["S (solide)","B (creux)","H (mi-creux)","NS (semi-solide)","PL (plat)"];

const newEquip = (type="Chaudière gaz") => ({
  id: Date.now()+Math.random(),
  type,
  gaz:"Gaz naturel", marque:"", modele:"", numSerie:"", puissance:"", annee:"", typeBruleur:"", marqueBruleur:"", modeleBruleur:"", numSerieBruleur:"",
  conduit:"Ventouse",
  marqueGicleur:"Steinen", debitGicleur:"", angleGicleur:"60°", spectreGicleur:"S (solide)",
  marqueClim:"", typeClim:"Simple split", numSerieClim:"", puissanceClim:"", anneeClim:"",
  marquePac:"", modelePac:"", numSeriePac:"", puissancePac:"", anneePac:"", typePac:"Air/Eau", copPac:"",
  contrat:"", numContrat:"", echeanceContrat:"", notes:"",
});

const fullAddr = c => [c.adresse, c.codePostal, c.ville].filter(Boolean).join(", ");
const mapsUrl = c => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddr(c))}`;
const AddrLink = ({client, style}) => (
  <a href={mapsUrl(client)} target="_blank" rel="noopener noreferrer"
    style={{color:"var(--info)",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:4,...style}}
    title="Ouvrir dans Google Maps">
    📍 {fullAddr(client)} <span style={{fontSize:"0.7em",opacity:.7}}>↗</span>
  </a>
);

const INIT_CLIENTS = [
  {id:1,nom:"Dupont",prenom:"Jean",adresse:"12 rue des Lilas",codePostal:"75012",ville:"Paris",tel:"06 12 34 56 78",email:"jean.dupont@email.fr",type:"Particulier",photos:[],
   equipements:[{...newEquip("Chaudière gaz"),gaz:"Gaz naturel",marque:"Viessmann",modele:"Vitopend 100",numSerie:"VS2019-1234",puissance:"24 kW",annee:"2019",typeBruleur:"Atmosphérique",conduit:"Ventouse"}],notes:"RAS"},
  {id:2,nom:"Martin",prenom:"Sophie",adresse:"8 allée des Chênes",codePostal:"69003",ville:"Lyon",tel:"07 98 76 54 32",email:"s.martin@email.fr",type:"Particulier",photos:[],
   equipements:[{...newEquip("Chaudière fioul"),marque:"Atlantic",modele:"Naneo PMC-M2",numSerie:"ATL2018-4521",puissance:"28 kW",annee:"2018",conduit:"Cheminée non gainée",marqueBruleur:"Riello",modeleBruleur:"40 G",marqueGicleur:"Steinen",debitGicleur:"0.85",angleGicleur:"60°",spectreGicleur:"S (solide)"},{...newEquip("Climatisation"),marqueClim:"Daikin",typeClim:"Bi-split",anneeClim:"2021"}],notes:"Chaudière + clim salon/chambre"},
  {id:3,nom:"SCI Les Pins",prenom:"",adresse:"45 avenue Foch",codePostal:"06000",ville:"Nice",tel:"04 93 11 22 33",email:"contact@lespins.fr",type:"Professionnel",photos:[],
   equipements:[{...newEquip("Chaudière gaz"),gaz:"Gaz naturel",marque:"Saunier Duval",modele:"Thema Condens",numSerie:"SD2020-7890",puissance:"35 kW",annee:"2020",typeBruleur:"Prémélangé",conduit:"Ventouse",contrat:"Contrat entretien",numContrat:"3094",echeanceContrat:"2027-01-13"}],notes:"3 chaudières immeuble"},
];
const INIT_RDV = [
  {id:1,clientId:1,date:todayStr(),heure:"09:00",type:"Entretien annuel",statut:"Confirmé",notes:""},
  {id:2,clientId:2,date:todayStr(),heure:"14:30",type:"Dépannage",statut:"Confirmé",notes:"Problème allumage"},
  {id:3,clientId:3,date:new Date(TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate()+2).toISOString().slice(0,10),heure:"10:00",type:"Entretien annuel",statut:"En attente",notes:""},
];
const INIT_DOCS = [];
const INIT_SOCIETE = {nom:"Votre Entreprise",technicien:"Pierre",siret:"000 000 000 00000",adresse:"1 rue de l'Exemple, 75000 Paris",tel:"01 23 45 67 89",email:"contact@votre-entreprise.fr",tvaIntra:"FR00000000000",rge:"",logo:"",iban:""};

const INIT_CATALOGUE = [
  {id:1,categorie:"Entretien chaudière gaz",designation:"Entretien chaudière gaz atmosphérique (contrat)",pu:135,tva:10,unite:"Forfait"},
  {id:2,categorie:"Entretien chaudière gaz",designation:"Entretien chaudière gaz condensation (contrat)",pu:145,tva:10,unite:"Forfait"},
  {id:3,categorie:"Entretien chaudière gaz",designation:"Entretien chaudière gaz (sans contrat)",pu:115,tva:10,unite:"Forfait"},
  {id:4,categorie:"Entretien chaudière fioul",designation:"Entretien chaudière fioul (contrat)",pu:185,tva:10,unite:"Forfait"},
  {id:5,categorie:"Entretien chaudière fioul",designation:"Entretien chaudière fioul haut rendement (contrat)",pu:235,tva:10,unite:"Forfait"},
  {id:6,categorie:"Entretien chaudière fioul",designation:"Entretien chaudière fioul (sans contrat)",pu:165,tva:10,unite:"Forfait"},
  {id:7,categorie:"Climatisation / PAC",designation:"Entretien climatisation simple split",pu:140,tva:10,unite:"Forfait"},
  {id:8,categorie:"Climatisation / PAC",designation:"Entretien climatisation bi-split",pu:180,tva:10,unite:"Forfait"},
  {id:9,categorie:"Climatisation / PAC",designation:"Entretien climatisation tri-split",pu:220,tva:10,unite:"Forfait"},
  {id:10,categorie:"Climatisation / PAC",designation:"Entretien climatisation gainable",pu:180,tva:10,unite:"Forfait"},
  {id:11,categorie:"Climatisation / PAC",designation:"Entretien pompe à chaleur",pu:185,tva:10,unite:"Forfait"},
  {id:12,categorie:"Dépannage / main d'œuvre",designation:"Ramonage poêle à bois",pu:90,tva:10,unite:"Forfait"},
  {id:19,categorie:"Dépannage / main d'œuvre",designation:"Ramonage cheminée / conduit",pu:110,tva:10,unite:"Forfait"},
  {id:13,categorie:"Dépannage / main d'œuvre",designation:"Forfait déplacement",pu:35,tva:20,unite:"Forfait"},
  {id:14,categorie:"Dépannage / main d'œuvre",designation:"Main d'œuvre technicien",pu:50,tva:10,unite:"h"},
  {id:15,categorie:"Fournitures / pièces",designation:"Filtre fioul",pu:12,tva:20,unite:"pièce"},
  {id:16,categorie:"Fournitures / pièces",designation:"Gicleur fioul Steinen",pu:18,tva:20,unite:"pièce"},
  {id:17,categorie:"Fournitures / pièces",designation:"Électrode d'allumage",pu:22,tva:20,unite:"pièce"},
  {id:18,categorie:"Fournitures / pièces",designation:"Joint d'étanchéité",pu:8,tva:20,unite:"pièce"},
];

const CATS_CATALOGUE = ["Entretien chaudière gaz","Entretien chaudière fioul","Climatisation / PAC","Dépannage / main d'œuvre","Fournitures / pièces"];

const genNumero = (type, docs, devis) => {
  const year = new Date().getFullYear();
  if(type==="devis") {
    const nb = (devis||[]).filter(d=>d.numero?.includes(year)).length+1;
    return `DEV-${year}-${String(nb).padStart(3,"0")}`;
  }
  const nb = (docs||[]).filter(d=>["Facture","Avoir"].includes(d.type)&&d.numero?.includes(year)).length+1;
  return `FAC-${year}-${String(nb).padStart(3,"0")}`;
};

function sendGmail(to, subject, body) {
  const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(url, "_blank");
}

function buildMailBody(doc, client, societe) {
  const isAtt = doc.type?.startsWith("Attestation");
  const ht = (doc.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const ttc = ht*(1+(doc.tva||10)/100);
  let body = `Bonjour ${client?.prenom} ${client?.nom},\n\nVeuillez trouver ci-dessous le résumé de votre ${doc.type} du ${fmt(doc.date)}.\n\n`;
  body += `N° document : ${doc.numero}\nDate : ${fmt(doc.date)}\nType : ${doc.type}\n\n`;
  if(!isAtt && ht>0) body += `Montant HT : ${money(ht)}\nTVA ${doc.tva}% : ${money(ht*doc.tva/100)}\nTotal TTC : ${money(ttc)}\n\n`;
  if(isAtt) {
    body += `Appareil : ${doc.combustible} — ${doc.marque||""} ${doc.modele||""}\n`;
    body += `Puissance : ${doc.puissance||"—"} | N° série : ${doc.numSerie||"—"}\n`;
    body += `Rendement : ${doc.rendement||"—"}% | CO : ${doc.emission||"—"} ppm\n`;
    body += `État général : ${doc.etat||"—"}\n\n`;
  }
  if(doc.observations) body += `Observations : ${doc.observations}\n\n`;
  body += `Pour toute question, n'hésitez pas à nous contacter.\n\nCordialement,\n${societe.technicien||societe.nom}\n${societe.nom}\n${societe.tel}\n${societe.email}`;
  return body;
}

function SignaturePad({label, onSave, existingSig}) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasSig, setHasSig] = useState(!!existingSig);
  const [saved, setSaved] = useState(!!existingSig);

  useEffect(() => {
    if(existingSig && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const img = new Image(); img.onload=()=>ctx.drawImage(img,0,0); img.src=existingSig;
      setHasSig(true); setSaved(true);
    }
  }, []);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width/r.width, sy = canvas.height/r.height;
    if(e.touches) return {x:(e.touches[0].clientX-r.left)*sx, y:(e.touches[0].clientY-r.top)*sy};
    return {x:(e.clientX-r.left)*sx, y:(e.clientY-r.top)*sy};
  };
  const start = e => { e.preventDefault(); drawing.current=true; setSaved(false); const p=getPos(e,canvasRef.current); const ctx=canvasRef.current.getContext("2d"); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
  const draw = e => { e.preventDefault(); if(!drawing.current) return; const p=getPos(e,canvasRef.current); const ctx=canvasRef.current.getContext("2d"); ctx.lineWidth=2.5; ctx.lineCap="round"; ctx.strokeStyle="#1a1a2e"; ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x,p.y); setHasSig(true); };
  const stop = e => { e.preventDefault(); drawing.current=false; };
  const clear = () => { const ctx=canvasRef.current.getContext("2d"); ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height); setHasSig(false); setSaved(false); onSave(null); };
  const save = () => { onSave(canvasRef.current.toDataURL("image/png")); setSaved(true); };

  return (
    <div>
      <div style={{fontSize:"0.75rem",fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:6}}>{label}</div>
      <div className={`sig-container${hasSig?" active":""}`} style={{height:120}}>
        <canvas ref={canvasRef} width={560} height={120} style={{width:"100%",height:"100%",display:"block"}}
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}/>
        {!hasSig && <div className="sig-label">✍️ Signez ici</div>}
      </div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button className="btn btn-ghost btn-sm" onClick={clear}>🗑 Effacer</button>
        {hasSig && !saved && <button className="btn btn-success btn-sm" onClick={save}>✓ Valider</button>}
        {saved && <span style={{fontSize:"0.78rem",color:"var(--success)",display:"flex",alignItems:"center",gap:5}}>✓ Enregistrée</span>}
      </div>
    </div>
  );
}

function DocWrapper({title, onClose, onMail, children}) {
  return (
    <div className="modal-overlay">
      <div className="modal modal-xl">
        <div className="no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <span className="modal-title" style={{marginBottom:0}}>{title}</span>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {onMail && <button className="btn btn-gmail btn-sm" onClick={onMail}>✉️ Envoyer Gmail</button>}
            <button className="btn btn-primary btn-sm" onClick={()=>window.print()}>🖨️ Imprimer</button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
          </div>
        </div>
        {children}
      </div>
    </div>
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
            <div className="doc-company-info">
              {societe.adresse}<br/>
              Tél : {societe.tel} · {societe.email}<br/>
              SIRET : {societe.siret} · TVA : {societe.tvaIntra}<br/>
              {societe.rge&&<span>{societe.rge}</span>}
            </div>
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
        <div className="doc-client-box">
          <h4>Émetteur</h4>
          <strong>{societe.nom}</strong><br/>
          {societe.adresse}<br/>
          SIRET : {societe.siret}
        </div>
        <div className="doc-client-box">
          <h4>Client / Destinataire</h4>
          <strong>{client?.prenom} {client?.nom}</strong><br/>
          {fullAddr(client)}<br/>
          {client?.tel}
        </div>
      </div>
    </>
  );
}

function DocLignes({lignes}) {
  const tvaMap = {};
  lignes.forEach(l=>{
    const ht=Number(l.qte)*Number(l.pu);
    const t=Number(l.tva||10);
    if(!tvaMap[t]) tvaMap[t]={taux:t,ht:0,tva:0};
    tvaMap[t].ht+=ht; tvaMap[t].tva+=ht*t/100;
  });
  const totalHT = lignes.reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const totalTVA = Object.values(tvaMap).reduce((s,t)=>s+t.tva,0);
  const totalTTC = totalHT+totalTVA;

  return (
    <>
      <table className="doc-items">
        <thead>
          <tr>
            <th style={{width:"45%"}}>Désignation</th>
            <th style={{width:"8%"}}>Qté</th>
            <th style={{width:"8%"}}>Unité</th>
            <th style={{width:"12%",textAlign:"right"}}>P.U. HT</th>
            <th style={{width:"8%",textAlign:"right"}}>TVA</th>
            <th style={{width:"12%",textAlign:"right"}}>Total HT</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((l,i)=>(
            <tr key={i}>
              <td>
                <div style={{fontWeight:l.isTitle?700:400,fontStyle:l.isComment?"italic":"normal",color:l.isTitle?"#1a1a2e":l.isComment?"#888":"inherit"}}>
                  {l.designation||l.desc}
                </div>
                {l.detail&&<div style={{fontSize:10,color:"#888",marginTop:2}}>{l.detail}</div>}
              </td>
              <td style={{textAlign:"center"}}>{l.isTitle||l.isComment?"":l.qte}</td>
              <td style={{textAlign:"center"}}>{l.isTitle||l.isComment?"":l.unite}</td>
              <td style={{textAlign:"right"}}>{l.isTitle||l.isComment?"":money(l.pu)}</td>
              <td style={{textAlign:"right"}}>{l.isTitle||l.isComment?"":l.tva+"%"}</td>
              <td style={{textAlign:"right",fontWeight:600}}>{l.isTitle||l.isComment?"":money(Number(l.qte)*Number(l.pu))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{display:"flex",justifyContent:"flex-end",gap:32,marginTop:8}}>
        <div style={{minWidth:260}}>
          {Object.values(tvaMap).map(t=>(
            <div key={t.taux} style={{display:"flex",justifyContent:"space-between",gap:24,fontSize:11,marginBottom:3}}>
              <span style={{color:"#888"}}>TVA {t.taux}% (base {money(t.ht)})</span>
              <span>{money(t.tva)}</span>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",gap:24,fontSize:11,marginBottom:3,paddingTop:4,borderTop:"1px solid #eee"}}>
            <span style={{color:"#888"}}>Total HT</span><span>{money(totalHT)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",gap:24,fontSize:11,marginBottom:3}}>
            <span style={{color:"#888"}}>Total TVA</span><span>{money(totalTVA)}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",gap:24,fontSize:14,fontWeight:700,color:"#f97316",paddingTop:6,borderTop:"2px solid #f97316",marginTop:4}}>
            <span>Total TTC</span><span>{money(totalTTC)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function DocDevis({doc, client, societe, onClose, onTransform}) {
  const mailBody = `Bonjour ${client?.prenom} ${client?.nom},\n\nVeuillez trouver ci-joint votre devis N° ${doc.numero} du ${fmt(doc.date)} d'un montant de ${money((doc.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0)*(1+(doc.tva||10)/100))} TTC.\n\nCe devis est valable jusqu'au ${fmt(doc.validite)}.\n\nCordialement,\n${societe.technicien}\n${societe.nom}\n${societe.tel}`;
  return (
    <DocWrapper title="Devis" onClose={onClose}
      onMail={client?.email?()=>sendGmail(client.email,`Devis ${doc.numero} — ${societe.nom}`,mailBody):null}>
      <div className="no-print" style={{marginBottom:12}}>
        {doc.statut==="Accepté"
          ?<span className="badge badge-success" style={{fontSize:"0.85rem",padding:"6px 14px"}}>✓ Devis accepté</span>
          :doc.statut==="Refusé"
          ?<span className="badge badge-danger" style={{fontSize:"0.85rem",padding:"6px 14px"}}>✗ Devis refusé</span>
          :doc.statut==="Facturé"
          ?<span className="badge badge-info" style={{fontSize:"0.85rem",padding:"6px 14px"}}>📄 Déjà facturé</span>
          :<span className="badge badge-warning" style={{fontSize:"0.85rem",padding:"6px 14px"}}>En attente de réponse</span>}
        {doc.statut!=="Refusé"&&doc.statut!=="Expiré"&&doc.statut!=="Facturé"&&onTransform&&
          <button className="btn btn-primary btn-sm" style={{marginLeft:10}} onClick={onTransform}>🧾 Transformer en facture</button>}
      </div>
      <div className="doc-preview">
        <DocEntete societe={societe} client={client} type="DEVIS" numero={doc.numero} date={doc.date} validite={doc.validite}/>
        {doc.objet&&<div style={{marginBottom:12,fontSize:12}}><strong>Objet :</strong> {doc.objet}</div>}
        <DocLignes lignes={doc.lignes||[]}/>
        {doc.notes&&<div style={{background:"#f7f8fc",borderRadius:6,padding:"10px 14px",fontSize:11,color:"#555",marginTop:12}}><strong>Conditions / Notes :</strong><br/>{doc.notes}</div>}
        <div style={{marginTop:16,fontSize:10,color:"#888"}}>
          Devis valable jusqu'au {fmt(doc.validite)} — TVA non récupérable pour les travaux en logement de plus de 2 ans (taux réduit 10%)
        </div>
        <div className="doc-sig-row" style={{marginTop:20}}>
          <div className="doc-sig-box"><p>Signature et cachet entreprise</p><div style={{height:60,borderBottom:"1px solid #ddd"}}/></div>
          <div className="doc-sig-box"><p>Bon pour accord — Date et signature client</p><div style={{height:60,borderBottom:"1px solid #ddd"}}/></div>
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
  const mailBody = `Bonjour ${client?.prenom} ${client?.nom},\n\nVeuillez trouver ci-joint votre facture N° ${doc.numero} du ${fmt(doc.date)} d'un montant de ${money(totalTTC)} TTC.\n\nRèglement à réception par : ${doc.modePaiement||"chèque, virement ou espèces"}.\n\nCordialement,\n${societe.technicien}\n${societe.nom}\n${societe.tel}`;
  return (
    <DocWrapper title="Facture" onClose={onClose}
      onMail={client?.email?()=>sendGmail(client.email,`Facture ${doc.numero} — ${societe.nom}`,mailBody):null}>
      <div className="doc-preview">
        <DocEntete societe={societe} client={client} type="FACTURE" numero={doc.numero} date={doc.date} dateEcheance={doc.dateEcheance}/>
        {doc.refDevis&&<div style={{marginBottom:10,fontSize:11,color:"#888"}}>Réf. devis : {doc.refDevis}</div>}
        {doc.objet&&<div style={{marginBottom:12,fontSize:12}}><strong>Objet :</strong> {doc.objet}</div>}
        <DocLignes lignes={doc.lignes||[]}/>
        {doc.acompte>0&&<div style={{display:"flex",justifyContent:"flex-end",marginTop:6}}>
          <div style={{minWidth:260}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:24,fontSize:11,color:"#888",marginBottom:3}}><span>Acompte versé</span><span>- {money(doc.acompte)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",gap:24,fontSize:14,fontWeight:700,color:"#1a1a2e",paddingTop:4,borderTop:"2px solid #1a1a2e"}}><span>Reste à payer</span><span>{money(totalTTC-doc.acompte)}</span></div>
          </div>
        </div>}
        <div style={{marginTop:16,background:"#f7f8fc",borderRadius:7,padding:"12px 16px",fontSize:11}}>
          <div style={{fontWeight:700,marginBottom:6,color:"#1a1a2e"}}>Conditions de règlement</div>
          <div style={{color:"#555"}}>
            Paiement à réception · Modes acceptés : {doc.modePaiement||"Chèque, Virement, Espèces, Carte bancaire"}<br/>
            {doc.iban&&<span>IBAN : {doc.iban}<br/></span>}
            En cas de retard de paiement, une pénalité de 3× le taux d'intérêt légal sera appliquée, ainsi qu'une indemnité forfaitaire de recouvrement de 40€ (art. L.441-10 C.com.)
          </div>
        </div>
        {doc.notes&&<div style={{background:"#f7f8fc",borderRadius:6,padding:"10px 14px",fontSize:11,color:"#555",marginTop:10}}>{doc.notes}</div>}
        {societe.rge&&<div style={{marginTop:10,fontSize:10,color:"#888"}}>Entreprise qualifiée : {societe.rge} — TVA à taux réduit 10% applicable aux travaux de rénovation énergétique (logement de plus de 2 ans)</div>}
        <div style={{marginTop:10,fontSize:10,color:"#aaa",textAlign:"center"}}>
          TVA non applicable si micro-entreprise — Sinon TVA acquittée sur les encaissements<br/>
          {societe.nom} — SIRET {societe.siret} — TVA : {societe.tvaIntra}
        </div>
        <div className="doc-sig-row" style={{marginTop:16}}>
          <div className="doc-sig-box"><p>Signature technicien</p>{doc.sigTech?<img src={doc.sigTech} alt="sig" style={{height:55}}/>:<div style={{height:55,borderBottom:"1px solid #ddd"}}/>}</div>
          <div className="doc-sig-box"><p>Acquitté — Signature client</p>{doc.sigClient?<img src={doc.sigClient} alt="sig" style={{height:55}}/>:<div style={{height:55,borderBottom:"1px solid #ddd"}}/>}</div>
        </div>
        <div className="doc-footer">{societe.nom} — SIRET {societe.siret} — {societe.tel} — {societe.email}</div>
      </div>
    </DocWrapper>
  );
}

function DocBon({doc, client, societe, onClose}) {
  const ht = (doc.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const ttc = ht*(1+(doc.tva||10)/100);
  const histDocs = doc.historique||[];
  return (
    <DocWrapper title="Bon d'intervention" onClose={onClose}
      onMail={client?.email?()=>sendGmail(client.email,`Bon d'intervention ${doc.numero} — ${societe.nom}`,buildMailBody(doc,client,societe)):null}>
      <div className="doc-preview">
        <div className="doc-head">
          <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
            {societe.logo&&<img src={societe.logo} alt="Logo" style={{height:60,maxWidth:130,objectFit:"contain",flexShrink:0}}/>}
            <div>
              <div className="doc-company-name">{societe.nom}</div>
              <div className="doc-company-info">{societe.adresse}<br/>Tél : {societe.tel} · {societe.email}<br/>SIRET : {societe.siret}</div>
            </div>
          </div>
          <div>
            <div className="doc-ref-type">BON D'INTERVENTION</div>
            <div className="doc-ref-info">N° {doc.numero}</div>
            <div className="doc-ref-info">Date : {fmt(doc.date)}</div>
            <div className="doc-ref-info">Technicien : {societe.technicien}</div>
          </div>
        </div>
        <div className="doc-2col">
          <div className="doc-section">
            <div className="doc-section-title">Client</div>
            <div className="doc-field"><div className="doc-field-label">Nom</div><div className="doc-field-value">{client?.prenom} {client?.nom}</div></div>
            <div className="doc-field"><div className="doc-field-label">Adresse</div><div className="doc-field-value">{fullAddr(client)}</div></div>
            <div className="doc-field"><div className="doc-field-label">Téléphone</div><div className="doc-field-value">{client?.tel}</div></div>
          </div>
          <div className="doc-section">
            <div className="doc-section-title">Équipement</div>
            <div className="doc-field"><div className="doc-field-label">Marque / Modèle</div><div className="doc-field-value">{doc.equip?.marque||"—"} {doc.equip?.modele}</div></div>
            <div className="doc-field"><div className="doc-field-label">N° de série</div><div className="doc-field-value">{doc.equip?.numSerie||"—"}</div></div>
            <div className="doc-field"><div className="doc-field-label">Puissance</div><div className="doc-field-value">{doc.equip?.puissance||"—"}</div></div>
          </div>
        </div>
        <div className="doc-section">
          <div className="doc-section-title">Intervention — {doc.typeIntervention}</div>
          <div className="doc-2col">
            <div className="doc-field"><div className="doc-field-label">Travaux réalisés</div><div className="doc-field-value" style={{minHeight:60,whiteSpace:"pre-wrap"}}>{doc.observations||""}</div></div>
            <div className="doc-field"><div className="doc-field-label">Pièces changées</div><div className="doc-field-value" style={{minHeight:60,whiteSpace:"pre-wrap"}}>{doc.piecesChangees||""}</div></div>
          </div>
        </div>
        {(doc.lignes||[]).length > 0 && <>
          <table className="doc-items">
            <thead><tr><th>Désignation</th><th>Qté</th><th>Unité</th><th style={{textAlign:"right"}}>P.U. HT</th><th style={{textAlign:"right"}}>Total HT</th></tr></thead>
            <tbody>{doc.lignes.map((l,i)=><tr key={i}><td>{l.desc}</td><td>{l.qte}</td><td>{l.unite}</td><td style={{textAlign:"right"}}>{money(l.pu)}</td><td style={{textAlign:"right"}}>{money(l.qte*l.pu)}</td></tr>)}</tbody>
          </table>
          <div className="doc-totals">
            <div className="doc-total-row"><span>Total HT</span><span>{money(ht)}</span></div>
            <div className="doc-total-row"><span>TVA {doc.tva}%</span><span>{money(ht*doc.tva/100)}</span></div>
            <div className="doc-total-row ttc"><span>Total TTC</span><span>{money(ttc)}</span></div>
          </div>
        </>}
        <div className="doc-sig-row">
          <div className="doc-sig-box"><p>Signature technicien</p>{doc.sigTech?<img src={doc.sigTech} alt="sig"/>:<div style={{height:65,borderBottom:"1px solid #ddd"}}/>}</div>
          <div className="doc-sig-box"><p>Signature client</p>{doc.sigClient?<img src={doc.sigClient} alt="sig"/>:<div style={{height:65,borderBottom:"1px solid #ddd"}}/>}</div>
        </div>
        <div className="doc-footer">{societe.nom} — SIRET {societe.siret} — {societe.tel} — {societe.email}</div>
      </div>
    </DocWrapper>
  );
}

function DocAttestation({doc, client, societe, onClose}) {
  const isFioul = doc.combustible==="Fioul";
  const checkList = isFioul?CHECKS_FIOUL:CHECKS_GAZ;
  const checks = doc.checks||{};
  const nonConf = (doc.nonConformites||[]).filter(n=>n.trim());
  const hasNonConf = nonConf.length>0;
  const equip = doc.equip||{};
  const classeColor = {A:"#22c55e",B:"#86efac",C:"#fde047",D:"#fb923c",E:"#f97316",F:"#ef4444",G:"#991b1b"};

  return (
    <DocWrapper title={`Attestation d'entretien — ${doc.combustible}`} onClose={onClose}
      onMail={client?.email?()=>sendGmail(client.email,`Attestation d'entretien ${doc.numero} — ${societe.nom}`,buildMailBody(doc,client,societe)):null}>
      <div className="doc-preview">
        <div className="doc-head">
          <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
            {societe.logo&&<img src={societe.logo} alt="Logo" style={{height:60,maxWidth:130,objectFit:"contain",flexShrink:0}}/>}
            <div>
              <div className="doc-company-name">{societe.nom}</div>
              <div className="doc-company-info">{societe.adresse}<br/>Tél : {societe.tel} · {societe.email}<br/>SIRET : {societe.siret}</div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="doc-ref-type">ATTESTATION D'ENTRETIEN</div>
            <div className="doc-ref-info">{isFioul?"Chaudière à combustible liquide":"Chaudière à gaz"}</div>
            <div className="doc-ref-info">N° {doc.numero} · {fmt(doc.date)}</div>
            <div className="doc-ref-info">Technicien : {societe.technicien}</div>
          </div>
        </div>
        {hasNonConf && <div style={{background:"#fee2e2",border:"2px solid #ef4444",borderRadius:8,padding:"10px 14px",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:11,color:"#dc2626",marginBottom:6}}>⚠️ NON-CONFORMITÉ(S) CONSTATÉE(S)</div>
          {nonConf.map((n,i)=><div key={i} style={{fontSize:10.5,color:"#991b1b",marginBottom:3}}>• {n}</div>)}
        </div>}
        <div className="doc-2col">
          <div>
            <div className="doc-section-title">Propriétaire</div>
            <div className="doc-field"><div className="doc-field-label">Nom</div><div className="doc-field-value">{client?.prenom} {client?.nom}</div></div>
            <div className="doc-field"><div className="doc-field-label">Adresse</div><div className="doc-field-value">{fullAddr(client)}</div></div>
          </div>
          <div>
            <div className="doc-section-title">Appareil</div>
            <div className="doc-field"><div className="doc-field-label">Marque / Modèle</div><div className="doc-field-value">{equip.marque||"—"} {equip.modele}</div></div>
            <div className="doc-field"><div className="doc-field-label">N° de série</div><div className="doc-field-value">{equip.numSerie||"—"}</div></div>
            <div className="doc-field"><div className="doc-field-label">Puissance</div><div className="doc-field-value">{equip.puissance||"—"}</div></div>
            <div className="doc-field"><div className="doc-field-label">Année</div><div className="doc-field-value">{equip.annee||"—"}</div></div>
          </div>
        </div>
        <div className="doc-section-title">🔬 Mesures de combustion</div>
        <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:7,padding:"10px 14px",marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"6px 16px"}}>
            {[["CO ambiant (ppm)",doc.coAmbiant],["CO fumées (ppm)",doc.coFumees],["CO₂ (%)",doc.co2],["O₂ (%)",doc.o2],["Temp. fumées (°C)",doc.tempFumees],["Rendement PCI (%)",doc.rendement],["Tirage (Pa)",doc.tirage],["NOx (mg/kWh)",doc.nox]].map((item,i)=>(
              <div key={i}>
                <div style={{fontSize:8.5,color:"#aaa",textTransform:"uppercase"}}>{item[0]}</div>
                <div style={{fontSize:12,fontWeight:700,color:item[1]?"#1a1a2e":"#ccc",borderBottom:"1px solid #e2e8f0",paddingBottom:2,marginTop:1}}>{item[1]||"—"}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="doc-section-title">Points de vérification ({checkList.length} points)</div>
        <div className="doc-check-grid">
          {checkList.map((c,i)=>(
            <div key={i} className="doc-check-item">
              <div className={`doc-check-box${checks[i]==="ok"?" ok":checks[i]==="nok"?" nok":""}`}>{checks[i]==="ok"?"✓":checks[i]==="nok"?"✗":""}</div>
              <span style={{color:checks[i]==="nok"?"#dc2626":""}}>{c}</span>
            </div>
          ))}
        </div>
        {doc.observations&&<><div className="doc-section-title">Observations</div><div style={{border:"1px solid #eee",borderRadius:6,padding:"9px 12px",marginBottom:12,fontSize:10.5,color:"#555"}}>{doc.observations}</div></>}
        <div className="doc-sig-row">
          <div className="doc-sig-box"><p>Signature technicien</p>{doc.sigTech?<img src={doc.sigTech} alt="sig"/>:<div style={{height:65,borderBottom:"1px solid #ddd"}}/>}</div>
          <div className="doc-sig-box"><p>Signature client</p>{doc.sigClient?<img src={doc.sigClient} alt="sig"/>:<div style={{height:65,borderBottom:"1px solid #ddd"}}/>}</div>
        </div>
        <div className="doc-footer">
          Document à conserver pendant 2 ans.<br/>
          {societe.nom} — SIRET {societe.siret} — {societe.tel}
        </div>
      </div>
    </DocWrapper>
  );
}

const EQUIP_ICON = t => t==="Chaudière gaz"?"🔥":t==="Chaudière fioul"?"🛢️":t==="Chauffe-eau gaz"?"💧":t==="Climatisation"?"❄️":t==="Pompe à chaleur"?"♨️":"🪵";

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
        <div className="form-group full"><label>Type d'équipement</label>
          <select value={equip.type} onChange={e=>onChange({...equip,type:e.target.value})}>
            {TYPES_EQUIP.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        {equip.type==="Poêle à bois"&&<>
          <div className="form-group"><label>Marque</label><input value={equip.marque||""} onChange={e=>s("marque",e.target.value)} placeholder="Invicta, Godin…"/></div>
          <div className="form-group"><label>Modèle</label><input value={equip.modele||""} onChange={e=>s("modele",e.target.value)}/></div>
          <div className="form-group"><label>Puissance (kW)</label><input value={equip.puissance||""} onChange={e=>s("puissance",e.target.value)}/></div>
          <div className="form-group"><label>Année</label><input value={equip.annee||""} onChange={e=>s("annee",e.target.value)}/></div>
          <div className="form-group full"><label>Notes</label><textarea value={equip.notes||""} onChange={e=>s("notes",e.target.value)} style={{minHeight:44}}/></div>
        </>}
        {isClim && <>
          <div className="form-group"><label>Marque</label>
            <select value={equip.marqueClim||""} onChange={e=>s("marqueClim",e.target.value)}>
              <option value="">— Sélectionner —</option>{MARQUES_CLIM.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Type</label>
            <select value={equip.typeClim||"Simple split"} onChange={e=>s("typeClim",e.target.value)}>
              {TYPES_CLIM.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Modèle</label><input value={equip.modele||""} onChange={e=>s("modele",e.target.value)}/></div>
          <div className="form-group"><label>N° de série</label><input value={equip.numSerieClim||""} onChange={e=>s("numSerieClim",e.target.value)}/></div>
          <div className="form-group"><label>Puissance (kW)</label><input value={equip.puissanceClim||""} onChange={e=>s("puissanceClim",e.target.value)}/></div>
          <div className="form-group"><label>Année</label><input value={equip.anneeClim||""} onChange={e=>s("anneeClim",e.target.value)}/></div>
        </>}
        {isPac && <>
          <div className="form-group"><label>Marque</label>
            <select value={equip.marquePac||""} onChange={e=>s("marquePac",e.target.value)}>
              <option value="">— Sélectionner —</option>{MARQUES_PAC.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Modèle</label><input value={equip.modelePac||""} onChange={e=>s("modelePac",e.target.value)}/></div>
          <div className="form-group"><label>N° de série</label><input value={equip.numSeriePac||""} onChange={e=>s("numSeriePac",e.target.value)}/></div>
          <div className="form-group"><label>Puissance (kW)</label><input value={equip.puissancePac||""} onChange={e=>s("puissancePac",e.target.value)}/></div>
          <div className="form-group"><label>COP</label><input value={equip.copPac||""} onChange={e=>s("copPac",e.target.value)}/></div>
          <div className="form-group"><label>Année</label><input value={equip.anneePac||""} onChange={e=>s("anneePac",e.target.value)}/></div>
        </>}
        {isChaud && <>
          {isGaz && <div className="form-group"><label>Type de gaz</label>
            <select value={equip.gaz||"Gaz naturel"} onChange={e=>s("gaz",e.target.value)}>
              {GAZ_TYPES.map(g=><option key={g}>{g}</option>)}
            </select>
          </div>}
          <div className="form-group"><label>Marque</label>
            <select value={equip.marque||""} onChange={e=>s("marque",e.target.value)}>
              <option value="">— Sélectionner —</option>{MARQUES_CHAUDIERE.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Modèle</label><input value={equip.modele||""} onChange={e=>s("modele",e.target.value)}/></div>
          <div className="form-group"><label>N° de série</label><input value={equip.numSerie||""} onChange={e=>s("numSerie",e.target.value)}/></div>
          <div className="form-group"><label>Puissance</label><input value={equip.puissance||""} onChange={e=>s("puissance",e.target.value)}/></div>
          <div className="form-group"><label>Année</label><input value={equip.annee||""} onChange={e=>s("annee",e.target.value)}/></div>
          <div className="form-group"><label>Conduit</label><input value={equip.conduit||""} onChange={e=>s("conduit",e.target.value)} placeholder="Ventouse, cheminée…"/></div>
          {isGaz && <div className="form-group"><label>Type brûleur</label><input value={equip.typeBruleur||""} onChange={e=>s("typeBruleur",e.target.value)}/></div>}
        </>}
        {isFioul && <>
          <div className="form-group"><label>Marque brûleur</label><input value={equip.marqueBruleur||""} onChange={e=>s("marqueBruleur",e.target.value)}/></div>
          <div className="form-group"><label>Modèle brûleur</label><input value={equip.modeleBruleur||""} onChange={e=>s("modeleBruleur",e.target.value)}/></div>
          <div className="form-group"><label>Marque gicleur</label>
            <select value={equip.marqueGicleur||"Steinen"} onChange={e=>s("marqueGicleur",e.target.value)}>
              {MARQUES_GICLEUR.map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Débit (gal/h)</label><input value={equip.debitGicleur||""} onChange={e=>s("debitGicleur",e.target.value)}/></div>
          <div className="form-group"><label>Angle</label>
            <select value={equip.angleGicleur||"60°"} onChange={e=>s("angleGicleur",e.target.value)}>
              {ANGLES_GICLEUR.map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="form-group"><label>Spectre</label>
            <select value={equip.spectreGicleur||"S (solide)"} onChange={e=>s("spectreGicleur",e.target.value)}>
              {SPECTRES_GICLEUR.map(sp=><option key={sp}>{sp}</option>)}
            </select>
          </div>
        </>}
        <div className="form-group"><label>Contrat</label>
          <select value={equip.contrat||""} onChange={e=>s("contrat",e.target.value)}>
            <option value="">Aucun</option><option>Contrat entretien</option><option>Contrat pièces et MO</option><option>Autre</option>
          </select>
        </div>
        {equip.contrat && <>
          <div className="form-group"><label>N° contrat</label><input value={equip.numContrat||""} onChange={e=>s("numContrat",e.target.value)}/></div>
          <div className="form-group"><label>Échéance</label><input type="date" value={equip.echeanceContrat||""} onChange={e=>s("echeanceContrat",e.target.value)}/></div>
        </>}
        <div className="form-group full"><label>Notes</label><textarea value={equip.notes||""} onChange={e=>s("notes",e.target.value)} style={{minHeight:44}}/></div>
      </div>
    </div>
  );
}

function ModalClient({client, onSave, onClose}) {
  const blank = {nom:"",prenom:"",adresse:"",codePostal:"",ville:"",tel:"",email:"",type:"Particulier",equipements:[newEquip("Chaudière gaz")],notes:"",photos:[]};
  const [f,setF]=useState(client ? {...client, equipements: client.equipements||[newEquip("Chaudière gaz")], photos: client.photos||[]} : blank);
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const addEquip=(type="Chaudière gaz")=>setF(p=>({...p,equipements:[...p.equipements,newEquip(type)]}));
  const updateEquip=(i,e)=>setF(p=>{const eq=[...p.equipements];eq[i]=e;return{...p,equipements:eq};});
  const delEquip=(i)=>setF(p=>({...p,equipements:p.equipements.filter((_,j)=>j!==i)}));

  const handlePhoto = e => {
    const files = Array.from(e.target.files);
    if((f.photos||[]).length + files.length > 5) { alert("Maximum 5 photos par client"); return; }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setF(p=>({...p,photos:[...(p.photos||[]),{url:ev.target.result,name:file.name,date:new Date().toISOString().slice(0,10)}]}));
      reader.readAsDataURL(file);
    });
  };
  const delPhoto = i => setF(p=>({...p,photos:p.photos.filter((_,j)=>j!==i)}));
  const photoInputRef = useRef(null);

  return (
    <div className="modal-overlay"><div className="modal modal-xl">
      <div className="modal-title">{client?"Modifier le client":"Nouveau client"}</div>
      <div className="form-grid">
        <div className="form-group"><label>Prénom</label><input value={f.prenom} onChange={e=>s("prenom",e.target.value)}/></div>
        <div className="form-group"><label>Nom *</label><input value={f.nom} onChange={e=>s("nom",e.target.value)}/></div>
        <div className="form-group full"><label>Adresse</label><input value={f.adresse} onChange={e=>s("adresse",e.target.value)}/></div>
        <div className="form-group"><label>Code postal</label><input value={f.codePostal||""} onChange={e=>s("codePostal",e.target.value)} maxLength={5}/></div>
        <div className="form-group"><label>Ville</label><input value={f.ville||""} onChange={e=>s("ville",e.target.value)}/></div>
        <div className="form-group"><label>Téléphone</label><input value={f.tel} onChange={e=>s("tel",e.target.value)}/></div>
        <div className="form-group"><label>Email</label><input value={f.email} onChange={e=>s("email",e.target.value)}/></div>
        <div className="form-group"><label>Type client</label><select value={f.type} onChange={e=>s("type",e.target.value)}><option>Particulier</option><option>Professionnel</option><option>Copropriété</option></select></div>
        <div className="form-group full"><label>Notes</label><textarea value={f.notes||""} onChange={e=>s("notes",e.target.value)} style={{minHeight:44}}/></div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"18px 0 10px"}}>
        <div style={{fontSize:"0.8rem",fontWeight:600,color:"var(--accent)",textTransform:"uppercase"}}>📷 Photos ({(f.photos||[]).length}/5)</div>
        {(f.photos||[]).length < 5 && <button className="btn btn-secondary btn-sm" onClick={()=>photoInputRef.current?.click()}>📷 Ajouter</button>}
      </div>
      <input ref={photoInputRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handlePhoto}/>
      {(f.photos||[]).length > 0 && <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}}>
        {f.photos.map((p,i)=>(
          <div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",aspectRatio:"1",border:"1px solid var(--border)"}}>
            <img src={p.url} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <button onClick={()=>delPhoto(i)} style={{position:"absolute",top:4,right:4,width:22,height:22,borderRadius:"50%",background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",fontSize:"0.7rem"}}>✕</button>
          </div>
        ))}
      </div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"18px 0 12px"}}>
        <div style={{fontSize:"0.8rem",fontWeight:600,color:"var(--accent)",textTransform:"uppercase"}}>Équipements ({f.equipements.length})</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {TYPES_EQUIP.map(t=><button key={t} className="btn btn-secondary btn-sm" onClick={()=>addEquip(t)}>{EQUIP_ICON(t)} +</button>)}
        </div>
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
  const [clientSearch,setClientSearch]=useState(()=>{
    if(rdv?.clientId){const c=clients.find(x=>x.id===rdv.clientId);return c?`${c.prenom} ${c.nom}`:"";} return "";
  });
  const [showDrop,setShowDrop]=useState(false);
  const s=(k,v)=>setF(p=>({...p,[k]:v}));

  const clientFiltered = clientSearch.length>0
    ? clients.filter(c=>`${c.prenom} ${c.nom} ${c.ville||""} ${c.tel}`.toLowerCase().includes(clientSearch.toLowerCase()))
    : clients.slice(0,8);

  const selectClient = c => {
    s("clientId", c.id);
    setClientSearch(`${c.prenom} ${c.nom} — ${c.ville||""}`);
    setShowDrop(false);
  };

  return (
    <div className="modal-overlay"><div className="modal">
      <div className="modal-title">{rdv?"Modifier le RDV":"Nouveau rendez-vous"}</div>
      <div className="form-grid">
        <div className="form-group full" style={{position:"relative"}}>
          <label>Client</label>
          <input value={clientSearch} onChange={e=>{setClientSearch(e.target.value);setShowDrop(true);s("clientId","");}} onFocus={()=>setShowDrop(true)} placeholder="🔍 Rechercher…"/>
          {showDrop && clientFiltered.length>0 && (
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,zIndex:300,maxHeight:220,overflowY:"auto",boxShadow:"0 8px 24px #00000060",marginTop:4}}>
              {clientFiltered.map(c=>(
                <div key={c.id} onClick={()=>selectClient(c)} style={{padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--border)"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--surface2)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div style={{fontWeight:600,fontSize:"0.875rem"}}>{c.prenom} {c.nom}</div>
                  <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>{fullAddr(c)} · {c.tel}</div>
                </div>
              ))}
            </div>
          )}
          {f.clientId&&<div style={{fontSize:"0.75rem",color:"var(--success)",marginTop:4}}>✓ Client sélectionné</div>}
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
  const emptyLine={desc:"",qte:1,pu:0,unite:"h"};
  const equips = client.equipements||[];
  const selEquip = equips[selectedEquipIdx]||{};
  const isSelClim = selEquip.type==="Climatisation";
  const [f,setF]=useState({
    clientId:client.id, numero:numAuto, date:rdv.date, tva:10, statut:"Émise",
    lignes:[{...emptyLine}], observations:"", piecesChangees:"", conseils:"",
    heureArrivee:"", heureDepart:"", tempsP:"", montantRecu:"", modeReglement:"Chèque", reference:"",
    typeIntervention:rdv.type,
    combustible:selEquip.type==="Chaudière fioul"?"Fioul":"Gaz",
    typeChaudiere:"", gaz:selEquip.gaz||"Gaz naturel",
    marque:selEquip.marque||selEquip.marqueClim||"", modele:selEquip.modele||"",
    annee:selEquip.annee||selEquip.anneeClim||"",
    puissance:selEquip.puissance||selEquip.puissanceClim||"",
    numSerie:selEquip.numSerie||selEquip.numSerieClim||"",
    coAmbiant:"", coFumees:"", co2:"", o2:"", tempFumees:"", tempAir:"",
    rendement:"", rendementRef:"", tirage:"", nox:"", indiceF:"",
    tempFroid:"", tempChaud:"",
    etat:"Bon état de fonctionnement", classeEnergetique:"",
    nonConformites:[""], checks:{},
  });
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const setLine=(i,k,v)=>setF(p=>{const l=[...p.lignes];l[i]={...l[i],[k]:v};return{...p,lignes:l};});
  const addLine=()=>setF(p=>({...p,lignes:[...p.lignes,{...emptyLine}]}));
  const delLine=(i)=>setF(p=>({...p,lignes:p.lignes.filter((_,j)=>j!==i)}));
  const setCheck=(i,v)=>setF(p=>({...p,checks:{...p.checks,[i]:p.checks[i]===v?undefined:v}}));
  const checkList=typeDoc==="Attestation Clim"?CHECKS_CLIM:f.combustible==="Fioul"?CHECKS_FIOUL:CHECKS_GAZ;
  const isAtt=typeDoc?.startsWith("Attestation");
  const isClim=typeDoc==="Attestation Clim";

  const [docTab, setDocTab] = useState("facture");
  const [docLignes, setDocLignes] = useState([]);
  const [docObjet, setDocObjet] = useState("");
  const [showCatWizard, setShowCatWizard] = useState(false);
  const [catFilter, setCatFilter] = useState("Tous");

  const docHT = docLignes.reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const docTVAmt = docLignes.reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*Number(l.tva||10)/100,0);
  const docTTC = docHT + docTVAmt;

  const addDocLine = () => setDocLignes(p=>[...p,{designation:"",qte:1,pu:0,tva:10,unite:"Forfait"}]);
  const addFromCatWizard = item => setDocLignes(p=>[...p,{designation:item.designation,qte:1,pu:item.pu,tva:item.tva,unite:item.unite}]);
  const setDocLine = (i,k,v) => setDocLignes(p=>{const l=[...p];l[i]={...l[i],[k]:v};return l;});
  const delDocLine = i => setDocLignes(p=>p.filter((_,j)=>j!==i));

  const prevDocs = docs.filter(d=>d.clientId===client.id).map(d=>({date:d.date,type:d.type,pieces:d.piecesChangees,tech:INIT_SOCIETE.technicien}));

  const handleSave=()=>{
    const newDocs=[];
    const bonDoc = {
      type:typeDoc==="Dépannage"?"Dépannage":"Bon d'intervention",
      typeIntervention:rdv.type, numero:`BI-${f.numero}`, date:f.date,
      clientId:client.id, tva:f.tva, statut:"Émise",
      lignes:f.lignes, observations:f.observations, piecesChangees:f.piecesChangees,
      heureArrivee:f.heureArrivee, heureDepart:f.heureDepart, tempsP:f.tempsP,
      montantRecu:f.montantRecu, modeReglement:f.modeReglement, reference:f.reference,
      historique:prevDocs, equip:selEquip, sigTech, sigClient,
    };
    newDocs.push(bonDoc);
    if(isAtt) newDocs.push({
      type:typeDoc, numero:`ATT-${f.numero}`, date:f.date, clientId:client.id, statut:"Émise",
      combustible:f.combustible, typeChaudiere:f.typeChaudiere,
      equip:selEquip,
      coAmbiant:f.coAmbiant, coFumees:f.coFumees, co2:f.co2, o2:f.o2,
      tempFumees:f.tempFumees, tempAir:f.tempAir, rendement:f.rendement,
      rendementRef:f.rendementRef, tirage:f.tirage, nox:f.nox, indiceF:f.indiceF,
      etat:f.etat, nonConformites:(f.nonConformites||[]).filter(n=>n.trim()),
      checks:f.checks, observations:f.observations,
      conseils:f.conseils, lignes:[], sigTech, sigClient,
    });
    if(docTab!=="aucun"&&docLignes.length>0) {
      const numDoc=`${docTab==="devis"?"DEV":"FAC"}-${f.numero}`;
      newDocs.push({
        type:docTab==="devis"?"Devis":"Facture",
        numero:numDoc, date:f.date, clientId:client.id,
        objet:docObjet||f.typeIntervention,
        statut:docTab==="devis"?"En attente":"En attente de règlement",
        lignes:docLignes, dateEcheance:f.date,
        modePaiement:"Chèque, Virement, Espèces, Carte bancaire",
        acompte:0, sigTech, sigClient,
      });
    }
    onSave(newDocs);
  };

  return (
    <div className="modal-overlay"><div className="modal modal-xl" style={{maxWidth:820}}>
      <div className="no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div className="modal-title" style={{marginBottom:0}}>
          {step===1?"Démarrer l'intervention":step===2?"Saisie":step===3?"Devis / Facture":"Signatures"}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
      </div>

      <div className="inter-header">
        <span style={{fontSize:"1.4rem"}}>👤</span>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:"0.95rem"}}>{client.prenom} {client.nom}</div>
          <div style={{fontSize:"0.78rem",color:"var(--muted)"}}><AddrLink client={client} style={{fontSize:"0.78rem"}}/> · {client.tel}</div>
          <div style={{fontSize:"0.75rem",color:"var(--muted)"}}>📅 {fmt(rdv.date)} à {rdv.heure} · {rdv.type}</div>
        </div>
      </div>

      {step===1&&<>
        {equips.length>1&&<div style={{marginBottom:16}}>
          <div style={{fontSize:"0.8rem",fontWeight:600,color:"var(--muted)",marginBottom:8}}>Équipement concerné</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {equips.map((e,i)=>(
              <button key={i} className={`btn btn-sm ${selectedEquipIdx===i?"btn-primary":"btn-secondary"}`} onClick={()=>setSelectedEquipIdx(i)}>
                {e.type==="Climatisation"?"❄️":"🔥"} {e.type} {e.marque||e.marqueClim||""}
              </button>
            ))}
          </div>
        </div>}
        <div className="action-grid">
          {[
            {id:"Entretien",icon:"🔧",title:"Bon d'intervention",desc:"Sans attestation"},
            ...(!isSelClim?[
              {id:"Attestation Gaz",icon:"🔥",title:"Attestation Gaz",desc:"Chaudière gaz"},
              {id:"Attestation Fioul",icon:"🛢️",title:"Attestation Fioul",desc:"Chaudière fioul"},
            ]:[]),
            ...(isSelClim?[{id:"Attestation Clim",icon:"❄️",title:"Attestation Clim",desc:"Climatisation"}]:[]),
            {id:"Dépannage",icon:"⚠️",title:"Dépannage",desc:"Avec facturation"},
          ].map(t=>(
            <div key={t.id} className="action-card" onClick={()=>{
              setTypeDoc(t.id);
              setF(p=>({...p,combustible:t.id==="Attestation Fioul"?"Fioul":"Gaz"}));
              setStep(2);
            }}>
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
          <div className="wizard-step-title"><div className="wizard-step-num">2</div>Identification chaudière</div>
          <div className="form-grid">
            <div className="form-group"><label>Combustible</label>
              <select value={f.combustible} onChange={e=>s("combustible",e.target.value)}><option>Gaz</option><option>Fioul</option></select>
            </div>
            <div className="form-group"><label>État général</label>
              <select value={f.etat} onChange={e=>s("etat",e.target.value)}>
                <option>Bon état de fonctionnement</option><option>État correct — surveillance recommandée</option><option>Mauvais état — intervention nécessaire</option>
              </select>
            </div>
          </div>
        </div>}

        {isAtt&&!isClim&&<div className="wizard-step">
          <div className="wizard-step-title"><div className="wizard-step-num">3</div>🔬 Ticket de combustion</div>
          <div className="form-grid">
            <div className="form-group"><label>CO ambiant (ppm)</label><input type="number" value={f.coAmbiant||""} onChange={e=>s("coAmbiant",e.target.value)}/></div>
            <div className="form-group"><label>CO fumées (ppm)</label><input type="number" value={f.coFumees||""} onChange={e=>s("coFumees",e.target.value)}/></div>
            <div className="form-group"><label>CO₂ (%)</label><input type="number" step="0.1" value={f.co2||""} onChange={e=>s("co2",e.target.value)}/></div>
            <div className="form-group"><label>O₂ (%)</label><input type="number" step="0.1" value={f.o2||""} onChange={e=>s("o2",e.target.value)}/></div>
            <div className="form-group"><label>Temp. fumées (°C)</label><input type="number" value={f.tempFumees||""} onChange={e=>s("tempFumees",e.target.value)}/></div>
            <div className="form-group"><label>Rendement PCI (%)</label><input type="number" step="0.1" value={f.rendement||""} onChange={e=>s("rendement",e.target.value)}/></div>
            <div className="form-group"><label>Tirage (Pa)</label><input type="number" value={f.tirage||""} onChange={e=>s("tirage",e.target.value)}/></div>
            <div className="form-group"><label>NOx (mg/kWh)</label><input type="number" value={f.nox||""} onChange={e=>s("nox",e.target.value)}/></div>
          </div>
        </div>}

        {isAtt&&<div className="wizard-step">
          <div className="wizard-step-title"><div className="wizard-step-num">{isClim?"2":"4"}</div>⚠️ Non-conformités</div>
          {(f.nonConformites||[""]).map((nc,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
              <input value={nc} onChange={e=>{const arr=[...(f.nonConformites||[""])];arr[i]=e.target.value;s("nonConformites",arr);}} placeholder={`Non-conformité ${i+1}`} style={{flex:1}}/>
              <button className="btn btn-ghost btn-sm" onClick={()=>{const arr=(f.nonConformites||[""]).filter((_,j)=>j!==i);s("nonConformites",arr.length?arr:[""]);}}>✕</button>
            </div>
          ))}
          <button className="btn btn-secondary btn-sm" onClick={()=>s("nonConformites",[...(f.nonConformites||[""]),""]) }>+ Ajouter</button>
        </div>}

        {isAtt&&<div className="wizard-step">
          <div className="wizard-step-title"><div className="wizard-step-num">{isClim?"3":"5"}</div>Points de vérification</div>
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
          <div className="wizard-step-title"><div className="wizard-step-num">{isAtt?(isClim?"4":"6"):"2"}</div>Travaux & Observations</div>
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
        <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setStep(2)}>← Retour</button>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16,background:"var(--surface2)",borderRadius:10,padding:4}}>
          {[["facture","🧾 Facture"],["devis","📋 Devis"],["aucun","⏭ Passer"]].map(item=>(
            <button key={item[0]} onClick={()=>setDocTab(item[0])} className={`btn${docTab===item[0]?" btn-primary":" btn-ghost"}`} style={{flex:1,justifyContent:"center"}}>{item[1]}</button>
          ))}
        </div>
        {docTab!=="aucun"&&<>
          <div className="form-group" style={{marginBottom:14}}>
            <label>Objet</label>
            <input value={docObjet} onChange={e=>setDocObjet(e.target.value)} placeholder="Ex: Entretien annuel"/>
          </div>
          <div style={{marginBottom:12}}>
            <button className="btn btn-secondary btn-sm" onClick={()=>setShowCatWizard(p=>!p)}>📚 {showCatWizard?"Masquer":"Bibliothèque"}</button>
            {showCatWizard&&<div style={{marginTop:10}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                {["Tous",...CATS_CATALOGUE].map(c=><div key={c} onClick={()=>setCatFilter(c)} style={{padding:"4px 10px",borderRadius:6,fontSize:"0.72rem",cursor:"pointer",background:catFilter===c?"var(--accent)":"var(--surface2)",color:catFilter===c?"#fff":"var(--muted)"}}>{c}</div>)}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:6,maxHeight:160,overflowY:"auto"}}>
                {(catFilter==="Tous"?catalogue:catalogue.filter(c=>c.categorie===catFilter)).map(item=>(
                  <div key={item.id} onClick={()=>addFromCatWizard(item)}
                    style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                    <div style={{fontWeight:600,fontSize:"0.8rem"}}>{item.designation}</div>
                    <div style={{fontSize:"0.72rem",color:"var(--muted)"}}>{money(item.pu)} HT · TVA {item.tva}%</div>
                  </div>
                ))}
              </div>
            </div>}
          </div>
          {docLignes.length>0&&<div style={{background:"var(--surface2)",borderRadius:10,padding:10,marginBottom:10}}>
            {docLignes.map((l,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"2.5fr 0.5fr 0.8fr 0.8fr auto",gap:6,marginBottom:6,alignItems:"center",background:"var(--surface)",borderRadius:8,padding:"7px 10px"}}>
                <input value={l.designation||""} onChange={e=>setDocLine(i,"designation",e.target.value)} placeholder="Désignation"/>
                <input type="number" value={l.qte||1} onChange={e=>setDocLine(i,"qte",e.target.value)} min={0} step="0.5"/>
                <input type="number" value={l.pu||0} onChange={e=>setDocLine(i,"pu",e.target.value)} min={0} step="0.01"/>
                <select value={l.tva||10} onChange={e=>setDocLine(i,"tva",Number(e.target.value))}>
                  <option value={0}>0%</option><option value={5.5}>5.5%</option><option value={10}>10%</option><option value={20}>20%</option>
                </select>
                <button className="btn btn-danger btn-sm" onClick={()=>delDocLine(i)}>✕</button>
              </div>
            ))}
          </div>}
          <button className="btn btn-secondary btn-sm" onClick={addDocLine} style={{marginBottom:14}}>+ Ligne</button>
          {docLignes.length>0&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}>
            <div style={{background:"var(--surface2)",borderRadius:10,padding:"10px 16px",minWidth:220,textAlign:"right"}}>
              <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:3}}>HT : {money(docHT)} · TVA : {money(docTVAmt)}</div>
              <div style={{fontSize:"1rem",fontWeight:700,color:"var(--accent)"}}>TTC : {money(docTTC)}</div>
            </div>
          </div>}
          {docTab==="facture"&&<div style={{background:"var(--surface2)",borderRadius:10,padding:14,marginBottom:4}}>
            <div className="form-grid">
              <div className="form-group"><label>Mode règlement</label>
                <select value={f.modeReglement} onChange={e=>s("modeReglement",e.target.value)}>
                  <option>Chèque</option><option>Espèces</option><option>Virement</option><option>CB</option><option>Non réglé</option>
                </select>
              </div>
              <div className="form-group"><label>Montant reçu</label><input value={f.montantRecu} onChange={e=>s("montantRecu",e.target.value)}/></div>
            </div>
          </div>}
        </>}
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-lg" onClick={()=>setStep(4)}>Signatures →</button>
        </div>
      </>}

      {step===4&&<>
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setStep(3)}>← Retour</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:20}}>
          <div className="card">
            <div className="card-title">✍️ Signature du technicien</div>
            <SignaturePad label="Signez ici" onSave={setSigTech} existingSig={sigTech}/>
          </div>
          <div className="card" style={{borderColor:"#3b82f640"}}>
            <div className="card-title" style={{color:"#60a5fa"}}>✍️ Signature du client</div>
            <div style={{fontSize:"0.82rem",color:"var(--muted)",marginBottom:10}}>Passez l'appareil au client</div>
            <SignaturePad label="Signez ici" onSave={setSigClient} existingSig={sigClient}/>
          </div>
        </div>
        <div className="form-actions" style={{marginTop:18}}>
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={!sigTech||!sigClient}>✓ Valider et enregistrer</button>
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
        <div className="stat"><div className="stat-label">RDV aujourd'hui</div><div className="stat-value" style={{color:"var(--success)"}}>{rdvAuj}</div><div className="stat-sub">{rdvAV} à venir</div></div>
        <div className="stat"><div className="stat-label">CA ce mois</div><div className="stat-value">{money(caM)}</div></div>
        <div className="stat"><div className="stat-label">À facturer</div><div className="stat-value" style={{color:imp>0?"var(--warning)":"var(--success)"}}>{imp}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card">
          <div className="card-title">📅 RDV à venir</div>
          {rdvs.filter(r=>r.date>=auj).slice(0,5).map(r=>{const c=clients.find(x=>x.id===r.clientId);return(
            <div key={r.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
              <div><div style={{fontWeight:600,fontSize:"0.875rem"}}>{c?.prenom} {c?.nom}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{r.type} · {fmt(r.date)} {r.heure}</div></div>
              <span className={`badge badge-${r.statut==="Confirmé"?"success":r.statut==="Réalisé"?"info":"warning"}`}>{r.statut}</span>
            </div>
          );})}
        </div>
        <div className="card">
          <div className="card-title">📄 Derniers documents</div>
          {docs.length===0&&<div style={{color:"var(--muted)",fontSize:"0.85rem"}}>Aucun document</div>}
          {docs.slice(-5).reverse().map(d=>{const c=clients.find(x=>x.id===d.clientId);return(
            <div key={d.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
              <div><div style={{fontWeight:600,fontSize:"0.875rem"}}>{d.type} · {d.numero}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{c?.prenom} {c?.nom} · {fmt(d.date)}</div></div>
              <span className={`badge badge-${d.statut==="Émise"||d.statut==="Payée"?"success":"warning"}`}>{d.statut}</span>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

function PageAgenda({rdvs, setRdvs, clients, docs, setDocs, catalogue}) {
  const [viewMode, setViewMode] = useState("jour");
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
  const saveIntervention=newDocs=>{
    const rdvId=wizard?.rdv?.id;
    setDocs(p=>{let base=[...p];newDocs.forEach(d=>{base=[...base,{...d,rdvId,id:newId(base)}];});return base;});
    if(rdvId) setRdvs(p=>p.map(r=>r.id===rdvId?{...r,statut:"Réalisé"}:r));
    setWizard(null);
  };
  const openPreview=doc=>{const c=clients.find(x=>x.id===doc.clientId);setPreview({doc,client:c});};
  const isAtt=type=>type?.startsWith("Attestation");
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
            <span style={{fontFamily:"var(--font-head)",fontWeight:600,minWidth:200,textAlign:"center",fontSize:"0.95rem"}}>
              {JOURS_FULL[(dayDate.getDay()+6)%7]} {dayDate.getDate()} {MOIS[dayDate.getMonth()]} {dayDate.getFullYear()}
            </span>
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
              <div>
                <span style={{fontWeight:700,fontSize:"1rem"}}>{dayRdvs.length} RDV</span>
                <span style={{color:"var(--muted)",fontSize:"0.85rem",marginLeft:10}}>{dayRdvs.filter(r=>r.statut==="Réalisé").length} réalisé(s) · {dayRdvs.filter(r=>r.statut==="Confirmé").length} confirmé(s)</span>
              </div>
              {isToday&&<span className="badge badge-accent">Aujourd'hui</span>}
            </div>
            <div style={{position:"relative",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"14px",overflow:"hidden"}}>
              {HOURS.map((h,hi)=>(
                <div key={h} style={{display:"flex",borderBottom:"1px solid var(--border)",minHeight:64,position:"relative"}}>
                  <div style={{width:52,flexShrink:0,padding:"4px 8px",fontSize:"0.7rem",color:"var(--muted)",fontWeight:600,borderRight:"1px solid var(--border)",background:"var(--surface2)",paddingTop:6}}>{h}</div>
                  <div style={{flex:1,position:"relative",minHeight:64}}>
                    <div style={{position:"absolute",top:"50%",left:0,right:0,borderTop:"1px dashed var(--border)",opacity:0.4}}/>
                    {dayRdvs.filter(r=>r.heure?.split(":")[0]===String(hi+7).padStart(2,"0")).map((r,ri)=>{
                      const c=clients.find(x=>x.id===r.clientId);
                      const equips=c?.equipements||[];
                      const eq=equips[0];
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
                              {eq&&<div style={{fontSize:"0.78rem",color:"var(--muted)",marginTop:3}}>{EQUIP_ICON(eq.type)} {eq.marque||eq.marqueClim||""} {eq.modele||""}</div>}
                              {r.notes&&<div style={{fontSize:"0.75rem",color:"var(--muted)",fontStyle:"italic",marginTop:2}}>📝 {r.notes}</div>}
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
            {dayRdvs.length===0&&<div className="empty" style={{marginTop:14}}><div className="icon">📅</div><p>Aucun RDV ce jour — <button className="btn btn-secondary btn-sm" style={{marginLeft:6}} onClick={()=>setModalRdv({mode:"new"})}>+ Ajouter</button></p></div>}
          </div>
        );
      })()}

      {viewMode==="mois"&&<>
        <div className="cal-header">{JOURS_FULL.map(j=><span key={j}>{j}</span>)}</div>
        <div className="cal-grid">
          {days.map((d,i)=>{
            const dStr=ds(d.date),isT=dStr===todStr,isSel=dStr===selected;
            return <div key={i} className={`cal-day${!d.cur?" other-month":""}${isT?" today":""}${isSel?" selected":""}`} onClick={()=>setSelected(dStr)}>
              <div className={`cal-day-num${isT?" today-c":""}`}>{d.date.getDate()}</div>
              {rdvsDay(d.date).map(r=>{const c=clients.find(x=>x.id===r.clientId);return <div key={r.id} className="cal-chip">{r.heure} {c?.nom}</div>;})}
            </div>;
          })}
        </div>
      </>}

      {viewMode==="semaine"&&<div style={{overflowX:"auto"}}>
        <div className="week-grid">
          <div className="week-header" style={{background:"var(--surface2)",borderRight:"1px solid var(--border)"}}></div>
          {weekDays.map((d,i)=>{const dStr=ds(d),isT=dStr===todStr;return <div key={i} className="week-header" style={{textAlign:"center",padding:"8px 4px",borderBottom:"1px solid var(--border)",borderRight:"1px solid var(--border)"}}><div className="week-header-day">{JOURS_FULL[i]}</div><div className={`week-header-date${isT?" today-c":""}`}>{d.getDate()}</div></div>;})}
          <div className="week-time-col">{HOURS.map(h=><div key={h} className="week-time-slot">{h}</div>)}</div>
          {weekDays.map((d,di)=>{
            const dStr=ds(d);
            const dayRdvs=rdvs.filter(r=>r.date===dStr);
            return <div key={di} className="week-day-col" onClick={()=>setSelected(dStr)}>
              {HOURS.map(h=><div key={h} className="week-slot"/>)}
              {dayRdvs.map(r=>{const c=clients.find(x=>x.id===r.clientId);const top=heureToPx(r.heure);return <div key={r.id} className="week-event" style={{top:top+1}} onClick={e=>{e.stopPropagation();setSelected(dStr);}}><div style={{fontWeight:700}}>{r.heure}</div><div>{c?.nom}</div><div style={{color:"var(--muted)",fontSize:"0.6rem"}}>{r.type}</div></div>;})}
            </div>;
          })}
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
          const rdvDocs=docs.filter(d=>d.rdvId===r.id);
          return <div key={r.id} className="rdv-row">
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
          </div>;
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

  const equipFilters=["Tous","Chaudière gaz","Chaudière fioul","Chauffe-eau gaz","Climatisation","Pompe à chaleur"];
  const filtered=clients.filter(c=>{
    const txt=`${c.prenom} ${c.nom} ${c.tel} ${fullAddr(c)} ${(c.equipements||[]).map(e=>`${e.marque||""} ${e.marqueClim||""} ${e.modele||""} ${e.type}`).join(" ")}`.toLowerCase();
    const matchSearch=txt.includes(search.toLowerCase());
    const matchFilter=filterEquip==="Tous"||(c.equipements||[]).some(e=>e.type===filterEquip);
    return matchSearch&&matchFilter;
  });

  const saveClient=f=>{if(modal?.mode==="new")setClients(p=>[...p,{...f,id:newId(p)}]);else setClients(p=>p.map(c=>c.id===modal.client.id?{...f,id:c.id}:c));setModal(null);};
  const delClient=id=>{if(confirm("Supprimer ?"))setClients(p=>p.filter(c=>c.id!==id));if(detail?.id===id)setDetail(null);};
  const isAtt=t=>t?.startsWith("Attestation");
  const openPreview=doc=>{const c=clients.find(x=>x.id===doc.clientId);setPreview({doc,client:c});};

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
              <div style={{fontFamily:"var(--font-head)",fontSize:"1.7rem",fontWeight:900}}>{detail.prenom} {detail.nom} <span className="badge badge-neutral" style={{fontSize:"0.7rem",marginLeft:6}}>{detail.type}</span></div>
              <div style={{fontSize:"0.83rem",color:"var(--muted)",marginTop:6,lineHeight:1.8}}><AddrLink client={detail}/><br/>📞 {detail.tel} · ✉️ {detail.email}</div>
              {detail.notes&&<div style={{fontSize:"0.78rem",color:"var(--muted)",marginTop:3}}>📝 {detail.notes}</div>}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-secondary btn-sm" onClick={()=>setModal({mode:"edit",client:detail})}>✏️ Modifier</button>
              <button className="btn btn-danger btn-sm" onClick={()=>delClient(detail.id)}>🗑️</button>
            </div>
          </div>
          {(detail.photos||[]).length>0&&<div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:"0.75rem",fontWeight:600,color:"var(--muted)",textTransform:"uppercase",marginBottom:8}}>📷 Photos</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {detail.photos.map((p,i)=>(
                <div key={i} style={{position:"relative",width:90,height:90,borderRadius:8,overflow:"hidden",border:"1px solid var(--border)",cursor:"pointer"}} onClick={()=>window.open(p.url,"_blank")}>
                  <img src={p.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              ))}
            </div>
          </div>}
          <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:"0.75rem",fontWeight:600,color:"var(--muted)",textTransform:"uppercase",marginBottom:10}}>Équipements ({equips.length})</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
              {equips.map((e,i)=>(
                <div key={i} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:9,padding:"12px 14px"}}>
                  <div style={{fontWeight:700,fontSize:"0.85rem",marginBottom:8,color:"var(--accent)"}}>{EQUIP_ICON(e.type)} {e.type}</div>
                  {e.type==="Climatisation"&&<><div style={{fontSize:"0.78rem"}}>{e.marqueClim} — {e.typeClim}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{e.modele} · {e.puissanceClim} · {e.anneeClim}</div></>}
                  {e.type==="Pompe à chaleur"&&<><div style={{fontSize:"0.78rem"}}>{e.marquePac} — {e.modelePac}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{e.puissancePac} · COP {e.copPac} · {e.anneePac}</div></>}
                  {(e.type==="Chaudière gaz"||e.type==="Chauffe-eau gaz"||e.type==="Chaudière fioul")&&<>
                    {e.gaz&&<div style={{fontSize:"0.78rem",color:"var(--warning)"}}>{e.gaz}</div>}
                    <div style={{fontSize:"0.78rem"}}>{e.marque} {e.modele}</div>
                    <div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{e.puissance} · {e.annee} · {e.conduit}</div>
                    {e.numSerie&&<div style={{fontSize:"0.75rem",color:"var(--muted)"}}>N° {e.numSerie}</div>}
                    {e.type==="Chaudière fioul"&&e.debitGicleur&&<div style={{fontSize:"0.75rem",color:"var(--muted)"}}>💧 {e.marqueGicleur} {e.debitGicleur} gal/h {e.angleGicleur}</div>}
                    {e.contrat&&<div style={{fontSize:"0.75rem",marginTop:4}}><span className="badge badge-info" style={{fontSize:"0.65rem"}}>{e.contrat}</span></div>}
                  </>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-title">📜 Historique</div>
          {[...clientRdvs.map(r=>({date:r.date,kind:"rdv",data:r})),...clientDocs.map(d=>({date:d.date,kind:"doc",data:d}))].sort((a,b)=>b.date?.localeCompare(a.date)).map((item,i)=>{
            if(item.kind==="rdv") {
              const r=item.data;
              const rdvDocs=clientDocs.filter(d=>d.rdvId===r.id);
              return <div key={r.id} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                  <div><div style={{fontWeight:700,fontSize:"0.9rem"}}>📅 {fmt(r.date)} {r.heure&&`à ${r.heure}`}</div><div style={{fontSize:"0.85rem",marginTop:2}}>{r.type}</div></div>
                  <span className={`badge badge-${r.statut==="Réalisé"?"success":r.statut==="Confirmé"?"info":r.statut==="Annulé"?"danger":"warning"}`}>{r.statut}</span>
                </div>
                {rdvDocs.length>0&&<div style={{marginTop:8,display:"flex",gap:7,flexWrap:"wrap"}}>{rdvDocs.map(d=><button key={d.id} className="btn btn-secondary btn-sm" onClick={()=>openPreview(d)}>👁 {d.type} {d.numero}</button>)}</div>}
              </div>;
            } else {
              const d=item.data;
              const ht=(d.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
              const ttc=ht*(1+(d.tva||10)/100);
              return <div key={d.id} style={{padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                  <div><div style={{fontWeight:700,fontSize:"0.9rem"}}>📄 {fmt(d.date)} — {d.type} {d.numero}</div></div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    {ttc>0&&<span style={{fontWeight:700,color:"var(--accent)"}}>{money(ttc)}</span>}
                    <button className="btn btn-secondary btn-sm" onClick={()=>openPreview(d)}>👁</button>
                  </div>
                </div>
              </div>;
            }
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      {modal&&<ModalClient client={modal.client} onSave={saveClient} onClose={()=>setModal(null)}/>}
      <div className="search-row">
        <input placeholder="🔍 Nom, adresse, téléphone, marque…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <button className="btn btn-primary" onClick={()=>setModal({mode:"new"})}>+ Nouveau client</button>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {equipFilters.map(f=>(
          <button key={f} className={`btn btn-sm ${filterEquip===f?"btn-primary":"btn-ghost"}`} onClick={()=>setFilterEquip(f)}>
            {f==="Chaudière gaz"?"🔥 Gaz":f==="Chaudière fioul"?"🛢️ Fioul":f==="Chauffe-eau gaz"?"🚿 Chauffe-eau":f==="Climatisation"?"❄️ Clim":f}
          </button>
        ))}
        <span style={{marginLeft:"auto",fontSize:"0.78rem",color:"var(--muted)",display:"flex",alignItems:"center"}}>{filtered.length} client(s)</span>
      </div>
      <div className="client-list">
        {filtered.length===0&&<div className="empty"><div className="icon">👥</div><p>Aucun client trouvé</p></div>}
        {filtered.map(c=>{
          const equips=c.equipements||[];
          return (
            <div key={c.id} className="client-card" onClick={()=>setDetail(c)}>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:"0.95rem"}}>{c.prenom} {c.nom} <span className="badge badge-neutral" style={{marginLeft:6,fontSize:"0.68rem"}}>{c.type}</span></div>
                <div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:3}}><AddrLink client={c}/> · 📞 {c.tel}</div>
                <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                  {equips.map((e,i)=>(
                    <span key={i} className={`badge badge-${e.type==="Climatisation"?"info":e.type==="Chaudière fioul"?"warning":"accent"}`} style={{fontSize:"0.65rem"}}>
                      {EQUIP_ICON(e.type)} {e.type==="Climatisation"?(e.marqueClim||"Clim"):`${e.marque||e.type}`}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:8,flexShrink:0}} onClick={e=>e.stopPropagation()}>
                <button className="btn btn-secondary btn-sm" onClick={()=>setModal({mode:"edit",client:c})}>✏️</button>
                <button className="btn btn-danger btn-sm" onClick={()=>delClient(c.id)}>🗑️</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PageDocuments({docs, setDocs, clients, societe}) {
  const [tab,setTab]=useState("Tous");
  const [preview,setPreview]=useState(null);
  const tabs=["Tous","Bon d'intervention","Dépannage","Attestation Gaz","Attestation Fioul"];
  const filtered=tab==="Tous"?docs:docs.filter(d=>d.type===tab);
  const del=id=>{if(confirm("Supprimer ?"))setDocs(p=>p.filter(d=>d.id!==id));};
  const open=doc=>{const c=clients.find(x=>x.id===doc.clientId);setPreview({doc,client:c});};
  const isAtt=t=>t?.startsWith("Attestation");
  return (
    <div className="content">
      {preview&&isAtt(preview.doc.type)&&<DocAttestation doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)}/>}
      {preview&&!isAtt(preview.doc.type)&&<DocBon doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)}/>}
      <div className="tabs">{tabs.map(t=><div key={t} className={`tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t}</div>)}</div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>N°</th><th>Type</th><th>Client</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length===0&&<tr><td colSpan={6}><div className="empty"><div className="icon">📄</div><p>Aucun document</p></div></td></tr>}
              {filtered.map(d=>{
                const c=clients.find(x=>x.id===d.clientId);
                return <tr key={d.id}>
                  <td style={{fontWeight:600,color:"var(--accent)"}}>{d.numero}</td>
                  <td><span className={`badge badge-${isAtt(d.type)?"success":d.type==="Dépannage"?"warning":"info"}`}>{d.type}</span></td>
                  <td>{c?.prenom} {c?.nom}</td>
                  <td>{fmt(d.date)}</td>
                  <td><span className={`badge badge-${d.statut==="Émise"||d.statut==="Payée"?"success":d.statut==="Annulée"?"danger":"warning"}`}>{d.statut}</span></td>
                  <td><div style={{display:"flex",gap:6}}>
                    <button className="btn btn-secondary btn-sm" onClick={()=>open(d)}>👁 Voir</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>del(d.id)}>🗑️</button>
                  </div></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PageSettings({societe, setSociete}) {
  const [f,setF]=useState({...societe});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const saved=JSON.stringify(f)===JSON.stringify(societe);
  const logoRef=useRef(null);
  const handleLogo=e=>{
    const file=e.target.files[0]; if(!file) return;
    if(file.size>2*1024*1024){alert("Logo trop grand (max 2 Mo)");return;}
    const reader=new FileReader();
    reader.onload=ev=>s("logo",ev.target.result);
    reader.readAsDataURL(file);
    e.target.value="";
  };
  return (
    <div className="content">
      <div className="card" style={{maxWidth:580}}>
        <div className="card-title">⚙️ Informations de la société</div>
        <div style={{marginBottom:20,paddingBottom:18,borderBottom:"1px solid var(--border)"}}>
          <div style={{fontSize:"0.78rem",fontWeight:700,color:"var(--accent)",textTransform:"uppercase",marginBottom:12}}>🖼️ Logo</div>
          <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            {f.logo?<div style={{position:"relative"}}>
              <img src={f.logo} alt="Logo" style={{height:80,maxWidth:200,objectFit:"contain",borderRadius:8,border:"1px solid var(--border)",background:"#fff",padding:6}}/>
              <button onClick={()=>s("logo","")} style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"var(--danger)",border:"none",color:"#fff",cursor:"pointer",fontSize:"0.7rem"}}>✕</button>
            </div>:<div style={{width:120,height:80,border:"2px dashed var(--border)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--muted)",fontSize:"0.8rem"}}>Pas de logo</div>}
            <button className="btn btn-secondary btn-sm" onClick={()=>logoRef.current?.click()}>{f.logo?"🔄 Changer":"📁 Importer"}</button>
            <input ref={logoRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleLogo}/>
          </div>
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
      </div>
    </div>
  );
}

function ModalDevisFacture({type, doc, clients, docs, devis, catalogue, societe, onSave, onClose}) {
  const isDevis = type==="devis";
  const validiteDefault = new Date(); validiteDefault.setMonth(validiteDefault.getMonth()+1);
  const [f,setF]=useState(doc||{clientId:"",objet:"",date:todayStr(),validite:isDevis?ds(validiteDefault):"",dateEcheance:todayStr(),modePaiement:"Chèque, Virement, Espèces, Carte bancaire",iban:"",acompte:0,lignes:[],notes:"",statut:isDevis?"En attente":"En attente de règlement"});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const [catFilter,setCatFilter]=useState("Tous");
  const [showCat,setShowCat]=useState(false);

  const addFromCat=(item)=>setF(p=>({...p,lignes:[...p.lignes,{designation:item.designation,qte:1,pu:item.pu,tva:item.tva,unite:item.unite,detail:""}]}));
  const addLine=()=>setF(p=>({...p,lignes:[...p.lignes,{designation:"",qte:1,pu:0,tva:10,unite:"Forfait",detail:""}]}));
  const addTitle=()=>setF(p=>({...p,lignes:[...p.lignes,{designation:"",isTitle:true,qte:0,pu:0,tva:0,unite:""}]}));
  const setLine=(i,k,v)=>setF(p=>{const l=[...p.lignes];l[i]={...l[i],[k]:v};return{...p,lignes:l};});
  const delLine=(i)=>setF(p=>({...p,lignes:p.lignes.filter((_,j)=>j!==i)}));

  const totalHT=f.lignes.filter(l=>!l.isTitle).reduce((s,l)=>s+Number(l.qte)*Number(l.pu),0);
  const totalTVA=f.lignes.filter(l=>!l.isTitle).reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*Number(l.tva||10)/100,0);
  const totalTTC=totalHT+totalTVA;
  const catItems=catFilter==="Tous"?catalogue:catalogue.filter(c=>c.categorie===catFilter);

  return (
    <div className="modal-overlay"><div className="modal modal-xl" style={{maxWidth:900}}>
      <div className="modal-title">{doc?"Modifier":"Nouveau"} {isDevis?"devis":"facture"}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        <div className="form-group full">
          <label>Client *</label>
          <select value={f.clientId} onChange={e=>s("clientId",Number(e.target.value))}>
            <option value="">— Sélectionner —</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.prenom} {c.nom} — {c.ville||""}</option>)}
          </select>
        </div>
        <div className="form-group full"><label>Objet</label><input value={f.objet} onChange={e=>s("objet",e.target.value)}/></div>
        <div className="form-group"><label>Date</label><input type="date" value={f.date} onChange={e=>s("date",e.target.value)}/></div>
        {isDevis&&<div className="form-group"><label>Validité</label><input type="date" value={f.validite} onChange={e=>s("validite",e.target.value)}/></div>}
        {!isDevis&&<div className="form-group"><label>Échéance</label><input type="date" value={f.dateEcheance} onChange={e=>s("dateEcheance",e.target.value)}/></div>}
        {!isDevis&&<div className="form-group"><label>Mode paiement</label><input value={f.modePaiement} onChange={e=>s("modePaiement",e.target.value)}/></div>}
        {!isDevis&&<div className="form-group"><label>Acompte (€)</label><input type="number" value={f.acompte} onChange={e=>s("acompte",Number(e.target.value))}/></div>}
        <div className="form-group"><label>Statut</label>
          <select value={f.statut} onChange={e=>s("statut",e.target.value)}>
            {isDevis?["En attente","Accepté","Refusé","Expiré"].map(s=><option key={s}>{s}</option>):["En attente de règlement","Payée","Partiellement payée","Avoir"].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:"0.8rem",fontWeight:700,color:"var(--accent)",textTransform:"uppercase"}}>📚 Bibliothèque</div>
          <button className="btn btn-secondary btn-sm" onClick={()=>setShowCat(p=>!p)}>{showCat?"▲ Masquer":"▼ Afficher"}</button>
        </div>
        {showCat&&<>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {["Tous",...CATS_CATALOGUE].map(c=><div key={c} onClick={()=>setCatFilter(c)} style={{padding:"4px 10px",borderRadius:6,fontSize:"0.72rem",cursor:"pointer",background:catFilter===c?"var(--accent)":"var(--surface2)",color:catFilter===c?"#fff":"var(--muted)"}}>{c}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:6,maxHeight:200,overflowY:"auto"}}>
            {catItems.map(item=>(
              <div key={item.id} onClick={()=>addFromCat(item)} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="var(--accent)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                <div style={{fontWeight:600,fontSize:"0.8rem"}}>{item.designation}</div>
                <div style={{fontSize:"0.72rem",color:"var(--muted)"}}>{money(item.pu)} · TVA {item.tva}%</div>
              </div>
            ))}
          </div>
        </>}
      </div>
      <div style={{background:"var(--surface2)",borderRadius:10,padding:12,marginBottom:10}}>
        {f.lignes.length===0&&<div style={{textAlign:"center",color:"var(--muted)",fontSize:"0.85rem",padding:"16px 0"}}>Aucune ligne</div>}
        {f.lignes.map((l,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:l.isTitle?"1fr auto":"3fr 0.5fr 1fr 0.7fr 0.7fr auto",gap:6,marginBottom:6,alignItems:"center",background:"var(--surface)",borderRadius:8,padding:"8px 10px",borderLeft:l.isTitle?"3px solid var(--accent)":"1px solid var(--border)"}}>
            <input value={l.designation||""} onChange={e=>setLine(i,"designation",e.target.value)} placeholder={l.isTitle?"Titre…":"Désignation…"} style={{fontWeight:l.isTitle?700:400,color:l.isTitle?"var(--accent)":"var(--text)"}}/>
            {!l.isTitle&&<>
              <input type="number" value={l.qte||1} onChange={e=>setLine(i,"qte",e.target.value)} min={0} step="0.5"/>
              <select value={l.unite||"Forfait"} onChange={e=>setLine(i,"unite",e.target.value)}><option>Forfait</option><option>h</option><option>pièce</option><option>m</option><option>m²</option></select>
              <input type="number" value={l.pu||0} onChange={e=>setLine(i,"pu",e.target.value)} min={0} step="0.01"/>
              <select value={l.tva||10} onChange={e=>setLine(i,"tva",Number(e.target.value))}><option value={0}>0%</option><option value={5.5}>5.5%</option><option value={10}>10%</option><option value={20}>20%</option></select>
            </>}
            <button className="btn btn-danger btn-sm" onClick={()=>delLine(i)}>✕</button>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button className="btn btn-secondary btn-sm" onClick={addLine}>+ Ligne</button>
        <button className="btn btn-ghost btn-sm" onClick={addTitle}>+ Titre</button>
      </div>
      {f.lignes.length>0&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
        <div style={{background:"var(--surface2)",borderRadius:10,padding:"12px 18px",minWidth:250}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:4}}><span style={{color:"var(--muted)"}}>Total HT</span><span>{money(totalHT)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.85rem",marginBottom:6}}><span style={{color:"var(--muted)"}}>Total TVA</span><span>{money(totalTVA)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:"1rem",fontWeight:700,color:"var(--accent)",paddingTop:6,borderTop:"1px solid var(--border)"}}><span>Total TTC</span><span>{money(totalTTC)}</span></div>
        </div>
      </div>}
      <div className="form-group" style={{marginBottom:8}}>
        <label>Notes</label>
        <textarea value={f.notes||""} onChange={e=>s("notes",e.target.value)} style={{minHeight:52}}/>
      </div>
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={()=>onSave(f)} disabled={!f.clientId||f.lignes.length===0}>✓ Enregistrer</button>
      </div>
    </div></div>
  );
}

function PageDevisFactures({clients, docs, setDocs, devis, setDevis, societe, catalogue, setCatalogue}) {
  const [tab,setTab]=useState("devis");
  const [modal,setModal]=useState(null);
  const [preview,setPreview]=useState(null);
  const [showCatalogue,setShowCatalogue]=useState(false);
  const [editCat,setEditCat]=useState(null);

  const saveDevis=(f)=>{const numero=f.numero||genNumero("devis",docs,devis);if(modal.doc)setDevis(p=>p.map(d=>d.id===modal.doc.id?{...f,numero,id:d.id}:d));else setDevis(p=>[...p,{...f,numero,id:newId(p)}]);setModal(null);};
  const saveFacture=(f)=>{const numero=f.numero||genNumero("facture",docs,devis);if(modal.doc)setDocs(p=>p.map(d=>d.id===modal.doc.id?{...f,numero,type:"Facture",id:d.id}:d));else setDocs(p=>[...p,{...f,numero,type:"Facture",id:newId(p)}]);setModal(null);};
  const transformDevisEnFacture=(dev)=>{const numero=genNumero("facture",docs,devis);setDocs(p=>[...p,{...dev,id:newId(p),type:"Facture",numero,refDevis:dev.numero,statut:"En attente de règlement",dateEcheance:todayStr()}]);setDevis(p=>p.map(d=>d.id===dev.id?{...d,statut:"Facturé"}:d));setPreview(null);alert(`✓ Facture ${numero} créée`);};
  const delDevis=(id)=>{if(confirm("Supprimer ?"))setDevis(p=>p.filter(d=>d.id!==id));};
  const delFacture=(id)=>{if(confirm("Supprimer ?"))setDocs(p=>p.filter(d=>d.id!==id));};
  const factures=docs.filter(d=>d.type==="Facture");
  const caTotal=factures.filter(f=>f.statut==="Payée").reduce((s,f)=>{const ht=(f.lignes||[]).reduce((a,l)=>a+Number(l.qte)*Number(l.pu),0);return s+ht+(f.lignes||[]).reduce((a,l)=>a+Number(l.qte)*Number(l.pu)*Number(l.tva||10)/100,0);},0);
  const impayees=factures.filter(f=>f.statut==="En attente de règlement");
  const impayeesTotal=impayees.reduce((s,f)=>{const ht=(f.lignes||[]).reduce((a,l)=>a+Number(l.qte)*Number(l.pu),0);return s+ht+(f.lignes||[]).reduce((a,l)=>a+Number(l.qte)*Number(l.pu)*Number(l.tva||10)/100,0);},0);
  const openPreview=(type,doc)=>{const c=clients.find(x=>x.id===doc.clientId);setPreview({type,doc,client:c});};

  return (
    <div className="content">
      {modal&&modal.type==="devis"&&<ModalDevisFacture type="devis" doc={modal.doc} clients={clients} docs={docs} devis={devis} catalogue={catalogue} societe={societe} onSave={saveDevis} onClose={()=>setModal(null)}/>}
      {modal&&modal.type==="facture"&&<ModalDevisFacture type="facture" doc={modal.doc} clients={clients} docs={docs} devis={devis} catalogue={catalogue} societe={societe} onSave={saveFacture} onClose={()=>setModal(null)}/>}
      {preview&&preview.type==="devis"&&<DocDevis doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)} onTransform={preview.doc.statut==="Accepté"?()=>transformDevisEnFacture(preview.doc):null}/>}
      {preview&&preview.type==="facture"&&<DocFacture doc={preview.doc} client={preview.client} societe={societe} onClose={()=>setPreview(null)}/>}

      <div className="stats-grid">
        <div className="stat"><div className="stat-label">Devis en cours</div><div className="stat-value" style={{color:"var(--info)"}}>{devis.filter(d=>d.statut==="En attente").length}</div></div>
        <div className="stat"><div className="stat-label">Factures impayées</div><div className="stat-value" style={{color:"var(--warning)"}}>{impayees.length}</div><div className="stat-sub">{money(impayeesTotal)} TTC</div></div>
        <div className="stat"><div className="stat-label">CA encaissé</div><div className="stat-value">{money(caTotal)}</div></div>
        <div className="stat"><div className="stat-label">Total factures</div><div className="stat-value" style={{color:"var(--muted)"}}>{factures.length}</div></div>
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div className="tabs" style={{marginBottom:0}}>
          <div className={`tab${tab==="devis"?" active":""}`} onClick={()=>setTab("devis")}>📋 Devis ({devis.length})</div>
          <div className={`tab${tab==="factures"?" active":""}`} onClick={()=>setTab("factures")}>🧾 Factures ({factures.length})</div>
          <div className={`tab${tab==="catalogue"?" active":""}`} onClick={()=>setTab("catalogue")}>📚 Catalogue</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {tab==="devis"&&<button className="btn btn-secondary" onClick={()=>setModal({type:"devis"})}>+ Nouveau devis</button>}
          {tab==="factures"&&<button className="btn btn-primary" onClick={()=>setModal({type:"facture"})}>+ Nouvelle facture</button>}
        </div>
      </div>

      {tab==="devis"&&<div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>N°</th><th>Client</th><th>Objet</th><th>Date</th><th>Montant TTC</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {devis.length===0&&<tr><td colSpan={7}><div className="empty"><div className="icon">📋</div><p>Aucun devis</p></div></td></tr>}
              {devis.map(d=>{
                const c=clients.find(x=>x.id===d.clientId);
                const ttc=(d.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*(1+Number(l.tva||10)/100),0);
                return <tr key={d.id}>
                  <td style={{fontWeight:600,color:"var(--accent)"}}>{d.numero}</td>
                  <td>{c?.prenom} {c?.nom}</td>
                  <td style={{maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{d.objet||"—"}</td>
                  <td>{fmt(d.date)}</td>
                  <td style={{fontWeight:600}}>{money(ttc)}</td>
                  <td><span className={`badge badge-${d.statut==="Accepté"?"success":d.statut==="Refusé"||d.statut==="Expiré"?"danger":d.statut==="Facturé"?"info":"warning"}`}>{d.statut}</span></td>
                  <td><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    <button className="btn btn-secondary btn-sm" onClick={()=>openPreview("devis",d)}>👁</button>
                    <button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"devis",doc:d})}>✏️</button>
                    {d.statut!=="Refusé"&&d.statut!=="Expiré"&&d.statut!=="Facturé"&&<button className="btn btn-primary btn-sm" onClick={()=>transformDevisEnFacture(d)}>🧾 → Facture</button>}
                    <button className="btn btn-danger btn-sm" onClick={()=>delDevis(d.id)}>🗑️</button>
                  </div></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>}

      {tab==="factures"&&<div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Montant TTC</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {factures.length===0&&<tr><td colSpan={6}><div className="empty"><div className="icon">🧾</div><p>Aucune facture</p></div></td></tr>}
              {factures.map(f=>{
                const c=clients.find(x=>x.id===f.clientId);
                const ttc=(f.lignes||[]).reduce((s,l)=>s+Number(l.qte)*Number(l.pu)*(1+Number(l.tva||10)/100),0);
                return <tr key={f.id}>
                  <td style={{fontWeight:600,color:"var(--accent)"}}>{f.numero}</td>
                  <td>{c?.prenom} {c?.nom}</td>
                  <td>{fmt(f.date)}</td>
                  <td style={{fontWeight:600}}>{money(ttc)}</td>
                  <td><span className={`badge badge-${f.statut==="Payée"?"success":f.statut==="En attente de règlement"?"warning":"info"}`}>{f.statut}</span></td>
                  <td><div style={{display:"flex",gap:5}}>
                    <button className="btn btn-secondary btn-sm" onClick={()=>openPreview("facture",f)}>👁</button>
                    <button className="btn btn-secondary btn-sm" onClick={()=>setModal({type:"facture",doc:f})}>✏️</button>
                    {f.statut==="En attente de règlement"&&<button className="btn btn-success btn-sm" onClick={()=>setDocs(p=>p.map(d=>d.id===f.id?{...d,statut:"Payée"}:d))}>✓ Payée</button>}
                    <button className="btn btn-danger btn-sm" onClick={()=>delFacture(f.id)}>🗑️</button>
                  </div></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>}

      {tab==="catalogue"&&<div>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
          <button className="btn btn-primary btn-sm" onClick={()=>setEditCat({categorie:CATS_CATALOGUE[0],designation:"",pu:0,tva:10,unite:"Forfait"})}>+ Ajouter</button>
        </div>
        {editCat&&<div className="modal-overlay"><div className="modal">
          <div className="modal-title">{editCat.id?"Modifier":"Nouvelle prestation"}</div>
          <div className="form-grid">
            <div className="form-group full"><label>Catégorie</label><select value={editCat.categorie} onChange={e=>setEditCat(p=>({...p,categorie:e.target.value}))}>{CATS_CATALOGUE.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="form-group full"><label>Désignation</label><input value={editCat.designation} onChange={e=>setEditCat(p=>({...p,designation:e.target.value}))}/></div>
            <div className="form-group"><label>Prix HT (€)</label><input type="number" value={editCat.pu} onChange={e=>setEditCat(p=>({...p,pu:Number(e.target.value)}))}/></div>
            <div className="form-group"><label>TVA</label><select value={editCat.tva} onChange={e=>setEditCat(p=>({...p,tva:Number(e.target.value)}))}><option value={0}>0%</option><option value={5.5}>5.5%</option><option value={10}>10%</option><option value={20}>20%</option></select></div>
            <div className="form-group"><label>Unité</label><select value={editCat.unite} onChange={e=>setEditCat(p=>({...p,unite:e.target.value}))}><option>Forfait</option><option>h</option><option>pièce</option><option>m</option><option>m²</option></select></div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={()=>setEditCat(null)}>Annuler</button>
            <button className="btn btn-primary" onClick={()=>{if(editCat.id)setCatalogue(p=>p.map(c=>c.id===editCat.id?editCat:c));else setCatalogue(p=>[...p,{...editCat,id:newId(p)}]);setEditCat(null);}} disabled={!editCat.designation}>Enregistrer</button>
          </div>
        </div></div>}
        {CATS_CATALOGUE.map(cat=>(
          <div key={cat} className="card" style={{marginBottom:14}}>
            <div className="card-title">{cat}</div>
            {catalogue.filter(c=>c.categorie===cat).map(item=>(
              <div key={item.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                <div><div style={{fontWeight:600,fontSize:"0.875rem"}}>{item.designation}</div><div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{money(item.pu)} HT · TVA {item.tva}% · {item.unite}</div></div>
                <div style={{display:"flex",gap:6}}>
                  <button className="btn btn-secondary btn-sm" onClick={()=>setEditCat(item)}>✏️</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>setCatalogue(p=>p.filter(c=>c.id!==item.id))}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>}
    </div>
  );
}

const DELAI_RELANCE = 11;
const EQUIP_RELANCE = ["Chaudière gaz","Chaudière fioul","Chauffe-eau gaz","Climatisation","Pompe à chaleur","Poêle à bois"];

function getLastEntretien(clientId, docs) {
  return docs.filter(d=>d.clientId===clientId&&["Attestation Gaz","Attestation Fioul","Bon d'intervention","Dépannage"].includes(d.type)).sort((a,b)=>b.date?.localeCompare(a.date))[0]?.date||null;
}
function moisDepuis(dateStr) {
  if(!dateStr) return 999;
  const d=new Date(dateStr),now=new Date();
  return (now.getFullYear()-d.getFullYear())*12+(now.getMonth()-d.getMonth());
}
function buildSms(client,equip,societe) {
  const el=equip.type==="Climatisation"?`climatisation ${equip.marqueClim||""}`.trim():`chaudière ${equip.marque||""}`.trim();
  return `Bonjour ${client.prenom} ${client.nom}, votre ${el} n'a pas été entretenu depuis plus de 11 mois. Contactez-nous. — ${societe.technicien}, ${societe.nom} ${societe.tel}`;
}
function buildMailRelance(client,equip,societe) {
  const el=equip.type==="Climatisation"?`climatisation ${equip.marqueClim||""}`.trim():`chaudière ${equip.marque||""}`.trim();
  return `Bonjour ${client.prenom} ${client.nom},\n\nVotre ${el} n'a pas été entretenu depuis plus de 11 mois.\n\nContactez-nous pour planifier votre rendez-vous.\n\nCordialement,\n${societe.technicien}\n${societe.nom}\n📞 ${societe.tel}\n✉️ ${societe.email}`;
}

function PageRelances({clients,docs,rdvs,setRdvs,societe}) {
  const [filter,setFilter]=useState("tous");
  const [search,setSearch]=useState("");

  const relances=[];
  clients.forEach(client=>{
    (client.equipements||[]).forEach(equip=>{
      if(!EQUIP_RELANCE.includes(equip.type)) return;
      const lastDate=getLastEntretien(client.id,docs);
      const mois=moisDepuis(lastDate);
      if(mois>=DELAI_RELANCE) relances.push({client,equip,lastDate,mois});
    });
  });
  relances.sort((a,b)=>b.mois-a.mois);

  const filtered=relances.filter(r=>{
    const txt=`${r.client.prenom} ${r.client.nom} ${r.client.ville||""} ${r.equip.type} ${r.equip.marque||""} ${r.equip.marqueClim||""}`.toLowerCase();
    const ms=!search||txt.includes(search.toLowerCase());
    const mf=filter==="tous"||(filter==="urgent"&&r.mois>=13)||(filter==="alerte"&&r.mois>=11&&r.mois<13);
    return ms&&mf;
  });

  const urgent=relances.filter(r=>r.mois>=13).length;
  const alerte=relances.filter(r=>r.mois>=11&&r.mois<13).length;
  const aJour=clients.reduce((s,c)=>(c.equipements||[]).filter(e=>EQUIP_RELANCE.includes(e.type)).length+s,0)-relances.length;

  const createRdv=(client)=>{
    const d=new Date();d.setDate(d.getDate()+7);
    setRdvs(p=>[...p,{id:newId(p),clientId:client.id,date:ds(d),heure:"09:00",type:"Entretien annuel",statut:"En attente",notes:"Relance entretien annuel"}]);
    alert(`✓ RDV créé pour ${client.prenom} ${client.nom}`);
  };

  return (
    <div className="content">
      <div className="stats-grid">
        <div className="stat"><div className="stat-label">À relancer</div><div className="stat-value" style={{color:"var(--warning)"}}>{relances.length}</div></div>
        <div className="stat"><div className="stat-label">🔴 Urgents +13 mois</div><div className="stat-value" style={{color:"var(--danger)"}}>{urgent}</div></div>
        <div className="stat"><div className="stat-label">🟠 Alerte 11-12 mois</div><div className="stat-value" style={{color:"var(--warning)"}}>{alerte}</div></div>
        <div className="stat"><div className="stat-label">✅ À jour</div><div className="stat-value" style={{color:"var(--success)"}}>{aJour}</div></div>
      </div>
      <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"14px",padding:"14px 18px",marginBottom:18}}>
        <input placeholder="🔍 Rechercher…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:12}}/>
        <div style={{display:"flex",gap:8}}>
          {[["tous","Tous"],["urgent","🔴 Urgents"],["alerte","🟠 Alerte"]].map(item=>(
            <div key={item[0]} onClick={()=>setFilter(item[0])} style={{padding:"6px 14px",borderRadius:8,fontSize:"0.82rem",cursor:"pointer",fontWeight:600,background:filter===item[0]?"var(--accent)":"var(--surface2)",color:filter===item[0]?"#fff":"var(--muted)"}}>{item[1]}</div>
          ))}
        </div>
      </div>
      {filtered.length===0&&<div className="empty"><div className="icon">{relances.length===0?"🎉":"🔍"}</div><p>{relances.length===0?"Tous vos clients sont à jour ! 🎉":"Aucun résultat"}</p></div>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map((r,i)=>{
          const isUrgent=r.mois>=13;
          const equipLabel=r.equip.type==="Climatisation"?`❄️ ${r.equip.marqueClim||"Clim"}`:r.equip.type==="Pompe à chaleur"?`♨️ ${r.equip.marquePac||"PAC"}`:`${EQUIP_ICON(r.equip.type)} ${r.equip.marque||""}`.trim();
          return (
            <div key={i} style={{background:"var(--surface)",border:`1px solid ${isUrgent?"var(--danger)":"var(--warning)"}`,borderRadius:"14px",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:200}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}>
                  <span style={{fontSize:"1.1rem"}}>{isUrgent?"🔴":"🟠"}</span>
                  <div style={{fontWeight:700,fontSize:"0.95rem"}}>{r.client.prenom} {r.client.nom}</div>
                  <span className={`badge badge-${isUrgent?"danger":"warning"}`}>{r.mois} mois</span>
                </div>
                <div style={{fontSize:"0.8rem",color:"var(--muted)",marginBottom:3}}><AddrLink client={r.client} style={{fontSize:"0.8rem"}}/> · 📞 {r.client.tel}</div>
                <div style={{fontSize:"0.8rem",color:"var(--muted)"}}>{equipLabel} · {r.lastDate?<span>Dernier : <strong style={{color:"var(--text)"}}>{fmt(r.lastDate)}</strong></span>:<span style={{color:"var(--danger)"}}>⚠️ Aucun entretien</span>}</div>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",flexShrink:0}}>
                {r.client.tel&&<a href={`sms:${r.client.tel.replace(/\s/g,"")}?body=${encodeURIComponent(buildSms(r.client,r.equip,societe))}`} className="btn btn-secondary btn-sm" style={{textDecoration:"none"}}>📱 SMS</a>}
                {r.client.email&&<a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(r.client.email)}&su=${encodeURIComponent("Rappel entretien — "+societe.nom)}&body=${encodeURIComponent(buildMailRelance(r.client,r.equip,societe))}`} target="_blank" rel="noopener noreferrer" className="btn btn-gmail btn-sm" style={{textDecoration:"none"}}>✉️ Gmail</a>}
                <button className="btn btn-primary btn-sm" onClick={()=>createRdv(r.client)}>📅 RDV</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
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

const MOT_DE_PASSE = "chachou34500";

function LoginScreen({onLogin}) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);

  const handleLogin = () => {
    if(pwd === MOT_DE_PASSE) { onLogin(); }
    else { setError(true); setPwd(""); setTimeout(()=>setError(false), 2000); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #0d1117 0%, #161b27 50%, #1a1f2e 100%)",fontFamily:"var(--font-body, sans-serif)"}}>
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
  const [loggedIn, setLoggedIn] = useState(false);
  const [page,setPage]=useState("agenda");
  const [clients,setClients]=useState(INIT_CLIENTS);
  const [rdvs,setRdvs]=useState(INIT_RDV);
  const [docs,setDocs]=useState(INIT_DOCS);
  const [devis,setDevis]=useState([]);
  const [catalogue,setCatalogue]=useState(INIT_CATALOGUE);
  const [societe,setSociete]=useState(INIT_SOCIETE);
  const [loaded, setLoaded]=useState(false);

  if(!loggedIn) return <><style>{CSS}</style><LoginScreen onLogin={()=>setLoggedIn(true)}/></>;

  // Chargement initial depuis Firebase
  useEffect(()=>{
    const load = async () => {
      const c = await charger("clients"); if(c) setClients(c);
      const r = await charger("rdvs"); if(r) setRdvs(r);
      const d = await charger("docs"); if(d) setDocs(d);
      const dv = await charger("devis"); if(dv) setDevis(dv);
      const s = await charger("societe"); if(s) setSociete(s);
      const cat = await charger("catalogue"); if(cat) setCatalogue(cat);
      setLoaded(true);
    };
    load();
  }, []);

  // Sauvegarde automatique — seulement après le chargement initial
  useEffect(()=>{ if(loaded) sauvegarder("clients", clients); }, [clients]);
  useEffect(()=>{ if(loaded) sauvegarder("rdvs", rdvs); }, [rdvs]);
  useEffect(()=>{ if(loaded) sauvegarder("docs", docs); }, [docs]);
  useEffect(()=>{ if(loaded) sauvegarder("devis", devis); }, [devis]);
  useEffect(()=>{ if(loaded) sauvegarder("societe", societe); }, [societe]);
  useEffect(()=>{ if(loaded) sauvegarder("catalogue", catalogue); }, [catalogue]);

  const nbRelances=clients.reduce((total,client)=>
    total+(client.equipements||[]).filter(equip=>{
      if(!EQUIP_RELANCE.includes(equip.type)) return false;
      return moisDepuis(getLastEntretien(client.id,docs))>=DELAI_RELANCE;
    }).length
  ,0);
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
                <span style={{width:20,textAlign:"center"}}>{n.icon}</span>
                {n.label}
                {n.id==="relances"&&nbRelances>0&&<span style={{marginLeft:"auto",background:"var(--danger)",color:"#fff",borderRadius:20,fontSize:"0.65rem",fontWeight:700,padding:"2px 7px"}}>{nbRelances}</span>}
                {n.id==="devis"&&nbImpayees>0&&<span style={{marginLeft:"auto",background:"var(--warning)",color:"#fff",borderRadius:20,fontSize:"0.65rem",fontWeight:700,padding:"2px 7px"}}>{nbImpayees}</span>}
              </div>
            ))}
          </nav>
        </aside>
        <div className="main">
          <div className="topbar">
            <h2>{LABELS[page]}</h2>
            <div className="topbar-right" style={{display:"flex",alignItems:"center",gap:10}}>
              {nbRelances>0&&page!=="relances"&&<div onClick={()=>setPage("relances")} style={{cursor:"pointer",background:"#ef444420",color:"var(--danger)",border:"1px solid #ef444440",borderRadius:20,padding:"4px 12px",fontSize:"0.75rem",fontWeight:600}}>🔔 {nbRelances} relance{nbRelances>1?"s":""}</div>}
              {nbImpayees>0&&page!=="devis"&&<div onClick={()=>setPage("devis")} style={{cursor:"pointer",background:"#f59e0b20",color:"var(--warning)",border:"1px solid #f59e0b40",borderRadius:20,padding:"4px 12px",fontSize:"0.75rem",fontWeight:600}}>🧾 {nbImpayees} impayée{nbImpayees>1?"s":""}</div>}
              <div style={{fontSize:"0.8rem",color:"var(--muted)"}}>{societe.nom}</div>
            </div>
          </div>
          {page==="dashboard"&&<PageDashboard clients={clients} rdvs={rdvs} docs={docs}/>}
          {page==="agenda"&&<PageAgenda rdvs={rdvs} setRdvs={setRdvs} clients={clients} docs={docs} setDocs={setDocs} catalogue={catalogue}/>}
          {page==="clients"&&<PageClients clients={clients} setClients={setClients} docs={docs} setDocs={setDocs} rdvs={rdvs} societe={societe}/>}
          {page==="devis"&&<PageDevisFactures clients={clients} docs={docs} setDocs={setDocs} devis={devis} setDevis={setDevis} societe={societe} catalogue={catalogue} setCatalogue={setCatalogue}/>}
          {page==="relances"&&<PageRelances clients={clients} docs={docs} rdvs={rdvs} setRdvs={setRdvs} societe={societe}/>}
          {page==="documents"&&<PageDocuments docs={docs} setDocs={setDocs} clients={clients} societe={societe}/>}
          {page==="settings"&&<PageSettings societe={societe} setSociete={setSociete}/>}
        </div>
        <nav className="mobile-nav">
          <div className="mobile-nav-inner">
            {NAV.map(n=>(
              <div key={n.id} className={`mobile-nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)} style={{position:"relative"}}>
                <span className="mn-icon">{n.icon}</span>
                <span>{n.label}</span>
                {n.id==="relances"&&nbRelances>0&&<span style={{position:"absolute",top:2,right:4,background:"var(--danger)",color:"#fff",borderRadius:20,fontSize:"0.55rem",fontWeight:700,padding:"1px 5px"}}>{nbRelances}</span>}
                {n.id==="devis"&&nbImpayees>0&&<span style={{position:"absolute",top:2,right:4,background:"var(--warning)",color:"#fff",borderRadius:20,fontSize:"0.55rem",fontWeight:700,padding:"1px 5px"}}>{nbImpayees}</span>}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
