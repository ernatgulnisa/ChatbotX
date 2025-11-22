import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
    } | {
        message: string;
    }>;
    register(body: any): Promise<{
        name: string | null;
        id: number;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): any;
}
