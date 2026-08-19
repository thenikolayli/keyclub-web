<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Icon from "@iconify/svelte";
  import * as Alert from "$lib/components/ui/alert/index";
  import * as Accordion from "$lib/components/ui/accordion/index";
  import ImageHeader from "$lib/components/ImageHeader.svelte";
  import { Slider } from "$lib/components/ui/slider/index";
  import {
    getLocalTimeZone,
    today,
    DateFormatter,
    type CalendarDate,
  } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index";
  import { Button } from "$lib/components/ui/button/index";
  import EventCard from "$lib/components/EventCard.svelte";
  import { onMount } from "svelte";
  import { searchEvents } from "./events.remote";
  import { PUBLIC_CALENDAR_SRC } from "$env/static/public";
  import type { Result } from "$lib/types/responses";
  import type { CalendarEvent } from "$lib/types/events";

  const start = today(getLocalTimeZone());
  const end = start.add({ days: 7 });
  let dates = $state<{start: CalendarDate; end: CalendarDate}>({ start, end });
  let length = $state<[number, number]>([0, 24]);
  let spots = $state<[number, number]>([0, 40]);
  let times = $state<[number, number]>([0, 24]);

  let result = $state<Result<CalendarEvent[]> | null>(null);
  let loading = $state(false);

  // Time filter with 12-hour format conversions
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
  });

  // Date filter with short date format
  // By default, the calendar shows events for the next week
  const dateFormatter = new DateFormatter("en-US", {
    dateStyle: "short",
  });
  let dateLabel = $derived(
    dates.start && dates.end
      ? `Between ${dateFormatter.format(dates.start.toDate(getLocalTimeZone()))} and ${dateFormatter.format(dates.end.toDate(getLocalTimeZone()))}`
      : "Pick a date range",
  );

  // the defaults, keep these pretty broad, so at least some events are shown
  function resetFilters() {
    times = [0, 24];
    length = [0, 24];
    dates = { start, end };
    spots = [0, 40];
  }

  // helper function to create a uniform time format with a leading zero for single-digit hours
  const toTimeStr = (hours: number) =>
    `${hours.toString().padStart(2, "0")}:00:00`;

  async function handleClick() {
    loading = true;
    result = await searchEvents({
      times: [toTimeStr(times[0]), toTimeStr(times[1])],
      lengths: [length[0], length[1]],
      dates: [dates.start.toString(), dates.end.toString()],
      spots: [spots[0], spots[1]],
    });
    loading = false;
  }

  onMount(async () => {
    document.title = "Events";
  })
</script>

<Header />

<ImageHeader
  imagePath="/events.jpg"
  title="Events"
  description="Find your next opportunity to serve"
  pageTitle="Events"
/>

<section
  class="w-full bg-background px-6 md:px-12 py-12 text-foreground flex flex-col items-center"
>
  <!-- Calendar -->
  <h2 class="text-2xl text-foreground mb-4">Calendar</h2>
  <div
    class="overflow-hidden w-full rounded-2xl border-4 border-primary bg-background"
  >
    <iframe
      title="JHS Key Club events calendar"
      src={PUBLIC_CALENDAR_SRC}
      class="h-[70vh] min-h-130 w-full"
      loading="lazy"
    ></iframe>
  </div>

  <Alert.Root class="mt-4 max-w-md mx-auto">
    <Icon icon="solar:info-circle-bold" class="mt-0.5 size-6 shrink-0" />
    <Alert.Title>
      Add a specific event &mdash; or the whole calendar &mdash; to your
      personal Google Calendar to open the event sign-up sheet. Tap an event
      below for details.
    </Alert.Title>
  </Alert.Root>

  <!-- Filters -->
  <h2 class="text-2xl text-foreground mb-4 mt-12">Filters</h2>
  <div class="w-full md:w-sm max-w-5xl">
    <Accordion.Root type="multiple" class="w-full">
      <Accordion.Item value="times">
        <Accordion.Trigger
          ><h3 class="text-lg font-normal">
            Start and End times
          </h3></Accordion.Trigger
        >
        <Accordion.Content>
          <p class="text-muted-foreground">{timeLabel()}</p>
          <Slider
            type="multiple"
            bind:value={times}
            min={0}
            max={24}
            step={1}
            class="w-full"
          />
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="length">
        <Accordion.Trigger
          ><h3 class="text-lg font-normal">Length</h3></Accordion.Trigger
        >
        <Accordion.Content>
          <p class="text-muted-foreground">
            Between {length[0]} and {length[1]} hours
          </p>
          <Slider
            type="multiple"
            bind:value={length}
            min={0}
            max={24}
            step={0.5}
            class="w-full"
          />
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="date">
        <Accordion.Trigger
          ><h3 class="text-lg font-normal">Date</h3></Accordion.Trigger
        >
        <Accordion.Content>
          <p class="text-muted-foreground">{dateLabel}</p>
          <RangeCalendar bind:value={dates} class="w-full" minValue={start} />
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="spots">
        <Accordion.Trigger
          ><h3 class="text-lg font-normal">Spots</h3></Accordion.Trigger
        >
        <Accordion.Content>
          <p class="text-muted-foreground">
            Between {spots[0]} and {spots[1]} open spots
          </p>
          <Slider
            type="multiple"
            bind:value={spots}
            min={0}
            max={40}
            step={1}
            class="w-full"
          />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>

    <div class="flex justify-between w-full mt-2">
      <Button variant="outline" onclick={resetFilters}>Reset filters</Button>
      <Button variant="secondary" onclick={handleClick}>
        {#if loading}
          <Icon icon="svg-spinners:ring-resize" data-icon="inline-start" />
          Checking...
        {:else}
          Search
        {/if}
      </Button>
    </div>
  </div>

  <!-- States -->
  <div class="mt-8 w-full flex flex-col gap-4" aria-live="polite">
    {#if result && !result.ok}
      <Alert.Root variant="destructive">
        <Icon icon="solar:danger-triangle-bold" class="size-7" />
        <Alert.Title>{result.error}</Alert.Title>
      </Alert.Root>
    {:else if result && result.ok && result.data.length > 0}
      <div class="w-full flex flex-wrap gap-4 justify-center">
        {#each result.data as event, i (i)}
          <EventCard {event} size="lg" />
        {/each}
      </div>
    {:else if result && result.ok && result.data.length === 0}
      <Alert.Root>
        <Icon icon="solar:danger-triangle-bold" class="size-7" />
        <Alert.Title>
          No events found :(<br />
          Try adjusting the filters.
        </Alert.Title>
      </Alert.Root>
    {/if}
  </div>
</section>

<Footer />
