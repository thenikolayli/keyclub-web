<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Icon from "@iconify/svelte";
    import gsap from "gsap";
    import {SplitText} from "gsap/SplitText";
    import {ScrollTrigger} from "gsap/ScrollTrigger";
    import {onMount} from "svelte";

    const committees = [
        {name: "Spirit", icon: "solar:fire-bold", text: "One of our LARGEST committees. We create fun energizers, take part in spirited events and build a great atmosphere."},
        {name: "Service", icon: "solar:hand-heart-bold", text: "Brainstorm and run service events that power our District Project and serve the community."},
        {name: "Decoration", icon: "solar:pallete-2-bold", text: "Make posters and signage, hang out at the AC, and keep things laid-back and creative after school."},
        {name: "Leadership", icon: "solar:star-bold", text: "Create and lead events for Key Club. Open to sophomores and above."},
    ]

    const joinSteps = [
        {title: "Register", icon: "solar:user-plus-bold", text: "Sign up to become an official Key Club member during registration season."},
        {title: "Pay Dues", icon: "solar:wallet-bold", text: "Dues are $41 total: $10 International, $5.50 District, $2.50 Club and a $23 hoodie."},
        {title: "Stay in the Hive", icon: "solar:bee-bold", text: "Earn 25 service hours a year, attend 50% of general meetings and honor your event sign-ups."},
    ]

    let canSend = $state(true)

    onMount(() => {
        document.title = "JHS Key Club"
        gsap.registerPlugin(SplitText, ScrollTrigger)

        const mm = gsap.matchMedia()

        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const tl = gsap.timeline({defaults: {ease: "power2.out", duration: .7}})
            const intro1 = new SplitText(".intro1", {type: "words"}).words
            const intro2 = new SplitText(".intro2", {type: "words"}).words

            tl.from(intro1, {opacity: 0, yPercent: 60, stagger: .08}, .3)
                .from(intro2, {opacity: 0, yPercent: 60, stagger: .08}, .7)
                .from(".intro3", {opacity: 0, yPercent: 40}, 1.1)
                .from(".intro4", {opacity: 0}, 1.5)

            gsap.utils.toArray(".reveal").forEach((el) => {
                gsap.from(el, {
                    opacity: 0, y: 40, duration: .6, ease: "power2.out",
                    scrollTrigger: {trigger: el, start: "top 85%"}
                })
            })

            return () => ScrollTrigger.getAll().forEach((t) => t.kill())
        })

        return () => mm.revert()
    })
</script>

<Header/>

<!-- Hero -->
<section class="relative flex h-[88vh] w-full flex-col items-center justify-center overflow-hidden text-center">
    <img class="absolute inset-0 h-full w-full object-cover brightness-[.35]" src="/faz.webp" alt=""/>
    <div class="absolute inset-0 bg-gradient-to-b from-kcblue/40 via-transparent to-kcblack"></div>

    <div class="relative z-10 px-6">
        <h2 class="intro1 text-2xl text-stone-200 sm:text-3xl">we don't make keys&hellip;</h2>
        <h2 class="intro2 text-2xl text-stone-200 sm:text-3xl">we make a</h2>
        <h1 class="intro3 font-display mt-2 text-6xl italic text-kcyellow sm:text-7xl md:text-8xl">difference!</h1>
        <p class="intro4 mt-6 text-xl text-stone-200 sm:text-2xl md:text-3xl">Henry M. Jackson High School Key Club</p>

        <div class="intro4 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a class="rounded-md bg-kcyellow px-8 py-3 text-lg font-semibold text-kcblack no-underline transition-transform hover:scale-[1.03]" href="#join">Join Key Club</a>
            <a class="rounded-md border-2 border-stone-200 px-8 py-3 text-lg font-semibold text-stone-200 no-underline transition-colors hover:bg-stone-200 hover:text-kcblack" href="/hours">Check your hours</a>
        </div>
    </div>

    <div class="absolute bottom-6 z-10 text-stone-300">
        <Icon icon="solar:double-alt-arrow-down-linear" class="size-8 animate-bounce"/>
    </div>
</section>

<!-- Who are we -->
<section class="grid w-full grid-cols-1 bg-stone-200 text-kcblack md:grid-cols-2">
    <img class="h-64 w-full object-cover md:h-full" src="/faz.webp" alt="Key Club members volunteering"/>
    <div class="reveal flex flex-col justify-center p-8 md:p-14">
        <span class="font-bold-gothic text-kcblue">WHO WE ARE</span>
        <h2 class="mt-2 text-4xl md:text-5xl">A student-led volunteering family.</h2>
        <p class="mt-6 text-lg md:text-xl">
            Key Club is a student-led volunteering organization. Henry M. Jackson High School is one of 14 schools in
            PNW Division 21 &mdash; and currently the chapter with the most members. It's a great way to give back to
            your community and make new friends across the division.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
            <span class="rounded-full bg-kcblue px-4 py-1.5 text-sm text-stone-100">Leadership</span>
            <span class="rounded-full bg-kcblue px-4 py-1.5 text-sm text-stone-100">Character</span>
            <span class="rounded-full bg-kcblue px-4 py-1.5 text-sm text-stone-100">Caring</span>
            <span class="rounded-full bg-kcblue px-4 py-1.5 text-sm text-stone-100">Inclusiveness</span>
        </div>
    </div>
</section>

<!-- Join CTA -->
<section id="join" class="w-full scroll-mt-24 bg-kcblack px-8 py-20">
    <div class="mx-auto max-w-5xl text-center">
        <span class="font-bold-gothic text-kcyellow">BECOME A KEYUTIE</span>
        <h2 class="mt-2 text-4xl text-stone-100 md:text-5xl">Join our chapter</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-stone-300">
            Anyone can join &mdash; that's what we're about. Here's how membership works once registration opens.
        </p>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
            {#each joinSteps as step (step.title)}
                <div class="reveal flex flex-col items-center rounded-xl border border-stone-700 bg-stone-900/40 p-8">
                    <Icon icon={step.icon} class="size-12 text-kcyellow"/>
                    <h3 class="font-bold-gothic mt-4 text-2xl text-stone-100">{step.title}</h3>
                    <p class="mt-3 text-stone-300">{step.text}</p>
                </div>
            {/each}
        </div>

        <div class="mx-auto mt-10 max-w-md">
            <!-- <ResponsiveButton
                text="Follow for updates"
                busyText="..."
                onClick={() => window.open("https://www.instagram.com/jhskeyclub21", "_blank")}
                canSend={canSend}
                color="#fed450"
            /> -->
            <p class="mt-4 text-sm text-stone-400">Registration reopens in October 2026. Follow our Instagram to be the first to know.</p>
        </div>
    </div>
</section>

<!-- Committees -->
<section class="w-full bg-stone-200 px-8 py-20 text-kcblack">
    <div class="mx-auto max-w-6xl">
        <div class="reveal text-center">
            <span class="font-bold-gothic text-kcblue">GET INVOLVED</span>
            <h2 class="mt-2 text-4xl md:text-5xl">Our four committees</h2>
            <p class="mx-auto mt-4 max-w-2xl text-lg">
                Committees are the best way to meet new people and earn volunteer hours.
                Every member joins at least one.
            </p>
        </div>

        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {#each committees as committee (committee.name)}
                <div class="reveal group overflow-hidden rounded-xl bg-white shadow-md transition-transform hover:-translate-y-1">
                    <div class="relative h-40 overflow-hidden">
                        <img class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" src="/faz.webp" alt={committee.name}/>
                        <div class="absolute inset-0 bg-kcblue/30"></div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-3">
                            <Icon icon={committee.icon} class="size-7 text-kcblue"/>
                            <h3 class="font-bold-gothic text-2xl">{committee.name}</h3>
                        </div>
                        <p class="mt-3 text-stone-600">{committee.text}</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Upcoming events teaser -->
<section class="w-full bg-kcblue px-8 py-20 text-stone-100">
    <div class="mx-auto max-w-6xl">
        <div class="reveal flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
                <span class="font-bold-gothic text-kcyellow">WHAT'S NEXT</span>
                <h2 class="mt-2 text-4xl md:text-5xl">Upcoming events</h2>
            </div>
            <a class="rounded-md bg-kcyellow px-6 py-3 font-semibold text-kcblack no-underline transition-transform hover:scale-[1.03]" href="/events">
                See full calendar
            </a>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-3">
            {#each [1, 2, 3] as n (n)}
                <a class="reveal block overflow-hidden rounded-xl bg-stone-100 text-kcblack no-underline shadow-md transition-transform hover:-translate-y-1" href="/events">
                    <img class="h-44 w-full object-cover" src="/faz.webp" alt=""/>
                    <div class="p-5">
                        <span class="text-sm font-semibold text-kcblue">Date TBA</span>
                        <h3 class="font-bold-gothic mt-1 text-xl">Upcoming Event {n}</h3>
                        <p class="mt-2 text-stone-600">Check the calendar for details, sign-ups and the latest opportunities to serve.</p>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>

<!-- Socials -->
<section class="w-full bg-stone-200 px-8 py-20 text-center text-kcblack">
    <div class="reveal mx-auto max-w-2xl">
        <h2 class="text-4xl md:text-5xl">Follow the buzz</h2>
        <p class="mt-4 text-lg">Catch event recaps, reminders and announcements on our socials.</p>
        <div class="mt-8 flex items-center justify-center gap-6">
            <a class="text-kcblue transition-transform hover:scale-110" aria-label="Instagram" target="_blank" rel="noopener" href="https://www.instagram.com/jhskeyclub21"><Icon icon="fa7-brands:instagram" class="size-9"/></a>
            <a class="text-kcblue transition-transform hover:scale-110" aria-label="TikTok" target="_blank" rel="noopener" href="https://www.tiktok.com/@jhskeyclub21"><Icon icon="fa7-brands:tiktok" class="size-9"/></a>
            <a class="text-kcblue transition-transform hover:scale-110" aria-label="YouTube" target="_blank" rel="noopener" href="https://www.youtube.com/@jhskeyclub4870"><Icon icon="fa7-brands:youtube" class="size-9"/></a>
            <a class="text-kcblue transition-transform hover:scale-110" aria-label="Discord" target="_blank" rel="noopener" href="https://discord.gg/SvBtv4fMbe"><Icon icon="fa7-brands:discord" class="size-9"/></a>
        </div>
    </div>
</section>

<Footer/>
