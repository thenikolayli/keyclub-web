<script lang="ts">
  import { onMount } from "svelte";
  import * as Card from "$lib/components/ui/card/index";
  import { Input } from "$lib/components/ui/input/index";
  import { Button } from "$lib/components/ui/button/index";
  import * as Alert from "$lib/components/ui/alert/index";
  import { signIn } from "./signIn.remote.js";

  onMount(() => {
    document.title = "Beekeeper - Sign In";
  });
</script>

<section class="flex min-h-screen items-center justify-center px-4">
  <Card.Root class="w-full max-w-sm">
    <Card.Header>
      <Card.Title>Admin Sign In</Card.Title>
      <Card.Description>Enter your credentials to continue.</Card.Description>
    </Card.Header>

    <form {...signIn}>
      <Card.Content class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5">
          <label for="email" class="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...signIn.fields.email.as("text")}
            disabled={signIn.pending > 0}
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-sm font-medium">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...signIn.fields.password.as("text")}
            disabled={signIn.pending > 0}
          />
        </div>

        <a class="text-sm underline text-muted-foreground" href="/resetpassword">Forgot password?</a>

        <Button type="submit" disabled={signIn.pending > 0}>
          {signIn.pending > 0 ? "Signing in..." : "Sign In"}
        </Button>

        {#if signIn.result && !signIn.result.ok}
          <Alert.Root variant="destructive">
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{signIn.result.error}</Alert.Description>
          </Alert.Root>
        {/if}
      </Card.Content>
    </form>
  </Card.Root>
</section>
