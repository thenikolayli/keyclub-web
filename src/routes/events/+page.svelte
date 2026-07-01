<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Icon from "@iconify/svelte";
    import * as Alert from "$lib/components/ui/alert/index";
    import * as Accordion from "$lib/components/ui/accordion/index";
    import ImageHeader from "$lib/components/ImageHeader.svelte";
    import {Slider} from "$lib/components/ui/slider/index";
    import { getLocalTimeZone, today, DateFormatter, type CalendarDate } from "@internationalized/date";
    import { RangeCalendar } from "$lib/components/ui/range-calendar/index";
    import { Button } from "$lib/components/ui/button/index";
    import { searchEvents, type Event, type EventSearchRequest } from "$lib/events";

    const calendarSrc = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&showPrint=0&showTz=0&showCalendars=0&src=ZjIzOGY1NzgyYWIwNjg5M2FhMGQ0MzM3YWNhZjBkZjg5ZDU3YTI4ZDI0NTk1OGMyZGIyNzc0Mjc5OWNlMzgzNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F4511E";
    let length = $state<[number, number]>([0, 24]);
    let spots = $state<[number, number]>([0, 40]);

    let times = $state<[number, number]>([0, 24]);
    let timeLabel = $derived(() => {
        let startLabel;
        if (times[0] === 0) {
            startLabel = "12:00 AM";
        } else if (times[0] < 12) {
            startLabel = `${times[0]}:00 AM`;
        } else if (times[0] === 12) {
            startLabel = "12:00 PM";
        } else {
            startLabel = `${times[0] - 12}:00 PM`;
        }
        let endLabel;
        if (times[1] === 0) {
            endLabel = "12:00 AM";
        } else if (times[1] < 12) {
            endLabel = `${times[1]}:00 AM`;
        } else if (times[1] === 24) {
            endLabel = "12:00 AM";
        } else {
            endLabel = `${times[1] - 12}:00 PM`;
        }
        return `Between ${startLabel} and ${endLabel}`;
    })

    const start = today(getLocalTimeZone());
    const end = start.add({days: 7});
    let dates = $state<{start: CalendarDate, end: CalendarDate}>({start, end});
    const dateFormatter = new DateFormatter("en-US", {
        dateStyle: "short"
    });
    let dateLabel = $derived(
        dates.start && dates.end
            ? `Between ${dateFormatter.format(dates.start.toDate(getLocalTimeZone()))} and ${dateFormatter.format(dates.end.toDate(getLocalTimeZone()))}`
            : "Pick a date range"
    );

    function clearFilters() {
        times = [0, 24];
        length = [0, 24];
        dates = {start, end};
        spots = [0, 40];
    }

    let status = $state("idle"); // idle | loading | error | result
    let result = $state<Event[] | null>(null);
    let errorMsg = $state("");
    async function search() {
        status = "loading";
        errorMsg = "";
        try {
            result = await searchEvents({times, length, dates: [dates.start.toString(), dates.end.toString()], spots} as EventSearchRequest) as Event[];
            status = "result";
        } catch (error) {
            result = null;
            status = "error";
            errorMsg = "An unknown error occurred, contact the Webmaster.";
        }
    }
</script>

<Header/>

<ImageHeader imagePath="/events.jpg" title="Events" description="Find your next opportunity to serve" pageTitle="Events"/>

<section class="w-full bg-background px-6 py-16 text-foreground flex flex-col items-center">
    <h2 class="text-2xl font-bold-gothic text-secondary mb-4">Filter events</h2>
    <Accordion.Root type="multiple" class="w-full max-w-5xl">
        <Accordion.Item value="times">
            <Accordion.Trigger><h3 class="text-lg font-[century]">Start and End times</h3></Accordion.Trigger>
            <Accordion.Content>
                <p class="text-muted-foreground">{timeLabel()}</p>
                <Slider type="multiple" bind:value={times} min={0} max={24} step={1} class="w-full" />
            </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="length">
            <Accordion.Trigger><h3 class="text-lg font-[century]">Length</h3></Accordion.Trigger>
            <Accordion.Content>
                <p class="text-muted-foreground">Between {length[0]} and {length[1]} hours</p>
                <Slider type="multiple" bind:value={length} min={0} max={24} step={0.5} class="w-full" />
            </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="date">
            <Accordion.Trigger><h3 class="text-lg font-[century]">Date</h3></Accordion.Trigger>
            <Accordion.Content>
                <p class="text-muted-foreground">{dateLabel}</p>
                <RangeCalendar bind:value={dates} class="w-full" />
            </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="spots">
            <Accordion.Trigger><h3 class="text-lg font-[century]">Spots</h3></Accordion.Trigger>
            <Accordion.Content>
                <p class="text-muted-foreground">Between {spots[0]} and {spots[1]} open spots</p>
                <Slider type="multiple" bind:value={spots} min={0} max={40} step={1} class="w-full" />
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
    <div class="flex justify-between w-full mt-2">
        <Button variant="outline" onclick={clearFilters}>Clear filters</Button>
        <Button variant="secondary" onclick={search}>
            {#if status === "loading"}
                    <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                    Checking...
                {:else}
                    Search
                {/if}
        </Button>
    </div>

    <!-- States -->
    <div class="mt-8 w-full flex flex-col gap-4" aria-live="polite">
        {#if status === "error"}
            <Alert.Root variant="destructive">
                <Icon icon="solar:danger-triangle-bold" class="size-7"/>
                <Alert.Title>{errorMsg}</Alert.Title>
            </Alert.Root>
        {:else if status === "result" && result}
            {#each result as event}
                <div class="overflow-hidden rounded-2xl bg-foreground text-background shadow-lg">
                    <div class="bg-secondary px-6 py-5">
                        <h2 class="font-bold-gothic text-3xl text-primary">{event.name}</h2>
                    </div>
                    <div class="grid grid-cols-2 divide-x divide-border">
                        <div class="p-6 text-center">
                            <p class="text-sm uppercase tracking-wide text-muted-foreground">Date</p>
                            <p class="font-bold-gothic mt-1 text-4xl text-primary">{event.date}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 divide-x divide-border">
                        <div class="p-6 text-center">
                            <p class="text-sm uppercase tracking-wide text-muted-foreground">Time</p>
                            <p class="font-bold-gothic mt-1 text-4xl text-primary">{event.startTime} - {event.endTime}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 divide-x divide-border">
                        <div class="p-6 text-center">
                            <p class="text-sm uppercase tracking-wide text-muted-foreground">Length</p>
                            <p class="font-bold-gothic mt-1 text-4xl text-primary">{event.length} hours</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 divide-x divide-border">
                        <div class="p-6 text-center">
                            <p class="text-sm uppercase tracking-wide text-muted-foreground">Address</p>
                            <p class="font-bold-gothic mt-1 text-4xl text-primary">{event.address}</p>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 divide-x divide-border">
                        <div class="p-6 text-center">
                            <p class="text-sm uppercase tracking-wide text-muted-foreground">Open spots</p>
                            <p class="font-bold-gothic mt-1 text-4xl text-primary">{event.nofOpenSlots}</p>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <!-- Calendar -->
    <h2 class="text-2xl font-bold-gothic text-secondary mt-12">Calendar</h2>
    <div class="overflow-hidden rounded-2xl border-4 border-primary bg-background shadow-lg">
        <iframe
            title="JHS Key Club events calendar"
            src={calendarSrc}
            class="h-[70vh] min-h-[520px] w-full"
            loading="lazy"
        ></iframe>
    </div>

    <Alert.Root class="mt-8 max-w-md mx-auto">
        <Icon icon="solar:info-circle-bold" class="mt-0.5 size-6 shrink-0"/>
        <Alert.Title>
            Add a specific event &mdash; or the whole calendar &mdash; to your personal Google Calendar to open the
            event sign-up sheet. Tap an event below for details.
        </Alert.Title>
    </Alert.Root>
</section>

<Footer/>
