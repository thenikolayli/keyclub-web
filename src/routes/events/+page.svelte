<script>
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Icon from "@iconify/svelte";
    import {onMount} from "svelte";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import ImageHeader from "$lib/components/ImageHeader.svelte";

    const calendarSrc = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&showPrint=0&showTz=0&showCalendars=0&src=ZjIzOGY1NzgyYWIwNjg5M2FhMGQ0MzM3YWNhZjBkZjg5ZDU3YTI4ZDI0NTk1OGMyZGIyNzc0Mjc5OWNlMzgzNkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F4511E";
</script>

<Header/>

<ImageHeader imagePath="/events.jpg" title="Events" description="Find your next opportunity to serve" pageTitle="Events"/>

<section class="w-full bg-background px-6 py-14 text-foreground">
    <div class="mx-auto max-w-5xl">
        <div class="overflow-hidden rounded-2xl border-4 border-primary bg-background shadow-lg">
            <iframe
                title="JHS Key Club events calendar"
                src={calendarSrc}
                class="h-[70vh] min-h-[520px] w-full"
                loading="lazy"
            ></iframe>
        </div>

        <Alert.Root class="mt-8 max-w-md mx-auto">
            <Icon icon="solar:info-circle-bold" class="mt-0.5 size-6 shrink-0"/>
            <Alert.Title>
                Add a specific event &mdash; or the whole calendar &mdash; to your personal Google Calendar to open the
                event sign-up sheet. Tap an event below for details.
            </Alert.Title>
        </Alert.Root>
    </div>
</section>

<Footer/>
