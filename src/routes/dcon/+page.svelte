<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import ImageHeader from "$lib/components/ImageHeader.svelte";
    import Icon from "@iconify/svelte";
    import {reveal} from "$lib/reveal";
    import Button from "$lib/components/ui/button/button.svelte";

    const highlights = [
        {icon: "solar:user-speak-rounded-bold", title: "Workshops", text: "Sessions that build real skills you bring back to our chapter."},
        {icon: "solar:users-group-rounded-bold", title: "Social Aspect", text: "Meet around 1,600 Key Clubbers from across the Pacific Northwest District."},
        {icon: "solar:cup-star-bold", title: "Awards & Recognition", text: "Celebrate the chapters, projects, and members making the biggest impact."},
        {icon: "solar:confetti-minimalistic-bold", title: "Spirit & Fun", text: "The opening and closing sessions, the talent show, and the Governor's Ball — all in a weekend you'll never forget."},
    ]

    let canSend = $state(true)
</script>

<Header/>

<ImageHeader imagePath="/yandcon.jpg" title="DCON" description="The biggest weekend of the Key Club year. One district, one family." pageTitle="DCON"/>

<!-- What is DCON -->
<section class="grid w-full grid-cols-1 bg-stone-200 text-kcblack md:grid-cols-2">
    <img class="h-64 w-full object-cover md:h-full order-2 md:order-1" src="/dcon.webp" alt="Key Clubbers at DCON"/>
    <div class="flex flex-col justify-center p-8 md:p-14 order-1 md:order-2">
        <div use:reveal>
            <span class="font-bold-gothic text-kcblue">WHAT IS DCON?</span>
            <h2 class="mt-2 text-4xl md:text-5xl">A District-Wide Celebration of Service.</h2>
        </div>
        <p use:reveal class="mt-6 text-lg md:text-xl">
            Each year, Key Clubbers from across the Pacific Northwest District gather for the District Convention &mdash;
            a weekend of leadership workshops, recognition, elections for the district board, and a whole lot of spirit.
            It's where our chapter connects with the bigger Key Club family and comes home inspired.
        </p>
    </div>
</section>

<!-- Highlights -->
<section class="w-full bg-kcblack px-8 py-20">
    <div class="mx-auto max-w-6xl">
        <h2 use:reveal class="text-4xl text-stone-100 md:text-5xl text-center">Why You Should Go</h2>
        <div use:reveal class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {#each highlights as item (item.title)}
                <div class="flex flex-col items-center rounded-xl border border-stone-700 bg-stone-900/40 p-8 text-center">
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
    <div class="mx-auto max-w-4xl text-center">
        <h2 use:reveal class="text-4xl md:text-5xl">Be a Part of Something Bigger</h2>
        <div use:reveal>
            <p class="mx-auto mt-6 max-w-2xl text-lg text-stone-200">
                Key Club is an international organization with a parent (Kiwanis) and sibling programs, plus conventions at
                every level. DCON is our district convention and beyond it is ICON, the Key Club International
                Convention, where clubs from around the world come together. Being part of JHS Key Club connects you to
                all of it.
            </p>
            <div class="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <span class="rounded-full bg-stone-100/10 px-6 py-3 text-lg">DCON — District</span>
                <Icon icon="solar:arrow-right-linear" class="hidden size-7 sm:block"/>
                <span class="rounded-full bg-stone-100/10 px-6 py-3 text-lg">ICON — International</span>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="w-full bg-stone-200 px-8 py-20 text-center text-kcblack">
    <h2 use:reveal class="text-4xl md:text-5xl">Want in on DCON?</h2>
    <div use:reveal>
        <p class="mt-4 text-lg max-w-2xl mx-auto">
            Talk to an officer at a general meeting, and keep an eye on the PNW District website for dates and details.
        </p>
        <Button class="w-fit mx-auto mt-2" size="lg" variant="secondary" href="https://www.pnwkeyclub.org/" target="_blank">
            <Icon icon="solar:link-bold" class="size-4"/>
            PNW Key Club website
        </Button>
    </div>
</section>

<Footer/>
