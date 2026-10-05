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
  imagePath="/service_committee.jpg"
  title="Service Committee"
  description="Support the cause"
  pageTitle="Service Committee"
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
      alt="Veteran's Day parade"
    />
  </div>
  <div class="order-1 flex flex-col justify-center p-8 md:order-2 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">THE COMMITTEE</span>
      <h2 class="mt-2 text-2xl md:text-5xl">Serve Your Community</h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        Service Committee is an amazing place where Key Club members can gather
        to come up with new service ideas for the community. We take initiative
        to bring the change we want to see in the community. Join us on our
        monthly Tuesday meetings to show your service dedication and enjoy free
        snacks!
      </p>
    </div>
  </div>
</section>

<!-- Meetings -->
<section
  class="relative w-full bg-background px-6 py-20 text-foreground md:px-12 flex flex-col items-center min-h-100"
>
  <div use:reveal class="w-full max-w-6xl">
    <span class="font-bold-gothic text-secondary">WHEN WE MEET</span>
    <h2 class="mt-2 text-4xl md:text-5xl">Next Service Meetings</h2>
    <p class="mt-4 max-w-2xl text-lg">
      Service Committee members are expected to attend meetings.
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
        No meetings have been scheduled yet. Check back soon.
      </p>
    </div>
  {/if}
</section>

<!-- Chair -->

<section
  class="relative grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-2 min-h-150"
>
  <div class="order-2 flex flex-col justify-center p-8 md:order-1 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">MEET YOUR CHAIRS</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Adwita Maheshwari</h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        Hi I’m Adwita, one of the chairs for Service Committee. I’ve been in Key
        Club for three years now and I’ve been to DCON all three years! A little
        about me is that I love Drake (and Key Club ofc 🐝), and I’ve been to
        10+ countries.
      </p>
    </div>
  </div>
  <div
    class="order-1 relative overflow-hidden md:order-2 aspect-square md:aspect-auto"
  >
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="/committees/adwita_chair.jpg"
      alt="Committee chair"
    />
  </div>
</section>

<section
  class="relative grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-2 min-h-150"
>
  <div
    class="order-1 relative overflow-hidden md:order-1 aspect-square md:aspect-auto"
  >
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="/committees/ivanna_chair.png"
      alt="Committee chair"
    />
  </div>
  <div class="order-2 flex flex-col justify-center p-8 md:order-2 md:p-14">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">MEET YOUR CHAIRS</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Ivanna Lim</h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        Hello! My name is Ivanna Lim and I’m a junior. As your Service Committee
        co-chair, I work alongside Adwita to organize our Service Project. I’m
        so excited to create something with a meaningful impact to our local
        community and hope that you (yes, you!!) can come join Service Committee
        and contribute to the cause. Fun fact: I own 500 books and 300 DVDs!
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
      src="https://docs.google.com/forms/d/e/1FAIpQLSe-FsnI_7jldhS7MGX6IMTSrrm4-s7e3KOHj0VnzI6BcCXrRg/viewform"
      width={isMobile ? "350" : "650"}
      height="800"
      frameborder="0"
      marginheight="0"
      marginwidth="0">Loading…</iframe
    >
  </div>
</section>
