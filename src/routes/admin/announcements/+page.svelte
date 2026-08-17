<script lang="ts">
  import { onMount } from "svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import MegaphoneIcon from "@lucide/svelte/icons/megaphone";

  onMount(() => {
    document.title = "Beekeper - Announcements";
  });
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <MegaphoneIcon class="size-5 text-muted-foreground" />
      <h1 class="text-2xl font-semibold tracking-tight">Announcements</h1>
    </div>
    <p class="text-sm text-muted-foreground">
      Dummy page — real announcement management coming soon.
    </p>
  </div>

  <Card.Root class="max-w-md">
    <Card.Header>
      <Card.Title>New announcement</Card.Title>
      <Card.Description>This form is a placeholder.</Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col gap-4">
      <Input placeholder="Announcement title" />
      <Input placeholder="Message" />
      <Button class="w-fit">Post (soon)</Button>
    </Card.Content>
  </Card.Root>
</div>
