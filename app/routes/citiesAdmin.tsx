import { useState } from "react";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import cityService from "~/services/cityService";
import type { City } from "~/interfaces/cityInterface";
import AdminSidebar from "~/components/AdminSidebar";
import CityForm from "~/components/CityForm";

export const loader: LoaderFunction = async () => {
    const cities = await cityService.getCities();
    return json({ cities });
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const actionType = formData.get("_action");

    if (actionType === "delete") {
        const cityId = Number(formData.get("cityId"));
        await cityService.deleteCity(cityId);
        return json({ success: true, message: "Ciudad eliminada correctamente" });
    }

    if (actionType === "create" || actionType === "update") {
        const cityData: City = {
            id: actionType === "update" ? Number(formData.get("id")) : undefined,
            cityName: formData.get("cityName") as string,
            country: formData.get("country") as string,
            unmissablePlace: formData.get("unmissablePlace") as string,
            image: formData.get("image") as string,
            language: formData.get("language") as string,
            continent: formData.get("continent") as string,
            cityHash: formData.get("cityHash") as string,
        };

        if (actionType === "create") {
            await cityService.addCity(cityData);
            return json({ success: true, message: "Ciudad creada correctamente" });
        } else if (actionType === "update") {
            await cityService.updateCity(cityData);
            return json({ success: true, message: "Ciudad actualizada correctamente" });
        }
    }

    return json({ error: "Acción no válida" }, { status: 400 });
};

export default function CitiesAdmin() {
    const { cities } = useLoaderData<{ cities: City[] }>();
    const submit = useSubmit();
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const handleDelete = (cityId: number) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta ciudad?")) {
            const formData = new FormData();
            formData.append("_action", "delete");
            formData.append("cityId", String(cityId));
            submit(formData, { method: "post" });
        }
    };

    const handleEdit = (city: City) => {
        setEditingCity(city);
        setShowCreateForm(false);
    };

    const handleCancel = () => {
        setEditingCity(null);
        setShowCreateForm(false);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white">
                <AdminSidebar />
            </div>

            {/* Contenido principal */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Gestión de Ciudades</h1>
                    <button
                        onClick={() => {
                            setShowCreateForm(true);
                            setEditingCity(null);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Nueva Ciudad
                    </button>
                </div>

                {showCreateForm && (
                    <CityForm
                        onCancel={handleCancel}
                        method="create"
                    />
                )}

                {editingCity && (
                    <CityForm
                        city={editingCity}
                        onCancel={handleCancel}
                        method="update"
                    />
                )}

                {!showCreateForm && !editingCity && (
                    <div className="grid gap-4">
                        {cities.map((city) => (
                            <div
                                key={city.id}
                                className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                            >
                                <div className="flex items-center space-x-4">
                                    <img src={city.image} alt={city.cityName} className="h-16" />
                                    <h3 className="font-bold">{city.cityName}</h3>
                                    <p className="text-gray-600">{city.country}</p>
                                    <p className="text-gray-600">{city.unmissablePlace}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(city)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Editar
                                    </button>
                                    <form method="post">
                                        <input type="hidden" name="cityId" value={city.id} />
                                        <button
                                            type="submit"
                                            name="_action"
                                            value="delete"
                                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                            onClick={() => city.id !== undefined && handleDelete(city.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}