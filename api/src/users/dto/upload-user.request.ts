import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class PasswordUpdate {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}

export class UpdateUserRequest {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PasswordUpdate) 
  password?: PasswordUpdate;
}