<script lang="ts">
  import { userState } from "$lib/stores/user.svelte";
  import * as Tabs from "$lib/components/ui/tabs";
  import InviteTab from "$lib/components/tabs/InviteTab.svelte";
  import InvitesTab from "$lib/components/tabs/InvitesTab.svelte";
  import AuthGuard from "$lib/components/AuthGuard.svelte";
  import CalendarTab from "$lib/components/tabs/CalendarTab.svelte";
  import UsersTab from "$lib/components/tabs/UsersTab.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  const tabs = [
    {
      id: "invite",
      label: "Invite",
      component: InviteTab,
      roles: ["officer"],
    },
    {
      id: "invites",
      label: "Invites",
      component: InvitesTab,
      roles: ["officer"],
    },
    {
      id: "add-to-calendar",
      label: "Add to Calendar",
      component: CalendarTab,
      roles: ["officer", "leader"],
    },
    {
      id: "users",
      label: "Users",
      component: UsersTab,
      roles: ["officer"],
    },
  ];
  let tab = $derived(page.url.searchParams.get("tab") || "");

  const visibleTabs = $derived(
    tabs.filter((tab) => tab.roles.includes(userState.user?.role || "")),
  );

  function changeTab(newTab: string) {
    const newParams = new URLSearchParams(page.url.searchParams.toString());
    newParams.set("tab", newTab);
    goto(`?${newParams.toString()}`, {
      keepFocus: true,
      noScroll: true,
    });
  }

  onMount(() => {
    document.title = "Dashboard - Admin";
    console.log(tab);
  });
</script>

<AuthGuard>
  <div class="mx-auto max-w-5xl px-6 py-8">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold tracking-tight text-stone-100">
        Hello, {userState.user?.firstName}
      </h1>
      <p class="mt-1 text-sm text-stone-400 italic">
        {userState.user?.role}
      </p>
    </header>

    <Tabs.Root value={tab} onValueChange={(newTab) => changeTab(newTab)}>
      <Tabs.List variant="line" class="mb-6">
        {#each visibleTabs as tab}
          <Tabs.Trigger value={tab.id}>{tab.label}</Tabs.Trigger>
        {/each}
      </Tabs.List>

      {#each visibleTabs as tab}
        <Tabs.Content value={tab.id}>
          <tab.component />
        </Tabs.Content>
      {/each}
    </Tabs.Root>
  </div>
</AuthGuard>
