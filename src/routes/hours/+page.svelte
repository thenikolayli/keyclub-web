<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import { Button } from "$lib/components/ui/button/index";
    import { Input } from "$lib/components/ui/input/index";
    import Icon from "@iconify/svelte";
    import ImageHeader from "$lib/components/ImageHeader.svelte";
    import * as Alert from "$lib/components/ui/alert/index";
    import { getHours } from "./hours.remote";
</script>

<Header/>

<ImageHeader imagePath="/stickers_after_workshop.webp" title="Your Hours" description="Look up your service hours" pageTitle="Hours"/>

<section class="w-full bg-background px-6 py-16 text-foreground">
    <div class="mx-auto max-w-xl">
        <form class="rounded-2xl bg-background p-8 shadow-lg" {...getHours}>
            <h4 class="font-bold-gothic text-2xl text-foreground">Enter your name</h4>
            <p class="mb-4 text-muted-foreground">Use the name you registered with.</p>

            <Input {...getHours.fields.name.as("text")} placeholder="Your name"/>

            <Button type="submit" size="lg" class="mt-6 w-full" disabled={getHours.pending > 0}>
                {#if getHours.pending > 0}
                    <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                    Checking...
                {:else}
                    Check my hours
                {/if}
            </Button>
        </form>

        <!-- States -->
        <div class="mt-8" aria-live="polite">
            {#if getHours.result && !getHours.result.ok}
                <Alert.Root variant="destructive">
                    <Icon icon="solar:danger-triangle-bold" class="size-7"/>
                    <Alert.Title>{getHours.result.error}</Alert.Title>
                </Alert.Root>
            {:else if getHours.result && getHours.result.ok}
                <div class="overflow-hidden rounded-2xl bg-foreground text-background shadow-lg">
                    <div class="bg-secondary px-6 py-5">
                        <h2 class="font-bold-gothic text-3xl text-primary">{getHours.result.data.name}</h2>
                        <p class="mt-1 text-muted-foreground">{getHours.result.data.class} Class of {getHours.result.data.grad_year}</p>
                    </div>
                    <div class="grid grid-cols-2 divide-x divide-border">
                        <div class="p-6 text-center">
                            <p class="text-sm uppercase tracking-wide text-muted-foreground">All-time hours</p>
                            <p class="font-bold-gothic mt-1 text-4xl text-primary">{getHours.result.data.all_hours}</p>
                        </div>
                        <div class="p-6 text-center">
                            <p class="text-sm uppercase tracking-wide text-muted-foreground">Term hours</p>
                            <p class="font-bold-gothic mt-1 text-4xl text-primary">{getHours.result.data.term_hours}</p>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</section>

<Footer/>
