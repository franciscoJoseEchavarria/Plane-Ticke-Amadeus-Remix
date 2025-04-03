import { LoaderFunction, json, redirect, ActionFunction } from "@remix-run/node";
import { useLoaderData, useSubmit, Form } from "@remix-run/react";
import { useState } from "react";
import AdminSidebar from "~/components/AdminSidebar";
import { getSession } from "~/services/sesionService";
import type { Question } from "~/interfaces/questionInterface";


export const loader: LoaderFunction = async ({ request }) => {
    // Check admin authentication
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("adminToken");
    const expiration = session.get("tokenExpiration");
  
    if (!token || !expiration || new Date(expiration) < new Date()) {
      return redirect("/AdminLogin");
    }
  
    // Fetch questions from your API
    const response = await fetch("http://localhost:5177/api/questions");
    const questions = await response.json();
  
    return json({ questions });
  };
  
  export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const action = formData.get("_action");
  
    const API_URL = "http://localhost:5177/api/questions";
  
    try {
      switch (action) {
        case "update": {
          const id = formData.get("id");
          const questionData = {
            id: id, // Incluimos el ID en los datos
            category: formData.get("category"),
            text: formData.get("text"),
          };
  
          const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${(await getSession(request.headers.get("Cookie"))).get("adminToken")}`
            },
            body: JSON.stringify(questionData),
          });
  
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al actualizar la pregunta');
          }
  
          return redirect("/questionsAdmin");
        }
        case "create": {
          const questionData = {
            category: formData.get("category"),
            text: formData.get("text"),
          };
  
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${(await getSession(request.headers.get("Cookie"))).get("adminToken")}`
            },
            body: JSON.stringify(questionData),
          });
  
          if (!response.ok) {
            throw new Error('Error al crear la pregunta');
          }
  
          // Aseguramos que la redirección sea a questionsAdmin
          return redirect("/questionsAdmin");
        }
  
        case "delete": {
          const id = formData.get("id");
          const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${(await getSession(request.headers.get("Cookie"))).get("adminToken")}`
            }
          });
  
          if (!response.ok) {
            throw new Error('Error al eliminar la pregunta');
          }
  
          return redirect("/questionsAdmin");
        }
      }
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : 'Error en la operación' },
        { status: 400 }
      );
    }
  };
  
  export default function QuestionsAdmin() {
    const { questions } = useLoaderData<{ questions: Question[] }>();
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const submit = useSubmit();
  
    return (
      <div className="flex h-screen overflow-auto">
        <div className="w-64 bg-gray-900">
          <AdminSidebar />
        </div>
  
        <div className="flex-1 p-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Gestión de Preguntas</h1>
            
            {isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Regresar
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedQuestion(null);
                  setIsEditing(true);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Nueva Pregunta
              </button>
            )}
          </div>
  
          {isEditing ? (
            <Form 
              method="post" 
              className="max-w-md bg-white p-6 rounded-lg shadow"
              onSubmit={async (e) => {
                if (!confirm('¿Estás seguro de guardar estos cambios?')) {
                  e.preventDefault();
                  return;
                }
                // El formulario se enviará y la acción manejará la redirección
              }}
            >
              <input type="hidden" name="id" value={selectedQuestion?.id || ""} />
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Categoría:</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={selectedQuestion?.category || ""}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
  
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Texto:</label>
                <textarea
                  name="text"
                  defaultValue={selectedQuestion?.text || ""}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
  
              <div className="flex gap-2">
                <button
                  type="submit"
                  name="_action"
                  value={selectedQuestion ? "update" : "create"}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {selectedQuestion ? "Actualizar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedQuestion(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </Form>
          ) : (
            <div className="grid gap-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{question.category}</h3>
                    <p className="text-gray-600">{question.text}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedQuestion(question);
                        setIsEditing(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-500"
                    >
                      Editar
                    </button>
                    <Form method="post">
                    <input type="hidden" name="id" value={question.id} />
                    <button
                        type="submit"
                        name="_action"
                        value="delete"
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-500"
                        onClick={(e) => {
                          if (!confirm("¿Estás seguro de eliminar esta pregunta?")) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    </Form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }