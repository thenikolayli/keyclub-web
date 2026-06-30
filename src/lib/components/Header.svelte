<script>
    import gsap from "gsap";
    import {onMount} from "svelte";
    import {page} from "$app/state";
    import Icon from "@iconify/svelte";

    const links = [
        {href: "/", label: "Home"},
        {href: "/about", label: "About"},
        {href: "/hours", label: "Hours"},
        // {href: "/dcon", label: "DCON"},
        {href: "/events", label: "Events"},
    ]

    let drawer
    let drawerButton
    let drawerOpen = $state(false)

    const isActive = (href) => href === "/" ? page.url.pathname === "/" : page.url.pathname.startsWith(href)

    onMount(() => {
        gsap.set(drawer, {
            transformOrigin: "top right"
        })
        const onWindowClick = (event) => {
            if (drawerOpen && !drawer.contains(event.target) && !drawerButton.contains(event.target)) {
                drawerOpen = false
            }
        }
        addEventListener("click", onWindowClick)
        return () => removeEventListener("click", onWindowClick)
    })

    $effect(() => {
        gsap.to(drawer, {xPercent: drawerOpen ? -100 : 0, duration: .3, ease: "power2.out"})
    })
</script>

<header class="relative h-[10vh] z-30 flex w-full flex-col items-center bg-background p-4 text-foreground md:flex-row md:justify-between md:px-8 lg:px-12">
    <a class="w-[78%] self-start md:w-auto md:self-auto" href="/" aria-label="Key Club home">
        <img class="h-12 w-full object-contain object-left md:h-14 lg:h-16" src="/keyclub_horizontal_black.png" alt="Henry M. Jackson Key Club"/>
    </a>

    <button class="absolute right-3 top-5 md:hidden" bind:this={drawerButton}
            onclick={() => drawerOpen = !drawerOpen} aria-label="Toggle menu" aria-expanded={drawerOpen}>
        <Icon icon="solar:hamburger-menu-linear" class="size-10"/>
    </button>

    <nav class="hidden md:block">
        <ul class="flex items-center gap-7 text-lg lg:gap-10 lg:text-xl">
            {#each links as link (link.href)}
                <li>
                    <a class="relative py-1"
                       href={link.href}>
                        {link.label}
                        <span class="pointer-events-none absolute bottom-0.5 left-0 h-1 w-full {isActive(link.href) ? 'bg-primary' : 'bg-transparent'}"></span>
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
</header>

<!-- Mobile drawer -->
<!-- I wrote the translate-x-full here instead of with GSAP because it was causing it to flash briefly when the page loaded -->
<aside bind:this={drawer} class="fixed right-0 top-0 z-20 flex h-screen w-[72%] max-w-xs flex-col bg-background p-6 text-foreground translate-x-full">
    <nav class="pt-16">
        <ul class="space-y-3 text-3xl">
            {#each links as link (link.href)}
                <li>
                    <a class="relative py-1"
                       href={link.href} onclick={() => drawerOpen = false}>{link.label}
                       <span class="pointer-events-none absolute bottom-0.5 left-0 h-1 w-full {isActive(link.href) ? 'bg-primary' : 'bg-transparent'}">

                       </span>
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
    <div class="flex-1"></div>
    <img class="mx-auto h-28 w-28 object-contain opacity-90" src="/faz.webp" alt="Henry M. Jackson Key Club"/>
</aside>
