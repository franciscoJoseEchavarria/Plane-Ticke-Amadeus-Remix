import { LoaderFunction, json} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AdminSidebar from "~/components/AdminSidebar";
import { requireAdminAuth } from "~/services/authService";

export const loader: LoaderFunction = async ({ request }) => {
  const {expiration} = await requireAdminAuth(request);
  return json({ isAuthenticated: true, expiration });
};

export default function ReportAdmin() {
  const { expiration } = useLoaderData<{
    isAuthenticated: boolean;
    expiration: string;
  }>();

  return (
    <div className="flex h-screen">
      {/* Sidebar fijo a la izquierda */}
      <div className="w-64 bg-gray-900 text-white">
        <AdminSidebar />
      </div>

      {/* Contenido a la derecha */}
      <div className="flex-1 bg-gray-100 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Reportes</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 mb-4">
            Sesión válida hasta: {new Date(expiration).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
