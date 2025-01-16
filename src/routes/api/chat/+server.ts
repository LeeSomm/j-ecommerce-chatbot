// +server.ts
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/firebase';

const API_URL = process.env.API_URL || 'http://localhost:8000';

export const POST = (async ({ request }) => {
    try {
        const { messages, idToken } = await request.json();
        
        // Check if we have a token
        if (!idToken) {
            throw error(401, 'No authentication token provided');
        }

        // Get the last user message
        const lastUserMessage = [...messages]
            .reverse()
            .find(msg => msg.role === 'user');
            
        if (!lastUserMessage) {
            throw error(400, 'No user message found');
        }

        // Get current user and token
        // const currentUser = auth.currentUser;
        // if (!currentUser) {
        //     throw error(401, 'User not authenticated');
        // }

        // const idToken = await currentUser.getIdToken();

        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                message: lastUserMessage.content,
                context: {}
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw error(response.status, errorData.detail || 'Failed to get response from API');
        }

        const data = await response.json();
        
        return new Response(JSON.stringify({
            message: data.message,
            timestamp: data.timestamp
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
    } catch (err) {
        console.error('Error in chat endpoint:', err);
        
        // Handle different types of errors
        if (err instanceof Error) {
            throw error(500, err.message);
        } else {
            throw error(500, 'An unknown error occurred');
        }
    }
}) satisfies RequestHandler;