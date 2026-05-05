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

export type CreateAdvertPayload = {
    name: string;
    description: string;
    price: number;
    isSale: boolean;
    image: string;
    tags: string[];
};

export type GetAdvertsResponse = {
    content: Advert[];
    total: number;
    page: number;
    limit: number;
};

export type GetAdvertsParams = {
    name?: string;
    minPrice?: string;
    maxPrice?: string;
    tag?: string;
    page?: number;
    limit?: number;
};

function buildAdvertsQuery(params: GetAdvertsParams = {}) {
    const searchParams = new URLSearchParams();

    searchParams.set("limit", String(params.limit ?? 12));
    searchParams.set("page", String(params.page ?? 1));

    if (params.name?.trim()) {
        searchParams.set("name", params.name.trim());
    }

    if (params.minPrice?.trim()) {
        searchParams.set("minPrice", params.minPrice.trim());
    }

    if (params.maxPrice?.trim()) {
        searchParams.set("maxPrice", params.maxPrice.trim());
    }

    if (params.tag?.trim()) {
        searchParams.set("tag", params.tag.trim());
    }

    return searchParams.toString();
}

export async function getAdverts(
    params: GetAdvertsParams = {},
): Promise<GetAdvertsResponse> {
    const query = buildAdvertsQuery(params);

    const response = await fetch(`${API_BASE_URL}/adverts?${query}`);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se han podido cargar los anuncios",
        );
    }

    return data;
}

export async function getLatestAdverts(): Promise<GetAdvertsResponse> {
    return getAdverts({
        limit: 12,
        page: 1,
    });
}

export async function getAdvertById(advertId: string): Promise<Advert> {
    const response = await fetch(`${API_BASE_URL}/adverts/${advertId}`);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se ha podido cargar el anuncio",
        );
    }

    return data;
}

export async function createAdvert(advertData: CreateAdvertPayload): Promise<Advert> {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No se ha podido validar la sesión");
    }

    const response = await fetch(`${API_BASE_URL}/adverts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(advertData),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message ?? data?.error ?? "No se ha podido crear el anuncio",
        );
    }

    return data;
}
