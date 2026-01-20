// api/analyze.js - Función sin servidor de Vercel (CommonJS)

module.exports = async (request, response) => {
  // Configurar CORS
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar preflight request
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // Solo permitir peticiones POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userInput } = request.body;

  if (!userInput) {
    return response.status(400).json({ message: 'User input is required' });
  }

  // Obtenemos la clave API secreta desde las Variables de Entorno de Vercel
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key missing");
    return response.status(500).json({ message: 'Server configuration error: API key not configured' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${apiKey}`;

  const systemPrompt = "Actúas como un asistente virtual para Fisiourense, una clínica de fisioterapia en Ourense, España. Eres amable, profesional y tu objetivo es orientar al usuario, nunca diagnosticar. Tu conocimiento se basa en los servicios que ofrece la clínica: Fisioterapia, Fisioterapia Deportiva, Osteopatía, Nutrición, Entrenador Personal y Fisiourense Estética.";

  const userQuery = `Un paciente describe su problema de la siguiente manera: '${userInput}'. Basándote en esta descripción, sugiere 1 o 2 servicios de Fisiourense que podrían ser más relevantes para él. Explica brevemente y en un lenguaje sencillo por qué cada servicio podría ayudar. Después de las sugerencias, añade un consejo general muy breve (ej. evitar movimientos bruscos, aplicar frío/calor si corresponde, etc.). Finalmente, y de forma obligatoria, añade el siguiente descargo de responsabilidad en negrita: '**Importante: Esta es una orientación y no sustituye un diagnóstico profesional. Te recomendamos que pidas una cita para que uno de nuestros especialistas pueda evaluar tu caso de forma personalizada.**'`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`Gemini API Error: ${geminiResponse.status} - ${errorText}`);
      throw new Error(`Gemini API responded with status: ${geminiResponse.status}`);
    }

    const result = await geminiResponse.json();
    const candidate = result.candidates?.[0];

    if (candidate && candidate.content?.parts?.[0]?.text) {
      response.status(200).json({ text: candidate.content.parts[0].text });
    } else {
      console.error("Invalid response structure:", JSON.stringify(result));
      throw new Error("Invalid response structure from Gemini API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    response.status(500).json({ message: "Error processing your request. Please try again later." });
  }
};
