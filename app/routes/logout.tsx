import { ActionFunction, redirect } from "@remix-run/node";
import { getSession, destroySession } from "~/services/sesionService";

export const action: ActionFunction = async ({ request }) => {
    const session = await getSession(request.headers.get("Cookie"));

    return redirect("/", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
};

// Redireccionar si alguien accede a /logout directamente
export const loader = () => redirect("/");