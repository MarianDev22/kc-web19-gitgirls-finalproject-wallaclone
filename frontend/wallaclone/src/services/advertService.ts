const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export type Advert = {
    id: string;
    name: string;
    description: string;
    price: number;
    isSale: boolean;
    image: string;
    tags: string[];
    status: "AVAILABLE" | "RESERVED" | "SOLD";
    ownerId: string;
    owner?: {
        id: string;
        username?: string;
    };
};

type GetAdvertsResponse = {
    content: Advert[];
    total: number;
    page: number;
    limit: number;
};

export async function getLatestAdverts(): Promise<GetAdvertsResponse> {
    const response = await fetch(`${API_BASE_URL}/adverts?limit=12&page=1`);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se han podido cargar los anuncios",
        );
    }

    return data;
}
