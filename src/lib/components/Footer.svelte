<script>
  import Icon from "@iconify/svelte";
  import { Button } from "$lib/components/ui/button/index.js";

  const socials = [
    {
      label: "Instagram",
      icon: "fa7-brands:instagram",
      href: "https://www.instagram.com/jhskeyclub21",
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
    {
      label: "Linktree",
      icon: "solar:link-bold",
      href: "https://linktr.ee/jhskeyclub21",
    },
  ];

  const nav = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/hours", label: "Hours" },
    // {href: "/dcon", label: "DCON"},
    { href: "/events", label: "Events" },
  ];
</script>

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
      <p class="mt-4 text-muted-foreground">Caring &mdash; Our way of life.</p>
    </div>

    <div>
      <h2 class="text-xl text-primary">Explore</h2>
      <ul class="mt-4 space-y-2">
        {#each nav as item (item.href)}
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
