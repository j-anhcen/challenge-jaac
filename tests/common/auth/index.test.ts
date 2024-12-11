import { Auth } from "../../../src/common/auth";
import { JwtAdapter } from "../../../src/plugins";

describe('common/auth/index.ts', () => {
    test('validateJWT() validation jwt -> No token provided', async () => {
        const data = await Auth.validateJWT('');

        expect(data!.error).toBe('No token provided');
    })

    test('validateJWT() validation jwt -> Invalid Bearer token', async () => {
        const data = await Auth.validateJWT('test');

        expect(data!.error).toBe('Invalid Bearer token');
    })

    test('validateJWT() validation jwt -> Invalid token', async () => {
        const data = await Auth.validateJWT('Bearer token text');

        expect(data!.error).toBe('Invalid token');
    })

    test('validateJWT() validation jwt -> Valid token', async () => {
        const token = await JwtAdapter.generateToken({ email: 'john@gmail.com' });
        const data = await Auth.validateJWT(`Bearer ${ token }`);
        
        expect(data).toBe(null);
    })
});