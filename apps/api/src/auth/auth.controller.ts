import {Body, Controller, Post, UseGuards, Request, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {LocalAuthGuard} from "./guards/local-auth/local-auth.guard";
import {JwtAuthGuard} from "./guards/jwt-auth/jwt-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  registerUser(@Body() createUserDto: CreateUserDto){
    return this.authService.registerUser(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("signin")
  login(@Request() req){
    // console.log('SIGN IN API HIT ✅');
    return this.authService.login(req.user.id, req.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get("protected")
  getAll(@Request() req){
    return {
      message: `You can now access this protected API. This is your user ID: ${req.user.id}`
  }
  }
}
