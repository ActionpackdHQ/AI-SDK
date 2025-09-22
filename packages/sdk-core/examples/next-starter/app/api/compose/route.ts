import { NextRequest } from 'next/server';
import { createProvider } from '@actionpackd/sdk-core/server';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { prompt, provider: providerId = 'openai' } = await req.json();

    const provider = createProvider({
      id: providerId,
      temperature: 0.7,
    });

    const stream = provider.generateStream(prompt, { temperature: 0.7, retries: 0 });
    
    const encoder = new TextEncoder();
    
    const customReadable = new ReadableStream<Uint8Array>({
      async start(controller): Promise<void> {
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
