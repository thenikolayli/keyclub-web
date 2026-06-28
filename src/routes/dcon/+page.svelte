<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import ResponsiveButton from "$lib/components/ResponsiveButton.svelte";
    import Icon from "@iconify/svelte";
    import gsap from "gsap";
    import {ScrollTrigger} from "gsap/ScrollTrigger";
    import {onMount} from "svelte";

    const highlights = [
        {icon: "solar:user-speak-rounded-bold", title: "Leadership Workshops", text: "Hands-on sessions that build real skills you bring back to our chapter."},
        {icon: "solar:users-group-rounded-bold", title: "District Fellowship", text: "Meet hundreds of Key Clubbers from across the Pacific Northwest District."},
        {icon: "solar:cup-star-bold", title: "Awards & Recognition", text: "Celebrate the chapters, projects and members making the biggest impact."},
        {icon: "solar:confetti-minimalistic-bold", title: "Spirit & Fun", text: "Energizers, the talent show, the dance, and a weekend you'll never forget."},
    ]

    let canSend = $state(true)

    onMount(() => {
        document.title = "DCON";
        gsap.registerPlugin(ScrollTrigger)
        const mm = gsap.matchMedia()
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.utils.toArray(".reveal").forEach((el) => {
                gsap.from(el, {
                    opacity: 0, y: 40, duration: .6, ease: "power2.out",
                    scrollTrigger: {trigger: el, start: "top 88%"}
                })
            })
            return () => ScrollTrigger.getAll().forEach((t) => t.kill())
        })
        return () => mm.revert()
    })
</script>

<Header/>

<!-- Hero -->
<section class="relative flex h-[56vh] w-full items-center justify-center overflow-hidden text-center">
    <img class="absolute inset-0 h-full w-full object-cover brightness-[.35]" src="/faz.webp" alt=""/>
    <div class="absolute inset-0 bg-gradient-to-b from-kcblue/50 to-kcblack"></div>
    <div class="relative z-10 px-6">
        <span class="font-bold-gothic tracking-widest text-kcyellow">PNW DISTRICT CONVENTION</span>
        <h1 class="font-display mt-2 text-6xl italic text-stone-100 md:text-8xl">DCON</h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-stone-200 md:text-xl">
            The biggest weekend of the Key Club year. One district, one family.
        </p>
    </div>
</section>

<!-- What is DCON -->
<section class="grid w-full grid-cols-1 bg-stone-200 text-kcblack md:grid-cols-2">
    <img class="h-64 w-full object-cover md:h-full" src="/faz.webp" alt="Key Clubbers at DCON"/>
    <div class="reveal flex flex-col justify-center p-8 md:p-14">
        <span class="font-bold-gothic text-kcblue">WHAT IS DCON?</span>
        <h2 class="mt-2 text-4xl md:text-5xl">A district-wide celebration of service.</h2>
        <p class="mt-6 text-lg md:text-xl">
            Each year, Key Clubbers from across the Pacific Northwest District gather for the District Convention &mdash;
            a weekend of leadership workshops, recognition, elections for the district board, and a whole lot of spirit.
            It's where our chapter connects with the bigger Key Club family and comes home inspired.
        </p>
    </div>
</section>

<!-- Highlights -->
<section class="w-full bg-kcblack px-8 py-20">
    <div class="mx-auto max-w-6xl">
        <h2 class="reveal text-center text-4xl text-stone-100 md:text-5xl">Why you should go</h2>
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {#each highlights as item (item.title)}
                <div class="reveal flex flex-col items-center rounded-xl border border-stone-700 bg-stone-900/40 p-8 text-center">
                    <Icon icon={item.icon} class="size-12 text-kcyellow"/>
                    <h3 class="font-bold-gothic mt-4 text-2xl text-stone-100">{item.title}</h3>
                    <p class="mt-3 text-stone-300">{item.text}</p>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Bigger picture -->
<section class="w-full bg-kcblue px-8 py-20 text-stone-100">
    <div class="reveal mx-auto max-w-4xl text-center">
        <h2 class="text-4xl md:text-5xl">Part of something bigger</h2>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-stone-200">
            Key Club is an international organization with a parent (Kiwanis) and sibling programs, plus conventions at
            every level. DCON is our district convention &mdash; and beyond it is ICON, the Key Club International
            Convention, where clubs from around the world come together. Being part of JHS Key Club connects you to
            all of it.
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <span class="rounded-full bg-stone-100/10 px-6 py-3 text-lg">DCON &mdash; District</span>
            <Icon icon="solar:arrow-right-linear" class="hidden size-7 sm:block"/>
            <span class="rounded-full bg-stone-100/10 px-6 py-3 text-lg">ICON &mdash; International</span>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="w-full bg-stone-200 px-8 py-20 text-center text-kcblack">
    <div class="reveal mx-auto max-w-2xl">
        <h2 class="text-4xl md:text-5xl">Want in on DCON?</h2>
        <p class="mt-4 text-lg">
            Talk to an officer at a general meeting, and keep an eye on the PNW District site for dates and details.
        </p>
        <div class="mx-auto mt-8 max-w-xs">
            <ResponsiveButton
                text="PNW Key Club"
                busyText="..."
                onClick={() => window.open("https://pnwkeyclub.org/", "_blank")}
                canSend={canSend}
                color="#fed450"
            />
        </div>
    </div>
</section>

<Footer/>
