import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwt;
    constructor(jwt: JwtService);
    login(username: string, password: string): {
        accessToken: string;
    };
    validatePayload(payload: {
        sub?: string;
    }): {
        username: string;
    };
}
