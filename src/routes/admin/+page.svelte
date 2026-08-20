<script lang="ts">
  import { onMount } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import ShieldAlertIcon from "@lucide/svelte/icons/shield-alert";
  import { getToolsForRole } from "$lib/tools";
  import { Separator } from "$lib/components/ui/separator";

  let { data } = $props();
  const tools = $derived(getToolsForRole(data.profile?.role));

  onMount(() => {
    document.title = "Beekeper - Dashboard";
  });

  const isMember = $derived(data.profile?.role === "member");
</script>

{#if isMember}
  <section class="flex flex-1 items-center justify-center">
    <Card.Root class="w-full max-w-md">
      <Card.Header class="items-center text-center">
        <div class="mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlertIcon class="size-6" />
        </div>
        <Card.Title>No Access</Card.Title>
        <Card.Description>
          Your account doesn't have permission to use the admin panel. If you believe
          this is a mistake, contact the webmaster.
        </Card.Description>
      </Card.Header>
    </Card.Root>
  </section>
{:else}
  <section class="flex flex-col text-foreground">
      <div class="w-fit flex flex-col gap-1">
          <h1 class="text-3xl font-semibold tracking-tight">
          Hello, {data.profile?.first_name}
          </h1>
          <p class="text-md text-muted-foreground capitalize">{data.profile?.role}</p>
          <Separator />
      </div>
    <p class="text-lg text-foreground mt-4">
        This is the Beekeper admin panel. It has a list of utilities on the left.
        <br>
        Please let me know if you have any questions.
        <br>
        <span class="text-muted-foreground">(Contact via Instagram @imnikolayli)</span>
    </p>
  </section>
{/if}
