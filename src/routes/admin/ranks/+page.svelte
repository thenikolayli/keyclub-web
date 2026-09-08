<script lang="ts">
  import { onMount } from "svelte";
  import { Separator } from "$lib/components/ui/separator/index";
  import * as Card from "$lib/components/ui/card/index";
  import { Input } from "$lib/components/ui/input/index";
  import { ranks } from "./ranks.remote";
  import * as Select from "$lib/components/ui/select/index";
  import { Button } from "$lib/components/ui/button/index";
  import * as Alert from "$lib/components/ui/alert/index";
  import Icon from "@iconify/svelte";

  const currentYear = new Date().getFullYear();
  const gradYears = Array.from({ length: 6 }, (_, i) => currentYear + i);

  onMount(() => {
    document.title = "Beekeper - Ranks";
  });
</script>

<section class="flex flex-col text-foreground">
  <div class="w-fit flex flex-col gap-1">
    <h1 class="text-3xl font-semibold tracking-tight">Ranks</h1>
    <p class="text-md text-muted-foreground">
      View the hour rankings for a graduating class.
    </p>
    <Separator />
  </div>
  <section class="flex flex-wrap p-4 gap-4">
    <div class="flex w-full max-w-md flex-col gap-4">
      <form {...ranks}>
        <Card.Root>
          <Card.Header>
            <Card.Title>View Class Ranks</Card.Title>
          </Card.Header>
          <Card.Content class="flex flex-col gap-2">
            <input
              type="hidden"
              name="n:gradYear"
              value={ranks.fields.gradYear.value() ?? ""}
            />
            <Select.Root
              type="single"
              onValueChange={(value) =>
                ranks.fields.gradYear.set(Number(value))}
            >
              <Select.Trigger>
                {ranks.fields.gradYear.value() === undefined
                  ? "Grad Year"
                  : ranks.fields.gradYear.value()}
              </Select.Trigger>
              <Select.Content>
                {#each gradYears as year}
                  <Select.Item value={String(year)}>{year}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>

            <Input placeholder="Limit" {...ranks.fields.limit.as("number")} />

            <Button
              type="submit"
              class="mt-2"
              variant="default"
              disabled={ranks.pending > 0}
            >
              {#if ranks.pending > 0}
                <Icon
                  icon="svg-spinners:ring-resize"
                  data-icon="inline-start"
                />
                Loading...
              {:else}
                View Ranks
              {/if}
            </Button>
          </Card.Content>
        </Card.Root>
      </form>
      {#if ranks.result && ranks.result.ok}
        <Card.Root>
          <Card.Header>
            <Card.Title>
              Grad Ranks for Class of {ranks.fields.gradYear.value()}
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b text-muted-foreground text-left">
                  <th class="py-2 pr-4 font-medium">Name</th>
                  <th class="py-2 pr-4 font-medium">All Hours</th>
                  <th class="py-2 font-medium">Term Hours</th>
                </tr>
              </thead>
              <tbody>
                {#each ranks.result.data as member (member.id)}
                  <tr class="border-b last:border-0">
                    <td class="py-2 pr-4">{member.name}</td>
                    <td class="py-2 pr-4">{member.all_hours ?? 0}</td>
                    <td class="py-2">{member.term_hours ?? 0}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </Card.Content>
        </Card.Root>
      {:else if ranks.result && !ranks.result.ok}
        <Alert.Root variant="destructive">
          <Icon icon="solar:danger-triangle-bold" class="size-7" />
          <Alert.Title>{ranks.result.error}</Alert.Title>
        </Alert.Root>
      {/if}
    </div>
  </section>
</section>
