import { ActionFunction, redirect } from "@remix-run/node";
// Import interfaces
import { User } from "~/interfaces/userInterface";
// Import services
import UserService from "~/services/userService";
import { commitSession, getSession } from "~/services/sesionService";
// Import components
import LoginForm from '../components/LoginForm';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const newUser: Omit<User, 'id'> = {
        Full_name: formData.get('name') as string,
        Email: formData.get('email') as string
    }

    try {
        const user = await UserService.getUserByEmail(newUser.Email);
        
        if (user === null) {
            await UserService.addUser(newUser);
        }
        const session = await getSession(request.headers.get('Cookie'));
        session.set('user', newUser);
    
        return redirect('/question', {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    } catch (error) {
        console.error("Error en el loader:", error);
        return redirect("/login?error=true");
    }    
}

export default function Login() {
    return (
        <div className="relative h-[90vh] bg-white bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('trip.jpg')" }}>
            {/* Overlay */}
            <div className="absolute inset-0"></div>

            {/* Form Container */}
            <LoginForm />
        </div>
    );
}