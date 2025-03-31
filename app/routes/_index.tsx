import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import HomePage from "~/components/HomePage";
import { User } from "~/interfaces/userInterface";
import { getSession } from "~/services/sesionService";

export const loader: LoaderFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user") || null;

    return json({ user });
}

export default function Index() {
    const { user } = useLoaderData<{ user: User | null }>();

    return (
        <div className="relative h-[90vh] w-screen  bg-blue-950 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('image.png')" }}>
            <HomePage user={user}/>
        </div>
    );
} 
