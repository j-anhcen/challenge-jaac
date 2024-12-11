import { APIGatewayProxyEvent } from 'aws-lambda';
import { JwtAdapter } from '../plugins';

module.exports.handler = async (event: APIGatewayProxyEvent) => {
    const { email } = JSON.parse(event.body!);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return {
            body: JSON.stringify({ error: `Invalid email format` }),
            statusCode: 400,
        };
    }

    const token = await JwtAdapter.generateToken({ email });

    return {
        body: JSON.stringify({ token }),
        statusCode: 200,
    };
}