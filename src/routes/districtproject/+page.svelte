<script lang="ts">
  import ImageHeader from "$lib/components/ImageHeader.svelte";
  import { reveal } from "$lib/reveal";
  import Button from "$lib/components/ui/button/button.svelte";
  import Icon from "@iconify/svelte";
</script>

<ImageHeader
  imagePath="/rmhc.jpg"
  title="The District Project"
  description="PNW Key Club's District Project"
  pageTitle="The District Project"
/>

<!-- What is DCON -->
<section
  class="grid w-full grid-cols-1 bg-stone-200 text-kcblack md:grid-cols-2 min-h-150"
>
  <div
    class="relative overflow-hidden order-2 md:order-1 aspect-square md:aspect-auto"
  >
    <img
      class="absolute inset-0 h-full w-full object-cover p-10"
      src="/rmhc_logo.png"
      alt="Ronald McDonald House Charities Logo"
    />
  </div>
  <div class="flex flex-col justify-center p-8 md:p-14 order-1 md:order-2">
    <div use:reveal>
      <span class="font-bold-gothic text-kcblue">WHAT IS IT?</span>
      <h2 class="mt-2 text-4xl md:text-5xl">Ronald McDonald House Charities</h2>
    </div>
    <p use:reveal class="mt-6 text-lg md:text-xl">
      McDonald House Charities (RMHC) provides essential housing, meals, and
      support to families with seriously ill or injured children receiving
      medical treatment at nearby hospitals. Offering a <span
        class="text-secondary">“home away from home,”</span
      >
      RMHC keeps families together during some of their most challenging times. As
      a Key Club member, you can directly support these families by volunteering or
      donating. Follow the link below to learn how to get involved and explore ways
      to give, whether it be fulfilling a wishlist or making a direct donation.
    </p>
    <div class="mt-4">
      <Button
        class="w-fit mx-auto mt-2"
        size="lg"
        variant="secondary"
        href="https://rmhcseattle.org/get-involved/volunteer/individual-volunteering/"
        target="_blank"
      >
        <Icon icon="solar:link-bold" class="size-4" />
        Volunteer
      </Button>
      <Button
        class="w-fit mx-auto mt-2"
        size="lg"
        variant="secondary"
        href="https://rmhcseattle.org/?form=give"
        target="_blank"
      >
        <Icon icon="solar:link-bold" class="size-4" />
        Donate
      </Button>
    </div>
  </div>
</section>
