export default function Navbar() {
    return (
        <nav className="bg-white">
            <div className="container ml-14 flex items-center justify-start pb-6 pt-6">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="amadeus-logo.png" alt="Logo Amadeus" className="h-4 w-auto" />
                </div>
                {/* Navigation Links */}
                <ul className="flex space-x-16 text-gray-700 font-medium ml-12">
                    <li className="hover:text-blue-500 cursor-pointer">Inicio</li>
                    <li className="hover:text-blue-500 cursor-pointer">Reporte</li>
                    <li className="hover:text-blue-500 cursor-pointer">Amadeus</li>
                </ul>
            </div>
        </nav>
    );
}