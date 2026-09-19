<script lang="ts">
  import { onMount } from "svelte";
  import { page, navigating } from "$app/state";
  import { resetPassword } from "./resetPassword.remote";
  import * as Card from "$lib/components/ui/card/index";
  import { Input } from "$lib/components/ui/input/index";
  import { Button } from "$lib/components/ui/button/index";
  import * as Alert from "$lib/components/ui/alert/index";
  import Icon from "@iconify/svelte";

  let token_hash = $derived(page.url.searchParams.get("token_hash"));

  onMount(() => {
    document.title = "Beekeeper - Reset Password";
  });
</script>

<section class="flex min-h-screen items-center justify-center px-4">
  <Card.Root class="w-full max-w-sm">
    <Card.Header>
      <Card.Title>Reset Password</Card.Title>
      <Card.Description>Enter your new password below.</Card.Description>
    </Card.Header>

    <form {...resetPassword.enhance(async ({ submit }) => await submit())}>
      <Card.Content class="flex flex-col gap-4">
        <!-- Hidden input for the token_hash, since the user shouldn't input it themselves -->
        <input type="hidden" name="token_hash" value={token_hash ?? ""} />
        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-sm font-medium">New password</label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your new password"
            {...resetPassword.fields.password.as("text")}
            disabled={resetPassword.pending > 0 || navigating.to != null}
          />
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={resetPassword.pending > 0 || navigating.to != null}
        >
          {#if resetPassword.pending > 0 || navigating.to != null}
            <Icon icon="svg-spinners:ring-resize" data-icon="inline-start" />
            Resetting password...
          {:else}
            Reset password
          {/if}
        </Button>

        {#if resetPassword.result && !resetPassword.result.ok}
          <Alert.Root variant="destructive">
            <Icon icon="solar:danger-triangle-bold" class="size-7" />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{resetPassword.result.error}</Alert.Description>
          </Alert.Root>
        {/if}
      </Card.Content>
    </form>
  </Card.Root>
</section>
