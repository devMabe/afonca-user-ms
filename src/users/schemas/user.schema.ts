import { Roles, User, UserReponse } from '../model/User';
import { ApiProperty } from '@nestjs/swagger';

export class UserSchema implements User {
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty({ nullable: true })
  dob?: Date;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class UserSchemaResponse implements UserReponse {
  @ApiProperty({ nullable: true })
  id?: string;
  @ApiProperty({ nullable: true })
  firstName?: string;
  @ApiProperty({ nullable: true })
  lastName?: string;
  @ApiProperty({ nullable: true })
  dob?: Date;
  @ApiProperty({ nullable: true })
  roles?: Roles;
  @ApiProperty({ nullable: true })
  email?: string;
  @ApiProperty({ nullable: true })
  resetCode?: string;
  @ApiProperty({ nullable: true })
  enable?: boolean;
  @ApiProperty({ nullable: true })
  token?: string;
}
