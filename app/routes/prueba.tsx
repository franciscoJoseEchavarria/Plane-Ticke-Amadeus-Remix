import { useParams, Link } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import userService from '~/services/userService';
import { User } from '~/interfaces/userInterface';

// Define la interfaz para los datos del loader
interface LoaderData {
  user?: User;
  error?: string;
}

// Loader básico para obtener el usuario
export const loader: LoaderFunction = async ({ params, request }) => {
  try {
    // Intenta obtener el ID de los parámetros de búsqueda
    const url = new URL(request.url);
    const id = params.id || url.searchParams.get('id');
    console.log("ID recibido en prueba:", id);
    
    if (!id) {
      console.log("⚠️ No se proporcionó ID");
      return json<LoaderData>({ error: "ID no proporcionado" });
    }
    
    // Intenta obtener el usuario
    try {
      const user = await userService.getUserById(Number(id));
      console.log("✅ Usuario obtenido:", user);
      return json<LoaderData>({ user });
    } catch (error) {
      console.error("❌ Error obteniendo usuario:", error);
      return json<LoaderData>({ error: "Error obteniendo el usuario" });
    }
  } catch (error) {
    console.error("❌ Error en loader:", error);
    return json<LoaderData>({ error: "Error en el servidor" });
  }
};

export default function PruebaId() {
  const params = useParams();
  // Usa el tipo genérico para que TypeScript sepa qué esperar
  const data = useLoaderData<LoaderData>();
  
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Ruta de prueba</h1>
      
      <div className="bg-blue-50 p-4 rounded-md mb-4">
        <p className="font-medium">ID del usuario: <span className="text-blue-600">
          {params.id || new URLSearchParams(window.location.search).get('id') || 'No disponible'}
        </span></p>
      </div>
      
      {data.error ? (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md mb-4">
          <p className="text-red-600">{data.error}</p>
        </div>
      ) : data.user ? (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-4">
          <h2 className="font-medium mb-2">Datos del usuario:</h2>
          <p><strong>ID:</strong> {data.user.id}</p>
          <p><strong>Nombre:</strong> {data.user.Full_name}</p>
          <p><strong>Email:</strong> {data.user.Email}</p>
        </div>
      ) : null}
      
      <Link
        to="/reportUser"
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md inline-block"
      >
        Volver a la lista
      </Link>
    </div>
  );
}