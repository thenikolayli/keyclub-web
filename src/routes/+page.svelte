<script lang="ts">
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button/index";
  import { Badge } from "$lib/components/ui/badge/index";
  import moment from "moment-timezone";
  import EventCard from "$lib/components/EventCard.svelte";
  import * as Carousel from "$lib/components/ui/carousel/index";
  import gsap from "gsap";
  import { SplitText } from "gsap/SplitText";
  import { reveal } from "$lib/reveal";
  import { IsMobile } from "$lib/hooks/is-mobile.svelte.js";

  const { data } = $props();
  const nextMeeting = $derived(data.meetings);
  const isMobile = new IsMobile();

  const committees = [
    {
      name: "Spirit",
      icon: "solar:fire-bold",
      text: "One of our LARGEST committees. Create fun energizers, take part in spirited events, and build a great atmosphere.",
      image: "/spirit_committee.jpg",
    },
    {
      name: "Service",
      icon: "solar:hand-heart-bold",
      text: "Brainstorm and run service events that power our District Project and serve the community.",
      image: "/service_committee.jpg",
    },
    {
      name: "Decoration",
      icon: "solar:pallete-2-bold",
      text: "Make posters and signage, hang out at the AC, and keep things laid-back and creative after school.",
      image: "/decoration_committee.jpg",
    },
    {
      name: "Leadership",
      icon: "solar:star-bold",
      text: "Create and lead events for Key Club. Open to sophomores and above.",
      image: "/leadership_committee.jpg",
    },
  ];

  const countdown = $state([
    { value: 0, label: "days" },
    { value: 0, label: "hours" },
    { value: 0, label: "minutes" },
    { value: 0, label: "seconds" },
  ]);
  const meetingDetails = $derived.by(() => {
    // double-check, meeting details fields won't load if nextMeeting is null
    if (!nextMeeting) {
      return [];
    }
    const start = moment.tz(nextMeeting.start, "America/Los_Angeles");
    const end = moment.tz(nextMeeting.end, "America/Los_Angeles");
    return [
      { label: "Date", value: start.format("dddd, MMMM D, YYYY") },
      {
        label: "Time",
        value: `${start.format("h:mm A")} — ${end.format("h:mm A")}`,
      },
      { label: "Location", value: nextMeeting.location ?? "The Annex" },
      {
        label: "What it's about",
        value: nextMeeting.topic ?? "TBD",
      },
      { label: "Transportation", value: "Bus passes will be provided" },
    ];
  });

  function tick() {
    if (!nextMeeting) {
      return;
    }
    const ms = moment
      .tz(nextMeeting.start, "America/Los_Angeles")
      .diff(moment());
    const total = moment.duration(ms);
    countdown[0].value = Math.floor(total.asDays());
    countdown[1].value = total.hours();
    countdown[2].value = total.minutes();
    countdown[3].value = total.seconds();
  }

  onMount(() => {
    document.title = "JHS Key Club";
    gsap.registerPlugin(SplitText);

    tick();
    const timer = setInterval(tick, 1000);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out", duration: 0.7 },
      });
      const intro1 = new SplitText(".intro1", { type: "words" }).words;
      const intro2 = new SplitText(".intro2", { type: "words" }).words;

      tl.from(intro1, { opacity: 0, yPercent: 60, stagger: 0.08 }, 0.3)
        .from(intro2, { opacity: 0, yPercent: 60, stagger: 0.08 }, 0.7)
        .from(".intro3", { opacity: 0, yPercent: 40 }, 1.1)
        .from(".intro4", { opacity: 0 }, 1.5);
    });

    return () => {
      clearInterval(timer);
      mm.revert();
    };
  });
</script>

<!-- Hero -->
<section
  class="relative flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden text-center"
>
  <img
    class="absolute inset-0 h-full w-full object-cover brightness-[.35]"
    src="/club.webp"
    alt=""
  />
  <div
    class="absolute inset-0 bg-linear-to-b from-foreground/40 via-transparent to-foreground"
  ></div>

  <div class="relative z-10 px-6">
    <h2 class="intro1 text-2xl text-background sm:text-3xl">
      We don't make keys...
    </h2>
    <h2 class="intro2 text-2xl text-background sm:text-3xl">We make a</h2>
    <h1
      class="intro3 font-[abril] mt-2 text-6xl italic text-primary sm:text-7xl md:text-8xl"
    >
      difference!
    </h1>
    <p class="intro4 mt-6 text-xl text-background sm:text-2xl md:text-3xl">
      Henry M. Jackson High School Key Club
    </p>

    <div
      class="intro4 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
    >
      <Button href="#join" size="xl" class="font-semibold">
        Join Key Club
      </Button>
      <Button href="/hours" variant="secondary" size="xl" class="font-semibold">
        Check Your Hours
      </Button>
    </div>
  </div>

  <a
    class="absolute bottom-6 z-10 text-muted transition-colors hover:text-background"
    aria-label="Scroll down to learn more"
    href="#who"
  >
    <Icon icon="solar:alt-arrow-down-linear" class="size-8 animate-bounce" />
  </a>
</section>

<!-- Who are we -->
<section
  id="who"
  class="grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-2 scroll-mt-24 min-h-150"
>
  <div
    class="relative overflow-hidden order-2 md:order-1 aspect-square md:aspect-auto"
  >
    <img
      class="absolute inset-0 h-full w-full object-cover"
      src="/canes.webp"
      alt="Key Club members volunteering"
    />
  </div>
  <div class="flex flex-col justify-center p-8 md:p-14 order-1 md:order-2">
    <div use:reveal>
      <span class="font-bold-gothic text-secondary">WHO WE ARE</span>
      <h2 class="mt-2 text-4xl md:text-5xl">
        A Student-Led Volunteering Family
      </h2>
    </div>
    <div use:reveal>
      <p class="mt-6 text-lg md:text-xl">
        Key Club is a student-led volunteering organization. Henry M. Jackson
        High School is one of 14 schools in PNW Division 21 &mdash; and
        currently the chapter with the most members. It's a great way to give
        back to your community and make new friends across the division.
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        {#each ["Leadership", "Character Building", "Caring", "Inclusiveness"] as value}
          <Badge>{value}</Badge>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- Join CTA -->
<section
  id="join"
  class="w-full scroll-mt-24 bg-foreground px-8 py-20 flex flex-col items-center justify-center text-center"
>
  <div use:reveal>
    <span class="font-bold-gothic text-primary">JOIN OUR CHAPTER</span>
    <h2 class="mt-2 text-4xl text-background md:text-5xl">Become a Keyutie</h2>
    <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
      Anyone can join — that's what we're all about. Here's how membership
      works.
    </p>
  </div>

  <div use:reveal>
    <div class="mt-10 grid gap-6 md:grid-cols-3 max-w-5xl">
      <div
        class="flex flex-col items-center rounded-xl border border-stone-700 bg-stone-900/40 p-8"
      >
        <Icon icon="solar:user-plus-bold" class="size-12 text-primary" />
        <h3 class="font-bold-gothic mt-4 text-2xl text-background">Register</h3>
        <p class="mt-3 text-muted">
          Fill out the
          <a
            class="text-primary underline"
            href="https://docs.google.com/forms/d/e/1FAIpQLSehyBt28LPjbq5x_-AN4s1FSvQpIgNJFsinn7WED6G3z9HGdg/viewform?usp=dialog"
          >
            registration form
          </a>.
        </p>
      </div>
      <div
        class="flex flex-col items-center rounded-xl border border-stone-700 bg-stone-900/40 p-8"
      >
        <Icon icon="solar:wallet-bold" class="size-12 text-primary" />
        <h3 class="font-bold-gothic mt-4 text-2xl text-background">Pay Dues</h3>
        <p class="mt-3 text-muted">
          Dues are $45 and are available on <a
            class="text-primary underline"
            target="_blank"
            href="https://wa-everett.intouchreceipting.com/">Payments Online</a
          > or at the ASB office.
        </p>
      </div>
      <div
        class="flex flex-col items-center rounded-xl border border-stone-700 bg-stone-900/40 p-8"
      >
        <img src="/bee.webp" alt="Bee" class="size-14 object-contain" />
        <h3 class="font-bold-gothic mt-4 text-2xl text-background">
          Stay in the Hive
        </h3>
        <p class="mt-3 text-muted">
          Attend general meetings and honor your event sign-ups.
        </p>
      </div>
    </div>

    <p class="mt-10 text-muted-foreground text-lg">Follow for updates</p>
    <div class="mt-2 w-full flex justify-center gap-4">
      <Button
        href="https://www.instagram.com/jhskeyclub21"
        target="_blank"
        rel="noopener"
        size="xl"
        class="font-semibold"
        variant="secondary"
      >
        <Icon icon="fa7-brands:instagram" class="size-10" />
        Instagram
      </Button>

      <Button
        href="https://groupme.com/join_group/117343192/3W7crLIS"
        target="_blank"
        rel="noopener"
        size="xl"
        class="font-semibold"
        variant="secondary"
      >
        <Icon icon="thesvg:groupme" class="size-8" />
        GroupMe
      </Button>
    </div>
  </div>
</section>

<!-- Next General Meeting -->
{#if nextMeeting}
  <section
    class="w-full bg-orange-600 scroll-mt-24 px-8 py-20 text-stone-100 flex flex-col items-center justify-center text-center lg:text-left"
    id="countdown"
  >
    <div
      use:reveal
      class="flex flex-col max-w-6xl items-center justify-between gap-10 lg:flex-row lg:items-end"
    >
      <div class="text-center lg:text-left">
        <span class="font-bold-gothic text-primary">COMING UP</span>
        <h2 class="mt-2 text-4xl md:text-5xl">The October General Meeting</h2>
        <p class="mt-4 max-w-xl text-lg text-stone-300">
          {nextMeeting.description}
        </p>

        <dl
          class="mx-auto mt-8 grid max-w-md grid-cols-1 gap-x-8 gap-y-4 text-left sm:grid-cols-2 lg:mx-0 lg:max-w-none"
        >
          {#each meetingDetails as item (item.label)}
            <div class="border-l-2 border-kcyellow/60 pl-4">
              <dt
                class="font-bold-gothic text-sm uppercase tracking-wider text-kcyellow"
              >
                {item.label}
              </dt>
              <dd class="mt-1 text-stone-100">{item.value}</dd>
            </div>
          {/each}
        </dl>
      </div>

      <div use:reveal class="w-full max-w-xl lg:w-auto">
        <p
          class="font-bold-gothic mb-3 text-sm uppercase tracking-widest text-stone-400"
        >
          Time until the meeting
        </p>
        <div class="relative grid grid-cols-4 gap-3">
          {#each countdown as unit (unit.label)}
            <div
              class="flex z-10 flex-col items-center rounded-xl bg-orange-900 px-2 py-5"
            >
              <span
                class="font-[abril] text-4xl text-kcyellow tabular-nums sm:text-5xl"
              >
                {unit.value}
              </span>
              <span class="mt-1 text-xs uppercase tracking-wider text-stone-400"
                >{unit.label}</span
              >
            </div>
          {/each}
          <img
            class="absolute -left-18 -rotate-12 size-32"
            src="/pumpkinbee.PNG"
            alt="Pumpkin Wolfbee"
          />
        </div>
      </div>
    </div>
  </section>
{/if}

<!-- Committees -->
<section
  class="w-full bg-background px-8 py-20 text-foreground flex flex-col items-center justify-center text-center"
>
  <div use:reveal>
    <span class="font-bold-gothic text-secondary">GET INVOLVED</span>
    <h2 class="mt-2 text-4xl md:text-5xl">Our Four Committees</h2>
    <p class="mx-auto mt-4 max-w-2xl text-lg">
      Committees are the best way to meet new people and earn volunteer hours.
      Every member should join at least one.
    </p>
  </div>

  <div
    use:reveal
    class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl"
  >
    {#each committees as committee (committee.name)}
      <div class="overflow-hidden rounded-xl bg-card shadow-md">
        <div class="relative h-40 overflow-hidden">
          <img
            class="h-full w-full object-cover"
            src={committee.image}
            alt={committee.name}
          />
          <div class="absolute inset-0 bg-secondary/30"></div>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-3">
            <Icon icon={committee.icon} class="size-7 text-secondary" />
            <h3 class="font-bold-gothic text-2xl">{committee.name}</h3>
          </div>
          <p class="mt-3 text-card-foreground">{committee.text}</p>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- Upcoming events teaser -->
<section
  class="w-full bg-kcblue px-8 py-20 text-stone-100 flex flex-col justify-center"
>
  <div class="mx-auto w-full max-w-6xl">
    <div
      use:reveal
      class="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end"
    >
      <h2 class="mt-2 text-4xl md:text-5xl">Upcoming events</h2>
      <Button class="mt-8 hidden md:inline" size="lg" href="/events">
        See full calendar
      </Button>
    </div>

    <div use:reveal class="flex flex-col items-center">
      <Carousel.Root
        class="mt-10 w-full cursor-grab select-none"
        opts={{
          loop: true,
          align: isMobile.current ? "center" : "start",
          skipSnaps: false,
        }}
      >
        <Carousel.Content>
          {#each data.events as event}
            <Carousel.Item
              class={isMobile.current ? "basis-full" : "basis-1/2"}
            >
              <EventCard
                {event}
                size={isMobile.current ? "xs" : "lg"}
                class={!isMobile.current ? "w-full!" : ""}
              />
            </Carousel.Item>
          {/each}
        </Carousel.Content>
      </Carousel.Root>

      <div class="mt-6 flex items-center justify-center gap-2 text-stone-400">
        <Icon icon="solar:arrow-left-right-linear" class="size-5" />
        <span class="text-sm">Drag to see more</span>
      </div>

      <Button class="mt-8 inline md:hidden" size="lg" href="/events">
        See full calendar
      </Button>
    </div>
  </div>
</section>
