<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Icon from "@iconify/svelte";
    import {onMount} from "svelte";
    import ImageHeader from "$lib/components/ImageHeader.svelte";
    import * as Carousel from "$lib/components/ui/carousel/index";
    import type { CarouselAPI } from "$lib/components/ui/carousel/context";
    import {Button} from "$lib/components/ui/button/index";
    import {reveal} from "$lib/reveal";

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

    const advisors = [
        {name: "Alfred Cain", role: "Faculty Advisor", email: "acain@everettsd.org", image: "/about/mrcain.png"},
        {name: "Rachel Vaught", role: "Faculty Advisor", email: "rvaught@everettsd.org", image: "/about/mrsvaught.jpg"},
        {name: "John Steckler", role: "Kiwanis Advisor", email: "johnsteckler@comcast.net", image: "/about/mrsteckler.png"},
        {name: "Lisa Steckler", role: "Kiwanis Advisor", email: "stecklerlisa@gmail.com", image: "/about/mrssteckler.png"},
        {name: "Ryan Tran", role: "D21 Lieutenant Governor", email: "ltg21@pnwkeyclub.org", image: "/about/ryan.png"},
        {name: "Willian Badiang", role: "Spirit Chair", email: "willbadiang16@gmail.com", image: "/about/willb.jpg"},
        {name: "Sorin Bulgannawar", role: "Leadership Chair", email: "sorinbulgannawar2009@outlook.com", image: "/about/baksus.jpg"}
    ]

    const partners = [
        {name: "Thirst Project", href: "https://thirstproject.org/", text: "Educating the next generation about the global water crisis and how they can be part of social change.", image: "/about/thirst_project.svg"},
        {name: "UNICEF", href: "https://www.unicef.org/", text: "The only United Nations organization dedicated exclusively to children, providing for their needs in more than 150 countries.", image: "/about/unicef.png"},
        {name: "Erika's Lighthouse", href: "https://erikaslighthouse.org/", text: "Making sure no young person feels alone in their depression, breaking down the stigma around mental health.", image: "/about/erikas_lighthouse.webp"},
        {name: "Schoolhouse", href: "https://schoolhouse.world/key-club", text: "Free peer tutoring for learners across the world — learn something new, or become a tutor yourself.", image: "/about/schoolhouse.jpg"},
        {name: "Collegewise", href: "https://collegewise.com/", text: "College and test-prep guidance, with a suite of Runway resources free for every Key Club member.", image: "/about/collegewise.svg"},
    ]

    let carouselAPI = $state<CarouselAPI>()
    let scrollSnaps = $state<number[]>([])
    let selectedSnap = $state(0)

    onMount(() => {
        document.title = "About";
    })

    $effect(() => {
        if (carouselAPI) {
            scrollSnaps = carouselAPI.scrollSnapList()
            carouselAPI.on("select", () => selectedSnap = carouselAPI?.selectedScrollSnap() ?? 0)
        }
    })
</script>

<Header/>

<ImageHeader imagePath="/about.jpg" title="About Us" description="The people and partners behind JHS Key Club" pageTitle="About"/>

<!-- Officers -->
<section class="w-full bg-foreground px-8 py-20">
    <div class="mx-auto max-w-6xl">
        <div use:reveal class="text-center">
            <h2 class="text-4xl text-background md:text-5xl">Meet The Officers</h2>
            <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                The one's running the show.
            </p>
        </div>

        <div use:reveal class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {#each officers as officer (officer.email)}
                <div class="flex flex-col items-center text-center">
                    <img class="aspect-square w-full border-8 border-primary object-cover" src={officer.image} alt={officer.name}/>
                    <h3 class="font-bold-gothic mt-4 text-2xl text-primary">{officer.name}</h3>
                    <p class="text-lg text-background">{officer.role}</p>
                    <a class="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-background transition-colors" href="mailto:{officer.email}">
                        <Icon icon="fe:mail"/><span>{officer.email}</span>
                    </a>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Advisors -->
<section class="w-full bg-background px-8 py-20 text-foreground">
    <div class="mx-auto max-w-6xl">
        <div use:reveal class="text-center">
            <h2 class="text-4xl md:text-5xl">Advisors & More</h2>
            <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                The adults and leaders who guide our chapter and connect us to the wider Key Club family.
            </p>
        </div>

        <div use:reveal class="mt-12 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {#each advisors as advisor (advisor.email)}
                <div class="flex w-full flex-col items-center text-center">
                    <img class="aspect-square w-full border-8 border-secondary object-cover" src={advisor.image} alt={advisor.name}/>
                    <h3 class="font-bold-gothic mt-4 text-2xl text-secondary">{advisor.name}</h3>
                    <span class="text-foreground">{advisor.role}</span>
                    <a class="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors" href="mailto:{advisor.email}">
                        <Icon icon="fe:mail"/><span>{advisor.email}</span>
                    </a>
                </div>
            {/each}
        </div>
    </div>
</section>

<!-- Partners -->
<section class="w-full bg-secondary px-8 py-20 text-background flex flex-col items-center">
    <div use:reveal class="text-center">
        <h2 class="text-4xl md:text-5xl">Preferred Partners & Charities</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">The organizations we proudly support and partner with.</p>
    </div>
    <div use:reveal class="flex justify-center items-center w-full">
        <Carousel.Root class="mx-auto mt-12 w-full max-w-3xl" opts={{loop: true, align: "center"}} setApi={(emblaApi) => (carouselAPI = emblaApi)}>
            <Carousel.Content class="select-none">
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
    </div>
    <span class="mt-4 flex items-center gap-2">
        {#each scrollSnaps as _, index}
        <button class="size-4 rounded-full border-2 border-background {selectedSnap === index ? 'bg-background' : 'bg-transparent'}" aria-label="Go to slide {index + 1}" aria-pressed={selectedSnap === index} onclick={() => carouselAPI?.scrollTo(index)}></button>
        {/each}
    </span>
</section>

<!-- Kiwanis sponsor -->
<section class="w-full bg-background text-foreground text-center py-20 flex flex-col justify-center px-8">
    <h2 use:reveal class="text-4xl md:text-5xl">The Kiwanis of Mill Creek</h2>
    <div use:reveal class="flex flex-col w-full max-w-2xl mx-auto">
        <p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Kiwanis is the parent organization of Key Club. The Kiwanis of Mill Creek are our sponsors!</p>
        <Button class="w-fit mx-auto mt-2" size="lg" variant="secondary" href="https://k19352.site.kiwanis.org/" target="_blank">
            <Icon icon="solar:link-bold" class="size-4"/>
            Kiwanis of Mill Creek website
        </Button>
        <span class="text-muted-foreground text-sm md:text-base mt-6">Fun fact: the "Key" in Key Club stands for Kiwanis Educating Youth!</span>
    </div>
</section>

<Footer/>
