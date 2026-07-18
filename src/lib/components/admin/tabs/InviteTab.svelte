<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import { Input } from "$lib/components/ui/input/index";
    import * as Alert from "$lib/components/ui/alert/index";

    import { inviteCreate, type inviteRequest } from "$lib/functions/invite";
    import PartyPopper from "@lucide/svelte/icons/party-popper";
    import Plane from "@lucide/svelte/icons/plane";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import SendHorizonal from "@lucide/svelte/icons/send-horizonal";

    let email = $state("");
    let firstName = $state("");
    let lastName = $state("");
    let role = $state("member");

    let status = $state<"idle" | "loading" | "error" | "success">("idle");
    let errorMsg = $state("");

    async function handleSubmit(event: Event) {
        event.preventDefault();

        if (!email.trim() || !firstName.trim() || !lastName.trim()) {
            status = "error";
            errorMsg = "All fields are required.";
            return;
        }

        status = "loading";
        errorMsg = "";

        try {
            const payload: inviteRequest = {
                email: email.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                role,
            };
            await inviteCreate(payload);
            status = "success";
        } catch (error) {
            errorMsg = error instanceof Error ? error.message : "An unknown error occurred.";
            status = "error";
        }
    }

    function resetForm() {
        email = "";
        firstName = "";
        lastName = "";
        role = "member";
        status = "idle";
        errorMsg = "";
    }
</script>

<div class="mx-auto max-w-lg">
    {#if status === "success"}
        <div class="flex animate-in fade-in slide-in-from-bottom-4 duration-500 flex-col items-center gap-6 rounded-2xl border-2 border-primary/20 bg-background px-8 py-16 text-center shadow-lg">
            <div class="flex size-20 items-center justify-center rounded-full bg-primary/10"
                >
                <PartyPopper class="size-10 text-primary" />
            </div>
            <div>
                <h3 class="font-bold-gothic text-2xl text-foreground">Invite sent!</h3>
                <p class="mt-2 text-muted-foreground">
                    Invite has been created successfully.
                </p>
                <p class="mt-1 text-xs text-muted-foreground/60">
                    An email is on its way to <span class="font-medium text-foreground">{email}</span>.
                </p>
            </div>
            <Button variant="outline" onclick={resetForm}>Send another invite</Button>
        </div>
    {:else}
        <form
            onsubmit={handleSubmit}
            class="relative overflow-hidden rounded-2xl border bg-background shadow-lg"
        >
            <!-- Envelope-flap accent -->
            <div class="absolute -right-12 -top-12 size-32 rotate-12 rounded-full bg-primary/5"></div>

            <div class="flex items-center gap-3 border-b border-border px-8 pb-3 pt-8">
                <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Plane class="size-5 text-primary" />
                </div>
                <div>
                    <h3 class="font-bold-gothic text-xl text-foreground">Send an Invite</h3>
                    <p class="text-sm text-muted-foreground">Add someone new to the club</p>
                </div>
            </div>

            <div class="space-y-5 px-8 pb-6 pt-6">
                <div class="space-y-2">
                    <label class="text-sm font-medium text-foreground" for="email">Email</label>
                    <Input id="email" bind:value={email} type="email" placeholder="name@example.com" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-foreground" for="first-name">First name</label>
                        <Input id="first-name" bind:value={firstName} placeholder="Ada" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-foreground" for="last-name">Last name</label>
                        <Input id="last-name" bind:value={lastName} placeholder="Lovelace" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-medium text-foreground" for="role">Role</label>
                    <div class="relative">
                        <select
                            id="role"
                            bind:value={role}
                            class="border-input data-placeholder:text-muted-foreground dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive gap-1.5 rounded-lg border bg-transparent py-2 pr-8 pl-2.5 text-sm transition-colors focus-visible:ring-3 flex w-full items-center justify-between appearance-none outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0"
                        >
                            <option value="member">member</option>
                            <option value="leader">leader</option>
                            <option value="officer">officer</option>
                        </select>
                        <svg
                            class="text-muted-foreground pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                        ><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                </div>
            </div>

            <div class="border-t border-border px-8 pb-8 pt-4">
                <Button type="submit" size="lg" class="w-full" disabled={status === "loading"}>
                    {#if status === "loading"}
                        <span class="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        Sending...
                    {:else}
                        <SendHorizonal class="size-4" />
                        Send invite
                    {/if}
                </Button>
            </div>

            {#if status === "error"}
                <div class="px-8 pb-6">
                    <Alert.Root variant="destructive">
                        <TriangleAlert class="size-5" />
                        <Alert.Title>{errorMsg}</Alert.Title>
                    </Alert.Root>
                </div>
            {/if}
        </form>
    {/if}
</div>
