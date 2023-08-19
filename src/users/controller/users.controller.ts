import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { Roles, User, UserReponse } from '../model/User';
import { RolesGuard } from 'src/auth/guard/roles.guard.middleware';
import { Role } from 'src/auth/decorator/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { UserSchema, UserSchemaResponse } from '../schemas/user.schema';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @UseGuards(RolesGuard)
  @Post('/create')
  @Role('ADMIN')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: UserSchema })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente',
    type: UserSchemaResponse,
  })
  public async createUser(@Body() userBody: User): Promise<UserReponse> {
    return await this.userService.createUser(userBody);
  }

  @UseGuards(RolesGuard)
  @Get('/:id')
  @Role('ADMIN', 'USER')
  @ApiOperation({ summary: 'Obtener información de un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario',
    type: 'UserReponse',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  public async getUser(
    @Param('id') userId: string,
  ): Promise<UserReponse | null> {
    return await this.userService.findUser(userId);
  }

  @UseGuards(RolesGuard)
  @Get()
  @Role('ADMIN', 'USER')
  @ApiOperation({ summary: 'Obtener una lista de todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    type: UserSchemaResponse,
    isArray: true,
  })
  public async getUsers(): Promise<UserReponse[]> {
    return await this.userService.findUsers();
  }

  @UseGuards(RolesGuard)
  @Put('/enable/:id')
  @Role('ADMIN')
  @ApiOperation({ summary: 'Habilitar/deshabilitar un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Estado del usuario actualizado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  public async enableUser(
    @Param('id') id: string,
    @Body() { enable }: { enable: boolean },
  ) {
    return await this.userService.setStatus(id, enable);
  }

  @UseGuards(RolesGuard)
  @Put('/set-role/:id')
  @Role('ADMIN')
  @ApiOperation({ summary: 'Establecer el rol de un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Rol del usuario actualizado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  public async setRole(
    @Param('id') id: string,
    @Body() { roles }: { roles: Roles },
  ) {
    return await this.userService.setRole(id, roles);
  }

  @UseGuards(RolesGuard)
  @Put('/update-profile/:id')
  @Role('ADMIN', 'USER')
  @ApiOperation({ summary: 'Actualizar el perfil de un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario actualizado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  public async updateProfileUser(@Param('id') id: string, @Body() body: User) {
    return await this.userService.updateProfileUser(id, body);
  }

  @UseGuards(RolesGuard)
  @Put('/update-user/:id')
  @Role('ADMIN')
  @ApiOperation({ summary: 'Actualizar la data de un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario actualizado correctamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  public async updateUser(@Param('id') id: string, @Body() body: User) {
    return await this.userService.updateUser(id, body);
  }

  @Post('/reset-password')
  @ApiOperation({
    summary:
      'Restablecer la contraseña de un usuario por su correo electrónico',
  })
  @ApiResponse({
    status: 200,
    description:
      'Solicitud de restablecimiento de contraseña enviada correctamente',
  })
  public async resetPassword(@Body() { email }: { email: string }) {
    return await this.userService.resetPassword(email);
  }

  @Post('/confirm-password')
  @ApiOperation({ summary: 'Confirmar el cambio de contraseña de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada correctamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Código de restablecimiento no válido',
  })
  public async confirmPassword(
    @Body()
    { resetCode, newPassword }: { resetCode: string; newPassword: string },
  ) {
    return await this.userService.confirmPassword(resetCode, newPassword);
  }
}
