import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";

const fakeUsers = [
    { username: "sara", password: "1234" },
    { username: "marian", password: "abcd" },
];

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Todos los campos son obligatorios");
            return;
        }

        const user = fakeUsers.find(
            (u) => u.username === username && u.password === password
        );

        if (!user) {
            setError("Usuario o contraseña incorrectos");
            return;
        }

        setSuccess(true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h1>

                    {success ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                            <p className="text-green-700 font-medium">
                                ¡Bienvenido, {username}!
                            </p>
                            <Link to="/" className="text-sm text-teal-600 hover:underline mt-2 inline-block">
                                Ir al inicio
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}

                            <div>
                                <label className="block text-sm mb-1">Nombre de usuario</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    placeholder="Tu nombre de usuario"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    placeholder="Tu contraseña"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                            >
                                Entrar
                            </button>

                            <p className="text-sm text-center text-gray-500">
                                ¿No tienes cuenta?{" "}
                                <Link to="/register" className="text-teal-600 hover:underline">
                                    Crear cuenta
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
