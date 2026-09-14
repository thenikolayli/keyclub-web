<script lang="ts">
  import "../app.css";
  import { Toaster } from "$lib/components/ui/sonner/index";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { page } from "$app/state";

  let { children, data } = $props();

  const hideHeader = $derived(
    page.url.pathname.startsWith("/admin") ||
      page.url.pathname.startsWith("/signin") ||
      page.url.pathname.startsWith("/resetpassword") ||
      page.url.pathname.startsWith("/acceptinvite"),
  );
</script>

{#if !hideHeader}
  <Header profile={data.profile} />
{/if}
{@render children?.()}
{#if !hideHeader}
  <Footer />
{/if}
<Toaster position="bottom-center" />
