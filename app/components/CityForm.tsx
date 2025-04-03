import { Form } from "@remix-run/react";
import type { City } from "~/interfaces/cityInterface";

interface CityFormProps {
    city?: City;
    method: "create" | "update";
    onCancel: () => void;
}

export default function CityForm({ city, method, onCancel }: CityFormProps) {
    return (
        <Form method="post" className="max-w-md bg-white p-6 rounded-lg shadow">
            <input type="hidden" name="_action" value={method} />
            {method === "update" && city && (
                <input type="hidden" name="id" value={city.id} />
            )}
            <div className="mb-4">
                <label htmlFor="cityName" className="block text-gray-700 mb-2">Nombre de la Ciudad:</label>
                <input
                    id="cityName"
                    type="text"
                    name="cityName"
                    defaultValue={city?.cityName || ""}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="country" className="block text-gray-700 mb-2">País:</label>
                <input
                    type="text"
                    name="country"
                    defaultValue={city?.country || ""}
                    className="w-full px-3 py-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label htmlFor="unmissablePlace" className="block text-gray-700 mb-2">Lugar Imperdible:</label>
                <input
                    type="text"
                    name="unmissablePlace"
                    defaultValue={city?.unmissablePlace || ""}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 mb-2">URL de la Imagen:</label>
                <input
                    type="text"
                    name="image"
                    defaultValue={city?.image || ""}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    {method === "update" ? "Actualizar" : "Crear"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Cancelar
                </button>
            </div>
        </Form>
    );
}
