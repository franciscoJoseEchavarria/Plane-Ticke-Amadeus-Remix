import {
  LoaderFunction,
  json,
  redirect,
  ActionFunction,
} from "@remix-run/node";
import { useLoaderData, useSubmit, Form } from "@remix-run/react";
import { useState } from "react";
import AdminSidebar from "~/components/AdminSidebar";
import { getSession } from "~/services/sesionService";

interface QuestionOption {
  id: number;
  questionId: number;
  text: string;
  description: string;
  image: string;
}

const ITEMS_PER_PAGE = 3; // Número de opciones por página

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("adminToken");
  const expiration = session.get("tokenExpiration");

  if (!token || !expiration || new Date(expiration) < new Date()) {
    return redirect("/AdminLogin");
  }

  const response = await fetch("http://localhost:5177/api/questionoption", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return json({ questionOptions: [] });
  }

  const questionOptions = await response.json();
  return json({ questionOptions });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("_action");
  const API_URL = "http://localhost:5177/api/questionoption";
  const token = (await getSession(request.headers.get("Cookie"))).get(
    "adminToken"
  );

  try {
    switch (action) {
      case "update": {
        const id = formData.get("id");
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(Object.fromEntries(formData)),
        });
        if (!response.ok) throw new Error("Error al actualizar la opción");
        return redirect("/questionOptionsAdmin");
      }
      case "create": {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(Object.fromEntries(formData)),
        });
        if (!response.ok) throw new Error("Error al crear la opción");
        return redirect("/questionOptionsAdmin");
      }
      case "delete": {
        const id = formData.get("id");
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Error al eliminar la opción");
        return redirect("/questionOptionsAdmin");
      }
    }
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Error en la operación",
      },
      { status: 400 }
    );
  }
};

export default function QuestionOptionsAdmin() {
  const { questionOptions } = useLoaderData<{
    questionOptions: QuestionOption[];
  }>();
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const submit = useSubmit();

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(questionOptions.length / ITEMS_PER_PAGE);

  // Obtener los elementos de la página actual
  const paginatedOptions = questionOptions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">
          Gestión de Opciones de Preguntas
        </h1>
        <button
          onClick={() => {
            setSelectedOption(null);
            setIsEditing(true);
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Nueva Opción
        </button>
        {isEditing ? (
          <Form method="post" className="mt-4 bg-white p-6 rounded shadow">
            <input type="hidden" name="id" value={selectedOption?.id || ""} />
            <input
              type="text"
              name="questionId"
              placeholder="ID de la pregunta"
              defaultValue={selectedOption?.questionId || ""}
              required
              className="block w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="text"
              placeholder="Texto"
              defaultValue={selectedOption?.text || ""}
              required
              className="block w-full mb-2 p-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Descripción"
              defaultValue={selectedOption?.description || ""}
              className="block w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="image"
              placeholder="URL de la imagen"
              defaultValue={selectedOption?.image || ""}
              className="block w-full mb-2 p-2 border rounded"
            />
            <button
              type="submit"
              name="_action"
              value={selectedOption ? "update" : "create"}
              className="bg-blue-500 text-white px-3 py-1 m-2 rounded text-sm"
            >
              {selectedOption ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              Cancelar
            </button>
          </Form>
        ) : (
          <>
            <div className="grid gap-4 mt-4">
              {paginatedOptions.map((option) => (
                <div
                  key={option.id}
                  className="bg-white p-4 rounded shadow flex justify-between"
                >
                  <div>
                    <h3 className="font-bold">{option.text}</h3>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <button
                      onClick={() => {
                        setSelectedOption(option);
                        setIsEditing(true);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <Form method="post">
                      <input type="hidden" name="id" value={option.id} />
                      <button
                        type="submit"
                        name="_action"
                        value="delete"
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </Form>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="flex justify-center mt-6 gap-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
              >
                Anterior
              </button>
              <span className="self-center text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white"
                }`}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
