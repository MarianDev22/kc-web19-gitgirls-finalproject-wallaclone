import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { registerUser } from "../services/authService";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.username.trim()) {
            newErrors.username = "El nombre de usuario es obligatorio";
        } else if (formData.username.trim().length < 3) {
            newErrors.username = "Mínimo 3 caracteres";
        }

        if (!formData.email.trim()) {
            newErrors.email = "El email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Introduce un email válido";
        }

        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        } else if (formData.password.length > 64) {
            newErrors.password = "La contraseña no puede tener más de 64 caracteres";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setApiError("");

        if (errors[name]) {
            setErrors((prev) => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });
        }
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError("");

        if (!validate()) {
            return;
        }

        try {
            setIsLoading(true);

            const data = await registerUser({
                username: formData.username.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setSuccess(true);

        } catch (error) {
            setApiError(
                error instanceof Error
                    ? error.message
                    : "No se ha podido completar el registro",
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="grow flex flex-col items-center justify-center px-4">
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
                        <div className="text-5xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            ¡Registro completado!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Bienvenid@{" "}
                            <span className="font-semibold">{formData.username}</span>, tu cuenta ha sido creada y la sesión se ha iniciado correctamente.
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-[#00bba7] hover:bg-[#009689] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
                        >
                            Ir al inicio
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="grow flex flex-col items-center justify-center px-4 py-10">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md w-full">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                        Crear cuenta
                    </h1>
                    <p className="text-gray-500 text-sm text-center mb-6">
                        Regístrate para comprar y vender en Wallaclone
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {apiError && (
                            <p className="text-red-500 text-sm text-center mb-4">
                                {apiError}
                            </p>
                        )}

                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nombre de usuario
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="ej: sara_dev"
                                className={`w-full px-4 py-2.5 text-sm rounded-lg border ${errors.username
                                    ? "border-red-400 focus:ring-red-300"
                                    : "border-gray-300 focus:ring-[#00bba7]/30"
                                    } focus:outline-none focus:ring-2 transition-colors`}
                            />
                            {errors.username && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                className={`w-full px-4 py-2.5 text-sm rounded-lg border ${errors.email
                                    ? "border-red-400 focus:ring-red-300"
                                    : "border-gray-300 focus:ring-[#00bba7]/30"
                                    } focus:outline-none focus:ring-2 transition-colors`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={6}
                                maxLength={64}
                                placeholder="Mínimo 6 caracteres"
                                className={`w-full px-4 py-2.5 text-sm rounded-lg border ${errors.password
                                    ? "border-red-400 focus:ring-red-300"
                                    : "border-gray-300 focus:ring-[#00bba7]/30"
                                    } focus:outline-none focus:ring-2 transition-colors`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength={6}
                                maxLength={64}
                                placeholder="Repite tu contraseña"
                                className={`w-full px-4 py-2.5 text-sm rounded-lg border ${errors.confirmPassword
                                    ? "border-red-400 focus:ring-red-300"
                                    : "border-gray-300 focus:ring-[#00bba7]/30"
                                    } focus:outline-none focus:ring-2 transition-colors`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#00bba7] hover:bg-[#009689] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                        >
                            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                        </button>
                    </form>

                    <p className="text-sm text-gray-500 text-center mt-6">
                        ¿Ya tienes cuenta?{" "}
                        <Link
                            to="/login"
                            className="text-[#00bba7] hover:text-[#009689] font-medium"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
