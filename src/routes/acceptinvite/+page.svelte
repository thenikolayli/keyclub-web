<script lang="ts">
    import {page} from "$app/state";
    import { onMount } from "svelte";
    import { accept } from "./accept.remote";
    import * as Card from "$lib/components/ui/card/index";
    import {Input} from "$lib/components/ui/input/index";
    import {Button} from "$lib/components/ui/button/index";
    import * as Alert from "$lib/components/ui/alert/index";
    import Icon from "@iconify/svelte";


    let token_hash = $derived(page.url.searchParams.get("token_hash"));

    onMount(() => {
      document.title = "Beekeper - Accept Invite";
    })
</script>

<section class="flex min-h-screen items-center justify-center px-4">
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title>Accept Invite</Card.Title>
            <Card.Description>Create your account to get started.</Card.Description>
        </Card.Header>

        <form {...accept}>
            <Card.Content class="flex flex-col gap-4">
                <!-- Hidden input for the token_hash, since the user shouldn't input it themselves -->
                <input
                    type="hidden"
                    name="token_hash"
                    value={token_hash ?? ""}
                />
                <div class="flex flex-col gap-1.5">
                    <label for="first_name" class="text-sm font-medium">First Name</label>
                    <Input id="first_name" type="text" placeholder="John" {...accept.fields.first_name.as("text")} disabled={accept.pending > 0} />
                </div>
                <div class="flex flex-col gap-1.5">
                    <label for="last_name" class="text-sm font-medium">Last Name</label>
                    <Input id="last_name" type="text" placeholder="Doe" {...accept.fields.last_name.as("text")} disabled={accept.pending > 0} />
                </div>
                <div class="flex flex-col gap-1.5">
                    <label for="password" class="text-sm font-medium">Password</label>
                    <Input id="password" type="password" placeholder="Enter a password" {...accept.fields.password.as("text")} disabled={accept.pending > 0} />
                </div>

                <Button type="submit" variant="default" disabled={accept.pending > 0}>
                    {#if accept.pending > 0}
                        <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                        Creating account...
                    {:else}
                        Create account
                    {/if}
                </Button>

                {#if accept.result && accept.result.ok}
                    <Alert.Root variant="default">
                        <Icon icon="solar:check-bold" class="size-7" />
                        <Alert.Title>Account created successfully!</Alert.Title>
                        <Alert.Description>
                            Click <a class="underline text-secondary" href="/admin">here</a> to be redirected to the Beekeper admin panel.
                        </Alert.Description>
                    </Alert.Root>
                {:else if accept.result && !accept.result.ok}
                    <Alert.Root variant="destructive">
                        <Icon icon="solar:danger-triangle-bold" class="size-7" />
                        <Alert.Title>Error</Alert.Title>
                        <Alert.Description>{accept.result.error}</Alert.Description>
                    </Alert.Root>
                {/if}
            </Card.Content>
        </form>
    </Card.Root>
</section>
