<script lang="ts">
  import Icon from "@iconify/svelte";
  import ImageHeader from "$lib/components/ImageHeader.svelte";
  import MeetingCard from "$lib/components/MeetingCard.svelte";
  import * as Carousel from "$lib/components/ui/carousel/index";
  import { reveal } from "$lib/reveal";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte";

  const { data } = $props();
  const isMobile = new IsMobile();
</script>

<ImageHeader
  imagePath="/faz.webp"
  title="Leadership Committee"
  description="Be a leader"
  pageTitle="Leadership Committee"
/>

<!-- About -->
<section
  class="grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-2 scroll-mt-24"
>
  <img
    class="order-2 h-64 w-full object-cover md:order-1 md:h-full"
    src="/gallery.jpg"
    alt="Leadership committee members"
  />
  <div class="order-1 flex flex-col justify-center p-8 md:order-2 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">THE COMMITTEE</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Learn to Lead by Leading</h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        Leadership is open to sophomores and above. Members create and lead
        volunteer events.
      </p>
    </div>
  </div>
</section>

<!-- Meetings -->
{#if data.authorized}
  <section
    class="w-full bg-background px-6 py-20 text-foreground md:px-12 flex flex-col items-center"
  >
    <div use:reveal class="w-full max-w-6xl">
      <span class="font-bold-gothic text-secondary">WHEN WE MEET</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Next Leadership Meetings</h2>
      <p class="mt-4 max-w-2xl text-lg">
        Leaders are expected to attend meetings.
      </p>
    </div>

    {#if data.meetings.length > 0}
      <div use:reveal class="mt-12 w-full max-w-6xl">
        <Carousel.Root
          class="w-full cursor-grab select-none"
          opts={{
            loop: false,
            align: isMobile.current ? "center" : "start",
            skipSnaps: false,
          }}
        >
          <Carousel.Content>
            {#each data.meetings as meeting}
              <Carousel.Item
                class={isMobile.current
                  ? "basis-full"
                  : "basis-1/2 lg:basis-1/3"}
              >
                <MeetingCard {meeting} />
              </Carousel.Item>
            {/each}
          </Carousel.Content>

          <div class="mt-8 flex items-center justify-center gap-4">
            <Carousel.Previous size="icon-lg" class="static translate-none" />
            <p class="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon icon="solar:arrow-left-right-linear" class="size-5" />
              Drag or use the arrows to see more
            </p>
            <Carousel.Next size="icon-lg" class="static translate-none" />
          </div>
        </Carousel.Root>
      </div>
    {:else}
      <div use:reveal class="mt-12 text-center">
        <p class="text-lg text-muted-foreground">
          No Leadership meetings are scheduled yet. Check back soon.
        </p>
      </div>
    {/if}
  </section>
{/if}

<!-- Chair -->
<section
  class="grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-2 scroll-mt-24"
>
  <div class="order-1 flex flex-col justify-center p-8 md:order-1 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">MEET YOUR CHAIR</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Sorin Bulgannawar</h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        [A short bio about the committee chair — what they do, how long they've
        been leading, and why they joined Leadership.]
      </p>
    </div>
  </div>
  <img
    class="order-2 h-64 w-full object-cover md:order-2 md:h-full"
    src="/faz.webp"
    alt="Committee chair"
  />
</section>

<!-- Registration -->
<section
  class="w-full bg-background px-6 py-20 text-foreground md:px-12 flex flex-col items-center"
>
  <div use:reveal class="w-full max-w-3xl text-center">
    <span class="font-bold-gothic text-secondary">WANT TO JOIN?</span>
    <h2 class="mt-2 text-4xl md:text-5xl">Registration is Currently Closed</h2>
    <p class="mx-auto mt-4 max-w-xl text-lg">
      Registration opens in second semester. Reach out to Sorin if you have any
      questions.
    </p>
  </div>
</section>
