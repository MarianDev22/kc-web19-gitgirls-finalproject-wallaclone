import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAdvertById, type Advert } from "../services/advertService";
import { contactSeller } from "../services/contactSellerService";
import { deleteAdvert } from "../services/deleteAdvertService";
import { updateAdvertStatus } from "../services/updateAdvertStatusService";

type StoredUser = {
    id?: string;
    _id?: string;
    user?: {
        id?: string;
        _id?: string;
    };
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

function getCurrentUserId() {
    const storageKeys = ["user", "currentUser"];

    for (const storageKey of storageKeys) {
        const storedUser = localStorage.getItem(storageKey);

        if (!storedUser) {
            continue;
        }

        try {
            const parsedUser = JSON.parse(storedUser) as StoredUser;

            return (
                parsedUser.id ??
                parsedUser._id ??
                parsedUser.user?.id ??
                parsedUser.user?._id ??
                null
            );
        } catch {
            return null;
        }
    }

    return null;
}

function AdvertDetailPage() {
    const { advertId } = useParams();
    const navigate = useNavigate();

    const [advert, setAdvert] = useState<Advert | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [contactMessage, setContactMessage] = useState("");
    const [contactErrorMessage, setContactErrorMessage] = useState("");
    const [contactSuccessMessage, setContactSuccessMessage] = useState("");
    const [isContactLoading, setIsContactLoading] = useState(false);

    const [statusErrorMessage, setStatusErrorMessage] = useState("");
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    useEffect(() => {
        async function loadAdvert() {
            if (!advertId) {
                setErrorMessage("No hemos podido encontrar este anuncio");
                setIsLoading(false);
                return;
            }

            try {
                const data = await getAdvertById(advertId);
                setAdvert(data);
            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "No hemos podido cargar este anuncio. Inténtalo de nuevo",
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadAdvert();
    }, [advertId]);

    if (isLoading) {
        return (
            <section className="min-h-full bg-gray-50 px-6 py-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                    Cargando anuncio...
                </div>
            </section>
        );
    }

    if (errorMessage || !advert) {
        return (
            <section className="min-h-full bg-gray-50 px-6 py-8">
                <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                    <p>{errorMessage || "No se ha podido cargar el anuncio"}</p>

                    <Link
                        to="/"
                        className="mt-4 inline-block rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689]"
                    >
                        Volver a anuncios
                    </Link>
                </div>
            </section>
        );
    }

    const currentUserId = getCurrentUserId();
    const authToken = localStorage.getItem("token");

    const isAuthenticated = Boolean(authToken && currentUserId);
    const canManageAdvert = Boolean(currentUserId && currentUserId === advert.ownerId);
    const isSoldAdvert = advert.status === "SOLD";
    const canContactSeller = Boolean(
        isAuthenticated && !canManageAdvert && !isSoldAdvert,
    );

    const advertTypeLabel = advert.isSale ? "Se vende" : "Se busca";

    const reservedNextStatus: Advert["status"] =
        advert.status === "RESERVED" ? "AVAILABLE" : "RESERVED";

    const soldNextStatus: Advert["status"] =
        advert.status === "SOLD" ? "AVAILABLE" : "SOLD";

    const reservedButtonLabel =
        advert.status === "RESERVED" ? "Desmarcar reservado" : "Marcar como reservado";

    const soldButtonLabel =
        advert.status === "SOLD" ? "Desmarcar vendido" : "Marcar como vendido";

    const contactTitle = advert.isSale
        ? "Hablar con el vendedor"
        : "Hablar con la persona que busca";

    const soldContactText = advert.isSale
        ? "Este artículo está vendido, así que no puedes contactar con el vendedor"
        : "Este anuncio ya está cerrado, así que no puedes contactar con la persona que busca.";

    const loginContactText = advert.isSale
        ? "Inicia sesión para poder hablar con el vendedor de este artículo"
        : "Inicia sesión para poder hablar con la persona que busca este artículo.";

    const contactPlaceholder = advert.isSale
        ? "Hola, me interesa este artículo. ¿Sigue disponible?"
        : "Hola, creo que tengo algo que puede encajar contigo. ¿Te interesa?";

    async function handleDeleteAdvert() {
        if (!advert) {
            return;
        }

        const advertToDelete = advert;

        const confirmed = window.confirm(
            `¿Seguro que quieres eliminar el anuncio "${advertToDelete.name}"?`,
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteAdvert(advertToDelete.id);
            navigate("/", { replace: true });
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "No hemos podido eliminar el anuncio",
            );
        }
    }

    async function handleStatusChange(nextStatus: Advert["status"]) {
        if (!advert) {
            return;
        }

        try {
            setIsStatusLoading(true);
            setStatusErrorMessage("");

            const updatedAdvert = await updateAdvertStatus(advert.id, nextStatus);

            setAdvert((currentAdvert) =>
                currentAdvert
                    ? {
                        ...currentAdvert,
                        ...updatedAdvert,
                        owner: updatedAdvert.owner ?? currentAdvert.owner,
                    }
                    : updatedAdvert,
            );
        } catch (error) {
            setStatusErrorMessage(
                error instanceof Error
                    ? error.message
                    : "No se ha podido actualizar el estado del anuncio",
            );
        } finally {
            setIsStatusLoading(false);
        }
    }

    async function handleContactSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!advert) {
            setContactErrorMessage("No hemos podido identificar este anuncio");
            setContactSuccessMessage("");
            return;
        }

        const advertToContact = advert;
        const trimmedMessage = contactMessage.trim();

        if (!trimmedMessage) {
            setContactErrorMessage("Escribe un mensaje antes de enviarlo");
            setContactSuccessMessage("");
            return;
        }

        if (!authToken) {
            setContactErrorMessage("Debes iniciar sesión para enviar el mensaje");
            setContactSuccessMessage("");
            return;
        }

        try {
            setIsContactLoading(true);
            setContactErrorMessage("");
            setContactSuccessMessage("");

            const response = await contactSeller(
                advertToContact.id,
                trimmedMessage,
                authToken,
            );

            setContactSuccessMessage(response.message);
            setContactMessage("");
        } catch (error) {
            setContactErrorMessage(
                error instanceof Error ? error.message : "No se ha podido enviar el mensaje",
            );
        } finally {
            setIsContactLoading(false);
        }
    }

    return (
        <section className="min-h-full bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/"
                    className="mb-6 inline-block text-sm font-semibold text-[#00bba7] hover:text-[#009689]"
                >
                    Volver a anuncios
                </Link>

                <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="grid gap-0 lg:grid-cols-2">
                        <div className="bg-gray-100">
                            {advert.image ? (
                                <img
                                    src={advert.image}
                                    alt={advert.name}
                                    className="h-full min-h-[320px] w-full object-cover"
                                />
                            ) : (
                                <div className="flex min-h-[320px] items-center justify-center text-sm text-gray-500">
                                    Sin imagen
                                </div>
                            )}
                        </div>

                        <div className="space-y-6 p-6 lg:p-8">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-[#00bba7]">
                                        {advertTypeLabel}
                                    </p>

                                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                                        {advert.name}
                                    </h1>
                                </div>

                                <span className="rounded-full bg-[#00bba7]/10 px-3 py-1 text-xs font-semibold text-[#009689]">
                                    {getAdvertStatusLabel(advert.status)}
                                </span>
                            </div>

                            <p className="text-4xl font-bold text-gray-900">
                                {new Intl.NumberFormat("es-ES", {
                                    style: "currency",
                                    currency: "EUR",
                                }).format(advert.price)}
                            </p>

                            <div>
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                    Descripción
                                </h2>
                                <p className="mt-2 whitespace-pre-line text-base leading-7 text-gray-700">
                                    {advert.description}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                    Publicado por
                                </h2>
                                <p className="mt-2 text-base font-semibold text-gray-900">
                                    {getOwnerName(advert.owner)}
                                </p>
                            </div>

                            {advert.tags.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                        Tags
                                    </h2>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {advert.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!canManageAdvert && (
                                <div className="border-t border-gray-100 pt-6">
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                        {contactTitle}
                                    </h2>

                                    {isSoldAdvert && (
                                        <p className="mt-3 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
                                            {soldContactText}
                                        </p>
                                    )}

                                    {!isSoldAdvert && !isAuthenticated && (
                                        <div className="mt-3 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                                            <p>{loginContactText}</p>

                                            <Link
                                                to="/login"
                                                className="mt-3 inline-block rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689]"
                                            >
                                                Iniciar sesión
                                            </Link>
                                        </div>
                                    )}

                                    {canContactSeller && (
                                        <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="contactMessage"
                                                    className="block text-sm font-semibold text-gray-700"
                                                >
                                                    Mensaje
                                                </label>

                                                <textarea
                                                    id="contactMessage"
                                                    value={contactMessage}
                                                    onChange={(event) => setContactMessage(event.target.value)}
                                                    rows={5}
                                                    disabled={isContactLoading}
                                                    className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#00bba7] disabled:cursor-not-allowed disabled:bg-gray-100"
                                                    placeholder={contactPlaceholder}
                                                />
                                            </div>

                                            {contactErrorMessage && (
                                                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                                    {contactErrorMessage}
                                                </p>
                                            )}

                                            {contactSuccessMessage && (
                                                <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                                    {contactSuccessMessage}
                                                </p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isContactLoading}
                                                className="rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isContactLoading ? "Enviando..." : "Enviar mensaje"}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}

{canManageAdvert && (
                                <div className="space-y-4 border-t border-gray-100 pt-6">
                                    <div>
                                        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                            Gestionar estado
                                        </h2>

                                        <div className="mt-3 flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                disabled={isStatusLoading}
                                                onClick={() => void handleStatusChange(reservedNextStatus)}
                                                className="rounded-md border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isStatusLoading && reservedNextStatus === "RESERVED"
                                                    ? "Actualizando..."
                                                    : reservedButtonLabel}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={isStatusLoading}
                                                onClick={() => void handleStatusChange(soldNextStatus)}
                                                className="rounded-md border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isStatusLoading && soldNextStatus === "SOLD"
                                                    ? "Actualizando..."
                                                    : soldButtonLabel}
                                            </button>
                                        </div>

                                        {statusErrorMessage && (
                                            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                                {statusErrorMessage}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            to={`/adverts/${advert.id}/edit`}
                                            state={{ advert }}
                                            className="rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689]"
                                        >
                                            Editar anuncio
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleDeleteAdvert}
                                            className="rounded-md border border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                                        >
                                            Eliminar anuncio
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );
}

export default AdvertDetailPage;
