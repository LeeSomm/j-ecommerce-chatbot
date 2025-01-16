<!-- src/routes/+layout.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { auth } from '$lib/firebase';
    import { user } from '$lib/stores/auth';
    import { onAuthStateChanged } from 'firebase/auth';
    import { goto } from '$app/navigation';
  
    onMount(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user.set(currentUser);
        
        // Redirect based on auth state
        const currentPath = window.location.pathname;
        if (currentUser && currentPath === '/login') {
          goto('/');
        } else if (!currentUser && currentPath !== '/login') {
          goto('/login');
        }
      });
  
      return () => unsubscribe();
    });
  </script>
  
  <slot />