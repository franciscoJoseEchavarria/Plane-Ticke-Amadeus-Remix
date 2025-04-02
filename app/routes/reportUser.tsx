import { LoaderFunction, ActionFunction, json, redirect } from '@remix-run/node';
import { useLoaderData, Link, useSubmit } from '@remix-run/react';
import { getSession } from '~/services/sesionService';
import userService from '~/services/userService';
import { IPagedResult } from '~/interfaces/IPagedResult';
import { User } from '~/interfaces/userInterface';
import { Pagination } from '~/components/Pagination';


interface LoaderData {
    isAuthenticated: boolean;
    expiration: string;
    pagedData: IPagedResult<User>;
  }

export const loader: LoaderFunction = async ({ request }) => {
    // Validar sesión y autenticación
    const session = await getSession(request.headers.get('Cookie'));
    const token = session.get('adminToken');
    const expiration = session.get('tokenExpiration');
  
    if (!token || !expiration || new Date(expiration) < new Date()) {
      return redirect('/AdminLogin');
    }


    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);

    const pagedData: IPagedResult<User> = await userService.getPagedUsers(page, pageSize);
   
    const normalizedPagedData = {
        ...pagedData,
        items: pagedData.items.map((user: any) => ({
          id: user.id,
          full_name: user.full_name,  // Renombra full_name a Full_name
          email: user.email,          // Renombra email a Email
        })),
      };
 
    return json({
        isAuthenticated: true,
        expiration,
        pagedData: normalizedPagedData,
    
      });
  };

  // Nueva función action para manejar operaciones de mutación
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



    export default function ReportAdmin() {

    const { expiration, pagedData } = useLoaderData<{
        isAuthenticated: boolean;
        expiration: string;
        pagedData: {
          items: any[]; // usaremos any para transformar
          currentPage: number;
          totalPages: number;
          pageSize: number;
        };
      }>();

      const normalizedUsers = pagedData.items;
      const submit = useSubmit();

      const handleDeleteUser = (userId: number) => {
         {
            submit(
                { userId: userId.toString(), _action: 'delete' },
                { method: 'post' }
            );
        }
    };

    return (
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
              <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 mb-4">
                      Sesión válida hasta: {new Date(expiration).toLocaleString()}
                  </p>
                  {/* Add your report content here */}
              </div>
            </div>
            <div> 
              <div className="mb-4 flex items-center space-x-4">
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                    usuarios
                </button>
             
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                    Preguntas
                </button>
             
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                    respuestas
                </button>
              </div>
            
            </div>

            <table className="table-fixed min-w-full border-collapse border-2 border-gray-200">
              <thead>
                  <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-2 border-blue-700 w-1/12">ID</th>
                      <th className="py-2 px-4 border-2 border-blue-700 w-1/4">Nombre</th>
                      <th className="py-2 px-4 border-2 border-blue-700 w-1/3">Email</th>
                      <th className="py-2 px-4 border-2 border-blue-700 w-1/3">Eventos</th>
                  </tr>
              </thead>
              <tbody>
                  {normalizedUsers.map((user) => (
                      <tr className="hover:bg-gray-200" key={user.id}>
                          <td className="py-2 px-4 border-2 border-blue-700 text-center">{user.id}</td>
                          <td className="py-2 px-4 border-2 border-blue-700 text-center">{user.full_name}</td>
                          <td className="py-2 px-4 border-2 border-blue-700 text-center">{user.email}</td>
                          <td className="py-2 px-4 border-2 border-blue-700 text-center">
                              <div className="flex justify-center space-x-2">
                                  <Link 
                                      to={`/ReportAdmin/edit/${user.id}`}
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
                                      to={`/ReportAdmin/responses/${user.id}`}
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
            
          {/* Componente de paginación reutilizable */}
          <Pagination 
              currentPage={pagedData.currentPage}
              totalPages={pagedData.totalPages}
              pageSize={pagedData.pageSize}
              baseUrl="/ReportAdmin" // Ajusta según la ruta actual
          />
    </div>
    );
}
