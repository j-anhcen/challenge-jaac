
describe('handlers/fusionados.ts', () => {

    const DEV_URL_LOGIN = 'https://73up929qvd.execute-api.us-east-1.amazonaws.com/dev/login';
    const DEV_URL_FUS = 'https://73up929qvd.execute-api.us-east-1.amazonaws.com/dev/fusionados/1';

    test('handler() Endpoint without auth returns error', async () => {
         const settings = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(DEV_URL_FUS);
        const data = await response.json();

        expect(data).toHaveProperty('error')
        expect(data.error).toBe('No token provided');
    })

    test('handler() Endpoint process a requeriment for get people data', async () => {
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

        const response = await fetch(DEV_URL_FUS, settings);
        const data = await response.json();

        expect(data).toMatchObject({
                id: '1',
                createdAt: 1733863168330,
                name: 'Luke Skywalker',
                height: '172',
                mass: '77',
                hair_color: 'blond',
                skin_color: 'fair',
                eye_color: 'blue',
                birth_year: '19BBY',
                gender: 'male'
        })
    })
})