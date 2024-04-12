import { Ai } from './vendor/@cloudflare/ai.js';

export default {
  async fetch(request, env, ctx) {
    const ai = new Ai(env.AI);
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }



    if (url.pathname === '/crawl') {
      try {
        const requestBody = await request.json();
        const chatHistory = requestBody.messages;
        const jsonResponse = JSON.stringify(chatHistory);
    
         const  barto  = await ai.run("@cf/facebook/bart-large-cnn", {
          input_text: jsonResponse,
        });
        const response = new Response(JSON.stringify(barto), {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
          },
        });
        return response;
      } catch (error) {
        console.error('Error:', error);
        return new Response(`Oh shit ${error}`, { status: 500 });
      }
    }


    if (url.pathname === '/info') {
      try {
        const requestBody = await request.json();
        const chatHistory = requestBody.messages;

        const messages = [
          { role: "system", content: "My job is to create visually engaging infographics for content on the web. I need you to take on the persona of a professional infographic creator and generate a visual description for the infographic so that the graphic designer can then create it. Describe what the designer needs to to with clear and practical steps, as if you were creating a prompt. Use the following text for the basis of the infographic: " },
          {
            role: "user",
            content: chatHistory,
          },
        ];

        const answer = await ai.run('@cf/mistral/mistral-7b-instruct-v0.1', { max_tokens : 500, messages: messages });
        const response = new Response(JSON.stringify(answer), {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json',
          },
        });
        return response;
      } catch (error) {
        console.error('Error:', error);
        return new Response('vixi Server Error', { status: 500 });
      }
    }

    if (url.pathname === '/image') {
      try {
        const requestBody = await request.json();
        const agoravai = JSON.stringify(requestBody)
        const inputs = {
          prompt: agoravai,
        };
  
        const ibagen = await ai.run('@cf/bytedance/stable-diffusion-xl-lightning', inputs);
  
        return new Response(ibagen, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            "content-type": "image/png",
          },
        });
      } catch (error) {
        console.error('Error:', error);
        return new Response('RAPAZ INTENSIFIES Server Error', { status: 500 });
      }
    }

    return new Response('Endpoint not found.', { status: 404 });
  },
};
