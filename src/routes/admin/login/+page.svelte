<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import { Input } from "$lib/components/ui/input/index";
  import { onMount } from "svelte";
  import { login } from "$lib/functions/login";
  import { goto } from "$app/navigation";
  import { userState, updateUser } from "$lib/stores/user.svelte";
  import Icon from "@iconify/svelte";

  let email = $state("");
  let status = $state("idle"); // idle | loading | error | result
  let errorMsg = $state("");

  async function handlesubmit(event: Event) {
        event.preventDefault();

        if (!email) {
            status = "error";
            errorMsg = "Please enter your email.";
            return;
        }

        status = "loading";
        errorMsg = "";
        try {
            await login(email);
            await updateUser();
            status = "result";
            goto("/admin");
        } catch {
            status = "error";
            errorMsg = "Login failed. Please check your email and try again.";
        }
    }

  onMount(async () => {
      document.title = "Admin Login";
      if (!userState.user) {
        await updateUser();
      }
      if (userState.user) {
        goto("/admin");
      }
  });
</script>

<div class="flex min-h-screen items-center justify-center bg-foreground px-4">
  <div class="w-full max-w-sm space-y-6">
    <div class="space-y-1.5 text-center">
      <h1 class="text-2xl font-semibold tracking-tight text-background">
        Admin Login
      </h1>
      <p class="text-sm text-muted-foreground">
        Enter your email to sign in
      </p>
    </div>
    <form class="space-y-4" onsubmit={handlesubmit}>
      <div class="space-y-2">
        <label for="email" class="text-sm font-medium text-background">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          bind:value={email}
        />
      </div>
      {#if status === "result"}
        <p class="text-center text-sm text-muted-foreground">
          Login verified, redirecting...
        </p>
      {:else}
        <Button type="submit" class="w-full" disabled={status === "loading"}>
          {#if status === "loading"}
            <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
            Signing in...
          {:else}
            Log in
          {/if}
        </Button>
      {/if}
    </form>
  </div>
</div>
