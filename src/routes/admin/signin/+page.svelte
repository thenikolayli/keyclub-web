<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import * as Card from "$lib/components/ui/card/index";
  import { Input } from "$lib/components/ui/input/index";
  import { Button } from "$lib/components/ui/button/index";
  import * as Alert from "$lib/components/ui/alert/index";

  let email = $state("");
  let password = $state("");
  let errorMsg = $state("");
  let status = $state<"idle" | "loading" | "success" | "error">("idle");

  const { data } = $props();

  onMount(() => {
    document.title = "Admin Sign In";
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      errorMsg = "Email and password are required.";
      status = "error";
      return;
    }

    status = "loading";
    errorMsg = "";

    const result = await data.supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (result.error) {
      errorMsg = result.error.message;
      status = "error";
      return;
    }

    status = "success";
    goto("/admin");
  }
</script>

<section class="flex min-h-screen items-center justify-center px-4">
  <Card.Root class="w-full max-w-sm">
    <Card.Header>
      <Card.Title>Admin Sign In</Card.Title>
      <Card.Description>Enter your credentials to continue.</Card.Description>
    </Card.Header>

    <form onsubmit={handleSubmit}>
      <Card.Content class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            bind:value={email}
            disabled={status === "loading"}
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-sm font-medium">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            bind:value={password}
            disabled={status === "loading"}
          />
        </div>

        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Signing in..." : "Sign In"}
        </Button>

        {#if status === "error"}
          <Alert.Root variant="destructive">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{errorMsg}</Alert.Description>
          </Alert.Root>
        {/if}
      </Card.Content>
    </form>
  </Card.Root>
</section>
