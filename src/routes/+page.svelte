<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Icon from "@iconify/svelte";
  import gsap from "gsap";
  import { SplitText } from "gsap/SplitText";
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button/index";
  import { Badge } from "$lib/components/ui/badge/index";
  import moment from "moment-timezone";
  import EventCard from "$lib/components/EventCard.svelte";
  import * as Carousel from "$lib/components/ui/carousel/index";
  import { reveal } from "$lib/reveal";

  const {data} = $props();

  const committees = [
    {
      name: "Spirit",
      icon: "solar:fire-bold",
      text: "One of our LARGEST committees. Create fun energizers, take part in spirited events, and build a great atmosphere.",
      image: "/spirit_co.jpg",
    },
    {
      name: "Service",
      icon: "solar:hand-heart-bold",
      text: "Brainstorm and run service events that power our District Project and serve the community.",
      image: "/service_co.jpg",
    },
    {
      name: "Decoration",
      icon: "solar:pallete-2-bold",
      text: "Make posters and signage, hang out at the AC, and keep things laid-back and creative after school.",
      image: "/deco_co.jpg",
    },
    {
      name: "Leadership",
      icon: "solar:star-bold",
      text: "Create and lead events for Key Club. Open to sophomores and above.",
      image: "/gallery.jpg",
    },
  ];

  const meetingDetails = [
    { label: "Date", value: "Tuesday, September 9, 2026" },
    { label: "Time", value: "2:15 PM — 3:15 PM" },
    { label: "Location", value: "The Annex" },
    { label: "What it's about", value: "Learn about Key Club & registration info." },
    { label: "Goodies", value: "Free donuts — one per member. Register to claim yours." },
    { label: "Getting there", value: "Bus passes will be provided." },
  ];

  const nextMeeting = $derived(moment.tz(data.meetings[0].start, "America/Los_Angeles"));
  const countdown = $state([{ value: 0, label: "days" }, { value: 0, label: "hours" }, { value: 0, label: "minutes" }, { value: 0, label: "seconds" }]);

  function tick() {
    const d = moment.duration(nextMeeting.diff(moment()));
    countdown[0].value = d.days();
    countdown[1].value = d.hours();
    countdown[2].value = d.minutes();
    countdown[3].value = d.seconds();
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

<Header />

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
      we don't make keys&hellip;
    </h2>
    <h2 class="intro2 text-2xl text-background sm:text-3xl">we make a</h2>
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
    <Icon
      icon="solar:alt-arrow-down-linear"
      class="size-8 animate-bounce"
    />
  </a>
</section>

<!-- Who are we -->
<section
  id="who"
  class="grid w-full grid-cols-1 bg-background text-foreground md:grid-cols-2 scroll-mt-24"
>
  <img
    class="h-64 w-full object-cover md:h-full"
    src="/canes.webp"
    alt="Key Club members volunteering"
  />
  <div use:reveal class="flex flex-col justify-center p-8 md:p-14">
    <span class="font-bold-gothic text-kcblue">WHO WE ARE</span>
    <h2 class="mt-2 text-4xl md:text-5xl">
      A student-led volunteering family.
    </h2>
    <p class="mt-6 text-lg md:text-xl">
      Key Club is a student-led volunteering organization. Henry M. Jackson High
      School is one of 14 schools in PNW Division 21 &mdash; and currently the
      chapter with the most members. It's a great way to give back to your
      community and make new friends across the division.
    </p>
    <div class="mt-8 flex flex-wrap gap-3">
      {#each ["Leadership", "Character Building", "Caring", "Inclusiveness"] as value}
        <Badge>{value}</Badge>
      {/each}
    </div>
  </div>
</section>

<!-- Join CTA -->
<section id="join" class="w-full scroll-mt-24 bg-foreground px-8 py-20">
  <div class="mx-auto max-w-5xl text-center">
    <span class="font-bold-gothic text-primary">BECOME A KEYUTIE</span>
    <h2 class="mt-2 text-4xl text-background md:text-5xl">Join our chapter</h2>
    <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
      Anyone can join &mdash; that's what we're all about.
      Here's how membership works.
    </p>

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      <div use:reveal
        class="flex flex-col items-center rounded-xl border border-stone-700 bg-stone-900/40 p-8"
      >
        <Icon icon="solar:user-plus-bold" class="size-12 text-primary" />
        <h3 class="font-bold-gothic mt-4 text-2xl text-background">Register</h3>
        <p class="mt-3 text-muted">
            Attend our <a class="text-primary underline" href="#countdown">first meeting</a> on September 9th in the annex.
        </p>
      </div>
      <div use:reveal
        class="flex flex-col items-center rounded-xl border border-stone-700 bg-stone-900/40 p-8"
      >
        <Icon icon="solar:wallet-bold" class="size-12 text-primary" />
        <h3 class="font-bold-gothic mt-4 text-2xl text-background">Pay Dues</h3>
        <p class="mt-3 text-muted">
            Payments will open on <a class="text-primary underline" target="_blank" href="https://wa-everett.intouchreceipting.com/">Payments Online</a> in October.
        </p>
      </div>
      <div use:reveal
        class="flex flex-col items-center rounded-xl border border-stone-700 bg-stone-900/40 p-8"
      >
        <img src="/bee.webp" alt="Bee" class="size-14 object-contain" />
        <h3 class="font-bold-gothic mt-4 text-2xl text-background">
          Stay in the Hive
        </h3>
        <p class="mt-3 text-muted">
          Earn 25 service hours a year, attend 50% of general meetings and honor
          your event sign-ups.
        </p>
      </div>
    </div>

    <div class="mx-auto mt-10 max-w-md">
      <Button
        href="https://www.instagram.com/jhskeyclub21"
        target="_blank"
        rel="noopener"
        size="xl"
        class="font-semibold"
        variant="secondary"
      >
        <Icon icon="fa7-brands:instagram" class="size-10" />
        Follow for updates
      </Button>
      <p class="mt-4 text-muted-foreground">
          We make awesome Instagram posts.
      </p>
    </div>
  </div>
</section>

<!-- Next General Meeting -->
<section class="w-full bg-kcblue scroll-mt-24 px-8 py-20 text-stone-100" id="countdown">
  <div class="mx-auto max-w-6xl">
    <div use:reveal class="flex flex-col items-center justify-between gap-10 lg:flex-row lg:items-end">
      <div class="text-center lg:text-left">
        <span class="font-bold-gothic text-kcyellow">UP NEXT</span>
        <h2 class="mt-2 text-4xl md:text-5xl">The First General Meeting</h2>
        <p class="mt-4 max-w-xl text-lg text-stone-300">
          The year kicks off with everything you need to become a Keyutie.
        </p>

        <dl class="mx-auto mt-8 grid max-w-md grid-cols-1 gap-x-8 gap-y-4 text-left sm:grid-cols-2 lg:mx-0 lg:max-w-none">
          {#each meetingDetails as item (item.label)}
            <div class="border-l-2 border-kcyellow/60 pl-4">
              <dt class="font-bold-gothic text-sm uppercase tracking-wider text-kcyellow">{item.label}</dt>
              <dd class="mt-1 text-stone-100">{item.value}</dd>
            </div>
          {/each}
        </dl>
      </div>

      <div use:reveal class="w-full max-w-xl lg:w-auto">
        <p class="font-bold-gothic mb-3 text-sm uppercase tracking-widest text-stone-400">Time until the meeting</p>
        <div class="grid grid-cols-4 gap-3">
          {#each countdown as unit (unit.label)}
            <div class="flex flex-col items-center rounded-xl bg-stone-900/40 px-2 py-5">
              <span class="font-[abril] text-4xl text-kcyellow tabular-nums sm:text-5xl">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span class="mt-1 text-xs uppercase tracking-wider text-stone-400">{unit.label}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Committees -->
<section class="w-full bg-background px-8 py-20 text-foreground">
  <div class="mx-auto max-w-6xl">
    <div use:reveal class="text-center">
      <span class="font-bold-gothic text-secondary">GET INVOLVED</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Our four committees</h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg">
        Committees are the best way to meet new people and earn volunteer hours.
        Every member should join at least one.
      </p>
    </div>

    <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {#each committees as committee (committee.name)}
        <div
          class="overflow-hidden rounded-xl bg-card shadow-md"
        >
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
  </div>
</section>

<!-- Upcoming events teaser -->
<section class="w-full bg-kcblue px-8 py-20 text-stone-100">
    <div class="mx-auto max-w-6xl">
        <div use:reveal class="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
                <span class="font-bold-gothic text-kcyellow">WHAT'S NEXT</span>
                <h2 class="mt-2 text-4xl md:text-5xl">Upcoming events</h2>
            </div>
            <a class="rounded-md bg-kcyellow px-6 py-3 font-semibold text-kcblack no-underline transition-transform hover:scale-[1.03]" href="/events">
                See full calendar
            </a>
        </div>

        <div use:reveal>
            <Carousel.Root
              class="mt-10 w-full cursor-grab"
              opts={{ loop: true, align: "start", skipSnaps: false }}
            >
              <Carousel.Content>
                {#each data.events as event}
                  <Carousel.Item class="basis-1/2">
                      <EventCard event={event} size="lg" />
                  </Carousel.Item>
                {/each}
              </Carousel.Content>
            </Carousel.Root>
        </div>

        <div class="mt-6 flex items-center justify-center gap-2 text-stone-400">
          <Icon icon="solar:arrow-left-right-linear" class="size-5" />
          <span class="text-sm">Drag to see more</span>
        </div>
    </div>
</section>

<Footer />
