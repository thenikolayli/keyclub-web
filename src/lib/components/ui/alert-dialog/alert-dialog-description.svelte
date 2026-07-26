<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AlertDialogPrimitive.DescriptionProps = $props();
</script>

<AlertDialogPrimitive.Description
	bind:ref
	data-slot="alert-dialog-description"
	class={cn("text-stone-400 *:[a]:hover:text-stone-100 text-sm text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3", className)}
	{...restProps}
/>
