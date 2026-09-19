<script lang="ts">
  import "../app.css";
  import { Toaster } from "$lib/components/ui/sonner/index";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index";
  import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import Icon from "@iconify/svelte";
  import { page } from "$app/state";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte.js";

  let { children, data } = $props();
  const isMobile = new IsMobile();
  let open = $state(false);

  const showHeader = $derived(!page.url.pathname.startsWith("/admin"));

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/hours", label: "Hours" },
    { href: "/dcon", label: "DCON" },
    { href: "/events", label: "Events" },
  ];
  const committees = [
    { href: "/committees/decoration", label: "Decoration" },
    { href: "/committees/leadership", label: "Leadership" },
    { href: "/committees/spirit", label: "Spirit" },
  ];

  const footerNav = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/hours", label: "Hours" },
    { href: "/dcon", label: "DCON" },
    { href: "/events", label: "Events" },
  ];
  const socials = [
    {
      label: "Instagram",
      icon: "fa7-brands:instagram",
      href: "https://www.instagram.com/jhskeyclub21",
    },
    {
      label: "Linktree",
      icon: "solar:link-bold",
      href: "https://linktr.ee/jhskeyclub21",
    },
    {
      label: "GroupMe",
      icon: "thesvg:groupme",
      href: "https://groupme.com/join_group/117343192/3W7crLIS",
    },
    {
      label: "TikTok",
      icon: "fa7-brands:tiktok",
      href: "https://tiktok.com/@jhskeyclub21",
    },
    {
      label: "YouTube",
      icon: "fa7-brands:youtube",
      href: "https://www.youtube.com/@jhskeyclub4870",
    },
  ];

  const isActive = (href: string) =>
    href === "/"
      ? page.url.pathname === "/"
      : page.url.pathname.startsWith(href);
</script>

<Sidebar.Provider class="flex-col" bind:open>
  {#if showHeader}
    <header
      class="relative h-[10vh] z-30 flex w-full flex-col items-center bg-background p-4 text-foreground md:flex-row md:justify-between md:px-8 lg:px-12"
    >
      <a
        class="w-[78%] self-start md:w-auto md:self-auto"
        href="/"
        aria-label="Key Club home"
      >
        <img
          class="h-12 w-full object-contain object-left md:h-14 lg:h-16"
          src="/keyclub_horizontal_black.png"
          alt="Henry M. Jackson Key Club"
        />
      </a>

      <Sidebar.Trigger
        class="absolute right-3 top-6 md:hidden size-8"
        aria-label="Toggle menu"
      />

      <NavigationMenu.Root viewport={isMobile.current} class="hidden md:block">
        <NavigationMenu.List class="gap-2">
          {#each links as link}
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href={link.href}
                class={navigationMenuTriggerStyle()}
              >
                {link.label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          {/each}
          <NavigationMenu.Item>
            <NavigationMenu.Trigger>Committees</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <ul class="w-fit gap-2 p-2">
                {#each committees as committee}
                  <li>
                    <NavigationMenu.Link href={committee.href}>
                      {committee.label}
                    </NavigationMenu.Link>
                  </li>
                {/each}
              </ul>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          {#if data.profile}
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/admin"
                class={navigationMenuTriggerStyle()}
              >
                Beekeeper
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          {/if}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </header>

    <!-- Mobile nav sidebar -->
    <Sidebar.Root
      class="bg-background text-foreground py-4 border-r-4! border-primary rounded-r-2xl"
    >
      <Sidebar.Header>
        <img
          class="mx-auto h-12 object-contain"
          src="/keyclub_horizontal_black.png"
          alt="Henry M. Jackson Key Club"
        />
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Menu>
          {#each links as link}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive={isActive(link.href)}>
                {#snippet child({ props })}
                  <a href={link.href} {...props}>
                    <span>{link.label}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}

          <Collapsible.Root class="group/collapsible">
            <Sidebar.MenuItem>
              <Collapsible.Trigger>
                {#snippet child({ props })}
                  <Sidebar.MenuButton {...props} class="text-foreground">
                    <span>Committees</span>
                    <Icon
                      icon="solar:alt-arrow-down-linear"
                      class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                    />
                  </Sidebar.MenuButton>
                {/snippet}
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Sidebar.MenuSub>
                  {#each committees as committee}
                    <Sidebar.MenuSubItem>
                      <Sidebar.MenuSubButton
                        isActive={isActive(committee.href)}
                        class="text-foreground"
                      >
                        {#snippet child({ props })}
                          <a href={committee.href} {...props}>
                            <span>{committee.label}</span>
                          </a>
                        {/snippet}
                      </Sidebar.MenuSubButton>
                    </Sidebar.MenuSubItem>
                  {/each}
                </Sidebar.MenuSub>
              </Collapsible.Content>
            </Sidebar.MenuItem>
          </Collapsible.Root>

          {#if data.profile}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive={isActive("/admin")}>
                {#snippet child({ props })}
                  <a href="/admin" {...props}>
                    <span>Beekeeper</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/if}
        </Sidebar.Menu>
      </Sidebar.Content>
    </Sidebar.Root>
  {/if}

  {@render children?.()}

  {#if showHeader}
    <footer class="w-full bg-foreground text-background">
      <div
        class="mx-auto grid w-full max-w-6xl gap-10 px-8 py-14 text-center md:grid-cols-3 md:text-left"
      >
        <div>
          <img
            class="mx-auto h-12 object-contain brightness-0 invert md:mx-0"
            src="/keyclub_horizontal_black.png"
            alt="Key Club"
          />
          <p class="mt-4 text-muted-foreground">
            Caring &mdash; Our way of life.
          </p>
        </div>

        <div>
          <h2 class="text-xl text-primary">Explore</h2>
          <ul class="mt-4 flex flex-col gap-2">
            {#each footerNav as item (item.href)}
              <li>
                <a
                  class="text-muted-foreground hover:text-primary transition-colors"
                  href={item.href}>{item.label}</a
                >
              </li>
            {/each}
          </ul>
        </div>

        <div>
          <h2 class="text-xl text-primary">Get in touch</h2>
          <a
            class="mt-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary md:justify-start transition-colors"
            href="mailto:jhskeyclub21@gmail.com"
          >
            <Icon icon="fe:mail" /><span>jhskeyclub21@gmail.com</span>
          </a>
          <ul class="mt-5 flex justify-center gap-5 md:justify-start">
            {#each socials as social (social.label)}
              <li>
                <Button
                  href={social.href}
                  target="_blank"
                  rel="noopener"
                  size="icon"
                  class="text-muted-foreground hover:text-primary transition-colors"
                  variant="icon"
                >
                  <Icon icon={social.icon} class="size-10" />
                </Button>
              </li>
            {/each}
          </ul>
        </div>
      </div>

      <div
        class="border-t border-border px-8 py-5 text-center text-sm text-muted-foreground"
      >
        a Nikolay Li production.
        <br />
        Henry M. Jackson High School Key Club &copy; 2026
      </div>
    </footer>
  {/if}
  <Toaster position="bottom-center" />
</Sidebar.Provider>
