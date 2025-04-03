import { LoaderFunction, ActionFunction, json, redirect } from '@remix-run/node';
import { useLoaderData, Link, useSubmit } from '@remix-run/react';
import { getSession } from '~/services/sesionService';
import userService from '~/services/userService';
import { IPagedResult } from '~/interfaces/IPagedResult';
import { User } from '~/interfaces/userInterface';
import { Pagination } from '~/components/Pagination';
import { AdminHeader } from '~/components/AdminHeader';
import { requireAdminAuth } from '~/services/authService';
import AdminSidebar from '~/components/AdminSidebar';

// Definir interfaces
interface LoaderData {
  isAuthenticated: boolean;
  expiration: string;
  pagedData: IPagedResult<User>;
}

// Loader para cargar datos
export const loader: LoaderFunction = async ({ request }) => {
  // Validar sesión y autenticación

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

// Action para manejar operaciones de mutación
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get('_action');
  
  if (_action === 'delete') {
    const userId = Number(formData.get('userId'));
    try {
      await userService.deleteUser(userId);
      return json({ success: true });
    } catch (error) {
      return json({ success: false, error: 'Error al eliminar el usuario' });
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

  const normalizedUsers = pagedData.items;
  const submit = useSubmit();

  const handleDeleteUser = (userId: number) => {
    submit(
      { userId: userId.toString(), _action: 'delete' },
      { method: 'post' }
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <AdminSidebar />
      </div>
      {/* Área de contenido principal */}
      <div className="flex-1 bg-gray-100 p-8 overflow-auto">
        <div className="container mx-auto">
          <AdminHeader title="Gestión de usuarios" expiration={expiration}/>
          {/* Tabla de usuarios */}
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
                      {/* Acciones */}
                      <div className="flex justify-center space-x-2" key={user.id}>
                        <Link
                          to={user && user.id ? `/prueba/${user.id}` : "#"}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md"
                        >
                          Editar
                        </Link>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                        >
                          Eliminar
                        </button>
                        <Link 
                          to={`/reportUser/responses/${user.id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md"
                        >
                          Respuestas
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginación */}
          <Pagination
            currentPage={pagedData.currentPage}
            totalPages={pagedData.totalPages}
            pageSize={pagedData.pageSize}
            baseUrl="/reportUser"
          />
        </div>
      </div>
    </div>
  );
}