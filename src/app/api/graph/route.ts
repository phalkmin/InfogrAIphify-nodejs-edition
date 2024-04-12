import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextRequest } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {

    const apiUrl = process.env.NEXT_PUBLIC_CF_WORKER;
    const requestBody = await req.text();

    const response = await fetch(`${apiUrl}/image`, {
      method: 'POST',
      body: JSON.stringify( { requestBody } ),
    });

    const responseData = await response.blob();
    return new Response(responseData, {
      headers: {
        "content-type": "image/png",
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(`Internal Server Error`, { status: 500 });
  }
}