<script lang="ts">
    import { onMount } from "svelte";
    import { requestReset } from "./requestReset.remote";
    import * as Card from "$lib/components/ui/card/index";
    import {Input} from "$lib/components/ui/input/index";
    import {Button} from "$lib/components/ui/button/index";
    import * as Alert from "$lib/components/ui/alert/index";
    import Icon from "@iconify/svelte";

    onMount(() => {
      document.title = "Beekeeper - Reset Password";
    })
</script>

<section class="flex min-h-screen items-center justify-center px-4">
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title>Reset Password</Card.Title>
            <Card.Description>Enter your new password below.</Card.Description>
        </Card.Header>

        <form {...requestReset}>
            <Card.Content class="flex flex-col gap-4">
                <div class="flex flex-col gap-1.5">
                    <label for="email" class="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="Enter your email" {...requestReset.fields.email.as("text")} disabled={requestReset.pending > 0} />
                </div>

                <Button type="submit" variant="default" disabled={requestReset.pending > 0}>
                    {#if requestReset.pending > 0}
                        <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                        Sending reset email...
                    {:else}
                        Send reset email
                    {/if}
                </Button>

                {#if requestReset.result && requestReset.result.ok}
                    <Alert.Root variant="default">
                        <Icon icon="solar:check-bold" class="size-7" />
                        <Alert.Title>Reset email sent successfully!</Alert.Title>
                        <Alert.Description>
                            Check your email for a link to reset your password.
                        </Alert.Description>
                    </Alert.Root>
                {:else if requestReset.result && !requestReset.result.ok}
                    <Alert.Root variant="destructive">
                        <Icon icon="solar:danger-triangle-bold" class="size-7" />
                        <Alert.Title>Error</Alert.Title>
                        <Alert.Description>{requestReset.result.error}</Alert.Description>
                    </Alert.Root>
                {/if}
            </Card.Content>
        </form>
    </Card.Root>
</section>
