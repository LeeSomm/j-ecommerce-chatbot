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
      <div class="info-section mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-sm">
        <p class="mb-4 font-semibold">Thank you for testing my website.</p>
        <p class="mb-2">This chatbot has access to a database of products from the following Japanese retailers:</p>
        <ul class="list-disc list-inside mb-4">
          <li><strong><a href="https://kumamotokabou.net/" target="_blank" rel="noopener">Kumamoto Kabou</a>:</strong> Bakery of Sweets</li>
          <li><strong><a href="https://musouan-shop.jp/" target="_blank" rel="noopener">Musousan</a></strong> Tofu, Natto, and Soybean-based Bread</li>
          <li><strong><a href="https://www.oec-daisho.com/" target="_blank" rel="noopener">Daisho</a>:</strong> Savory Soup, Sauce, and Seasoning Manufacturer</li>
          <li><strong><a href="https://www.kanohachi.jp/" target="_blank" rel="noopener">Kanohachi</a>:</strong> Specialty Honey Store</li>
        </ul>
        <p class="mb-2"><strong>Disclaimer:</strong> The e-commerce websites linked by this AI chatbot are not affiliated with ET-Lode, LLC. We do not endorse or take responsibility for the content, products, or services offered by these third-party websites.</p>
        <p class="mb-2">This chatbot is instructed to help provide tailored recommendations based on your conversation. Please begin a conversation and provide your preferences.</p>
      </div>
      
    <!-- Chat interface goes here -->
        <ChatBox />
      
    </main>
  </div>
{/if}




