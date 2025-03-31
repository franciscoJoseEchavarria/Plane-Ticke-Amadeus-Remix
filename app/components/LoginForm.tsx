export default function LoginForm() {
    return (
        <div className="absolute top-1/2 left-[70%] transform -translate-y-1/2 -translate-x-1/2 z-10">
            <div className="bg-white p-8 shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
                <form method="post">
                    {/* Nombre */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingresa tu nombre"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingresa tu email"
                            required
                        />
                    </div>

                    {/* Términos y condiciones */}
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mr-2"
                            required
                        />
                        <label htmlFor="terms" className="text-gray-700 text-sm">
                            Acepto los <a href="/" className="text-blue-500 underline">términos y condiciones</a>
                        </label>
                    </div>
                    
                    {/* Botón de ingresar */}
                    <div className="mb-4 flex items-center">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                            Empecemos
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}