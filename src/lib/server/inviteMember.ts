import type { InviteRequest } from "$lib/types/invites";
import { supabaseAdmin } from "$lib/db/admin";
import type { Result } from "$lib/types/responses";

// sends an email to the member to invite and creates a profile for them
export const inviteMember = async (
  inviteRequest: InviteRequest,
): Promise<Result<null>> => {
  // you can check the default email link in the supabase dashboard.
  // "{{ .SiteURL }}/admin/accept-invite?token={{ .TokenHash }}"
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    inviteRequest.email,
  );
  if (error) {
    return { ok: false, error: error };
  }

  const { error: insertError } = await supabaseAdmin.from("profiles").insert({
    first_name: inviteRequest.firstName,
    last_name: inviteRequest.lastName,
    email: inviteRequest.email,
    role: inviteRequest.role,
    user_id: data.user!.id,
  });
  if (insertError) {
    return { ok: false, error: new Error(insertError.message) };
  }

  return { ok: true, data: null };
};
