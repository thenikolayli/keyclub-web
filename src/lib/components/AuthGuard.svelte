<script lang="ts">
  import { onMount } from "svelte";
  import { userState } from "$lib/stores/user.svelte";
  import { goto } from "$app/navigation";

  let { children }: { children: import("svelte").Snippet } = $props();

  let checking = $state(true);

  onMount(async () => {
    if (!userState.user) {
      await userState.fetchUser();
    }
    if (!userState.user) {
      goto("/admin/login");
      return;
    }
    checking = false;
  });
</script>

{#if checking}
  <div class="flex min-h-screen items-center justify-center">
    <p class="text-muted-foreground">Checking authentication...</p>
  </div>
{:else}
  {@render children()}
{/if}
