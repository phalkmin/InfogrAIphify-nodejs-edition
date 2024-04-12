import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextRequest } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import cheerio from 'cheerio';

export const runtime = 'edge';

interface RequestBody {
  url?: string; // Define the shape of the request body
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json(); // Specify the type of the request body
    const url = typeof body.url === 'string' ? body.url : null;

    if (!url) {
      return new Response('Missing URL in request body or invalid format', { status: 400 });
    }

    let encodedURL = new URL(url);

    const response = await fetch(encodedURL);
    const html = await response.text();
    const parsedHtml = cheerio.load(html);
    let content = parsedHtml('article').html();

    if (!content) {
      content = parsedHtml('main').html();
    }

    const responseData = {
      content: content,
    };

    const jsonResponse = JSON.stringify(responseData);

    return new Response(jsonResponse, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
