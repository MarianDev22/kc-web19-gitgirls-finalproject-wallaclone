const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

type ContactSellerResponse = {
    message: string;
};

type ApiErrorResponse = {
    error?: string;
};

export async function contactSeller(
    advertId: string,
    message: string,
    token: string,
): Promise<ContactSellerResponse> {
    const response = await fetch(`${API_BASE_URL}/adverts/${advertId}/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
    });

    const data = (await response.json()) as ContactSellerResponse & ApiErrorResponse;

    if (!response.ok) {
        throw new Error(data.error ?? "No se pudo enviar el mensaje");
    }

    return data;
}
