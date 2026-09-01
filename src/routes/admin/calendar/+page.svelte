<script lang="ts">
    import { onMount } from "svelte";
    import {Separator} from "$lib/components/ui/separator/index";
    import * as Card from "$lib/components/ui/card/index";
    import {Input} from "$lib/components/ui/input/index";
    import {calendar} from "./calendar.remote";
    import {Button} from "$lib/components/ui/button/index";
    import * as Alert from "$lib/components/ui/alert/index";
    import Icon from "@iconify/svelte";

    onMount(() => {
        document.title = "Beekeper - Invites";
    });
</script>

<section class="flex flex-col text-foreground">
    <div class="w-fit flex flex-col gap-1">
        <h1 class="text-3xl font-semibold tracking-tight">
            Invites
        </h1>
        <p class="text-md text-muted-foreground capitalize">
            Invite someone to give them access to the Beekeper admin panel.
        </p>
        <Separator />
    </div>
    <section class="flex flex-wrap p-4 gap-4">
        <div class="flex w-full max-w-md flex-col gap-4">
            <form {...calendar}>
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Add an event to the calendar</Card.Title>
                    </Card.Header>
                    <Card.Content class="flex flex-col gap-2">
                        <Input placeholder="URL" {...calendar.fields.url.as("url")} />
                        <Button type="submit" class="mt-2" variant="default" disabled={calendar.pending > 0}>
                            {#if calendar.pending > 0}
                                <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                                Adding...
                            {:else}
                                Add
                            {/if}
                        </Button>
                    </Card.Content>
                </Card.Root>
            </form>
            {#if calendar.result && calendar.result.ok}
                <Alert.Root>
                    <Icon icon="lucide:check" class="size-7" />
                    <Alert.Title>Event added successfully</Alert.Title>
                    <Alert.Description>
                        <a target="_blank" class="underline text-secondary" href={calendar.result.data.link}>{calendar.result.data.name}</a>
                        has been successfully added to the calendar.
                        <br>
                    </Alert.Description>
                </Alert.Root>
            {:else if calendar.result && !calendar.result.ok}
                <Alert.Root variant="destructive">
                    <Icon icon="lucide:alert-triangle" class="size-7" />
                    <Alert.Title>{calendar.result.error}</Alert.Title>
                </Alert.Root>
            {/if}
        </div>
        <div class="w-full max-w-4xl flex-1 min-w-[20rem]">
            <Card.Root>
                <Card.Header>
                    <Card.Title>
                        Adding an event to the calendar
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    This tool will add an event to the Key Club Member Google Calendar.
                    Simply paste the attendance doc url and click the "Add" button.
                    <br>
                    If there is an error, confirm the following:
                    <ul class="list-disc list-inside">
                        <li>The URL has an ID</li>
                        <li>
                            The attendance doc is shared with the Google service account
                            (the one with the long email)
                        </li>
                        <li>
                            The fields in the first table of the attendance doc are filled out and
                            formatted according to the
                            <a class="underline text-secondary" href="https://docs.google.com/document/d/1r6Jz_XoWstzBPy_G2Oja_ggeVrzbK2s7qqLAVOalfPA/edit?usp=sharing">event template</a>
                        </li>
                    </ul>
                </Card.Content>
            </Card.Root>
        </div>
    </section>
</section>
