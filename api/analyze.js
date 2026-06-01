// api/analyze.js - Función sin servidor de Vercel (CommonJS)
// Analizador de síntomas con IA — Deepseek V4 Pro

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
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error("Deepseek API Key missing");
    return response.status(500).json({ message: 'Server configuration error: API key not configured' });
  }

  // Deepseek API — OpenAI-compatible endpoint
  const apiUrl = 'https://api.deepseek.com/chat/completions';

  const systemPrompt = "Actúas como un asistente virtual para Fisiourense, una clínica de fisioterapia en Ourense, España. Eres amable, profesional y tu objetivo es orientar al usuario, nunca diagnosticar. Tu conocimiento se basa en los servicios que ofrece la clínica: Fisioterapia, Fisioterapia Deportiva, Osteopatía, Nutrición, Entrenador Personal y Fisiourense Estética.";

  const userQuery = `Un paciente describe su problema de la siguiente manera: '${userInput}'. Basándote en esta descripción, sugiere 1 o 2 servicios de Fisiourense que podrían ser más relevantes para él. Explica brevemente y en un lenguaje sencillo por qué cada servicio podría ayudar. Después de las sugerencias, añade un consejo general muy breve (ej. evitar movimientos bruscos, aplicar frío/calor si corresponde, etc.). Finalmente, y de forma obligatoria, añade el siguiente descargo de responsabilidad en negrita: '**Importante: Esta es una orientación y no sustituye un diagnóstico profesional. Te recomendamos que pidas una cita para que uno de nuestros especialistas pueda evaluar tu caso de forma personalizada.**'`;

  const payload = {
    model: 'deepseek-v4-pro',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery },
    ],
  };

  try {
    console.log(`Attempting to call Deepseek API with model: deepseek-v4-pro`);

    const deepseekResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!deepseekResponse.ok) {
      const errorText = await deepseekResponse.text();
      console.error(`Deepseek API Error details: ${deepseekResponse.status} - ${errorText}`);
      throw new Error(`Deepseek API responded with status: ${deepseekResponse.status} - ${errorText}`);
    }

    const result = await deepseekResponse.json();
    const message = result.choices?.[0]?.message;

    if (message && message.content) {
      response.status(200).json({ text: message.content });
    } else {
      console.error("Invalid response structure:", JSON.stringify(result));
      throw new Error("Invalid response structure from Deepseek API.");
    }

  } catch (error) {
    console.error("Error calling Deepseek API:", error);
    response.status(500).json({
      message: "Error processing your request. Please try again later.",
      debug: error.message || String(error),
    });
  }
};
