import { CreateUserDto } from '../../users/dto/create-user.dto';

// Re-use CreateUserDto but we can enforce specific rules if needed
export class RegisterDto extends CreateUserDto {}