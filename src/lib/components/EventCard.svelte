<script lang="ts">
  import Icon from "@iconify/svelte";
  import { Button } from "$lib/components/ui/button/index";
  import { Badge } from "$lib/components/ui/badge/index";
  import { toast } from "svelte-sonner";
  import { cn } from "$lib/utils";
  import type { Event } from "../functions/events";

  let { event, size = "sm" }: { event: Event; size?: "sm" | "lg" } = $props();

  const sizeClasses = {
    sm: "w-sm",
    lg: "w-xl",
  };

  // Color-code availability so members can gauge it at a glance.
  function spotsClass(n: number) {
    if (n <= 0) return "bg-red-500/15 text-red-600 dark:text-red-400";
    if (n <= 5) return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
    return "bg-green-500/15 text-green-600 dark:text-green-400";
  }

  // Delegate 12h/AM-PM and locale correctness to the platform; fall back to
  // the raw string if the server ever sends an unexpected format.
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  function formatTime(t: string) {
    const [h, m] = t.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return t;
    return timeFmt.format(new Date(2000, 0, 1, h, m));
  }

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  function formatDate(d: string) {
    // ponytail: assumes ISO YYYY-MM-DD from the server; parsed as local to
    // avoid the UTC-midnight off-by-one day shift.
    const [y, mo, day] = d.split("-").map(Number);
    if (!y || !mo || !day) return d;
    return dateFmt.format(new Date(y, mo - 1, day));
  }

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
  class="overflow-hidden flex flex-col rounded-2xl bg-foreground text-background shadow-lg {sizeClasses[
    size
  ]}"
>
  <div class="bg-secondary px-5 py-3">
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
        {formatTime(event.startTime)} &ndash; {formatTime(event.endTime)}
      </span>
      <span class="flex items-center gap-1.5">
        <Icon icon="solar:hourglass-linear" class="size-4 text-primary" />
        {event.length} hours
      </span>
      <Badge class="py-1 px-2 {cn(spotsClass(event.nofOpenSlots))}">
        {#if event.nofOpenSlots <= 0}
          Full
        {:else}
          {event.nofOpenSlots}
          {event.nofOpenSlots === 1 ? "spot" : "spots"} left
        {/if}
      </Badge>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
      {#if event.address}
        <Button
          variant="secondary"
          size="sm"
          class="max-w-full"
          onclick={() => copyAddress(event.address)}
          title="Copy address to clipboard"
        >
          <Icon icon="solar:map-point-linear" data-icon="inline-start" />
          <span class="truncate">{event.address}</span>
          <Icon icon="solar:copy-linear" data-icon="inline-end" />
        </Button>
      {/if}
      <Button href={event.signUpUrl} target="_blank" rel="noopener noreferrer">
        Sign up
        <Icon icon="solar:arrow-right-linear" data-icon="inline-end" />
      </Button>
    </div>
  </div>
</div>
