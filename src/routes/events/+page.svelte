<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Icon from "@iconify/svelte";
    import {onMount} from "svelte";

    const calendarSrc = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&showPrint=0&showTz=0&showCalendars=0&src=ZjIzOGY1NzgyYWIwNjg5M2FhMGQ0MzM3YWNhZjBkZjg5ZDU3YTI4ZDI0NTk1OGMyZGIyNzc0Mjc5OWNlMzgzNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F4511E";

    onMount(() => {
        document.title = "Events";
    });
</script>

<Header/>

<section class="relative flex h-[34vh] w-full items-center justify-center overflow-hidden text-center">
    <img class="absolute inset-0 h-full w-full object-cover brightness-[.4]" src="/faz.webp" alt=""/>
    <div class="absolute inset-0 bg-kcblue/40"></div>
    <div class="relative z-10 px-6">
        <h1 class="font-display text-5xl italic text-kcyellow md:text-7xl">Events</h1>
        <p class="mt-3 text-lg text-stone-200 md:text-xl">Find your next opportunity to serve</p>
    </div>
</section>

<section class="w-full bg-stone-200 px-6 py-14 text-kcblack">
    <div class="mx-auto max-w-5xl">
        <div class="flex items-start gap-3 rounded-xl border border-kcblue/30 bg-white p-5">
            <Icon icon="solar:info-circle-bold" class="mt-0.5 size-6 shrink-0 text-kcblue"/>
            <p>
                Add a specific event &mdash; or the whole calendar &mdash; to your personal Google Calendar to open the
                event sign-up sheet. Tap an event below for details.
            </p>
        </div>

        <div class="mt-8 overflow-hidden rounded-2xl border-4 border-kcyellow bg-white shadow-lg">
            <iframe
                title="JHS Key Club events calendar"
                src={calendarSrc}
                class="h-[70vh] min-h-[520px] w-full"
                loading="lazy"
            ></iframe>
        </div>

        <p class="mt-6 text-center text-stone-600">
            Don't see what you're looking for? Follow us on
            <a class="font-semibold text-kcblue hover:underline" target="_blank" rel="noopener" href="https://www.instagram.com/jhskeyclub21">Instagram</a>
            for the latest announcements.
        </p>
    </div>
</section>

<Footer/>
