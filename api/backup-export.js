// Sauvegarde automatique hebdomadaire : exporte toutes les données Firestore
// (clients, rdv, devis, documents, catalogue, société) et les envoie par email
// en pièce jointe à contact@albertenergie.fr, via Resend.
//
// Déclenché automatiquement chaque semaine par Vercel Cron (voir vercel.json).
//
// Variables d'environnement nécessaires sur Vercel (Settings > Environment Variables) :
//   FIREBASE_ADMIN_PROJECT_ID    -> "project_id" du fichier JSON de la clé de service
//   FIREBASE_ADMIN_CLIENT_EMAIL  -> "client_email" du fichier JSON
//   FIREBASE_ADMIN_PRIVATE_KEY   -> "private_key" du fichier JSON (coller tel quel, avec les \n)
//   RESEND_API_KEY               -> déjà utilisée par api/send-mail.js
//   BACKUP_EMAIL_TO              -> adresse de destination (ex: contact@albertenergie.fr)
//   CRON_SECRET                  -> chaîne secrète de ton choix, pour empêcher un déclenchement externe non autorisé
//
// Ces valeurs se saisissent UNIQUEMENT dans le tableau de bord Vercel — jamais dans le code ni dans le repo Git.

import admin from "firebase-admin";

const USER_ID = "pierre";

function getAdminApp() {
  if (admin.apps.length) return admin.app();
  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Vercel stocke les variables d'environnement sur une seule ligne :
      // les retours à la ligne du \n littéral doivent être restaurés.
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    }),
  });
}

async function chargerCollection(db, col) {
  const ref = db.collection("thermopro").doc(USER_ID).collection(col).doc("data");
  const snap = await ref.get();
  if (!snap.exists) return null;
  try { return JSON.parse(snap.data().value); } catch { return null; }
}

async function chargerDocsItems(db) {
  const snap = await db.collection("thermopro").doc(USER_ID).collection("docsItems").get();
  return snap.docs.map(d => d.data());
}

export default async function handler(req, res) {
  // Sécurité : seul Vercel Cron (avec le bon secret) ou toi-même en test manuel
  // peut déclencher cette route.
  const auth = req.headers.authorization;
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  try {
    if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
      return res.status(500).json({ error: "Identifiants Firebase Admin non configurés (FIREBASE_ADMIN_*)." });
    }
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: "Clé API Resend non configurée (RESEND_API_KEY)." });
    }
    const destinataire = process.env.BACKUP_EMAIL_TO || "contact@albertenergie.fr";

    const app = getAdminApp();
    const db = admin.firestore(app);

    const [clients, rdvs, devis, catalogue, societe, docsItems] = await Promise.all([
      chargerCollection(db, "clients"),
      chargerCollection(db, "rdvs"),
      chargerCollection(db, "devis"),
      chargerCollection(db, "catalogue"),
      chargerCollection(db, "societe"),
      chargerDocsItems(db),
    ]);

    const backup = {
      clients: clients || [],
      rdvs: rdvs || [],
      docs: docsItems || [],
      devis: devis || [],
      catalogue: catalogue || [],
      societe: societe || {},
      exportDate: new Date().toISOString(),
      version: "ThermoPro-v9-auto",
    };

    const json = JSON.stringify(backup, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `thermopro-sauvegarde-auto-${dateStr}.json`;
    const base64 = Buffer.from(json, "utf-8").toString("base64");

    const mailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Albert Énergie <contact@albertenergie.fr>",
        to: [destinataire],
        subject: `Sauvegarde automatique ThermoPro — ${dateStr}`,
        text: `Bonjour,\n\nVoici la sauvegarde automatique hebdomadaire de vos données ThermoPro (${dateStr}).\nConservez ce fichier — il permet de tout restaurer via Paramètres > Importer sauvegarde.\n\nCeci est un email automatique.`,
        attachments: [{ filename, content: base64 }],
      }),
    });

    const mailData = await mailRes.json();
    if (!mailRes.ok) throw new Error(mailData?.message || "Erreur lors de l'envoi via Resend");

    return res.status(200).json({ success: true, id: mailData.id, filename });
  } catch (e) {
    console.error("Erreur backup-export:", e);
    return res.status(500).json({ error: e.message });
  }
}
