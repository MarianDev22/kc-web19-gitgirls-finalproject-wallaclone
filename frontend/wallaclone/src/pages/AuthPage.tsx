import { useState } from "react";

function AuthPage() {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl min-h-[500px] flex overflow-hidden">

                {/* Panel del formulario */}
                <div className="w-1/2 p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-6">
                        {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                    </h2>
                    <p className="text-gray-500 mb-4">
                        {isLogin
                            ? "Panel login"
                            : "Panel registro"}
                    </p>
                </div>

                {/* Panel de bienvenida */}
                <div className="w-1/2 bg-purple-500 text-white p-10 flex flex-col justify-center items-center rounded-l-[80px]">
                    <h2 className="text-2xl font-bold mb-4">
                        {isLogin ? "¿Aún no tienes cuenta?" : "¿Ya tienes cuenta?"}
                    </h2>
                    <p className="mb-6 text-center text-sm">
                        {isLogin
                            ? "Regístrate y empieza a comprar y vender"
                            : "Inicia sesión para acceder a tu cuenta"}
                    </p>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-purple-500 transition-colors cursor-pointer"
                    >
                        {isLogin ? "Regístrate" : "Inicia sesión"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AuthPage;
