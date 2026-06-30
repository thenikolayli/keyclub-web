<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import Icon from "@iconify/svelte";
    import {onMount} from "svelte";
    import {fetchHours} from "$lib/hours.js";
    import ImageHeader from "$lib/components/ImageHeader.svelte";
    import * as Alert from "$lib/components/ui/alert/index.js";

    let name = $state("");
    let status = $state("idle"); // idle | loading | error | result
    let result = $state(null);
    let errorMsg = $state("");

    async function lookup(event) {
        event.preventDefault();

        const trimmed = name.trim();
        if (!trimmed) {
            status = "error";
            errorMsg = "Please enter your name first.";
            return;
        }
        status = "loading";
        errorMsg = "";
        try {
            result = await fetchHours(trimmed);
            status = "result";
        } catch {
            result = null;
            status = "error";
            errorMsg = "We couldn't load those hours. Check the spelling of your name, and make sure you're connected.";
        }
    }
</script>

<Header/>

<ImageHeader imagePath="/stickers_after_workshop.webp" title="Your Hours" description="Look up your service hours" pageTitle="Hours"/>

<section class="w-full bg-background px-6 py-16 text-foreground">
    <div class="mx-auto max-w-xl">
        <form class="rounded-2xl bg-background p-8 shadow-lg" onsubmit={lookup}>
            <h4 class="font-bold-gothic text-2xl text-foreground">Enter your name</h4>
            <p class="mb-4 text-muted-foreground">Use the name you registered with.</p>

            <Input bind:value={name} placeholder="Your name"/>

            <Button type="submit" size="lg" class="mt-6 w-full" disabled={status === "loading"}>
                {#if status === "loading"}
                    <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                    Checking…
                {:else}
                    Check my hours
                {/if}
            </Button>
        </form>

        <!-- States -->
        <div class="mt-8" aria-live="polite">
            {#if status === "error"}
                <Alert.Root variant="destructive">
                    <Icon icon="solar:danger-triangle-bold" class="size-7"/>
                    <Alert.Title>{errorMsg}</Alert.Title>
                </Alert.Root>
            {:else if status === "result" && result}
                <div class="overflow-hidden rounded-2xl bg-foreground text-background shadow-lg">
                    <div class="bg-secondary px-6 py-5">
                        <h2 class="font-bold-gothic text-3xl text-primary">{result.name}</h2>
                        <p class="mt-1 text-muted-foreground">{result.className} · Class of {result.gradYear}</p>
                    </div>
                    <div class="grid grid-cols-2 divide-x divide-border">
                        <div class="p-6 text-center">
                            <p class="text-sm uppercase tracking-wide text-muted-foreground">All-time hours</p>
                            <p class="font-bold-gothic mt-1 text-4xl text-primary">{result.allHours}</p>
                        </div>
                        <div class="p-6 text-center">
                            <p class="text-sm uppercase tracking-wide text-muted-foreground">Term hours</p>
                            <p class="font-bold-gothic mt-1 text-4xl text-primary">{result.termHours}</p>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div> 
</section>

<Footer/>
