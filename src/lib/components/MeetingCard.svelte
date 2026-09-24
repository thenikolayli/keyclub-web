<script lang="ts">
  import moment from "moment-timezone";
  import type { Meeting } from "$lib/events/types";

  let { meeting }: { meeting: Meeting } = $props();

  const start = $derived(moment.tz(meeting.start, "America/Los_Angeles"));
  const end = $derived(moment.tz(meeting.end, "America/Los_Angeles"));

  const details = $derived([
    {
      label: "Time",
      value: `${start.format("h:mm A")} — ${end.format("h:mm A")}`,
    },
    { label: "Location", value: meeting.location ?? "TBD" },
  ]);
</script>

<div
  class="mx-auto flex w-sm max-w-full flex-col overflow-hidden rounded-2xl border border-foreground/20 bg-foreground text-background shadow-lg"
>
  <div class="bg-secondary px-5 py-4">
    <h3 class="font-[abril] text-2xl italic text-primary">
      {meeting.name ?? "Leadership Meeting"}
    </h3>
  </div>

  <div class="flex flex-1 flex-col p-5">
    <p class="font-[abril] text-4xl italic text-primary">
      {start.format("dddd, MMMM D")}
    </p>

    <dl class="mt-5 flex flex-col gap-4">
      {#each details as item (item.label)}
        <div class="border-l-2 border-kcyellow/60 pl-4">
          <dt
            class="font-[century] text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            {item.label}
          </dt>
          <dd class="mt-0.5 text-background">{item.value}</dd>
        </div>
      {/each}
    </dl>

    {#if meeting.description}
      <p
        class="mt-5 border-t border-muted pt-4 text-sm leading-relaxed text-muted"
      >
        {meeting.description}
      </p>
    {/if}
  </div>
</div>
