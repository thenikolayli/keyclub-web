<script lang="ts">
    import { page } from "$app/state";
    import { Button } from "$lib/components/ui/button/index";
    import { verifyLogin } from "$lib/functions/login";
    import { onMount } from "svelte";
    import Icon from "@iconify/svelte";

    let token = $derived(page.url.searchParams.get("token") ?? "");
    let status = $state("idle"); // idle | loading | error | result
    let errorMsg = $state("");

    async function handleclick(event: Event) {
        event.preventDefault();

        if (!token) {
            status = "error";
            errorMsg = "No verification token found.";
            return;
        }

        status = "loading";
        errorMsg = "";
        try {
            await verifyLogin(token);
            status = "result";
        } catch {
            status = "error";
            errorMsg = "Verification failed. The token may be invalid or expired.";
        }
    }

    onMount(() => {
        document.title = "Verify Login - Admin";
    });
</script>

<div class="flex min-h-screen items-center justify-center bg-foreground px-4">
    <div class="w-full max-w-sm space-y-6">
        <div class="space-y-1.5 text-center">
            <h1 class="text-2xl font-semibold tracking-tight text-background">
                Verify Login
            </h1>
            {#if status === "result"}
                <p class="text-sm text-muted-foreground">
                    Login has been verified, you may close this page.
                </p>
            {:else}
                <p class="text-sm text-muted-foreground">
                    An attempt to log into your account has been made, verify this login?
                    <br>
                    <br>
                    If this wasn't you, close this page.
                </p>
                <Button class="w-full mt-4" onclick={handleclick} disabled={status === "loading"}>
                {#if status === "loading"}
                    <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                    Verifying...
                {:else}
                    Verify login
                {/if}
            </Button>
            {/if}
        </div>
    </div>
</div>
