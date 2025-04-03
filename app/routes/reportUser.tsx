import { LoaderFunction, ActionFunction, json } from '@remix-run/node';
import { useLoaderData, Link, useSubmit, Form, useActionData } from '@remix-run/react';
import { useState, useEffect } from 'react';
import userService from '~/services/userService';
import { IPagedResult } from '~/interfaces/IPagedResult';
import { User } from '~/interfaces/userInterface';
import { Pagination } from '~/components/Pagination';
import { AdminHeader } from '~/components/AdminHeader';
import { requireAdminAuth } from '~/services/authService';
import AdminSidebar from '~/components/AdminSidebar';

// Definir interfaces (mantener las existentes)
interface LoaderData {
  isAuthenticated: boolean;
  expiration: string;
  pagedData: IPagedResult<User>;
}

// Loader existente sin cambios
export const loader: LoaderFunction = async ({ request }) => {
  // Código existente sin cambios
  const {expiration,} = await requireAdminAuth(request);

  // Obtener parámetros de paginación
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

  // Obtener datos paginados
  const pagedData: IPagedResult<User> = await userService.getPagedUsers(page, pageSize);
  
  // Normalizar los datos para la vista
  const normalizedPagedData = {
    ...pagedData,
    items: pagedData.items.map((user: any) => ({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
    })),
  };

  return json({
    isAuthenticated: true,
    expiration,
    pagedData: normalizedPagedData,
  });
};

// Action modificado para incluir actualización
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get('_action');
  
  if (_action === 'delete') {
    const userId = Number(formData.get('userId'));
    try {
      await userService.deleteUser(userId);
      return json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
      return json({ success: false, error: 'Error al eliminar el usuario' });
    }
  }
  
  // Nueva acción para actualizar usuario
  if (_action === 'update') {
    const userId = Number(formData.get('userId'));
    const userData = {
      full_name: formData.get('full_name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
    };
    
    try {
      await userService.updateUser(userId, userData);
      return json({ success: true, message: 'Usuario actualizado correctamente' });
    } catch (error) {
      console.error("Error al actualizar:", error);
      return json({ success: false, error: 'Error al actualizar el usuario' });
    }
  }
  
  return json({ success: false, error: 'Acción no válida' });
};

// Componente principal
export default function ReportUser() {
  const { expiration, pagedData } = useLoaderData<{
    isAuthenticated: boolean;
    expiration: string;
    pagedData: {
      items: any[];
      currentPage: number;
      totalPages: number;
      pageSize: number;
    };
  }>();
  
  // Obtener resultado de la acción
  const actionData = useActionData<{ success?: boolean; message?: string; error?: string }>();

  const normalizedUsers = pagedData.items;
  const submit = useSubmit();
  
  // Estados para el modal de edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formValues, setFormValues] = useState({
    full_name: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para mostrar mensajes de éxito/error
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
    visible: boolean;
  }>({
    type: 'success',
    text: '',
    visible: false
  });
  
  // Efecto para mostrar mensajes de feedback tras una acción
  useEffect(() => {
    if (actionData?.success) {
      setFeedbackMessage({
        type: 'success',
        text: actionData.message || 'Operación completada con éxito',
        visible: true
      });
      // Ocultar mensaje después de 3 segundos
      const timer = setTimeout(() => {
        setFeedbackMessage(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    } else if (actionData?.error) {
      setFeedbackMessage({
        type: 'error',
        text: actionData.error,
        visible: true
      });
      // Ocultar mensaje después de 3 segundos
      const timer = setTimeout(() => {
        setFeedbackMessage(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionData]);

  // Función para eliminar usuario
  const handleDeleteUser = (userId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      submit(
        { userId: userId.toString(), _action: 'delete' },
        { method: 'post' }
      );
    }
  };
  
  // Función para abrir modal de edición
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormValues({
      full_name: user.Full_name,
      email: user.Email
    });
    setIsModalOpen(true);
  };
  
  // Función para cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };
  
  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar envío del formulario
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('_action', 'update');
    formData.append('userId', editingUser.id.toString());
    formData.append('full_name', formValues.full_name);
    formData.append('email', formValues.email);
    
    submit(formData, { method: 'post' });
    setIsModalOpen(false);
    setEditingUser(null);
    setIsSubmitting(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar (sin cambios) */}
      <div className="w-64 bg-gray-900 text-white">
        <AdminSidebar />
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 bg-gray-100 p-8 overflow-auto">
        <div className="container mx-auto">
          <AdminHeader title="Gestión de usuarios" expiration={expiration}/>
          
          {/* Mensaje de feedback */}
          {feedbackMessage.visible && (
            <div className={`mb-4 p-4 rounded-md ${
              feedbackMessage.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {feedbackMessage.text}
            </div>
          )}
          
          {/* Tabla de usuarios (modificada) */}
          <div className="bg-white rounded-lg shadow mb-6">
            <table className="table-fixed min-w-full border-collapse border-2 border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-2 border-blue-700 w-1/12">ID</th>
                  <th className="py-2 px-4 border-2 border-blue-700 w-1/4">Nombre</th>
                  <th className="py-2 px-4 border-2 border-blue-700 w-1/3">Email</th>
                  <th className="py-2 px-4 border-2 border-blue-700 w-1/3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {normalizedUsers.map((user) => (
                  <tr className="hover:bg-gray-200" key={user.id}>
                    <td className="py-2 px-4 border-2 border-blue-700 text-center">{user.id}</td>
                    <td className="py-2 px-4 border-2 border-blue-700 text-center">{user.full_name}</td>
                    <td className="py-2 px-4 border-2 border-blue-700 text-center">{user.email}</td>
                    <td className="py-2 px-4 border-2 border-blue-700 text-center">
                      {/* Acciones - botón de editar modificado */}
                      <div className="flex justify-center space-x-2" key={user.id}>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-500"
                        >
                          Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginación (sin cambios) */}
          <Pagination
            currentPage={pagedData.currentPage}
            totalPages={pagedData.totalPages}
            pageSize={pagedData.pageSize}
            baseUrl="/reportUser"
          />
        </div>
      </div>
      
      {/* Modal de edición */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Editar Usuario</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitForm}>
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
              
              <div className="flex space-x-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}