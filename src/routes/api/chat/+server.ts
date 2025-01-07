// import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import type { RequestHandler } from '../../$types';

import { env } from '$env/dynamic/private';

// const openai = createOpenAI({
//   apiKey: env.OPENAI_API_KEY ?? '',
// });
const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY ?? ''
});

export const POST = (async ({ request }) => {
  const { messages } = await request.json();

  const result = streamText({
    // model: openai('gpt-4o-mini'),
    model: google('gemini-1.5-flash-latest'),
    messages,
  });

  return result.toDataStreamResponse();
}) satisfies RequestHandler;