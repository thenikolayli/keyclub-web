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
  imagePath="/leadership_committee.jpg"
  title="Leadership Committee"
  description="Be a leader"
  pageTitle="Leadership Committee"
/>

<!-- About -->
<section
  class="grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-2 scroll-mt-24 min-h-150"
>
  <div
    class="order-2 relative overflow-hidden md:order-1 aspect-square md:aspect-auto"
  >
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="/committees/leadership_members.jpg"
      alt="Leadership committee members"
    />
  </div>
  <div class="order-1 flex flex-col justify-center p-8 md:order-2 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">THE COMMITTEE</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Learn to Lead by Leading</h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        Key Club Leadership Committee is the backbone of Key Club. We create and
        lead every event you see—without us, not much volunteering would be
        done! <span class="font-bold">
          Applications for this committee will open in December
        </span> and are open to sophomores or above, so if you think you have what
        it takes to lead, then stay tuned!
      </p>
    </div>
  </div>
</section>

<!-- Meetings -->
{#if data.authorized}
  <section
    class="w-full bg-background px-6 py-20 text-foreground md:px-12 flex flex-col items-center min-h-100"
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
  class="grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-2 min-h-150"
>
  <div class="order-1 flex flex-col justify-center p-8 md:order-1 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">MEET YOUR CHAIR</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Sorin Bulgannawar</h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        Hi! My name is Sorin Bulgannawar and I am the Key Club Leadership
        Committee chair! I have two siblings, a sister who rides horses and a
        younger brother who is crazy at Minecraft PvP. As for myself, I enjoy my
        classes at Cascadia College, volunteering for Key Club, and playing
        Magic the Gathering. Key Club is an amazing group of amazing people, and
        I couldn’t ask for anything else!
      </p>
    </div>
  </div>
  <div
    class="order-2 relative overflow-hidden md:order-2 aspect-square md:aspect-auto"
  >
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="/committees/sorin_chair.jpg"
      alt="Committee chair"
    />
  </div>
</section>

<!-- Registration -->
<section
  class="w-full bg-background px-6 py-20 text-foreground md:px-12 flex flex-col items-center min-h-100"
>
  <div use:reveal class="w-full max-w-3xl text-center">
    <span class="font-bold-gothic text-secondary">WANT TO JOIN?</span>
    <h2 class="mt-2 text-4xl md:text-5xl">Registration is Currently Closed</h2>
    <p class="mx-auto mt-4 max-w-xl text-lg">
      <span class="font-bold">Registration opens in December</span>. Reach out
      to Sorin if you have any questions.
    </p>
  </div>
</section>
