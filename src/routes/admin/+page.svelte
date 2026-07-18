<script lang="ts">
  import { userState } from "$lib/stores/user.svelte";
  import * as Tabs from "$lib/components/ui/tabs";
  import MembersTab from "$lib/components/admin/tabs/MembersTab.svelte";
  import EventsTab from "$lib/components/admin/tabs/EventsTab.svelte";
  import InviteTab from "$lib/components/admin/tabs/InviteTab.svelte";
  import AuthGuard from "$lib/components/AuthGuard.svelte";
  import { onMount } from "svelte";

  const tabs = [
    {
      id: 'events',
      label: 'Events',
      component: EventsTab,
      roles: ['officer', 'leader']
    },
    {
      id: 'members',
      label: 'Members',
      component: MembersTab,
      roles: ['officer']
    },
    {
      id: 'invite',
      label: 'Invite',
      component: InviteTab,
      roles: ['officer']
    }
  ];

  const visibleTabs = $derived(
    tabs.filter(tab => tab.roles.includes(userState.user?.role || ''))
  );

  onMount(() => {
    document.title = "Dashboard - Admin";
  })
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

    <Tabs.Root value={visibleTabs[0]?.id}>
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