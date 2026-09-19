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
  imagePath="/decoration_committee.jpg"
  title="Decoration Committee"
  description="Be creative"
  pageTitle="Decoration Committee"
/>

<!-- About -->
<section
  class="relative grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-2 min-h-150"
>
  <div
    class="order-2 relative overflow-hidden md:order-1 aspect-square md:aspect-auto"
  >
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="/committees/parade_bts.jpg"
      alt="Leadership committee members"
    />
  </div>
  <div class="order-1 flex flex-col justify-center p-8 md:order-2 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">THE COMMITTEE</span>
      <h2 class="mt-2 text-2xl md:text-5xl">
        Make <span class="text-secondary">Bee</span>autiful Posters!
      </h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        The Decoration Committee paints posters for important school events such
        as the Haunted Hallway and Deck the Halls. Show up and demonstrate your
        creativity!
      </p>
    </div>
  </div>
</section>

<!-- Meetings -->
<!-- <section
  class="relative w-full bg-background px-6 py-20 text-foreground md:px-12 flex flex-col items-center min-h-100"
>
  <div use:reveal class="w-full max-w-6xl">
    <span class="font-bold-gothic text-secondary">WHEN WE MEET</span>
    <h2 class="mt-2 text-4xl md:text-5xl">Next Decoration Meetings</h2>
    <p class="mt-4 max-w-2xl text-lg">
      Spirit Committee members are expected to attend meetings.
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
              class={isMobile.current ? "basis-full" : "basis-1/2 lg:basis-1/3"}
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
        No Spirit Committee meetings are scheduled yet. Check back soon.
      </p>
    </div>
  {/if}
</section> -->

<!-- Chair -->
<section
  class="relative grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-3 min-h-150"
>
  <div class="order-2 flex flex-col justify-center p-8 md:order-1 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">MEET YOUR CHAIRS</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Nana Endo</h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        Hi everyone, I’m Nana Endo and I’m the other co-editor for the year with
        Ellie! This will be an amazing artsy committee, Ellie and I are happy to
        be co-chairs.
      </p>
    </div>
  </div>
  <div
    class="order-1 relative overflow-hidden md:order-2 aspect-square md:aspect-auto"
  >
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="/committees/ellie_nana_chairs.jpg"
      alt="Committee chair"
    />
  </div>
  <div class="order-3 flex flex-col justify-center p-8 md:order-3 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">MEET YOUR CHAIRS</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Ellie Nguyen</h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        Hey bees!! I’m Ellie Nguyen and I’m the co-editor for the year! I’m so
        excited to help manage this committee along side Nana.
      </p>
    </div>
  </div>
</section>

<!-- Registration -->
<section
  class="w-full bg-background px-6 py-20 text-foreground md:px-12 flex flex-col items-center"
>
  <div use:reveal class="w-full max-w-3xl text-center">
    <span class="font-bold-gothic text-secondary">WANT TO JOIN?</span>
    <h2 class="mt-2 text-4xl md:text-5xl">Registration is Open</h2>
    <p class="mx-auto mt-4 max-w-xl text-lg">
      Fill out the form below to register.
    </p>
    <iframe
      class="mx-auto mt-8 border-4 rounded border-primary"
      title="Registration Form"
      src="https://docs.google.com/forms/d/e/1FAIpQLSfpkLjHZKRBSSkMHHHD1b45o8E3gmrNTBGRwpEo2C6Gxt3U5Q/viewform"
      width="640"
      height="800"
      frameborder="0"
      marginheight="0"
      marginwidth="0">Loading…</iframe
    >
  </div>
</section>
