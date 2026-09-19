<script lang="ts">
  import { page, navigating } from "$app/state";
  import { onMount } from "svelte";
  import { acceptInvite } from "./acceptInvite.remote";
  import * as Card from "$lib/components/ui/card/index";
  import { Input } from "$lib/components/ui/input/index";
  import { Button } from "$lib/components/ui/button/index";
  import * as Alert from "$lib/components/ui/alert/index";
  import Icon from "@iconify/svelte";

  let token_hash = $derived(page.url.searchParams.get("token_hash"));

  onMount(() => {
    document.title = "Beekeeper - Accept Invite";
  });
</script>

<section class="flex min-h-screen items-center justify-center px-4">
  <Card.Root class="w-full max-w-sm">
    <Card.Header>
      <Card.Title>Accept Invite</Card.Title>
      <Card.Description>Create your account to get started.</Card.Description>
    </Card.Header>

    <form {...acceptInvite.enhance(async ({ submit }) => await submit())}>
      <Card.Content class="flex flex-col gap-4">
        <!-- Hidden input for the token_hash, since the user shouldn't input it themselves -->
        <input type="hidden" name="token_hash" value={token_hash ?? ""} />
        <div class="flex flex-col gap-1.5">
          <label for="first_name" class="text-sm font-medium">First Name</label>
          <Input
            id="first_name"
            type="text"
            placeholder="John"
            {...acceptInvite.fields.first_name.as("text")}
            disabled={acceptInvite.pending > 0 || navigating.to != null}
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="last_name" class="text-sm font-medium">Last Name</label>
          <Input
            id="last_name"
            type="text"
            placeholder="Doe"
            {...acceptInvite.fields.last_name.as("text")}
            disabled={acceptInvite.pending > 0 || navigating.to != null}
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <label for="password" class="text-sm font-medium">Password</label>
          <Input
            id="password"
            type="password"
            placeholder="Enter a password"
            {...acceptInvite.fields.password.as("text")}
            disabled={acceptInvite.pending > 0 || navigating.to != null}
          />
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={acceptInvite.pending > 0 || navigating.to != null}
        >
          {#if acceptInvite.pending > 0 || navigating.to != null}
            <Icon icon="svg-spinners:ring-resize" data-icon="inline-start" />
            Creating account...
          {:else}
            Create account
          {/if}
        </Button>

        {#if acceptInvite.result && !acceptInvite.result.ok}
          <Alert.Root variant="destructive">
            <Icon icon="solar:danger-triangle-bold" class="size-7" />
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>{acceptInvite.result.error}</Alert.Description>
          </Alert.Root>
        {/if}
      </Card.Content>
    </form>
  </Card.Root>
</section>
