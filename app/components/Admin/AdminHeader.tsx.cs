import React from 'react';

interface AdminHeaderProps {
    title: string;
    expiration: string;
}

export function AdminHeader ({title, expiration}: AdminHeaderProps) {
 
    return (

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold"> {title} </h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">
                Sesión válida hasta: {new Date(expiration).toLocaleString()}
              </p>
            </div>
          </div>
    )
}