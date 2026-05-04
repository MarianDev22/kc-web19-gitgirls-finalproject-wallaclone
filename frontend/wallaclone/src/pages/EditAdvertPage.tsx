import { useEffect, useState, type SyntheticEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type { Advert } from "../services/advertService";
import { updateAdvert } from "../services/updateAdvertService";

type EditAdvertErrors = {
    name?: string;
    description?: string;
    price?: string;
    image?: string;
    tags?: string;
    general?: string;
};

type LocationState = {
    advert?: Advert;
};

type StoredUser = {
    id?: string;
    username?: string;
};

function getStoredUser() {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return null;
    }

    try {
        return JSON.parse(storedUser) as StoredUser;
    } catch {
        return null;
    }
}

function isAdvertOwner(advert: Advert, user: StoredUser | null) {
    if (!user) {
        return false;
    }

    return (
        advert.ownerId === user.id ||
        advert.owner?.id === user.id ||
        advert.owner?.username === user.username
    );
}

function EditAdvertPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { advertId } = useParams();

    const state = location.state as LocationState | null;
    const advert = state?.advert;

    const [name, setName] = useState(advert?.name ?? "");
    const [description, setDescription] = useState(advert?.description ?? "");
    const [price, setPrice] = useState(advert ? String(advert.price) : "");
    const [image, setImage] = useState(advert?.image ?? "");
    const [tags, setTags] = useState(advert?.tags.join(", ") ?? "");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<EditAdvertErrors>({});

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const currentUser = getStoredUser();

        if (advert && !isAdvertOwner(advert, currentUser)) {
            setErrors({
                general: "No tienes permisos para editar este anuncio",
            });
        }
    }, [advert, navigate]);

    const getParsedTags = () => {
        return tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);
    };

    const validate = () => {
        const newErrors: EditAdvertErrors = {};
        const numericPrice = Number(price);

        if (!name.trim()) {
            newErrors.name = "El nombre es obligatorio";
        } else if (name.trim().length < 2) {
            newErrors.name = "El nombre debe tener al menos 2 caracteres";
        }

        if (!description.trim()) {
            newErrors.description = "La descripción es obligatoria";
        } else if (description.trim().length < 5) {
            newErrors.description = "La descripción debe tener al menos 5 caracteres";
        } else if (description.trim().length > 200) {
            newErrors.description = "La descripción no puede tener más de 200 caracteres";
        }

        if (!price.trim()) {
            newErrors.price = "El precio es obligatorio";
        } else if (Number.isNaN(numericPrice) || numericPrice <= 0) {
            newErrors.price = "El precio tiene que ser mayor a cero";
        }

        if (!image.trim()) {
            newErrors.image = "La imagen es obligatoria";
        } else {
            try {
                new URL(image.trim());
            } catch {
                newErrors.image = "La imagen debe ser una URL válida";
            }
        }

        if (getParsedTags().length === 0) {
            newErrors.tags = "Añade al menos un tag";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!advert || !advertId) {
            setErrors({
                general: "No se ha podido identificar el anuncio",
            });
            return;
        }

        const currentUser = getStoredUser();

        if (!isAdvertOwner(advert, currentUser)) {
            setErrors({
                general: "No tienes permisos para editar este anuncio",
            });
            return;
        }

        if (!validate()) {
            return;
        }

        try {
            setIsLoading(true);
            setErrors({});

            await updateAdvert(advertId, {
                name: name.trim(),
                description: description.trim(),
                price: Number(price),
                isSale: advert.isSale,
                image: image.trim(),
                tags: getParsedTags(),
            });

            navigate("/");
        } catch (error) {
            setErrors({
                general:
                    error instanceof Error
                        ? error.message
                        : "No se ha podido actualizar el anuncio",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!advert) {
        return (
            <section className="min-h-full bg-gray-50 px-6 py-8">
                <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">
                        No se ha podido cargar el anuncio
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Vuelve al listado y entra a editar desde el botón del anuncio
                    </p>
                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-md bg-[#00bba7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#009689]"
                    >
                        Volver a los anuncios
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-full bg-gray-50 px-6 py-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <Link
                        to="/"
                        className="text-sm font-medium text-[#00bba7] hover:underline"
                    >
                        Volver a los anuncios
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
                        Editar anuncio
                    </h1>

                    <p className="mt-2 text-base text-gray-600">
                        Actualiza los datos de tu anuncio
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                    noValidate
                >
                    {errors.general && (
                        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errors.general}
                        </p>
                    )}

                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Nombre del artículo
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    name: undefined,
                                    general: undefined,
                                }));
                            }}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Ej. Bicicleta Orbea de montaña"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="description"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) => {
                                setDescription(event.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    description: undefined,
                                    general: undefined,
                                }));
                            }}
                            rows={5}
                            maxLength={200}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.description ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Describe el estado, detalles importantes y cualquier información útil."
                        />
                        <div className="mt-1 flex items-center justify-between">
                            {errors.description ? (
                                <p className="text-xs text-red-500">
                                    {errors.description}
                                </p>
                            ) : (
                                <span />
                            )}
                            <p className="text-xs text-gray-400">
                                {description.length}/200
                            </p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="price"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Precio de venta
                        </label>
                        <input
                            id="price"
                            type="number"
                            min="1"
                            step="1"
                            value={price}
                            onChange={(event) => {
                                setPrice(event.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    price: undefined,
                                    general: undefined,
                                }));
                            }}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.price ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Ej. 120"
                        />
                        {errors.price && (
                            <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="image"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            URL de la imagen
                        </label>
                        <input
                            id="image"
                            type="url"
                            value={image}
                            onChange={(event) => {
                                setImage(event.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    image: undefined,
                                    general: undefined,
                                }));
                            }}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.image ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="https://picsum.photos/seed/mi-anuncio/800/600"
                        />
                        {errors.image && (
                            <p className="mt-1 text-xs text-red-500">{errors.image}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="tags"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Tags
                        </label>
                        <input
                            id="tags"
                            type="text"
                            value={tags}
                            onChange={(event) => {
                                setTags(event.target.value);
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    tags: undefined,
                                    general: undefined,
                                }));
                            }}
                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.tags ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="movil, samsung, android"
                        />
                        {errors.tags ? (
                            <p className="mt-1 text-xs text-red-500">{errors.tags}</p>
                        ) : (
                            <p className="mt-1 text-xs text-gray-400">
                                Separa los tags con comas
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-[#00bba7] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#009689] disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                        {isLoading ? "Guardando cambios..." : "Guardar cambios"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default EditAdvertPage;
