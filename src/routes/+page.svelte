<script lang="ts">
  import "../app.css";
  import ChatBox from '$lib/components/ChatBox.svelte';
  import { user } from '$lib/stores/auth';
  import { auth } from '$lib/firebase';
  import { signOut } from 'firebase/auth';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    const unsubscribe = user.subscribe((currentUser) => {
      if (!currentUser) {
        goto('/login');
      }
    });

    return () => unsubscribe();
  });

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
</script>

{#if $user}
  <div class="min-h-screen bg-gray-50">
    <!-- Header with logout -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">AI Chatbot</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">
            {$user.isAnonymous ? 'Anonymous User' : $user.email}
          </span>
          <button
            on:click={handleLogout}
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Chat content -->
    <main class="container mx-auto p-4">
      <div class="bg-white rounded-lg shadow p-6">
        <p>This website connects an LLM with a database of ecommerce data from four Japanese food websites. Send it a message asking for recommendations or suggesting what kind of foods you like. If working correctly, it should provide you with a recommendation tailored to your message. Thank you for testing my application. Please give me any feedback you may have as I work on improving it.</p>
    <!-- Chat interface goes here -->
        <ChatBox />
      </div>
    </main>
  </div>
{/if}




