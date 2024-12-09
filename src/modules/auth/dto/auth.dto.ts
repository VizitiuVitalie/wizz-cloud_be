export class RegisterDto {
    fullName: string;
    email: string;
    password: string;
    deviceId: string;
}

export class LoginDto {
    email: string;
    password: string;
    deviceId: string;
}