import { useState, useEffect, useRef } from "react";
import { Link, Form } from "@remix-run/react";
import type { User } from "~/interfaces/userInterface";

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar el dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <nav className="bg-white border-b border-gray-200 flex justify-between items-center">
            <div className="container flex items-center justify-start py-6 pl-14">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="amadeus-logo.png" alt="Logo Amadeus" className="h-4 w-auto" />
                </div>
                {/* Navigation Links */}
                <ul className="flex space-x-16 text-gray-700 font-medium ml-12">
                    <li><Link to="/" className="hover:text-blue-500">Inicio</Link></li>
                    <li><Link to="/AdminUser/ReportUser" className="hover:text-blue-500">Reporte</Link></li>
                    <li><a href="https://amadeus.com/es" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">Amadeus</a></li>
                </ul>
            </div>            
            
            <div className="mr-10 relative" ref={dropdownRef}>
                {user ? (
                    <>
                        <div 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-300 hover:bg-blue-200 transition-colors">
                                <span className="text-blue-600 font-medium">
                                    {user.Full_name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="hidden md:inline-block text-gray-700 font-medium">
                                {user.Full_name.split(' ')[0]}
                            </span>
                        </div>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-700">{user.Full_name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user.Email}</p>
                                </div>
                                <Link 
                                    to="/question" 
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Nuevo cuestionario
                                </Link>
                                <Form method="post" action="/logout">
                                    <button 
                                        type="submit"
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Cerrar sesión
                                    </button>
                                </Form>
                            </div>
                        )}
                    </>
                ) : (
                    <Link to="/login">
                        <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                            <i className="ri-user-line text-2xl text-gray-700"></i>
                        </div>
                    </Link>
                )}
            </div>
        </nav>
    );
}