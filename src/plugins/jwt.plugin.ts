import * as jwt from 'jsonwebtoken';

const SEED_TEST = 'test'

export class JwtAdapter {

    static async generateToken(payload: any, duration: string = '2h') {
        return new Promise((resolve) => {
            jwt.sign(payload, process.env.JWT_SEED! || SEED_TEST, { expiresIn: duration }, (err, token) => {
                if (err) return resolve(null);
                return resolve(token);
            })
        });
    }

    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, process.env.JWT_SEED! || SEED_TEST, (err, decoded) => {
                if (err) return resolve(null);

                return resolve(decoded as T);
            })
        });
    }
}
