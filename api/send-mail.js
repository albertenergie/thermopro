// Envoie un email avec pièce jointe PDF, depuis contact@albertenergie.fr, via l'API Resend.
// Nécessite la variable d'environnement RESEND_API_KEY sur Vercel (Settings > Environment Variables).
// Nécessite que le domaine albertenergie.fr soit vérifié dans Resend (enregistrements DNS SPF/DKIM).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { to, subject, body, pdfBase64, filename } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Adresse email du client manquante." });
    }
    if (!pdfBase64) {
      return res.status(400).json({ error: "PDF manquant." });
    }
    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: "Clé API Resend non configurée sur le serveur (RESEND_API_KEY)." });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Albert Énergie <contact@albertenergie.fr>",
        to: [to],
        subject: subject || "Document — Albert Énergie",
        text: body || "",
        attachments: [
          {
            filename: filename || "document.pdf",
            content: pdfBase64
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Erreur lors de l'envoi via Resend");
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (e) {
    console.error("Erreur send-mail:", e);
    return res.status(500).json({ error: e.message });
  }
}
