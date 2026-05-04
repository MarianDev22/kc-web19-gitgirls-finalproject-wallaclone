import { Link } from "react-router-dom";
import type { Advert } from "../../services/advertService";

type AdvertCardProps = {
    advert: Advert;
};

function getAdvertStatusLabel(status: Advert["status"]) {
    const statusLabels = {
        AVAILABLE: "Disponible",
        RESERVED: "Reservado",
        SOLD: "Vendido",
    };

    return statusLabels[status] ?? status;
}

function getOwnerName(owner?: Advert["owner"]) {
    return owner?.username ?? "Usuario";
}

function AdvertCard({ advert }: AdvertCardProps) {
    return (
        <Link
            to={`/adverts/${advert.id}`}
            className="block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00bba7] focus:ring-offset-2"
            aria-label={`Ver detalle de ${advert.name}`}
        >
            <article>
                <div className="h-48 bg-gray-100">
                    {advert.image ? (
                        <img
                            src={advert.image}
                            alt={advert.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                            Sin imagen
                        </div>
                    )}
                </div>

                <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#00bba7]">
                                Se vende
                            </p>

                            <h2 className="mt-1 line-clamp-2 text-xl font-bold text-gray-900">
                                {advert.name}
                            </h2>
                        </div>

                        <span className="rounded-full bg-[#00bba7]/10 px-3 py-1 text-xs font-semibold text-[#009689]">
                            {getAdvertStatusLabel(advert.status)}
                        </span>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                        {advert.description}
                    </p>

                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Publicado por</p>
                            <p className="font-medium text-gray-800">
                                {getOwnerName(advert.owner)}
                            </p>
                        </div>

                        <p className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat("es-ES", {
                                style: "currency",
                                currency: "EUR",
                            }).format(advert.price)}
                        </p>
                    </div>

                    {advert.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {advert.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </Link>
    );
}

export default AdvertCard;
