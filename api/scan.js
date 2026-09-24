// Lecture d'une plaque signalétique par l'IA.
// Paramètre "cible" (envoyé par l'appli) :
//   - "appareil" (par défaut) : chaudière, clim, PAC...
//   - "bruleur" : plaque d'un brûleur fioul (Riello, Cuenod, Elco...)

const CONSIGNE_APPAREIL = `Lis cette plaque signalétique d'appareil de chauffage ou climatisation et extrais les informations. Réponds UNIQUEMENT en JSON valide sans texte autour :
{
  "marque": "la marque de l'appareil",
  "modele": "le modèle exact",
  "numSerie": "le numéro de série",
  "puissance": "la puissance en kW",
  "fluide": "le fluide frigorigène si présent (R32, R410A etc) sinon vide"
}
Si une information n'est pas visible, mets une chaîne vide "".`;

const CONSIGNE_BRULEUR = `Cette photo montre la plaque signalétique d'un BRÛLEUR fioul (et non de la chaudière). Marques courantes : Riello, Cuenod, Elco, Weishaupt, Bentone, Ecoflam, Lamborghini, Oertli, Baltur, De Dietrich, Chappée.
Extrais les informations du brûleur. Réponds UNIQUEMENT en JSON valide sans texte autour :
{
  "marque": "la marque du brûleur",
  "modele": "le type ou modèle du brûleur (souvent indiqué 'Type', 'Mod.' ou 'Modèle', ex : RDB 2.2, NC4, VL 1.55)",
  "numSerie": "le numéro de série du brûleur (souvent 'N°', 'S/N', 'Serial' ou 'Fabr. Nr')"
}
Ne confonds pas le numéro de série avec le code article ou la référence. N'indique pas la puissance de la chaudière. Si une information n'est pas visible, mets une chaîne vide "".`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { image, mediaType, cible } = req.body;
    const consigne = cible === 'bruleur' ? CONSIGNE_BRULEUR : CONSIGNE_APPAREIL;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image }
            },
            { type: 'text', text: consigne }
          ]
        }]
      })
    });

    const data = await response.json();

    // Détecte une erreur API et la remonte clairement au lieu de l'avaler silencieusement
    if (!response.ok || data.type === 'error') {
      console.error('Erreur API Anthropic:', JSON.stringify(data));
      return res.status(response.status || 500).json({
        error: data.error?.message || 'Erreur API Anthropic'
      });
    }

    const text = data.content?.[0]?.text || '{}';
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    res.status(200).json(parsed);
  } catch (e) {
    console.error('Erreur scan.js:', e.message);
    res.status(500).json({ error: e.message });
  }
}
