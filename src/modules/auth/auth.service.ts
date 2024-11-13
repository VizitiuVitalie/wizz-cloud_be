import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UserRepo } from "../user/user.repo";
import { AuthDto } from './dto/auth.dto';
import { UserDomain } from "../user/domain/user.domain";


@Injectable()
export class AuthService {
    constructor(@Inject(UserRepo) private readonly userRepo: UserRepo) { }

    public async register(dto: AuthDto): Promise<any> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser: UserDomain = {
            id: null,
            fullName: dto.fullName,
            email: dto.email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return this.userRepo.save(newUser);
    }

    public async login(dto: AuthDto): Promise<any> {
        return dto;
    }

    public async logout(bearer: string) {
        return bearer;
    }
}