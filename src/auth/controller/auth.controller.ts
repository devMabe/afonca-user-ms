import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Auth } from '../model/auth';
import { User } from 'src/users/model/User';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthResponse, AuthSchema } from '../schemas/auth.schema';
import { UserSchema } from 'src/users/schemas/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: AuthSchema })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    type: AuthResponse,
  })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  async login(@Body() { username, password }: Auth) {
    return this.authService.login(username, password);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: UserSchema })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado correctamente',
    type: UserSchema,
  })
  @ApiResponse({
    status: 400,
    description: 'Error en los datos proporcionados',
  })
  async register(@Body() params: User) {
    return this.authService.register(params);
  }
}
