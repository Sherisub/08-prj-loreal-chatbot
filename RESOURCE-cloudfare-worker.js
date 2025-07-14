export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Get user input
    const body = await request.json();
    const userMessages = body.messages || [];

    // Add system prompt at the beginning
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful, friendly AI assistant that only answers questions related to L’Oréal products, skincare, beauty routines, haircare, and makeup. If the question is unrelated, politely refuse to answer."
      },
      ...userMessages
    ];

    // Prepare OpenAI request
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const openaiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 300
      })
    });

    const result = await openaiResponse.json();

    return new Response(JSON.stringify(result), {
      headers: corsHeaders
    });
  }
};
