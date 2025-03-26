import { createCookieSessionStorage } from "@remix-run/node";

// Ajusta esta clave secreta a una cadena segura para tu aplicación
const sessionSecret = process.env.SESSION_SECRET || "default-secret-key-change-me";

// Configura el almacenamiento de sesión
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
    cookie: {
        name: "__go4it_session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 semana
        path: "/",
        sameSite: "lax",
        secrets: [sessionSecret],
        secure: process.env.NODE_ENV === "production",
    },
});

export { getSession, commitSession, destroySession };