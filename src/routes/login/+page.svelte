<!-- src/routes/login/+page.svelte -->
<script lang="ts">
    import "$src/app.css";
    import { auth } from '$lib/firebase';
    import { user } from '$lib/stores/auth';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { 
      signInWithPopup, 
      GoogleAuthProvider,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signInAnonymously,
      onAuthStateChanged
    } from 'firebase/auth';
    import { fade } from 'svelte/transition';
  
    let email = '';
    let password = '';
    let isSignUp = false;
    let loading = false;
    let error = '';
  
    onMount(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user.set(currentUser);
        if (currentUser) {
          goto('/');
        }
      });
  
      return () => unsubscribe();
    });
  
    async function signInWithGoogle() {
      loading = true;
      error = '';
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (e) {
        error = 'Failed to sign in with Google';
        console.error(e);
      }
      loading = false;
    }
  
    async function handleAnonymousSignIn() {
      loading = true;
      error = '';
      try {
        await signInAnonymously(auth);
      } catch (e) {
        error = 'Failed to sign in anonymously';
        console.error(e);
      }
      loading = false;
    }
  
    async function handleSubmit() {
      loading = true;
      error = '';
      try {
        if (isSignUp) {
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }
      } catch (e) {
        error = isSignUp ? 'Failed to create account' : 'Invalid email or password';
        console.error(e);
      }
      loading = false;
    }
  </script>
  
  <div class="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
    <div 
      class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      transition:fade
    >
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">AI Chatbot</h1>
        <p class="text-gray-600">Your intelligent conversation partner</p>
      </div>
  
      <div class="space-y-4">
        <!-- Try Now button for anonymous auth -->
        <button
          on:click={handleAnonymousSignIn}
          class="w-full bg-purple-600 text-white rounded-md py-3 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Try Now - No Account Required'}
        </button>
  
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
  
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              bind:value={email}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
  
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              bind:value={password}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
  
          {#if error}
            <p class="text-red-500 text-sm">{error}</p>
          {/if}
  
          <button
            type="submit"
            class="w-full bg-purple-600 text-white rounded-md py-2 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {#if loading}
              Loading...
            {:else}
              {isSignUp ? 'Sign Up' : 'Sign In'}
            {/if}
          </button>
        </form>
  
        <div class="mt-4">
          <button
            on:click={signInWithGoogle}
            class="w-full bg-white border border-gray-300 text-gray-700 rounded-md py-2 px-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Continue with Google
            </div>
          </button>
        </div>
  
        <div class="mt-4 text-center">
          <button
            on:click={() => isSignUp = !isSignUp}
            class="text-sm text-purple-600 hover:text-purple-500"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  </div>