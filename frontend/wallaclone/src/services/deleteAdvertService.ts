const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function deleteAdvert(advertId: string): Promise<void> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No se ha podido validar la sesión");
    }

    const response = await fetch(`${API_BASE_URL}/adverts/${advertId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se ha podido borrar el anuncio",
        );
    }
}
