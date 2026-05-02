import { useEffect, useState } from "react";
import AdvertCard from "../components/adverts/AdvertCard";
import { getLatestAdverts, type Advert } from "../services/advertService";

function HomePage() {
    const [adverts, setAdverts] = useState<Advert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadLatestAdverts() {
            try {
                const data = await getLatestAdverts();
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

        loadLatestAdverts();
    }, []);

    return (
        <section className="min-h-full bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Últimos anuncios publicados
                    </h1>
                    <p className="mt-2 text-base text-gray-600">
                        Encuentra artículos de segunda mano o publica lo que ya no necesitas
                    </p>
                </div>

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
                        Todavía no hay anuncios publicados
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
