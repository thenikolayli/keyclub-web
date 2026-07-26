import { PUBLIC_API_URL } from "$env/static/public";

export interface inviteRequest {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export async function inviteCreate(request: inviteRequest) {
    const response = await fetch(`${PUBLIC_API_URL}/auth/invite/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(request),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
}

export async function inviteAccept(token: string) {
    const response = await fetch(`${PUBLIC_API_URL}/auth/invite/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({token}),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
}