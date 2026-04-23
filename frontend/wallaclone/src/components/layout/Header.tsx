import { Link } from 'react-router-dom'

function Header() {
    return (
        <header className="bg-white shadow p-4">
            <Link to="/" className="text-xl font-bold">Wallaclone</Link>
        </header>
    )
}

export default Header
