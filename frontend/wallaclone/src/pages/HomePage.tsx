import { useEffect, useState, type SyntheticEvent } from "react";
import AdvertCard from "../components/adverts/AdvertCard";
import {
    getAdverts,
    type Advert,
    type GetAdvertsParams,
} from "../services/advertService";

function HomePage() {
    const [adverts, setAdverts] = useState<Advert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchName, setSearchName] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [tag, setTag] = useState("");
    const [hasActiveSearch, setHasActiveSearch] = useState(false);

    async function loadAdverts(params: GetAdvertsParams = {}) {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const data = await getAdverts({
                ...params,
                limit: 12,
                page: 1,
            });

            setAdverts(data.content);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "No se han podido cargar los anuncios",
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadAdverts();
    }, []);

    function handleSearchSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const hasSearch =
            searchName.trim() ||
            minPrice.trim() ||
            maxPrice.trim() ||
            tag.trim();

        setHasActiveSearch(Boolean(hasSearch));

        void loadAdverts({
            name: searchName,
            minPrice,
            maxPrice,
            tag,
        });
    }

    function handleClearSearch() {
        setSearchName("");
        setMinPrice("");
        setMaxPrice("");
        setTag("");
        setHasActiveSearch(false);

        void loadAdverts();
    }

    return (
        <section className="min-h-full bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {hasActiveSearch
                            ? "Resultados de búsqueda"
                            : "Últimos anuncios publicados"}
                    </h1>
                    <p className="mt-2 text-base text-gray-600">
                        Encuentra artículos de segunda mano o publica lo que ya no
                        necesitas
                    </p>
                </div>

                <form
                    onSubmit={handleSearchSubmit}
                    className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label
                                htmlFor="searchName"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Nombre del artículo
                            </label>
                            <input
                                id="searchName"
                                type="text"
                                value={searchName}
                                onChange={(event) =>
                                    setSearchName(event.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7]"
                                placeholder="Ej. iPhone"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="minPrice"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Precio mínimo
                            </label>
                            <input
                                id="minPrice"
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(event) =>
                                    setMinPrice(event.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7]"
                                placeholder="Ej. 50"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="maxPrice"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Precio máximo
                            </label>
                            <input
                                id="maxPrice"
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(event) =>
                                    setMaxPrice(event.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7]"
                                placeholder="Ej. 500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="tag"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Tag
                            </label>
                            <input
                                id="tag"
                                type="text"
                                value={tag}
                                onChange={(event) => setTag(event.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7]"
                                placeholder="Ej. movil"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="submit"
                            className="rounded-md bg-[#00bba7] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689]"
                        >
                            Buscar
                        </button>

                        {hasActiveSearch && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </div>
                </form>

                {isLoading && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                        Cargando anuncios...
                    </div>
                )}

                {!isLoading && errorMessage && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && !errorMessage && adverts.length === 0 && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                        {hasActiveSearch
                            ? "No se han encontrado anuncios con esos criterios"
                            : "Todavía no hay anuncios publicados"}
                    </div>
                )}

                {!isLoading && !errorMessage && adverts.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {adverts.map((advert) => (
                            <AdvertCard key={advert.id} advert={advert} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default HomePage;
