<script lang="ts">
    import { page } from "$app/state";
    import { Button } from "$lib/components/ui/button/index";
    import { inviteAccept } from "$lib/functions/invite";
    import { onMount } from "svelte";
    import Icon from "@iconify/svelte";

    let token = $state("");
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
            await inviteAccept(token);
            status = "result";
        } catch(error) {
            errorMsg = error instanceof Error ? error.message : "An unknown error occurred.";
            status = "error";
        }
    }

    onMount(() => {
        document.title = "Accept Invite - Admin";
        token = page.url.searchParams.get("token") || "";
    });
</script>

<div class="flex min-h-screen items-center justify-center bg-foreground px-4">
    <div class="w-full max-w-sm space-y-6">
        <div class="space-y-1.5 text-center">
            <h1 class="text-2xl font-semibold tracking-tight text-background">
                Accept Invite
            </h1>
            {#if status === "error"}
                <p class="text-sm text-muted-foreground">
                    {errorMsg}  
                </p>
            {:else if status === "result"}
                <p class="text-sm text-muted-foreground">
                    Your account has been created. You may login in at <a href="/admin/login" class="text-primary underline">/admin/login</a>.
                </p>
            {:else}
                <p class="text-sm text-muted-foreground">
                    Accept the invite to create your account. If you have any issues, please contact the Webmaster.
                </p>
                <Button class="w-full mt-4" onclick={handleclick} disabled={status === "loading"}>
                {#if status === "loading"}
                    <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                    Creating account...
                {:else}
                    Accept Invite
                {/if}
            </Button>
            {/if}
        </div>
    </div>
</div>
