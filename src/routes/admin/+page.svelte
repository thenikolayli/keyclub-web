<script lang="ts">
  import { userState } from "$lib/stores/user.svelte";
  import * as Tabs from "$lib/components/ui/tabs";
  import MembersTab from "$lib/components/admin/tabs/MembersTab.svelte";
  import EventsTab from "$lib/components/admin/tabs/EventsTab.svelte";
  import AuthGuard from "$lib/components/AuthGuard.svelte";

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
    }
  ];

  const visibleTabs = $derived(
    tabs.filter(tab => tab.roles.includes(userState.user?.role || ''))
  );
</script>

<AuthGuard>
  <header class="border-b border-gray-200 p-4">
    <div class="flex items-center gap-2">
      <span class="font-medium">
        {userState.user?.firstName} {userState.user?.lastName}
      </span>
      <span class="text-sm text-gray-600">
        ({userState.user?.role})
      </span>
    </div>
  </header>

  <Tabs.Root value={visibleTabs[0]?.id}>
  <Tabs.List class="mb-4">
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
</AuthGuard>