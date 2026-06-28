<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Icon from "@iconify/svelte";
    import gsap from "gsap";
    import {ScrollTrigger} from "gsap/ScrollTrigger";
    import {onMount} from "svelte";

    const officers = [
        {name: "Annabelle Ho", role: "President", email: "annabelle.zt.ho@gmail.com"},
        {name: "Eldana Woldegiorgis", role: "Vice President", email: "eldanaaw.38@gmail.com"},
        {name: "Kaitlyn Luu", role: "Treasurer", email: "kaitlynluu579@gmail.com"},
        {name: "Nadia Villareal-Carriedo", role: "Secretary", email: "nvillarrealcarriedo@gmail.com"},
        {name: "Ellie Nguyen", role: "Editor", email: "ellienguyen882@gmail.com"},
        {name: "Nana Endo", role: "Editor", email: "shibewanco49@gmail.com"},
        {name: "Nikolay Li", role: "Webmaster", email: "nikolayliwork@gmail.com"},
        {name: "Daya Putheth", role: "Historian", email: "puthethdaya@gmail.com"},
    ]

    const facultyAdvisors = [
        {name: "Alfred Cain", email: "acain@everettsd.org"},
        {name: "Rachel Vaught", email: "rvaught@everettsd.org"},
    ]

    const kiwanisAdvisors = [
        {name: "John Steckler", email: "johnsteckler@comcast.net"},
        {name: "Lisa Steckler", email: "stecklerlisa@gmail.com"},
    ]

    const partners = [
        {name: "Thirst Project", href: "https://thirstproject.org/", text: "Educating the next generation about the global water crisis and how they can be part of social change."},
        {name: "UNICEF", href: "https://www.unicef.org/", text: "The only United Nations organization dedicated exclusively to children, providing for their needs in more than 150 countries."},
        {name: "Erika's Lighthouse", href: "https://erikaslighthouse.org/", text: "Making sure no young person feels alone in their depression, breaking down the stigma around mental health."},
        {name: "Schoolhouse", href: "https://schoolhouse.world/key-club", text: "Free peer tutoring for learners across the world — learn something new, or become a tutor yourself."},
        {name: "Collegewise", href: "https://collegewise.com/", text: "College and test-prep guidance, with a suite of Runway resources free for every Key Club member."},
    ]

    let canSend = $state(true)

    onMount(() => {
        document.title = "About"
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

<!-- Page hero -->
<section class="relative flex h-[40vh] w-full items-center justify-center overflow-hidden text-center">
    <img class="absolute inset-0 h-full w-full object-cover brightness-[.4]" src="/faz.webp" alt=""/>
    <div class="absolute inset-0 bg-kcblue/40"></div>
    <div class="relative z-10 px-6">
        <h1 class="font-display text-5xl italic text-kcyellow md:text-7xl">About Us</h1>
        <p class="mt-3 text-lg text-stone-200 md:text-xl">The people and partners behind JHS Key Club</p>
    </div>
</section>

<!-- Officers -->
<section class="w-full bg-kcblack px-8 py-20">
    <div class="mx-auto max-w-6xl">
        <h2 class="reveal text-center text-4xl text-stone-100 md:text-5xl">Meet the officers</h2>
        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {#each officers as officer (officer.email)}
                <div class="reveal flex flex-col items-center text-center">
                    <img class="aspect-square w-full border-8 border-kcyellow object-cover" src="/faz.webp" alt={officer.name}/>
                    <h3 class="font-bold-gothic mt-4 text-2xl text-kcyellow">{officer.name}</h3>
                    <p class="text-lg text-stone-200">{officer.role}</p>
                    <a class="mt-1 flex items-center gap-1 text-sm text-stone-400 hover:text-stone-200" href="mailto:{officer.email}">
                        <Icon icon="fe:mail"/><span>{officer.email}</span>
                    </a>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Advisors -->
<section class="w-full bg-stone-200 px-8 py-20 text-kcblack">
    <div class="mx-auto max-w-5xl">
        <h2 class="reveal text-center text-4xl md:text-5xl">Faculty advisors</h2>
        <div class="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2">
            {#each facultyAdvisors as advisor (advisor.email)}
                <div class="reveal flex flex-col items-center text-center">
                    <img class="aspect-[3/4] w-full border-8 border-kcyellow object-cover" src="/faz.webp" alt={advisor.name}/>
                    <h3 class="font-bold-gothic mt-4 text-3xl">{advisor.name}</h3>
                    <a class="flex items-center gap-1 text-stone-600 hover:text-kcblack" href="mailto:{advisor.email}">
                        <Icon icon="fe:mail"/><span>{advisor.email}</span>
                    </a>
                </div>
            {/each}
        </div>

        <h2 class="reveal mt-20 text-center text-4xl md:text-5xl">Kiwanis advisors</h2>
        <div class="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2">
            {#each kiwanisAdvisors as advisor (advisor.email)}
                <div class="reveal flex flex-col items-center text-center">
                    <img class="aspect-[3/4] w-full border-8 border-kcyellow object-cover" src="/faz.webp" alt={advisor.name}/>
                    <h3 class="font-bold-gothic mt-4 text-3xl">{advisor.name}</h3>
                    <a class="flex items-center gap-1 text-stone-600 hover:text-kcblack" href="mailto:{advisor.email}">
                        <Icon icon="fe:mail"/><span>{advisor.email}</span>
                    </a>
                </div>
            {/each}
        </div>

        <h2 class="reveal mt-20 text-center text-4xl md:text-5xl">D21 Lieutenant Governor</h2>
        <div class="reveal mx-auto mt-10 flex max-w-xs flex-col items-center text-center">
            <img class="aspect-[3/4] w-full border-8 border-kcyellow object-cover" src="/faz.webp" alt="Ryan Tran"/>
            <h3 class="font-bold-gothic mt-4 text-3xl">Ryan Tran</h3>
            <a class="flex items-center gap-1 text-stone-600 hover:text-kcblack" href="mailto:ltg21@pnwkeyclub.org">
                <Icon icon="fe:mail"/><span>ltg21@pnwkeyclub.org</span>
            </a>
        </div>
    </div>
</section>

<!-- Partners -->
<section class="w-full bg-kcblue px-8 py-20 text-stone-100">
    <div class="mx-auto max-w-6xl">
        <div class="reveal text-center">
            <h2 class="text-4xl md:text-5xl">Preferred partners &amp; charities</h2>
            <p class="mx-auto mt-4 max-w-2xl text-lg text-stone-200">The organizations we proudly support and partner with.</p>
        </div>
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {#each partners as partner (partner.name)}
                <div class="reveal flex flex-col overflow-hidden rounded-xl bg-stone-100 text-kcblack shadow-md">
                    <img class="h-40 w-full object-cover" src="/faz.webp" alt={partner.name}/>
                    <div class="flex flex-1 flex-col p-6">
                        <h3 class="font-bold-gothic text-2xl">{partner.name}</h3>
                        <p class="mt-2 flex-1 text-stone-600">{partner.text}</p>
                        <a class="mt-4 inline-flex items-center gap-1 font-semibold text-kcblue hover:underline" target="_blank" rel="noopener" href={partner.href}>
                            Learn more <Icon icon="solar:arrow-right-up-linear"/>
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Kiwanis sponsor -->
<section class="grid w-full grid-cols-1 bg-stone-200 text-kcblack md:grid-cols-2">
    <div class="reveal flex flex-col justify-center p-8 md:p-14">
        <span class="font-bold-gothic text-kcblue">OUR SPONSOR</span>
        <h2 class="mt-2 text-4xl md:text-5xl">The Kiwanis of Mill Creek</h2>
        <p class="mt-6 text-lg md:text-xl">
            JHS Key Club is sponsored by the Kiwanis of Mill Creek. Kiwanis is an international community of clubs
            dedicated to serving their community and improving the lives of children around them.
        </p>
        <div class="max-w-xs">
            <!-- <ResponsiveButton
                text="Kiwanis Website"
                busyText="..."
                onClick={() => window.open("https://k19352.site.kiwanis.org/", "_blank")}
                canSend={canSend}
                color="#fed450"
            /> -->
        </div>
    </div>
    <img class="h-64 w-full object-cover md:h-full" src="/faz.webp" alt="Kiwanis of Mill Creek"/>
</section>

<!-- More websites -->
<section class="w-full bg-kcblack px-8 py-20 text-center">
    <h2 class="reveal text-4xl text-stone-100 md:text-5xl">More websites</h2>
    <p class="reveal mx-auto mt-4 max-w-2xl text-lg text-stone-300">
        Check out our international and district websites to learn more and catch up with the buzz.
    </p>
    <div class="reveal mx-auto mt-8 flex max-w-2xl flex-col justify-center gap-6 sm:flex-row">
        <div class="flex-1">
            <!-- <ResponsiveButton text="Key Club" busyText="..." onClick={() => window.open("https://keyclub.org/", "_blank")} canSend={canSend} color="#fed450"/> -->
        </div>
        <div class="flex-1">
            <!-- <ResponsiveButton text="PNW Key Club" busyText="..." onClick={() => window.open("https://pnwkeyclub.org/", "_blank")} canSend={canSend} color="#fed450"/> -->
        </div>
    </div>
</section>

<Footer/>
