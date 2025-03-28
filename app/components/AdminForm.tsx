import React, { useState } from 'react';
import { Form, useActionData, useNavigate } from '@remix-run/react';

export default function AdminForm() {
    // Estado para almacenar el email del administrador
    const [email, setEmail] = useState('');
    // Estado para almacenar la contraseña del administrador
    const [password, setPassword] = useState('');
    // Hook para obtener los datos de la acción
    const actionData = useActionData<{ success: boolean; error?: string }>();
    // Hook para manejar la navegación
    const navigate = useNavigate();

    // Efecto para redirigir cuando la autenticación es exitosa
    React.useEffect(() => {
        if (actionData?.success) {
            navigate('/ReportAdmin');
        }
    }, [actionData, navigate]);

    return (
        // Formulario que usa la acción definida en AdminLogin.tsx
        <Form method="post" className="mt-4">
            {/* Mensaje de error si las credenciales son inválidas */}
            {actionData?.error && (
                <div className="mb-4 p-3 text-red-500 bg-red-100 rounded-md">
                    {actionData.error}
                </div>
            )}
            
            {/* Contenedor del campo email */}
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-900 font-medium mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md"
                    required
                />
            </div>
            
            {/* Contenedor del campo contraseña */}
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-900 font-medium mb-2">
                    Contraseña
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md"
                    required
                />
            </div>
            
            {/* Botón de envío del formulario */}
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
                Iniciar sesión
            </button>
        </Form>
    );
}