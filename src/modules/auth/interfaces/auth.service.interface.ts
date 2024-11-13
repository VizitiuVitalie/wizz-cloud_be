import { AuthDto } from "../dto/auth.dto";

export interface AuthServiceInterface {
    register(dto: AuthDto): Promise<any>;
    login(dto: AuthDto): Promise<any>;
    logout(bearer: string);
}