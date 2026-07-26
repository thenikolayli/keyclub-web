<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button/index";
  import { Badge } from "$lib/components/ui/badge/index";
  import * as Alert from "$lib/components/ui/alert/index";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index";
  import {
    listUsers,
    deleteUser,
    updateUser,
    type User,
    type UpdateUserRequest,
  } from "$lib/functions/users";
  import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
  import Trash2 from "@lucide/svelte/icons/trash-2";
  import Pencil from "@lucide/svelte/icons/pencil";
  import Users from "@lucide/svelte/icons/users";
  import Check from "@lucide/svelte/icons/check";
  import X from "@lucide/svelte/icons/x";
  import LoaderCircle from "@lucide/svelte/icons/loader-circle";

  let users = $state<User[]>([]);
  let status = $state<"idle" | "loading" | "error" | "success">("idle");
  let errorMsg = $state("");

  let editingId = $state<string | null>(null);
  let editEmail = $state("");
  let editFirstName = $state("");
  let editLastName = $state("");
  let editRole = $state("");

  let deleteDialogOpen = $state(false);
  let deletingUserId = $state<string | null>(null);

  onMount(() => {
    fetchUsers();
  });

  async function fetchUsers() {
    status = "loading";
    errorMsg = "";
    try {
      users = await listUsers(0, 100);
      status = "success";
    } catch (error) {
      errorMsg =
        error instanceof Error ? error.message : "Failed to load users.";
      status = "error";
    }
  }

  function startEdit(user: User) {
    editingId = user.id;
    editEmail = user.email;
    editFirstName = user.firstName;
    editLastName = user.lastName;
    editRole = user.role;
  }

  function cancelEdit() {
    editingId = null;
  }

  async function saveEdit(user: User) {
    const original: UpdateUserRequest = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
    const updated: UpdateUserRequest = {
      email: editEmail.trim(),
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      role: editRole,
    };

    if (
      original.email === updated.email &&
      original.firstName === updated.firstName &&
      original.lastName === updated.lastName &&
      original.role === updated.role
    ) {
      editingId = null;
      return;
    }

    try {
      await updateUser(user.id, updated);
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updated };
      }
      editingId = null;
    } catch (error) {
      errorMsg =
        error instanceof Error ? error.message : "Failed to update user.";
    }
  }

  function confirmDelete(user: User) {
    deletingUserId = user.id;
    deleteDialogOpen = true;
  }

  async function handleDelete() {
    if (!deletingUserId) return;
    try {
      await deleteUser(deletingUserId);
      users = users.filter((u) => u.id !== deletingUserId);
    } catch (error) {
      errorMsg =
        error instanceof Error ? error.message : "Failed to delete user.";
    }
    deleteDialogOpen = false;
    deletingUserId = null;
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
        <Users class="size-5 text-primary" />
      </div>
      <div>
        <h3 class="font-bold-gothic text-xl text-stone-100">Users</h3>
        <p class="text-sm text-stone-400">Manage all registered users</p>
      </div>
    </div>

    {#if status === "loading"}
      <div class="flex items-center justify-center py-16">
        <LoaderCircle class="size-8 animate-spin text-stone-400" />
      </div>
    {:else if status === "error"}
      <div class="p-8">
        <Alert.Root variant="destructive">
          <TriangleAlert class="size-5" />
          <Alert.Title>{errorMsg}</Alert.Title>
        </Alert.Root>
        <Button variant="outline" class="mt-4" onclick={fetchUsers}
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
              <th class="px-6 py-4 font-medium">First Name</th>
              <th class="px-6 py-4 font-medium">Last Name</th>
              <th class="px-6 py-4 font-medium">Email</th>
              <th class="px-6 py-4 font-medium">Role</th>
              <th class="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each users as user (user.id)}
              <tr
                class="border-b border-stone-800 transition-colors hover:bg-stone-800/50"
              >
                {#if editingId === user.id}
                  <td class="px-6 py-3">
                    <div class="flex gap-2">
                      <input
                        bind:value={editFirstName}
                        placeholder="First name"
                        class="w-28 rounded-md border border-stone-600 bg-stone-800 px-2.5 py-1.5 text-sm text-stone-200 outline-none transition-colors focus:border-primary"
                      />
                      <input
                        bind:value={editLastName}
                        placeholder="Last name"
                        class="w-28 rounded-md border border-stone-600 bg-stone-800 px-2.5 py-1.5 text-sm text-stone-200 outline-none transition-colors focus:border-primary"
                      />
                    </div>
                  </td>
                  <td class="px-6 py-3">
                    <input
                      bind:value={editEmail}
                      placeholder="Email"
                      class="w-full rounded-md border border-stone-600 bg-stone-800 px-2.5 py-1.5 text-sm text-stone-200 outline-none transition-colors focus:border-primary"
                    />
                  </td>
                  <td class="px-6 py-3">
                    <select
                      bind:value={editRole}
                      class="rounded-md border border-stone-600 bg-stone-800 px-2.5 py-1.5 text-sm text-stone-200 outline-none transition-colors focus:border-primary"
                    >
                      <option value="member">member</option>
                      <option value="leader">leader</option>
                      <option value="officer">officer</option>
                    </select>
                  </td>
                  <td class="px-6 py-3 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onclick={() => saveEdit(user)}
                      >
                        <Check class="size-4 text-green-400" />
                      </Button>
                      <Button size="icon" variant="ghost" onclick={cancelEdit}>
                        <X class="size-4 text-stone-400" />
                      </Button>
                    </div>
                  </td>
                {:else}
                  <td class="px-6 py-3 font-medium text-stone-100"
                    >{user.firstName}</td
                  >
                  <td class="px-6 py-3 font-medium text-stone-100"
                    >{user.lastName}</td
                  >
                  <td class="px-6 py-3 text-stone-400">{user.email}</td>
                  <td class="px-6 py-3">
                    <Badge>
                      {user.role}
                    </Badge>
                  </td>
                  <td class="px-6 py-3 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onclick={() => startEdit(user)}
                      >
                        <Pencil class="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onclick={() => confirmDelete(user)}
                      >
                        <Trash2 class="size-4 text-red-400" />
                      </Button>
                    </div>
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>

        {#if users.length === 0}
          <div class="py-16 text-center text-stone-500">No users found.</div>
        {/if}
      </div>

      {#if errorMsg}
        <div class="px-8 pb-6 pt-2">
          <Alert.Root variant="destructiveOutline">
            <TriangleAlert class="size-5" />
            <Alert.Title>{errorMsg}</Alert.Title>
          </Alert.Root>
        </div>
      {/if}
    {/if}
  </div>
</div>

<AlertDialog.Root bind:open={deleteDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This will permanently delete this user account. This action cannot be
        undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={handleDelete}>Delete</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
