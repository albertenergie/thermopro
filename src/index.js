import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<StrictMode><App /></StrictMode>);

// Désactivation du service worker (temporaire) : le service worker de mise en
// cache de l'appli (public/sw.js) a pu causer un écran blanc persistant chez
// certains utilisateurs — un simple rechargement ne suffit pas à vider son
// cache. On le désinscrit activement ici pour débloquer tout le monde ; on
// pourra le réactiver plus tard une fois la cause identifiée avec certitude.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
  if (window.caches) {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
  }
}
