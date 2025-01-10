import type { RequestHandler } from './$types';

const apiUrl = process.env.API_URL;

export const POST = (async ({ request }) => {
  try {
      const { messages } = await request.json();
      
      const response = await fetch(`${apiUrl}/chat`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              message: messages[messages.length - 1].content,  // Send just the last message
              session_id: 'default'
          }),
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to get response from API');
      }

      const data = await response.json();
      
      return new Response(JSON.stringify({
          content: data.message,  // Assuming your FastAPI returns { message: string }
          timestamp: new Date().toISOString()
      }), {
          headers: {
              'Content-Type': 'application/json'
          }
      });
      
  } catch (error) {
      console.error('Error in chat endpoint:', error);
      return new Response(
          JSON.stringify({ 
              error: error instanceof Error ? error.message : 'Unknown error occurred' 
          }), { 
              status: 500,
              headers: {
                  'Content-Type': 'application/json'
              }
          }
      );
  }
}) satisfies RequestHandler;