import { LoaderFunction, json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getSession } from '~/services/sesionService';

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get('Cookie'));
    const token = session.get('adminToken');
    const expiration = session.get('tokenExpiration');

    if (!token || !expiration || new Date(expiration) < new Date()) {
        return redirect('/AdminLogin');
    }

    return json({ 
        isAuthenticated: true,
        expiration 
    });
};

export default function ReportAdmin() {
    const { expiration } = useLoaderData<{ isAuthenticated: boolean; expiration: string }>();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 mb-4">
                    Sesión válida hasta: {new Date(expiration).toLocaleString()}
                </p>
                {/* Add your report content here */}
            </div>
        </div>
    );
}