import { JwtAdapter } from "../../src/plugins"

describe('plugins/jwt.plugin.ts', () => {

    test('generateToken() returns a token string', async () => {
        const token = await JwtAdapter.generateToken({ email: 'john@gmail.com' });

        expect(typeof token).toBe('string');
    })


    test('validateToken() return a valid confirmation of a given token', async () => {
        const email = 'john@gmail.com';
        const token = await JwtAdapter.generateToken({ email });
        const payload = await JwtAdapter.validateToken<{ email: string }>(token + '');
        
        expect(email).toBe(payload!.email);
    })

})