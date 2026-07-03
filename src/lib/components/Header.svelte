<script>
    import {page} from "$app/state";
    import Icon from "@iconify/svelte";
    import * as Drawer from "$lib/components/ui/drawer/index.js";

    const links = [
        {href: "/", label: "Home"},
        {href: "/about", label: "About"},
        {href: "/hours", label: "Hours"},
        // {href: "/dcon", label: "DCON"},
        {href: "/events", label: "Events"},
    ]

    let drawerOpen = $state(false)

    const isActive = (href) => href === "/" ? page.url.pathname === "/" : page.url.pathname.startsWith(href)
</script>

<header class="relative h-[10vh] z-30 flex w-full flex-col items-center bg-background p-4 text-foreground md:flex-row md:justify-between md:px-8 lg:px-12">
    <a class="w-[78%] self-start md:w-auto md:self-auto" href="/" aria-label="Key Club home">
        <img class="h-12 w-full object-contain object-left md:h-14 lg:h-16" src="/keyclub_horizontal_black.png" alt="Henry M. Jackson Key Club"/>
    </a>

    <Drawer.Root bind:open={drawerOpen} direction="right">
        <Drawer.Trigger class="absolute right-3 top-5 md:hidden" aria-label="Toggle menu">
            <Icon icon="solar:hamburger-menu-linear" class="size-10"/>
        </Drawer.Trigger>
        <Drawer.Content class="w-[72%] max-w-xs border-primary data-[vaul-drawer-direction=right]:border-l-4 bg-background p-6 text-foreground">
            <Drawer.Header class="sr-only">
                <Drawer.Title>Menu</Drawer.Title>
                <Drawer.Description>Site navigation</Drawer.Description>
            </Drawer.Header>
            <nav>
                <ul class="space-y-3 text-3xl">
                    {#each links as link (link.href)}
                        <li>
                            <a class="relative py-1"
                               href={link.href} onclick={() => drawerOpen = false}>{link.label}
                               <span class="pointer-events-none absolute bottom-0.5 left-0 h-0.5 w-full {isActive(link.href) ? 'bg-primary' : 'bg-transparent'}"></span>
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>
            <div class="flex-1"></div>
            <img class="mx-auto h-28 w-28 object-contain opacity-90" src="/faz.webp" alt="Henry M. Jackson Key Club"/>
        </Drawer.Content>
    </Drawer.Root>

    <nav class="hidden md:block">
        <ul class="flex items-center gap-7 text-lg lg:gap-10 lg:text-xl">
            {#each links as link (link.href)}
                <li>
                    <a class="relative py-1"
                       href={link.href}>
                        {link.label}
                        <span class="pointer-events-none absolute bottom-0.5 left-0 h-0.5 w-full {isActive(link.href) ? 'bg-primary' : 'bg-transparent'}"></span>
                    </a>
                </li>
            {/each}
        </ul>
    </nav>
</header>
