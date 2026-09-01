<script lang="ts">
    import { onMount } from "svelte";
    import {Separator} from "$lib/components/ui/separator/index";
    import * as Card from "$lib/components/ui/card/index";
    import {Input} from "$lib/components/ui/input/index";
    import { invite } from "./invite.remote";
    import * as Select from "$lib/components/ui/select/index";
    import {Button} from "$lib/components/ui/button/index";
    import * as Alert from "$lib/components/ui/alert/index";
    import Icon from "@iconify/svelte";

    onMount(() => {
        document.title = "Beekeper - Invites";
    });
</script>

<section class="flex flex-col text-foreground">
    <div class="w-fit flex flex-col gap-1">
        <h1 class="text-3xl font-semibold tracking-tight">
            Invites
        </h1>
        <p class="text-md text-muted-foreground capitalize">
            Invite someone to give them access to the Beekeper admin panel.
        </p>
        <Separator />
    </div>
    <section class="flex flex-wrap p-4 gap-4">
        <div class="flex w-full max-w-md flex-col gap-4">
            <form {...invite}>
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Create Invite</Card.Title>
                    </Card.Header>
                    <Card.Content class="flex flex-col gap-2">
                        <Input type="email" placeholder="Email" {...invite.fields.email.as("text")} />
                        <!-- There has to be a hidden input because the form requires a navite form element -->
                        <input
                            type="hidden"
                            name="role"
                            value={invite.fields.role.value() ?? ""}
                        />
                        <Select.Root type="single" onValueChange={(value) => invite.fields.role.set(value)}>
                            <Select.Trigger class="capitalize">
                                {invite.fields.role.value() === undefined ? "Role" : invite.fields.role.value()}
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="member">Member</Select.Item>
                                <Select.Item value="leader">Leader</Select.Item>
                                <Select.Item value="officer">Officer</Select.Item>
                            </Select.Content>
                        </Select.Root>
                        <Button type="submit" class="mt-2" variant="default" disabled={invite.pending > 0}>
                            {#if invite.pending > 0}
                                <Icon icon="svg-spinners:ring-resize" data-icon="inline-start"/>
                                Inviting...
                            {:else}
                                Invite
                            {/if}
                        </Button>
                    </Card.Content>
                </Card.Root>
            </form>
            {#if invite.result && invite.result.ok}
                <Alert.Root>
                    <Icon icon="solar:check-bold" class="size-7" />
                    <Alert.Title>Invite created successfully</Alert.Title>
                    <Alert.Description>
                        Please tell the user to check their email and finish creating their account.
                    </Alert.Description>
                </Alert.Root>
            {:else if invite.result && !invite.result.ok}
                <Alert.Root variant="destructive">
                    <Icon icon="solar:danger-triangle-bold" class="size-7" />
                    <Alert.Title>{invite.result.error}</Alert.Title>
                </Alert.Root>
            {/if}
        </div>
        <div class="w-full max-w-4xl flex-1 min-w-[20rem]">
            <Card.Root>
                <Card.Header>
                    <Card.Title>
                        Roles and Permissions
                    </Card.Title>
                </Card.Header>
                <Card.Content>
                    <p>
                        There are currently three roles available: <strong>member</strong>, <strong>leader</strong>, and <strong>officer</strong>.
                    </p>
                    <br>
                    Members do not have access to any tools.
                    Leaders have access only to the following tools:
                    <ul class="list-disc list-inside">
                        <li>Dashboard</li>
                        <li>Adding events to calendar</li>
                        <li>Viewing member information</li>
                    </ul>
                    <br>
                    Officers have access to all leader tools plus the following:
                    <ul class="list-disc list-inside">
                        <li>Logging events</li>
                        <li>Creating invites</li>
                    </ul>
                </Card.Content>
            </Card.Root>
        </div>
    </section>
</section>
