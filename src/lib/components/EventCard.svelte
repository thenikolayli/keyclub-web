<script lang="ts">
  import Icon from "@iconify/svelte";
  import { Button } from "$lib/components/ui/button/index";
  import { Badge } from "$lib/components/ui/badge/index";
  import { toast } from "svelte-sonner";
  import moment from "moment-timezone";
  import { cn } from "$lib/utils";
  import type { CalendarEvent } from "$lib/events/types";

  let { event, size = "sm", class: className = "" }: { event: CalendarEvent; size?: "sm" | "lg" | "xs"; class?: string } = $props();

  const sizeClasses = {
    sm: "w-sm",
    lg: "w-xl",
    xs: "w-xs"
  };

  // Color-code availability so members can gauge it at a glance.
  function spotsClass(n: number) {
    if (n <= 0) return "bg-red-500/15 text-red-600 dark:text-red-400";
    if (n <= 5) return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
    return "bg-green-500/15 text-green-600 dark:text-green-400";
  }

  // Dates are stored as "YYYY-MM-DD" and times as "HH:mm:ss", so we can format
  // them directly with moment without guessing.
  //
  // The `date` column can arrive as a JS Date: postgres.js maps the Postgres
  // `date` type to a Date at UTC midnight, so parsing it in the local timezone
  // (e.g. America/Los_Angeles) shifts it to the previous day. Treating it as a
  // pure calendar date in UTC keeps the day intact regardless of timezone.
  function formatDate(d: string | Date | null) {
    if (!d) return "\u2014";
    const m = d instanceof Date ? moment.utc(d) : moment.utc(d, "YYYY-MM-DD");
    return m.isValid() ? m.format("ddd, MMM D, YYYY") : String(d);
  }

  function formatTime(t: string | null) {
    if (!t) return "\u2014";
    const m = moment(t, "HH:mm:ss");
    return m.isValid() ? m.format("h:mm A") : t;
  }

  const openSlots = $derived(
    (event.n_slots ?? 0) - (event.n_volunteers ?? 0),
  );

  const eventLength = $derived(() => {
    if (!event.start_time || !event.end_time) return null;
    const start = moment(event.start_time, "HH:mm:ss");
    let end = moment(event.end_time, "HH:mm:ss");
    const diff = end.diff(start, "hours", true);
    return diff > 0 ? diff.toFixed(1) : null;
  });

  const eventAddress = $derived(event.address);

  async function copyAddress(address: string) {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard");
    } catch {
      toast.error("Couldn't copy the address");
    }
  }
</script>

<div
  class="overflow-hidden mx-auto flex flex-col rounded-2xl border-foreground/20 border-2 bg-foreground text-background shadow-lg
  {sizeClasses[size]} {className}"
>  <div class="bg-secondary px-5 py-3">
    <h2 class="font-bold-gothic text-2xl text-primary">{event.name}</h2>
  </div>

  <div class="flex flex-1 flex-col gap-3 p-5">
    {#if event.description}
      <p class="text-sm leading-relaxed text-muted">
        {event.description}
      </p>
    {:else}
      <p class="text-sm leading-relaxed text-muted">
        Check the attendance document for more information.
      </p>
    {/if}

    <div class="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <span class="flex items-center gap-1.5">
        <Icon icon="solar:calendar-linear" class="size-4 text-primary" />
        {formatDate(event.date)}
      </span>
      <span class="flex items-center gap-1.5">
        <Icon icon="solar:clock-circle-linear" class="size-4 text-primary" />
        {formatTime(event.start_time)} &ndash; {formatTime(event.end_time)}
      </span>
      <span class="flex items-center gap-1.5">
        <Icon icon="solar:hourglass-linear" class="size-4 text-primary" />
        {eventLength() ?? "\u2014"} hours
      </span>
      <Badge class="py-1 px-2 {cn(spotsClass(openSlots))}">
        {#if openSlots <= 0}
          Full
        {:else}
          {openSlots}
          {openSlots === 1 ? "spot" : "spots"} left
        {/if}
      </Badge>
    </div>

    <div class="flex flex-col items-start justify-between gap-3 pt-1">
      {#if eventAddress}
        <Button
          variant="secondary"
          size="sm"
          class="max-w-full"
          onclick={() => copyAddress(eventAddress!)}
          title="Copy address to clipboard"
        >
          <Icon icon="solar:map-point-linear" data-icon="inline-start" />
          <span class="truncate">{eventAddress}</span>
          <Icon icon="solar:copy-linear" data-icon="inline-end" />
        </Button>
      {/if}
      <Button
        href={event.attendance_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Sign up
        <Icon icon="solar:arrow-right-linear" data-icon="inline-end" />
      </Button>
    </div>
  </div>
</div>
