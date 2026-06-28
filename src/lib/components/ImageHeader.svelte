<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import {SplitText} from "gsap/SplitText";

    const {imagePath, title, description, pageTitle} = $props();
    let titleElement
    let descriptionElement

    onMount(() => {
        gsap.registerPlugin(SplitText);
        document.title = pageTitle;

        const titleText = SplitText.create(titleElement, {type: "chars"}).chars;

        gsap.from(titleText, {opacity: 0, y: 50, stagger: 1/10, duration: 0.4});
        gsap.from(descriptionElement, {opacity: 0, y: 50, duration: 0.5, delay: 0.3});
    });
</script>

<section class="relative flex h-[34vh] w-full items-center justify-center overflow-hidden text-center">
    <img class="absolute inset-0 h-full w-full object-cover brightness-[.4]" src={imagePath} alt=""/>
    <div class="absolute inset-0 bg-kcblue/40"></div>
    <div class="relative z-10 px-6">
        <h1 bind:this={titleElement} class="font-[abril] text-5xl italic text-kcyellow md:text-7xl">{title}</h1>
        <p bind:this={descriptionElement} class="mt-3 text-lg text-stone-200 md:text-xl">{description}</p>
    </div>
</section>