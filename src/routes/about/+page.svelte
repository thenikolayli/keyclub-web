<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Icon from "@iconify/svelte";
    import gsap from "gsap";
    import {ScrollTrigger} from "gsap/ScrollTrigger";
    import {onMount} from "svelte";
    import ImageHeader from "$lib/components/ImageHeader.svelte";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    import {Button} from "$lib/components/ui/button/index.js";

    const officers = [
        {name: "Annabelle Ho", role: "President", email: "annabelle.zt.ho@gmail.com", image: "/about/annabelle.jpg"},
        {name: "Eldana Woldegiorgis", role: "Vice President", email: "eldanaaw.38@gmail.com", image: "/about/eldana.jpg"},
        {name: "Kaitlyn Luu", role: "Treasurer", email: "kaitlynluu579@gmail.com", image: "/about/kaitlyn.jpg"},
        {name: "Nadia Villarreal-Carriedo", role: "Secretary", email: "nvillarrealcarriedo@gmail.com", image: "/about/nadia.jpg"},
        {name: "Ellie Nguyen", role: "Editor", email: "ellienguyen882@gmail.com", image: "/about/ellie.jpg"},
        {name: "Nana Endo", role: "Editor", email: "shibewanco49@gmail.com", image: "/about/nana.jpg"},
        {name: "Nikolay Li", role: "Webmaster", email: "nikolayliwork@gmail.com", image: "/about/nikolay.jpg"},
        {name: "Daya Putheth", role: "Historian", email: "puthethdaya@gmail.com", image: "/about/daya.jpg"},
    ]

    const facultyAdvisors = [
        {name: "Alfred Cain", email: "acain@everettsd.org", image: "/about/mrcain.png"},
        {name: "Rachel Vaught", email: "rvaught@everettsd.org", image: "/about/mrsvaught.jpg"},
    ]

    const kiwanisAdvisors = [
        {name: "John Steckler", email: "johnsteckler@comcast.net", image: "/about/mrsteckler.png"},
        {name: "Lisa Steckler", email: "stecklerlisa@gmail.com", image: "/about/mrssteckler.png"},
    ]

    const partners = [
        {name: "Thirst Project", href: "https://thirstproject.org/", text: "Educating the next generation about the global water crisis and how they can be part of social change.", image: "/about/thirst_project.svg"},
        {name: "UNICEF", href: "https://www.unicef.org/", text: "The only United Nations organization dedicated exclusively to children, providing for their needs in more than 150 countries.", image: "/about/unicef.png"},
        {name: "Erika's Lighthouse", href: "https://erikaslighthouse.org/", text: "Making sure no young person feels alone in their depression, breaking down the stigma around mental health.", image: "/about/erikas_lighthouse.webp"},
        {name: "Schoolhouse", href: "https://schoolhouse.world/key-club", text: "Free peer tutoring for learners across the world — learn something new, or become a tutor yourself.", image: "/about/schoolhouse.jpg"},
        {name: "Collegewise", href: "https://collegewise.com/", text: "College and test-prep guidance, with a suite of Runway resources free for every Key Club member.", image: "/about/collegewise.svg"},
    ]

    let canSend = $state(true)
    let carouselAPI = $state()
    let scrollSnaps = $state([])
    let selectedSnap = $state(0)

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger)

        const mm = gsap.matchMedia()
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            gsap.utils.toArray(".reveal").forEach((el) => {
                gsap.from(el, {
                    opacity: 0, y: 40, duration: .6, ease: "power2.out",
                    scrollTrigger: {trigger: el, start: "top 88%"}
                })
            })
        })
        return () => mm.revert()
    })

    $effect(() => {
        if (carouselAPI) {
            scrollSnaps = carouselAPI.scrollSnapList()
            carouselAPI.on("select", () => selectedSnap = carouselAPI.selectedScrollSnap())
        }
    })
</script>

<Header/>

<ImageHeader imagePath="/about.jpg" title="About Us" description="The people and partners behind JHS Key Club" pageTitle="About"/>

<!-- Officers -->
<section class="w-full bg-foreground px-8 py-20">
    <div class="mx-auto max-w-6xl">
        <h2 class="reveal text-center text-4xl text-background md:text-5xl">Meet the officers</h2>
        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {#each officers as officer (officer.email)}
                <div class="reveal flex flex-col items-center text-center">
                    <img class="aspect-square w-full border-8 border-primary object-cover" src={officer.image} alt={officer.name}/>
                    <h3 class="font-bold-gothic mt-4 text-2xl text-primary">{officer.name}</h3>
                    <p class="text-lg text-background">{officer.role}</p>
                    <a class="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-colors" href="mailto:{officer.email}">
                        <Icon icon="fe:mail"/><span>{officer.email}</span>
                    </a>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Advisors -->
<section class="w-full bg-background px-8 py-20 text-foreground">
    <div class="mx-auto max-w-5xl">
        <h2 class="reveal text-center text-4xl md:text-5xl">Faculty advisors</h2>
        <div class="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2">
            {#each facultyAdvisors as advisor (advisor.email)}
                <div class="reveal flex flex-col items-center text-center">
                    <img class="aspect-3/4 w-full border-8 border-primary object-cover" src={advisor.image} alt={advisor.name}/>
                    <h3 class="font-bold-gothic mt-4 text-3xl">{advisor.name}</h3>
                    <a class="flex items-center gap-1 hover:text-muted-foreground transition-colors" href="mailto:{advisor.email}">
                        <Icon icon="fe:mail"/><span>{advisor.email}</span>
                    </a>
                </div>
            {/each}
        </div>

        <h2 class="reveal mt-20 text-center text-4xl md:text-5xl">Kiwanis advisors</h2>
        <div class="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2">
            {#each kiwanisAdvisors as advisor (advisor.email)}
                <div class="reveal flex flex-col items-center text-center">
                    <img class="aspect-3/4 w-full border-8 border-primary object-cover" src={advisor.image} alt={advisor.name}/>
                    <h3 class="font-bold-gothic mt-4 text-3xl">{advisor.name}</h3>
                    <a class="flex items-center gap-1 text-muted-foreground hover:text-muted-foreground transition-colors" href="mailto:{advisor.email}">
                        <Icon icon="fe:mail"/><span>{advisor.email}</span>
                    </a>
                </div>
            {/each}
        </div>

        <h2 class="reveal mt-20 text-center text-4xl md:text-5xl">D21 Lieutenant Governor</h2>
        <div class="reveal mx-auto mt-10 flex max-w-xs flex-col items-center text-center">
            <img class="aspect-3/4 w-full border-8 border-primary object-cover" src="/about/ryan.png" alt="Ryan Tran"/>
            <h3 class="font-bold-gothic mt-4 text-3xl">Ryan Tran</h3>
            <a class="flex items-center gap-1 text-muted-foreground hover:text-muted-foreground transition-colors" href="mailto:ltg21@pnwkeyclub.org">
                <Icon icon="fe:mail"/><span>ltg21@pnwkeyclub.org</span>
            </a>
        </div>
    </div>
</section>

<!-- Partners -->
<section class="w-full bg-secondary px-8 py-20 text-background flex flex-col items-center">
    <div class="reveal text-center">
        <h2 class="text-4xl md:text-5xl">Preferred partners &amp; charities</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">The organizations we proudly support and partner with.</p>
    </div>
    <Carousel.Root class="reveal mt-12 w-full md:w-1/2" opts={{loop: true, align: "center"}} setApi={(emblaApi) => (carouselAPI = emblaApi)}>
        <Carousel.Content>
            {#each partners as partner (partner.name)}
            <Carousel.Item>
                <div class="flex flex-col overflow-hidden rounded-xl bg-background text-foreground shadow-md">
                    <img class="h-40 w-full object-contain" src={partner.image} alt={partner.name}/>
                    <div class="flex flex-1 flex-col p-6">
                        <h3 class="text-2xl">{partner.name}</h3>
                        <p class="mt-2 flex-1 text-muted-foreground">{partner.text}</p>
                        <a class="mt-4 inline-flex w-fit items-center gap-1 font-semibold text-secondary hover:underline transition-colors" target="_blank" rel="noopener" href={partner.href}>
                            Learn more <Icon icon="solar:arrow-right-up-linear"/>
                        </a>
                    </div>
                </div>
            </Carousel.Item>
        {/each}
        </Carousel.Content>
    </Carousel.Root>
    <span class="mt-4 flex items-center gap-2">
        {#each scrollSnaps as _, index}
        <button class="size-4 rounded-full border-2 border-accent {selectedSnap === index ? 'bg-accent' : 'bg-transparent'}" aria-label="Go to slide {index + 1}" aria-pressed={selectedSnap === index} onclick={() => carouselAPI.scrollTo(index)}></button>
        {/each}
    </span>
</section>

<!-- Kiwanis sponsor -->
<section class="w-full bg-background text-foreground">
    <div class="reveal flex flex-col justify-center p-8 md:p-14 w-full md:w-1/2 mx-auto">
        <span class="text-secondary">OUR SPONSOR</span>
        <h2 class="mt-2 text-4xl md:text-5xl">The Kiwanis of Mill Creek</h2>
        <p class="mt-6 text-lg md:text-xl">
            JHS Key Club is sponsored by the Kiwanis of Mill Creek. Kiwanis is an international community of clubs
            dedicated to serving their community and improving the lives of children around them.
        </p>
        <div class="mt-4 mx-auto">
            <Button class="w-fit" size="lg" variant="secondary" href="https://k19352.site.kiwanis.org/" target="_blank">
                <Icon icon="solar:link-bold" class="size-4"/>
                Kiwanis of Mill Creek website
            </Button>
        </div>
    </div>
</section>

<Footer/>
