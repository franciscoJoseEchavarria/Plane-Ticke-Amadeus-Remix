import { ActionFunction, json, redirect } from "@remix-run/node";
import { User } from "~/interfaces/userInterface";
import UserService from "~/services/userService";

import LoginForm from '../components/LoginForm';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const newUser: Omit<User, 'id'> = {
        Full_name: formData.get('name') as string,
        Email: formData.get('email') as string
    }

/*     if (formData.get('terms') === null) {
        return json({ error: 'Debes aceptar los términos y condiciones' }, { status: 400 });
    } */

    const user = await UserService.getUserByEmail(newUser.Email);
    
    if (user === null) {
        await UserService.addUser(newUser);
        return redirect('/question');
    }

    return redirect('/question');
}

export default function Login() {
    return (
        <div className="relative h-[90vh] bg-blue-950 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('trip.jpg')" }}>
            {/* Overlay */}
            <div className="absolute inset-0"></div>

            {/* Form Container */}
            <LoginForm />
        </div>
    );
}