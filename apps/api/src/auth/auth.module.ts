import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserService} from "../user/user.service";
import {PrismaService} from "../prisma/prisma.service";
import {LocalStrategy} from "./strategies/local.strategy";
import {JwtModule} from "@nestjs/jwt";
import JwtConfig from "./config/jwt.config";
import {ConfigModule} from "@nestjs/config";
import jwtConfig from "./config/jwt.config";

@Module({
  imports: [JwtModule.registerAsync(
    JwtConfig.asProvider()
  ),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, LocalStrategy],
})
export class AuthModule {}
