<script lang="ts">
  import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
  import { cn } from "$lib/utils.js";
  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: NavigationMenuPrimitive.LinkProps = $props();
</script>

<NavigationMenuPrimitive.Link
  bind:ref
  data-slot="navigation-menu-link"
  class={cn(
    "data-[active=true]:focus:bg-secondary/30 data-[active=true]:hover:bg-secondary/30 data-[active=true]:bg-secondary/30 focus-visible:ring-ring/50 hover:bg-secondary/30 focus:bg-secondary/30 flex items-center gap-1.5 rounded-md p-2 text-sm transition-all outline-none focus-visible:ring-3 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4 in-data-[slot=navigation-menu-content]:rounded-sm",
    className,
  )}
  {...restProps}
/>
