import { ActionFunction, LoaderFunction, json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useNavigation, Link } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { User } from '~/interfaces/userInterface';
import userService from '~/services/userService';
import { requireAdminAuth } from '~/services/authService';
import AdminSidebar from '~/components/AdminSidebar';
import { AdminHeader } from '~/components/AdminHeader';

// Definir interfaces
interface LoaderData {
  user: User;
  expiration: string;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  // Log para saber si se está ejecutando el loader
  console.log("⭐ LOADER INICIADO, params:", params);
  
  try {
    // Validar autenticación
    const { expiration } = await requireAdminAuth(request);
    console.log("✅ Auth validada");
    
    // Obtener el ID del usuario
    const userId = params.userId;
    console.log("🔍 ID recibido:", userId);
    
    if (!userId) {
      console.log("⚠️ ID no proporcionado");
      throw new Response('ID de usuario no proporcionado', { status: 400 });
    }
    
    // Aquí está fallando probablemente
    console.log("🔄 Intentando obtener usuario con ID:", userId);
    const user = await userService.getUserById(Number(userId));
    console.log("👤 Usuario obtenido:", user);
    
    if (!user) {
      console.log("⚠️ Usuario no encontrado");
      throw new Response('Usuario no encontrado', { status: 404 });
    }
    
    return json({ user, expiration });
  } catch (error) {
    console.error("❌ Error en loader:", error);
    throw new Response(`Error: ${error instanceof Error ? error.message : 'Desconocido'}`, {
      status: 500
    });
  }
};

// Action para actualizar usuario
export const action: ActionFunction = async ({ request, params }) => {
  // Validar autenticación
  await requireAdminAuth(request);
  
  // Obtener datos del formulario
  const formData = await request.formData();
  const userId = params.userId;
  
  // Construir objeto de usuario
  const userData = {
    full_name: formData.get('full_name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
  };
  
  try {
    // Actualizar usuario
    await userService.updateUser(Number(userId), userData);
    return redirect('/reportUser');
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    return json({ error: 'Error al actualizar el usuario' }, { status: 500 });
  }
};

export default function UserEdit() {
  const { user, expiration } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  
  // Estado para el formulario con manejo compatible
  const [formValues, setFormValues] = useState({
    full_name: '',
    email: ''
  });
  
  // Cargar datos iniciales cuando se carga el usuario
  useEffect(() => {
    if (user) {
      // Crear una función de ayuda para acceder a propiedades
      // independientemente de si están en minúsculas o mayúsculas
      const getValue = (obj: any, key: string) => {
        return obj[key] || obj[key.charAt(0).toUpperCase() + key.slice(1)];
      };
      
      setFormValues({
        full_name: getValue(user, 'full_name'),
        email: getValue(user, 'email')
      });
      
      console.log("Datos cargados:", {
        'Valores originales': user,
        'Valores normalizados': formValues
      });
    }
  }, [user]);
  
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <AdminSidebar />
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 bg-gray-100 p-8 overflow-auto">
        <div className="container mx-auto">
          <AdminHeader title="Editar Usuario" expiration={expiration} />
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Editar usuario: {user.Full_name}</h2>
            
            <Form method="post">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="full_name">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formValues.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
                
                <Link
                  to="/reportUser"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}