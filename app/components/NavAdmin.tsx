import React from 'react';
import { Link, Outlet, useLocation, useLoaderData } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { getSession } from '~/services/sesionService';

// Define el loader que proporciona los datos
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('adminToken');
  const expiration = session.get('tokenExpiration');

  if (!token || !expiration || new Date(expiration) < new Date()) {
    return redirect('/AdminLogin');
  }

  return json({
    isAuthenticated: true,
    expiration,
  });
};

export default function NavAdmin() {
  const location = useLocation();
  const { expiration } = useLoaderData<{ expiration: string }>();

  // Determina cuál es el botón activo
  const isUsers = location.pathname === '/ReportAdmin';
  const isQuestions = location.pathname.includes('/questions');
  const isAnswers = location.pathname.includes('/answers');

  return (
    <div className="container mx-auto px-4">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Sesión válida hasta: {new Date(expiration).toLocaleString()}
        </p>
      </div>
    </div>
    
    <div>
      <div className="mb-4 flex items-center space-x-4">
        <Link
          to="/ReportAdmin"
          className={`w-full py-2 px-4 rounded-lg transition duration-200 text-center ${
            isUsers ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Usuarios
        </Link>
        
        <Link
          to="/ReportAdmin/questions"
          className={`w-full py-2 px-4 rounded-lg transition duration-200 text-center ${
            isQuestions ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Preguntas
        </Link>
        
        <Link
          to="/ReportAdmin/answers"
          className={`w-full py-2 px-4 rounded-lg transition duration-200 text-center ${
            isAnswers ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Respuestas
        </Link>
      </div>
    </div>
    
    <Outlet /> {/* Aquí se renderizarán las sub-rutas */}
  </div>
  );

}