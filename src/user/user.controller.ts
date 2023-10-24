import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/customGuard';
import { GetUser } from 'src/auth/decorator';
import { editUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    console.log({
      user: user,
    });
    return user;
  }

  @Get('mee')
  getMyEmail(@GetUser('email') email: string) {
    console.log({
      email: email,
    });
    return {
      email: email,
    };
  }

  @Patch()
  editUser(@GetUser('id') id: number, @Body() dto: editUserDto) {
    return this.userService.editUser(id, dto);
  }
}
