
describe('handlers/historial.ts', () => {

    const DEV_URL_LOGIN = 'https://73up929qvd.execute-api.us-east-1.amazonaws.com/dev/login';
    const DEV_URL_HIS = 'https://73up929qvd.execute-api.us-east-1.amazonaws.com/dev/historial';
    const LIMIT = 3

    test('handler() Endpoint without auth returns error', async () => {
         const settings = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(DEV_URL_HIS);
        const data = await response.json();

        expect(data).toHaveProperty('error')
        expect(data.error).toBe('No token provided');
    })

    test('handler() Pagination returns a total no greater than that requested', async () => {
        const loginSettings = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'john@gmail.com' })
        };

        const loginResponse = await fetch(DEV_URL_LOGIN, loginSettings);
        const loginData = await loginResponse.json();
        const { token } = loginData


        const settings = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await fetch(DEV_URL_HIS + '?limit=' + LIMIT, settings);
        const data = await response.json();

        expect(data.results).toHaveProperty('Count');
        expect(data.results.Count).not.toBeGreaterThan(LIMIT);

    })
})