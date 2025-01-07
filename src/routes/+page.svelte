<script lang="ts">
    import { useChat } from '@ai-sdk/svelte';
    import { fade } from 'svelte/transition';
  
    interface Message {
      role: 'user' | 'assistant';
      content: string;
      timestamp?: Date;
    }
  
    const { input, handleSubmit, messages } = useChat();
    const scrollToBottom = () => {
      setTimeout(() => {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer?.scrollTo(0, chatContainer.scrollHeight);
      }, 100);
    };
  
    $: if ($messages) scrollToBottom();
</script>
  
<main class="flex flex-col h-screen bg-gray-50 p-4">
    <div class="flex-1 max-w-3xl mx-auto w-full flex flex-col gap-4">
        <div class="chat-container flex-1 overflow-y-auto space-y-4 p-4 rounded-lg bg-white shadow-sm">
        {#each $messages as message}
            <div
            transition:fade
            class="flex gap-3 {message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}"
            >
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                {message.role === 'assistant' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}">
                {message.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div class="flex-1 max-w-[80%]">
                <div class="rounded-lg p-3 
                {message.role === 'assistant' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-gray-100 text-gray-900'}">
                <p class="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                <span class="text-xs text-gray-500 mt-1">
                {new Date().toLocaleTimeString()}
                </span>
            </div>
            </div>
        {/each}
        </div>

        <form 
        on:submit|preventDefault={handleSubmit}
        class="flex gap-2 p-4 bg-white rounded-lg shadow-sm"
        >
        <input
            bind:value={$input}
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            Send
        </button>
        </form>
    </div>
</main>
  
<style>
    .chat-container {
      height: calc(100vh - 180px);
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }
    
    .chat-container::-webkit-scrollbar {
      width: 6px;
    }
    
    .chat-container::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .chat-container::-webkit-scrollbar-thumb {
      background-color: rgba(156, 163, 175, 0.5);
      border-radius: 3px;
    }
</style>