import { useState, useEffect } from 'react';
import { LoaderFunction, ActionFunction, json, redirect } from '@remix-run/node';
import { useLoaderData, Form, useActionData, Link } from '@remix-run/react';
import { User } from '~/interfaces/userInterface';
import { requireAdminAuth } from '~/services/authService';
import userService from '~/services/userService';
import AdminSidebar from '~/components/AdminSidebar';
import { AdminHeader } from '~/components/Admin/AdminHeader';

// Interfaces para tipos
interface LoaderData {
  user: User;
  expiration: string;
}

interface ActionData {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    full_name?: string;
    email?: string;
  };
}

// Loader - Obtiene los datos del usuario para el formulario
export const loader: LoaderFunction = async ({ request, params }) => {
  // Verificar autenticación de administrador
  const { expiration } = await requireAdminAuth(request);
  
  // Obtener el ID del usuario desde la URL
  const userId = Number(params.userId);
  
  if (isNaN(userId)) {
    throw new Response('ID de usuario inválido', { status: 400 });
  }
  
  try {
    // Obtener datos del usuario
    const user = await userService.getUserById(userId);
    
    return json<LoaderData>({ 
      user, 
      expiration 
    });
  } catch (error) {
    throw new Response('Usuario no encontrado', { status: 404 });
  }
};

// Action - Procesa el formulario cuando se envía
export const action: ActionFunction = async ({ request, params }) => {
  // Verificar autenticación
  await requireAdminAuth(request);
  
  // Obtener el ID del usuario
  const userId = Number(params.userId);
  
  // Procesar los datos del formulario
  const formData = await request.formData();
  const full_name = formData.get('full_name')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  
  // Validación básica
  const fieldErrors: ActionData['fieldErrors'] = {};
  
  if (!full_name) fieldErrors.full_name = 'El nombre es requerido';
  if (!email) fieldErrors.email = 'El email es requerido';
  else if (!/^\S+@\S+\.\S+$/.test(email)) fieldErrors.email = 'Email inválido';
  
  if (Object.keys(fieldErrors).length > 0) {
    return json<ActionData>({ fieldErrors }, { status: 400 });
  }
  
  
  try {
    // Actualizar el usuario
    await userService.updateUser(userId, {
      id: userId,
      full_name,
      email
    });
    
    // Redireccionar a la lista de usuarios
    return redirect('/reportUser');
  } catch (error) {
    return json<ActionData>({ 
      success: false, 
      error: 'Error al actualizar el usuario. Inténtelo de nuevo.' 
    }, { status: 500 });
  }
};


// reportUser.edit.$userId.tsx
// ... mantén las importaciones y el resto del código igual ...






export default function ReportEdit() {
    const { user, expiration } = useLoaderData<LoaderData>();
    const actionData = useActionData<ActionData>();
    const transition = useTransition();
    
    // ... mantén el resto del código igual ...
    
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white">
          <AdminSidebar />
        </div>
        
        {/* Área de contenido principal con degradado */}
        <div className="flex-1 bg-gradient-to-br from-gray-100 to-blue-50 p-8 overflow-auto">
          <div className="container mx-auto">
            <AdminHeader title="Editar Usuario" expiration={expiration} />
            
            {/* Formulario con fondo semitransparente */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg mb-6 p-6 border border-gray-200">
              {/* Encabezado del formulario */}
              <h2 className="text-xl text-gray-800 font-semibold mb-6 pb-2 border-b border-gray-200">
                Editando al usuario: {user.full_name}
              </h2>
              
              {/* Mensaje de error general */}
              {actionData?.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {actionData.error}
                </div>
              )}
              
              <Form method="post">
                <div className="mb-4">
                  <label htmlFor="full_name" className="block text-gray-700 font-semibold mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formValues.full_name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none ${
                      actionData?.fieldErrors?.full_name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  {actionData?.fieldErrors?.full_name && (
                    <p className="mt-1 text-red-500 text-sm">
                      {actionData.fieldErrors.full_name}
                    </p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none ${
                      actionData?.fieldErrors?.email 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  {actionData?.fieldErrors?.email && (
                    <p className="mt-1 text-red-500 text-sm">
                      {actionData.fieldErrors.email}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                  
                  <a 
                    href="/reportUser" 
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Cancelar
                  </a>
                </div>
              </Form>
            </div>
            
            {/* Indicador visual de conexión con la página principal */}
            <div className="flex justify-center">
              <Link 
                to="/reportUser" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Volver a la lista de usuarios
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


