import { IsString, IsStrongPassword } from "class-validator";

export class CreateUserRequest {

    @IsString()
    username: string;

    @IsStrongPassword()
    password: string;
}