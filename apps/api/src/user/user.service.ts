import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {PrismaService} from "../prisma/prisma.service";
import {hash} from "argon2";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user} = createUserDto;
    const hashedPassword = await hash(password)
    await this.prisma.user.create({
      data: {
        password: hashedPassword,
        ...user,
      }
    })
  }

  async findByEmail(email: string): Promise<CreateUserDto | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      }
    });
  }
}
