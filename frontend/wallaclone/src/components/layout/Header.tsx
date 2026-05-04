import { Link } from 'react-router-dom'

function Header() {
    const token = localStorage.getItem("token");

    return (
        <header className="bg-white shadow p-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link to="/" className="text-xl font-bold text-[#00bba7]">
                    Wallaclone
                </Link>

                <nav className="flex items-center gap-4 text-sm font-medium">
                    <Link to="/" className="text-gray-700 hover:text-[#00bba7]">
                        Anuncios
                    </Link>

                    {token ? (
                        <Link
                            to="/adverts/new"
                            className="rounded-md bg-[#00bba7] px-4 py-2 text-white hover:bg-[#009689]"
                        >
                            Crear anuncio
                        </Link>
                    ) : (
                        <Link to="/login" className="text-gray-700 hover:text-[#00bba7]">
                            Iniciar sesión
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Header
