import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";

const fakeUsers = [
    { username: "sara", password: "123456" },
    { username: "marian", password: "abcdef" },
];

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { username?: string; password?: string; general?: string } = {};

        // Validación: campos obligatorios
        if (!username.trim()) {
            newErrors.username = "El nombre de usuario es obligatorio";
        }
        if (!password) {
            newErrors.password = "La contraseña es obligatoria";
        }

        // Si hay errores de campo, no seguimos
        if (newErrors.username || newErrors.password) {
            setErrors(newErrors);
            return;
        }

        // Verificar credenciales contra datos falsos
        const user = fakeUsers.find(
            (u) => u.username === username.trim() && u.password === password
        );

        if (!user) {
            setErrors({ general: "Usuario o contraseña incorrectos" });
            return;
        }

        // Simular guardar token/sesión
        localStorage.setItem("token", "fake-token-" + user.username);
        localStorage.setItem("user", user.username);

        // Redirigir a la página principal
        navigate("/");
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

                    {/* Error general */}
                    {errors.general && (
                        <p className="text-red-500 text-sm text-center mb-4">
                            {errors.general}
                        </p>
                    )}

                    {/* Campo: nombre de usuario */}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setErrors((prev) => ({ ...prev, username: undefined, general: undefined }));
                            }}
                            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.username ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Tu nombre de usuario"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Campo: contraseña */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors((prev) => ({ ...prev, password: undefined, general: undefined }));
                            }}
                            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bba7] ${errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Tu contraseña"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Botón de login */}
                    <button
                        type="submit"
                        className="w-full bg-[#00bba7] hover:bg-[#009689] text-white font-semibold py-2 rounded-md transition-colors text-sm"
                    >
                        Entrar
                    </button>

                    {/* Enlaces */}
                    <div className="mt-4 text-center text-sm text-gray-600 space-y-2">
                        <p>
                            <Link to="/forgot-password" className="text-[#00bba7] hover:underline">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </p>
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
