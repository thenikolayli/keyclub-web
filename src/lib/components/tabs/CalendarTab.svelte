<script lang="ts">
  import { Button } from "$lib/components/ui/button/index";
  import { Input } from "$lib/components/ui/input/index";
  import * as Alert from "$lib/components/ui/alert/index";

  import { addToCalendar, type AddToCalendarRequest } from "$lib/functions/add_to_calendar";
  import CalendarPlus from "@lucide/svelte/icons/calendar-plus";
  import CheckCircle from "@lucide/svelte/icons/check-circle";
  import Link from "@lucide/svelte/icons/link";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";

  let url = $state("");
  let status = $state<"idle" | "loading" | "error" | "success">("idle");
  let errorMsg = $state("");
  let resultUrl = $state("");

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!url.trim()) {
      status = "error";
      errorMsg = "URL is required.";
      return;
    }

    status = "loading";
    errorMsg = "";
    resultUrl = "";

    try {
      const payload: AddToCalendarRequest = { url: url.trim() };
      const res = await addToCalendar(payload);
      resultUrl = res.url;
      status = "success";
    } catch (error) {
      errorMsg = error instanceof Error ? error.message : "An unknown error occurred.";
      status = "error";
    }
  }

  function resetForm() {
    url = "";
    status = "idle";
    errorMsg = "";
    resultUrl = "";
  }
</script>

<div class="mx-auto max-w-lg">
  {#if status === "success"}
    <div class="flex animate-in fade-in slide-in-from-bottom-4 duration-500 flex-col items-center gap-6 rounded-2xl border border-stone-700 bg-stone-900 px-8 py-16 text-center shadow-lg">
      <div class="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle class="size-10 text-primary" />
      </div>
      <div>
        <h3 class="font-bold-gothic text-2xl text-stone-100">Added to calendar!</h3>
        <p class="mt-2 text-stone-400">
          Event has been added to your calendar.
        </p>
        <p class="mt-1 text-xs text-stone-500 break-all">
          <a href={resultUrl} target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">{resultUrl}</a>
        </p>
      </div>
      <Button variant="outline" onclick={resetForm}>Add another event</Button>
    </div>
  {:else}
    <form
      onsubmit={handleSubmit}
      class="relative overflow-hidden rounded-2xl border border-stone-700 bg-stone-900 shadow-lg"
    >
      <div class="absolute -right-12 -top-12 size-32 rotate-12 rounded-full bg-primary/5"></div>

      <div class="flex items-center gap-3 border-b border-stone-700 px-8 pb-3 pt-8">
        <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <CalendarPlus class="size-5 text-primary" />
        </div>
        <div>
          <h3 class="font-bold-gothic text-xl text-stone-100">Add to Calendar</h3>
          <p class="text-sm text-stone-400">Import an event by its URL</p>
        </div>
      </div>

      <div class="space-y-5 px-8 pb-6 pt-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-stone-300" for="url">Event URL</label>
          <Input id="url" bind:value={url} type="url" placeholder="https://example.com/event/123" />
        </div>
      </div>

      <div class="border-t border-stone-700 px-8 pb-8 pt-4">
        <Button type="submit" size="lg" class="w-full" disabled={status === "loading"}>
          {#if status === "loading"}
            <span class="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            Adding...
          {:else}
            <Link class="size-4" />
            Add to calendar
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
