<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { writable } from 'svelte/store';

  interface ChatMessage {
      role: 'user' | 'assistant';
      content: string;
      timestamp: string;
  }

  // Create stores for messages and input
  const messages = writable<ChatMessage[]>([]);
  const input = writable('');
  const isLoading = writable(false);

  let chatContainer: HTMLElement;

  const scrollToBottom = () => {
      if (browser && chatContainer) {
          chatContainer.scrollTo(0, chatContainer.scrollHeight);
      }
  };

  const handleSubmit = async (event: Event) => {
      event.preventDefault();
      const currentInput = $input;
      if (!currentInput.trim()) return;

      // Clear input immediately
      input.set('');
      
      // Add user message
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
                  session_id: 'default'
              }),
          });

          if (!response.ok) {
              throw new Error('Failed to get response from API');
          }

          const data = await response.json();
          
          // Add assistant message
          messages.update(msgs => [...msgs, {
              role: 'assistant',
              content: data.content,
              timestamp: new Date().toISOString()
          }]);

      } catch (error) {
          console.error('Error:', error);
          // Optionally show error in UI
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

<div class="grid h-screen grid-rows-[1fr,auto]">
  <div
      bind:this={chatContainer}
      class="chat-container overflow-y-auto p-4 space-y-4"
  >
      {#each $messages as message}
          <div
              class="flex gap-3 {message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}"
          >
              <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  {message.role === 'assistant' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}">
                  {message.role === 'assistant' ? '🐸' : '👤'}
              </div>
              <div class="flex-1 max-w-[80%]">
                  <div class="rounded-lg p-3
                      {message.role === 'assistant'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-gray-100 text-gray-900'}">
                      <p class="whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <span class="text-xs text-gray-500 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
              </div>
          </div>
      {/each}
      {#if $isLoading}
          <div class="flex justify-center">
              <div class="animate-pulse text-gray-500">Processing...</div>
          </div>
      {/if}
  </div>

  <form
      on:submit={handleSubmit}
      class="border-t bg-white p-4"
  >
      <div class="max-w-3xl mx-auto flex gap-2">
          <input
              bind:value={$input}
              placeholder="Type your message..."
              class="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={$isLoading}
          />
          <button
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              disabled={!$input.trim() || $isLoading}
          >
              {$isLoading ? 'Sending...' : 'Send'}
          </button>
      </div>
  </form>
</div>