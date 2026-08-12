export interface InviteRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: "member" | "leader" | "officer";
}
