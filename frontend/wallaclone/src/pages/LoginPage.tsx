import { useState, useEffect, type SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { loginUser } from "../services/authService";

interface LoginErrors {
    username?: string;
    password?: string;
    general?: string;
}
export default function LoginPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/", { replace: true });
        }
    }, [navigate]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({});

    const validate = () => {
        const newErrors: LoginErrors = {};

        if (!username.trim()) {
            newErrors.username = "El nombre de usuario es obligatorio";
        }

        if (!password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        } else if (password.length > 64) {
            newErrors.password = "La contraseña no puede tener más de 64 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setIsLoading(true);
            setErrors({});

            const data = await loginUser({
                username: username.trim(),
                password,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data.user ?? { username: username.trim() }),
            );

            navigate("/", { replace: true });

        } catch (error) {
            setErrors({
                general:
                    error instanceof Error
                        ? error.message
                        : "No se ha podido iniciar sesión",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="grow flex items-center justify-center px-4">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
                    noValidate
                >
                    <h1 className="text-2xl font-bold text-[#00bba7] mb-6 text-center">
                        Iniciar sesión
                    </h1>

                    {errors.general && (
                        <p className="text-red-500 text-sm text-center mb-4">
                            {errors.general}
                        </p>
                    )}

                    <div className="mb-4">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nombre de usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    username: undefined,
                                    general: undefined,
                                }));
                            }}
                            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.username ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Tu nombre de usuario"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors((prev) => ({
                                    ...prev,
                                    password: undefined,
                                    general: undefined,
                                }));
                            }}
                            minLength={6}
                            maxLength={64}
                            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Tu contraseña"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#00bba7] hover:bg-[#009689] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-md transition-colors text-sm"
                    >
                        {isLoading ? "Entrando..." : "Entrar"}
                    </button>

                    <div className="mt-4 text-center text-sm text-gray-600 space-y-2">
                        <p>
                            ¿No tienes cuenta?{" "}
                            <Link to="/register" className="text-[#00bba7] hover:underline">
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}
