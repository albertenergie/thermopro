// Génère un flux iCal (.ics) avec tous les RDV clients + les blocs perso/vacances,
// à partir des données déjà stockées dans Firestore (mêmes documents que l'app).
// Aucune dépendance supplémentaire : lecture directe via l'API REST Firestore.

const USER_ID = "pierre";

function escapeICS(str) {
  return String(str || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function pad(n) { return String(n).padStart(2, "0"); }

function fmtDateTime(dateStr, timeStr) {
  // dateStr: "YYYY-MM-DD", timeStr: "HH:MM" -> "YYYYMMDDTHHMMSS" (heure locale, flottante)
  const [y, m, d] = dateStr.split("-");
  const [hh, mm] = (timeStr || "00:00").split(":");
  return `${y}${m}${d}T${pad(hh)}${pad(mm)}00`;
}

function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return `${y}${m}${d}`;
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addMinutes(dateStr, timeStr, minutes) {
  const [hh, mm] = timeStr.split(":").map(Number);
  const total = hh * 60 + mm + minutes;
  const dayOffset = Math.floor(total / (24 * 60));
  const rem = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const nh = Math.floor(rem / 60), nm = rem % 60;
  return { date: dayOffset ? addDays(dateStr, dayOffset) : dateStr, time: `${pad(nh)}:${pad(nm)}` };
}

async function fetchDoc(col) {
  const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/thermopro/${USER_ID}/${col}/data`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const raw = json.fields?.value?.stringValue;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Erreur lecture ${col}:`, e.message);
    return null;
  }
}

function fullAddr(c) {
  if (!c) return "";
  return [c.adresse, c.codePostal, c.ville].filter(Boolean).join(", ");
}

export default async function handler(req, res) {
  try {
    const [clients, rdvs, blocsPerso] = await Promise.all([
      fetchDoc("clients"),
      fetchDoc("rdvs"),
      fetchDoc("blocsPerso"),
    ]);

    const clientsList = clients || [];
    const rdvsList = rdvs || [];
    const blocsList = blocsPerso || [];

    const now = new Date();
    const dtstamp =
      `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T` +
      `${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

    const lines = [];
    lines.push("BEGIN:VCALENDAR");
    lines.push("VERSION:2.0");
    lines.push("PRODID:-//ThermoPro//Agenda//FR");
    lines.push("CALSCALE:GREGORIAN");
    lines.push("METHOD:PUBLISH");
    lines.push("X-WR-CALNAME:Agenda Albert Énergie");
    lines.push("X-WR-TIMEZONE:Europe/Paris");

    // RDV clients
    rdvsList.forEach((r) => {
      if (!r.date) return;
      const client = clientsList.find((c) => c.id === r.clientId);
      const nomClient = client ? `${client.prenom || ""} ${client.nom || ""}`.trim() : "Client";
      const heure = r.heure || "09:00";
      const end = addMinutes(r.date, heure, 60);
      const summary = `${nomClient} — ${r.type || "RDV"}`;
      const descParts = [];
      if (r.statut) descParts.push(`Statut : ${r.statut}`);
      if (client?.tel) descParts.push(`Tél : ${client.tel}`);
      if (r.notes) descParts.push(`Notes : ${r.notes}`);
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:rdv-${r.id}@thermopro`);
      lines.push(`DTSTAMP:${dtstamp}`);
      lines.push(`DTSTART:${fmtDateTime(r.date, heure)}`);
      lines.push(`DTEND:${fmtDateTime(end.date, end.time)}`);
      lines.push(`SUMMARY:${escapeICS(summary)}`);
      if (client) lines.push(`LOCATION:${escapeICS(fullAddr(client))}`);
      if (descParts.length) lines.push(`DESCRIPTION:${escapeICS(descParts.join(" — "))}`);
      lines.push("END:VEVENT");
    });

    // Blocs perso / vacances
    blocsList.forEach((b) => {
      if (!b.date) return;
      const icon = b.type === "Vacances" ? "🌴" : "📌";
      const summary = `${icon} ${b.titre || b.type}`;
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:bloc-${b.id}@thermopro`);
      lines.push(`DTSTAMP:${dtstamp}`);

      if (b.mode === "heure") {
        const heure = b.heureDebut || "09:00";
        const end = addMinutes(b.date, heure, Number(b.duree || 1) * 60);
        lines.push(`DTSTART:${fmtDateTime(b.date, heure)}`);
        lines.push(`DTEND:${fmtDateTime(end.date, end.time)}`);
      } else if (b.mode === "apresmidi") {
        lines.push(`DTSTART:${fmtDateTime(b.date, "14:00")}`);
        lines.push(`DTEND:${fmtDateTime(b.date, "18:00")}`);
      } else if (b.mode === "plage") {
        lines.push(`DTSTART;VALUE=DATE:${fmtDate(b.date)}`);
        lines.push(`DTEND;VALUE=DATE:${fmtDate(addDays(b.dateFin || b.date, 1))}`);
      } else {
        // journee entière
        lines.push(`DTSTART;VALUE=DATE:${fmtDate(b.date)}`);
        lines.push(`DTEND;VALUE=DATE:${fmtDate(addDays(b.date, 1))}`);
      }

      lines.push(`SUMMARY:${escapeICS(summary)}`);
      lines.push(`DESCRIPTION:${escapeICS(b.type || "")}`);
      lines.push("END:VEVENT");
    });

    lines.push("END:VCALENDAR");

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", "inline; filename=agenda.ics");
    res.status(200).send(lines.join("\r\n"));
  } catch (e) {
    console.error("Erreur agenda.ics:", e.message);
    res.status(500).send("Erreur génération agenda");
  }
}
