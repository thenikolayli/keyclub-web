<script lang="ts">
  import { onMount } from "svelte";
  import { userState, updateUser } from "$lib/stores/user.svelte";
  import { goto } from "$app/navigation";

  let { children }: { children: import("svelte").Snippet } = $props();

  let checking = $state(true);

  onMount(async () => {
    if (!userState.user) {
      await updateUser();
    }
    if (!userState.user || (userState.user.role !== "officer" && userState.user.role !== "leader")) {
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
