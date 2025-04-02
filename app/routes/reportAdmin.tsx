import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AdminSidebar from "~/components/AdminSidebar";
import { getSession } from "~/services/sesionService";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("adminToken");
  const expiration = session.get("tokenExpiration");

  if (!token || !expiration || new Date(expiration) < new Date()) {
    return redirect("/AdminLogin");
  }

  return json({
    isAuthenticated: true,
    expiration,
  });
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
          {/* Aquí puedes agregar los reportes */}
        </div>
      </div>
    </div>
  );
}