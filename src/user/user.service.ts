import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { editUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  editUser = async (userId: number, editDto: editUserDto) => {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...editDto,
      },
    });
    delete user.hash;
    return user;
  };
}
