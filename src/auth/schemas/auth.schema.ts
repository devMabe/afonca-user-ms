import { ApiProperty } from '@nestjs/swagger';

export class AuthSchema {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}
