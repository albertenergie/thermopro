export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { image, mediaType } = req.body;
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
            {
              type: 'text',
              text: `Lis cette plaque signalétique d'appareil de chauffage ou climatisation et extrais les informations. Réponds UNIQUEMENT en JSON valide sans texte autour :
{
  "marque": "la marque de l'appareil",
  "modele": "le modèle exact",
  "numSerie": "le numéro de série",
  "puissance": "la puissance en kW",
  "fluide": "le fluide frigorigène si présent (R32, R410A etc) sinon vide"
}
Si une information n'est pas visible, mets une chaîne vide "".`
            }
          ]
        }]
      })
    });

    const data = await response.json();

    // NOUVEAU : détecter une erreur API et la remonter clairement
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
