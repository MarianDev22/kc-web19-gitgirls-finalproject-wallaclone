import type { Advert } from "./advertService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function updateAdvertStatus(
    advertId: string,
    status: Advert["status"],
): Promise<Advert> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No se ha podido validar la sesión");
    }

    const response = await fetch(`${API_BASE_URL}/adverts/${advertId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ??
            data?.error ??
            "No se ha podido actualizar el estado del anuncio",
        );
    }

    return data;
}
