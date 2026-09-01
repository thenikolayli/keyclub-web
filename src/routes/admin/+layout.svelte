<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { page } from "$app/state";
  import { getToolsForRole } from "$lib/auth/tools";
  import Icon from "@iconify/svelte";

  let { data, children } = $props();
  const currentPath = $derived(page.url.pathname);
  const isSignIn = $derived(currentPath === "/admin/signin");
  const tools = $derived(getToolsForRole(data.profile?.role));

  async function signOut() {
    await data.supabase.auth.signOut();
    window.location.href = "/signin";
  }
</script>

{#if isSignIn}
  {@render children?.()}
{:else}
  <section class="min-h-screen">
    <Sidebar.Provider>
        <Sidebar.Root>
            <Sidebar.Header>
                <Sidebar.Menu>
                    <Sidebar.MenuButton size="lg">
                        {#snippet child(p)}
                        <a {...p.props} href="/admin">
                            <img src="/bee.webp" alt="Bee" class="size-8 object-contain">
                            <div class="grid flex-1 text-left leading-tight">
                                <span class="truncate font-semibold">Beekeper</span>
                                <span class="truncate text-xs text-muted-foreground">Admin Panel</span>
                            </div>
                        </a>
                        {/snippet}
                    </Sidebar.MenuButton>
                </Sidebar.Menu>
            </Sidebar.Header>

            <Sidebar.Content>
                <Sidebar.Menu>
                    {#each tools as tool}
                    <Sidebar.MenuItem>
                    <Sidebar.MenuButton
                        isActive={currentPath === tool.href}
                        tooltipContent={tool.label}
                    >
                        {#snippet child(p)}
                            <a {...p.props} href={tool.href}>
                                <Icon icon={tool.icon} />
                                <span>{tool.label}</span>
                            </a>
                        {/snippet}
                        </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                    {/each}
                </Sidebar.Menu>
            </Sidebar.Content>

            <Sidebar.Footer>
                <div class="flex items-center gap-2 px-2 pb-1">
                <div class="grid flex-1 leading-tight">
                    <span class="truncate text-sm font-medium">
                        {data.profile?.first_name} {data.profile?.last_name}
                    </span>
                    <span class="truncate text-xs capitalize text-muted-foreground">
                        {data.profile?.role}
                    </span>
                </div>
                </div>
                <Sidebar.Menu>
                    <Sidebar.MenuButton variant="secondary" onclick={signOut}>
                        <Icon icon="solar:exit-linear" />
                        Sign out
                    </Sidebar.MenuButton>
                </Sidebar.Menu>
            </Sidebar.Footer>
            <Sidebar.Rail />
        </Sidebar.Root>

        <Sidebar.Inset>
            <header class="flex h-14 shrink-0 items-center justify-end gap-2 border-b px-4 text-foreground md:hidden">
                <Sidebar.Trigger class="-mr-1" />
            </header>
            <div class="flex flex-1 flex-col gap-4 p-4 md:p-6">
                {@render children?.()}
            </div>
        </Sidebar.Inset>
    </Sidebar.Provider>
  </section>
{/if}
