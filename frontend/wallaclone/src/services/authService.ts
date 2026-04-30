const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

type RegisterUserData = {
    username: string;
    email: string;
    password: string;
};

type AuthUser = {
    id: string;
    username: string;
    email: string;
};

type RegisterUserResponse = {
    message: string;
    token: string;
    user: AuthUser;
};

export async function registerUser(
    userData: RegisterUserData,
): Promise<RegisterUserResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se ha podido completar el registro",
        );
    }

    return data;
}
