import { JwtAdapter } from '../../plugins';

export class Auth {
    static async validateJWT(authorization: string = '') {
        if (!authorization) return { error: 'No token provided' };
        if (!authorization.startsWith('Bearer')) return { error: 'Invalid Bearer token' };

        const token = authorization.split(' ').at(1) || '';

        try {
            
            const payload = await JwtAdapter.validateToken<{ email: string }>(token);
            if (!payload) return { error: 'Invalid token' };

            return null;


        } catch (error) {
            return { error: 'Internal server error processing token' };
        }
    }
}