<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button/index";
  import { Badge } from "$lib/components/ui/badge/index";
  import * as Alert from "$lib/components/ui/alert/index";
  import { listInvites, type Invite } from "$lib/functions/invite";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import Mail from "@lucide/svelte/icons/mail";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";
  import CheckCircle from "@lucide/svelte/icons/check-circle";
  import Clock from "@lucide/svelte/icons/clock";

  let invites = $state<Invite[]>([]);
  let status = $state<"idle" | "loading" | "error" | "success">("idle");
  let errorMsg = $state("");

  onMount(() => {
    fetchInvites();
  });

  async function fetchInvites() {
    status = "loading";
    errorMsg = "";
    try {
      invites = await listInvites(0, 100);
      status = "success";
    } catch (error) {
      errorMsg =
        error instanceof Error ? error.message : "Failed to load invites.";
      status = "error";
    }
  }

  const roleBadgeVariant: Record<string, string> = {
    officer: "default",
    leader: "secondary",
    member: "outline",
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
</script>

<div class="mx-auto max-w-5xl">
  <div class="rounded-2xl border border-stone-700 bg-stone-900 shadow-lg">
    <div
      class="flex items-center gap-3 border-b border-stone-700 px-8 pb-3 pt-8"
    >
      <div
        class="flex size-10 items-center justify-center rounded-lg bg-primary/10"
      >
        <Mail class="size-5 text-primary" />
      </div>
      <div>
        <h3 class="font-bold-gothic text-xl text-stone-100">Invites</h3>
        <p class="text-sm text-stone-400">View all sent invitations</p>
      </div>
    </div>

    {#if status === "loading"}
      <div class="flex items-center justify-center py-16">
        <LoaderCircle class="size-8 animate-spin text-stone-400" />
      </div>
    {:else if status === "error"}
      <div class="p-8">
        <Alert.Root variant="destructiveOutline">
          <TriangleAlert class="size-5" />
          <Alert.Title>{errorMsg}</Alert.Title>
        </Alert.Root>
        <Button variant="outline" class="mt-4" onclick={fetchInvites}
          >Retry</Button
        >
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-stone-300">
          <thead>
            <tr
              class="border-b border-stone-700 text-xs uppercase tracking-wider text-stone-500"
            >
              <th class="px-6 py-4 font-medium">Email</th>
              <th class="px-6 py-4 font-medium">First Name</th>
              <th class="px-6 py-4 font-medium">Last Name</th>
              <th class="px-6 py-4 font-medium">Role</th>
              <th class="px-6 py-4 font-medium">Created</th>
              <th class="px-6 py-4 font-medium">Expires</th>
              <th class="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {#each invites as invite}
              <tr
                class="border-b border-stone-800 transition-colors hover:bg-stone-800/50"
              >
                <td class="px-6 py-3 text-stone-100">{invite.email}</td>
                <td class="px-6 py-3 text-stone-300">{invite.firstName}</td>
                <td class="px-6 py-3 text-stone-300">{invite.lastName}</td>
                <td class="px-6 py-3">
                  <Badge>
                    {invite.role}
                  </Badge>
                </td>
                <td class="px-6 py-3 text-stone-400"
                  >{formatDate(invite.createdAt)}</td
                >
                <td class="px-6 py-3 text-stone-400"
                  >{formatDate(invite.expiresAt)}</td
                >
                <td class="px-6 py-3">
                  {#if invite.acceptedAt}
                    <span class="inline-flex items-center gap-1 text-green-400">
                      <CheckCircle class="size-4" />
                      Accepted
                    </span>
                  {:else}
                    <span class="inline-flex items-center gap-1 text-amber-400">
                      <Clock class="size-4" />
                      Pending
                    </span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>

        {#if invites.length === 0}
          <div class="py-16 text-center text-stone-500">No invites found.</div>
        {/if}
      </div>
    {/if}
  </div>
</div>
