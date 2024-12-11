
describe('handlers/login.ts', () => {

    const DEV_URL_LOGIN = 'https://73up929qvd.execute-api.us-east-1.amazonaws.com/dev/login';

    test('handler() Endpoint returns a valid token for login', async () => {
       const settings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'john@gmail.com' })
        };

        const response = await fetch(DEV_URL_LOGIN, settings);
        const data = await response.json();
      
        expect(data).toHaveProperty('token')
        expect(typeof data.token).toBe('string');
    })
})