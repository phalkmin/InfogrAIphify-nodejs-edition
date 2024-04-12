import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextRequest } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { stripHtml } from "string-strip-html";

export const runtime = 'edge';

interface ResponseData {
  summary: string;
}

export async function POST(req: NextRequest) {
  try {
    
    const apiUrl = process.env.NEXT_PUBLIC_CF_WORKER;

    const requestBody = await req.text();
    const { messages } = JSON.parse(requestBody);
    const test = stripHtml(JSON.stringify(messages));
    
    const response = await fetch(`${apiUrl}/crawl`, {
      method: 'POST',
      body: JSON.stringify( { messages: test } ),
    });

    const responseData: ResponseData = await response.json();

    // Assuming you want to return the summary from the response
    const summary = responseData.summary || 'No summary available';
    const jsonResponse = JSON.stringify({ summary });

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