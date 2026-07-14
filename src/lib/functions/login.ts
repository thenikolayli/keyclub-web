import { PUBLIC_API_URL } from "$env/static/public";


// private function to start the login process
async function loginStart(email: string) {
    const response = await fetch(`${PUBLIC_API_URL}/auth/login/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: email }),
    });

    if (!response.ok) throw new Error(`Server responded ${response.status}`);
}
// private function to wait for the login process to complete
async function loginWait() {
    const response = await fetch(`${PUBLIC_API_URL}/auth/login/wait`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!response.ok) throw new Error(`Server responded ${response.status}`);
}


// all in one login function
export async function login(email: string) {
    try {
        await loginStart(email);
        await loginWait();
    } catch (error) {
        return Promise.reject(error);
    }

    return Promise.resolve();
}

export async function verifyLogin(token: string) {
    const response = await fetch(`${PUBLIC_API_URL}/auth/login/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
    });

    if (!response.ok) throw new Error(`Server responded ${response.status}`);
}