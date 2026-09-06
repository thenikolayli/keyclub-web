<script lang="ts">
    import { onMount } from "svelte";
    import { Separator } from "$lib/components/ui/separator/index";
    import * as Card from "$lib/components/ui/card/index";
    import { Input } from "$lib/components/ui/input/index";
    import { logEvent } from "./logEvent.remote";
    import { Button } from "$lib/components/ui/button/index";
    import * as Alert from "$lib/components/ui/alert/index";
    import { Badge } from "$lib/components/ui/badge/index";
    import Icon from "@iconify/svelte";

    onMount(() => {
        document.title = "Beekeper - Log Event";
    });

    function formatHours(hours: number | null): string {
        return hours == null ? "—" : `${hours.toFixed(2)} hrs`;
    }
</script>

<section class="flex flex-col text-foreground">
    <div class="w-fit flex flex-col gap-1">
        <h1 class="text-3xl font-semibold tracking-tight">
            Events
        </h1>
        <p class="text-md text-muted-foreground">
            Log a volunteer event from its attendance doc.
        </p>
        <Separator />
    </div>
    <section class="flex flex-wrap p-4 gap-4">
        <div class="flex w-full max-w-md flex-col gap-4">
            <form {...logEvent}>
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Log an event</Card.Title>
                    </Card.Header>
                    <Card.Content class="flex flex-col gap-2">
                        <Input placeholder="Attendance doc URL" {...logEvent.fields.url.as("url")} />
                        <Button type="submit" class="mt-2" variant="default" disabled={logEvent.pending > 0}>
                            {#if logEvent.pending > 0}
                                <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                                Logging...
                            {:else}
                                Log Event
                            {/if}
                        </Button>
                    </Card.Content>
                </Card.Root>
            </form>

            {#if logEvent.result && logEvent.result.ok}
                <Alert.Root>
                    <Icon icon="lucide:check" class="size-7" />
                    <Alert.Title>{logEvent.result.data.event.name} logged</Alert.Title>
                    <Alert.Description>
                        <span class="font-medium">{logEvent.result.data.event.total_hours!.toFixed(2)} total hours</span> were
                        written to the attendance doc, the Events sheet, and the EventsMembers sheet.
                    </Alert.Description>
                </Alert.Root>
            {:else if logEvent.result && !logEvent.result.ok}
                <Alert.Root variant="destructive">
                    <Icon icon="lucide:alert-triangle" class="size-7" />
                    <Alert.Title>{logEvent.result.error}</Alert.Title>
                </Alert.Root>
            {/if}
        </div>

        <div class="flex w-full max-w-md flex-1 min-w-[20rem] flex-col gap-4">
            <Card.Root>
                <Card.Header class="flex flex-row items-center justify-between space-y-0">
                    <Card.Title>Members Logged</Card.Title>
                    <Badge variant="secondary">
                        {logEvent.result?.ok ? logEvent.result.data.membersLogged.length : 0}
                    </Badge>
                </Card.Header>
                <Card.Content>
                    {#if logEvent.result?.ok && logEvent.result.data.membersLogged.length > 0}
                        <ul class="flex flex-col gap-2">
                            {#each logEvent.result.data.membersLogged as member}
                                <li class="flex items-center justify-between gap-2">
                                    <span class="truncate">{member.name}</span>
                                    <span class="text-muted-foreground text-sm shrink-0">{formatHours(member.hours)}</span>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <p class="text-muted-foreground text-sm">No members logged yet.</p>
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>

        <div class="flex w-full max-w-4xl flex-1 min-w-[20rem] flex-col gap-4">
            <Card.Root>
                <Card.Header class="flex flex-row items-center justify-between space-y-0">
                    <Card.Title>Members Not Logged</Card.Title>
                    <Badge variant="secondary">
                        {logEvent.result?.ok ? logEvent.result.data.membersNotLogged.length : 0}
                    </Badge>
                </Card.Header>
                <Card.Content>
                    {#if logEvent.result?.ok && logEvent.result.data.membersNotLogged.length > 0}
                        <ul class="flex flex-col gap-2">
                            {#each logEvent.result.data.membersNotLogged as member}
                                <li class="flex items-center justify-between gap-2">
                                    <span class="truncate">{member.name}</span>
                                    <span class="text-muted-foreground text-sm shrink-0">{formatHours(member.hours)}</span>
                                </li>
                            {/each}
                        </ul>
                    {:else}
                        <p class="text-muted-foreground text-sm">No members missing.</p>
                    {/if}
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header>
                    <Card.Title>About logging events</Card.Title>
                </Card.Header>
                <Card.Content>
                    Paste the attendance doc URL and click "Log Event". This will:
                    <ul class="list-disc list-inside mt-2">
                        <li>Write each volunteer's calculated hours into the attendance doc</li>
                        <li>Append the event (name, total hours, link) to the Events sheet</li>
                        <li>Record each member's hours in the EventsMembers sheet</li>
                    </ul>
                    <br>
                    Members whose names don't match a column in the EventsMembers sheet show up under
                    "Members Not Logged" and won't have their hours recorded.
                </Card.Content>
            </Card.Root>
        </div>
    </section>
</section>
