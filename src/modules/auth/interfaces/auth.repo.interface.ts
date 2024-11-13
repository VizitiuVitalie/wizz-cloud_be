import { AuthDto } from "../dto/auth.dto";

export interface AuthRepoInterface {
    register(dto: AuthDto): Promise<any>;
    login(dto: AuthDto): Promise<any>;
    logout(id: number): string;
}