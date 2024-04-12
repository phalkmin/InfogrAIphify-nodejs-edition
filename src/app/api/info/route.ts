import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextRequest } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {

    const apiUrl = process.env.NEXT_PUBLIC_CF_WORKER;
    const requestBody = await req.text();

    const response = await fetch(`${apiUrl}/info`, {
      method: 'POST',
      body: JSON.stringify( { messages: requestBody } ),
    });

    const responseData = await response.json();
    const jsonResponse = JSON.stringify({ responseData });

    return new Response(jsonResponse, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(`Internal Server Error`, { status: 500 });
  }
}