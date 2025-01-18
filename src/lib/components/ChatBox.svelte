<!-- ChatBox.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { writable } from 'svelte/store';
    import { fade, fly } from 'svelte/transition';
    import { auth } from '$lib/firebase';
    import ProductGallery from './ProductGallery.svelte';
  
    interface ProductInfo {
        product_name: string;
        url: string;
        image_links: string[];
    }  
    
    interface ChatMessage {
      role: 'user' | 'assistant';
      content: string;
      timestamp: string;
      product?: ProductInfo;
    }

    const messages = writable<ChatMessage[]>([]);
    const input = writable('');
    const isLoading = writable(false);
  
    let chatContainer: HTMLElement;
  
    const scrollToBottom = () => {
      if (browser && chatContainer) {
        setTimeout(() => {
          chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }, 0);
      }
    };
  
    const handleSubmit = async (event: Event) => {
      event.preventDefault();
      const currentInput = $input;
      if (!currentInput.trim()) return;

      const idToken = await auth.currentUser?.getIdToken();
  
      input.set('');
      
      messages.update(msgs => [...msgs, {
        role: 'user',
        content: currentInput,
        timestamp: new Date().toISOString()
      }]);
  
      isLoading.set(true);
  
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: $messages,
            idToken,
            session_id: 'default'
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to get response from API');
        }
  
        const data = await response.json();
        
        let product: ProductInfo | undefined;
        
        messages.update(msgs => [...msgs, {
            role: 'assistant',
            content: data.message,
            timestamp: new Date().toISOString(),
            product: data.product_json
        }]);
  
      } catch (error) {
        console.error('Error:', error);
        messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request.',
          timestamp: new Date().toISOString()
        }]);
      } finally {
        isLoading.set(false);
      }
    };
  
    onMount(() => {
      if ($messages.length) scrollToBottom();
    });
  
    $: if (browser && $messages) scrollToBottom();
</script>

<div class="h-[calc(100vh-100px)] flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-5xl h-[calc(100vh-150px)] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        <!-- Chat header -->
        <div class="bg-blue-600 text-white p-4 flex items-center">
            <div>
                <h1 class="text-xl font-bold">eCommerce Chatbot</h1>
                <!-- <p class="text-sm opacity-75">Ask me about Japanese products</p> -->
            </div>
        </div>
  
        <!-- Chat messages -->
        <div class="flex-1 overflow-hidden bg-gray-50">
            <div bind:this={chatContainer} class="h-full overflow-y-auto p-4 space-y-4">
                {#each $messages as message, i (i)}
                    <div 
                        in:fly="{{ y: 20, duration: 300, delay: 50 * i }}"
                        out:fade="{{ duration: 200 }}"
                        class="flex gap-4 {message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}"
                    >
                        <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                            {message.role === 'assistant' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}">
                            {message.role === 'assistant' ? '🤖' : '👤'}
                        </div>
                        <div class="flex-1 max-w-[80%]">
                            <div class="rounded-2xl p-4 shadow-md
                                {message.role === 'assistant'
                                    ? 'bg-white text-gray-800'
                                    : 'bg-blue-500 text-white'}">
                                <p class="whitespace-pre-wrap break-words">{message.content}</p>
                                
                                {#if message.product}
                                    <div class="mt-4 space-y-3 border-t pt-3">
                                        <a
                                            href={message.product.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="text-blue-600 hover:text-blue-800 font-medium block"
                                        >
                                            <b>{message.product.product_name}</b> ➡️
                                        </a>
                                        {#if message.product.image_links && message.product.image_links.length > 0}
                                            <ProductGallery
                                                images={message.product.image_links}
                                                productUrl={message.product.url}
                                                productName={message.product.product_name}
                                            />
                                        {/if}
                                    </div>
                                {/if}
                            </div>
                            <span class="text-xs text-gray-500 mt-1 block">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                {/each}
                
                {#if $isLoading}
                    <div class="flex justify-center" in:fade="{{ duration: 200 }}">
                        <div class="flex space-x-2 animate-pulse">
                            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
  
        <!-- Input area -->
        <form
            on:submit={handleSubmit}
            class="border-t bg-white p-4"
        >
            <div class="flex gap-2">
                <input
                    bind:value={$input}
                    placeholder="Type here..."
                    class="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    disabled={$isLoading}
                />
                <button
                    type="submit"
                    class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 transition-all duration-300 flex items-center justify-center"
                    disabled={!$input.trim() || $isLoading}
                >
                    {#if $isLoading}
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    {:else}
                        Send
                    {/if}
                </button>
            </div>
        </form>
    </div>
</div>