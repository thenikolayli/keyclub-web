<script lang="ts">
  import { onMount } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import ShieldAlertIcon from "@lucide/svelte/icons/shield-alert";

  let { data } = $props();

  onMount(() => {
    document.title = "Beekeper - Dashboard";
  });

  const isMember = $derived(data.profile?.role === "member");
</script>

{#if isMember}
  <div class="flex flex-1 items-center justify-center">
    <Card.Root class="w-full max-w-md">
      <Card.Header class="items-center text-center">
        <div class="mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlertIcon class="size-6" />
        </div>
        <Card.Title>No Access</Card.Title>
        <Card.Description>
          Your account doesn't have permission to use the admin panel. If you believe
          this is a mistake, contact an officer.
        </Card.Description>
      </Card.Header>
    </Card.Root>
  </div>
{:else}
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-semibold tracking-tight">
          Welcome back, {data.profile?.first_name}
        </h1>
        <Badge variant="secondary" class="capitalize">{data.profile?.role}</Badge>
      </div>
      <p class="text-sm text-muted-foreground">
        Here's an overview of the tools you have access to.
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.tools as tool}
        <a
          href={tool.href}
          class="group rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:bg-accent"
        >
          <div class="flex flex-col gap-3">
            <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <tool.icon class="size-5" />
            </div>
            <div>
              <h2 class="font-medium">{tool.label}</h2>
              <p class="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}
