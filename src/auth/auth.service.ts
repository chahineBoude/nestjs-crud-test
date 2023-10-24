import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Authdto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(dto: Authdto) {
    //generating the password hash
    const hash = await argon.hash(dto.password);
    //save user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      //return JWT
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already used');
        }
      }
      throw error;
    }
  }

  async signin(dto: Authdto) {
    //find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //throw exception if user does not exist
    if (!user) throw new ForbiddenException('Incorrect Credentials');
    //compare passwords
    const pwCompare = await argon.verify(user.hash, dto.password);
    //throw exception if wrong password
    if (!pwCompare) throw new ForbiddenException('Incorrect Credentials');
    //return JWT
    return this.signToken(user.id, user.email);
  }

  signToken = async (
    userId: number,
    userEmail: string,
  ): Promise<{ access_token: string }> => {
    const data = {
      sub: userId,
      email: userEmail,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(data, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  };
}
