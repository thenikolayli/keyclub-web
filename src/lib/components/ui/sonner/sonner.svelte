<script lang="ts">
  import {
    Toaster as Sonner,
    type ToasterProps as SonnerProps,
  } from "svelte-sonner";
  import { mode } from "mode-watcher";
  import Icon from "@iconify/svelte";

  let { ...restProps }: SonnerProps = $props();
</script>

<Sonner
  theme={mode.current}
  class="toaster group"
  toastOptions={{
    classes: {
      toast: "!bg-background !text-foreground !border-2 !border-primary",
    },
  }}
  {...restProps}
>
  {#snippet loadingIcon()}
    <Icon
      icon="svg-spinners:ring-resize"
      class="size-4"
      data-icon="inline-start"
    />
  {/snippet}
  {#snippet successIcon()}
    <Icon icon="solar:check-circle-linear" class="size-4" />
  {/snippet}
  {#snippet errorIcon()}
    <Icon icon="solar:close-circle-linear" class="size-4" />
  {/snippet}
  {#snippet infoIcon()}
    <Icon icon="solar:info-circle-linear" class="size-4" />
  {/snippet}
  {#snippet warningIcon()}
    <Icon icon="solar:danger-triangle-linear" class="size-4" />
  {/snippet}
</Sonner>
