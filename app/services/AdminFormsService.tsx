interface LoginResponse {
    token: string;
    expiration: string;
}

const API_URL = 'http://localhost:5177/api/Admin';

const loginAdmin = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Credenciales inválidas');
            }
            throw new Error('Error en el servidor');
        }

        const data = await response.json();
        
        if (!data.token || !data.expiration) {
            throw new Error('Respuesta del servidor inválida');
        }

        return {
            token: data.token,
            expiration: data.expiration
        };
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};

export default {
    loginAdmin
};