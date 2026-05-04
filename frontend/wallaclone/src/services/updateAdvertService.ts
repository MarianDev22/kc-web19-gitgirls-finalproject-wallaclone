const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export type UpdateAdvertPayload = {
    name?: string;
    description?: string;
    price?: number;
    isSale?: boolean;
    image?: string;
    tags?: string[];
};

export async function updateAdvert(
    advertId: string,
    advertData: UpdateAdvertPayload,
): Promise<void> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No se ha podido validar la sesión");
    }

    const response = await fetch(`${API_BASE_URL}/adverts/${advertId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(advertData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se ha podido actualizar el anuncio",
        );
    }
}
