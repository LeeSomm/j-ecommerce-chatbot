<script lang="ts">
    import { fade, slide } from 'svelte/transition';
    import { ChevronLeft, ChevronRight } from 'lucide-svelte';
    
    export let images: string[];
    export let productUrl: string;
    export let productName: string;
    
    let selectedIndex = 0;
    let zoomLevel = 1;
    let zoomOriginX = 50;
    let zoomOriginY = 50;
    
    function selectImage(index: number) {
        selectedIndex = index;
    }

    function nextImage() {
        selectedIndex = (selectedIndex + 1) % images.length;
    }

    function previousImage() {
        selectedIndex = (selectedIndex - 1 + images.length) % images.length;
    }

    function handleMouseMove(event: MouseEvent) {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        zoomOriginX = ((event.clientX - rect.left) / rect.width) * 100;
        zoomOriginY = ((event.clientY - rect.top) / rect.height) * 100;
    }

    $: hasMultipleImages = images.length > 1;
</script>

<div class="flex flex-col gap-4">
    <!-- Main image container -->
    <div class="relative overflow-hidden rounded-lg">
        <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="block"
        >
            {#key selectedIndex}
                <div 
                    class="w-full h-64 relative overflow-hidden"
                    role="region"
                    aria-label="Zoomable product image"
                    on:mousemove={handleMouseMove}
                    on:mouseenter={() => zoomLevel = 2}
                    on:mouseleave={() => zoomLevel = 1}
                >
                    <img
                        src={images[selectedIndex] || "/placeholder.svg"}
                        alt={`${productName} - Main view`}
                        class="w-full h-full object-contain transition-transform duration-300 ease-in-out"
                        style="transform: scale({zoomLevel}); transform-origin: {zoomOriginX}% {zoomOriginY}%;"
                        loading="lazy"
                        in:fade={{ duration: 300 }}
                    />
                </div>
            {/key}
        </a>

        {#if hasMultipleImages}
            <!-- Navigation arrows -->
            <button
                class="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                on:click|preventDefault={previousImage}
                aria-label="Previous image"
            >
                <ChevronLeft size={20} />
            </button>
            
            <button
                class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                on:click|preventDefault={nextImage}
                aria-label="Next image"
            >
                <ChevronRight size={20} />
            </button>
        {/if}
    </div>
    
    <!-- Thumbnails -->
    {#if hasMultipleImages}
        <div class="flex gap-2 overflow-x-auto pb-2">
            {#each images as image, i}
                <button
                    class="relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    class:ring-2={selectedIndex === i}
                    class:ring-blue-500={selectedIndex === i}
                    class:opacity-60={selectedIndex !== i}
                    on:click={() => selectImage(i)}
                >
                    <img
                        src={image || "/placeholder.svg"}
                        alt={`${productName} - View ${i + 1}`}
                        class="w-full h-full object-cover"
                        loading="lazy"
                    />
                </button>
            {/each}
        </div>
    {/if}
</div>

