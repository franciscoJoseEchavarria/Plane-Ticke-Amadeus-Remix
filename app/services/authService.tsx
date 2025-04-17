import { redirect } from '@remix-run/node';
import { getSession } from '~/services/sesionService';

export async function requireAdminAuth(request: Request) {
    const session = await getSession(request.headers.get('Cookie'));
    const token = session.get('adminToken');
    const expiration = session.get('tokenExpiration');
  
    if (!token || !expiration || new Date(expiration) < new Date()) {
      throw redirect('/adminLogin');
    }
  
    return { token, expiration, isAuthenticated: true };
  }

