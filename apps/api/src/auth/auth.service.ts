import {ConflictException, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {hash, verify} from "argon2";
import {AuthJwtPayload} from "./types/auth-jwtPayload";
import {JwtService} from "@nestjs/jwt";
import refreshConfig from "./config/refresh.config";
import {ConfigType} from "@nestjs/config";
import {refreshToken} from "web/lib/auth";

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService,
                private readonly jwtService: JwtService,
                @Inject(refreshConfig.KEY)
                private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    ) {}
    async registerUser(createUserDto: CreateUserDto) {
        const user = await this.userService.findByEmail(createUserDto.email);
        if(user) throw new ConflictException("User already exists");
        return this.userService.create(createUserDto)
    }

    async validateLocalUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) throw new UnauthorizedException("User not found");
        const isPasswordMatched = verify(user.password, password);
        if(!isPasswordMatched) throw new UnauthorizedException("Invalid credentials");

        return { id: user.id, name: user.name };
    }

    async login(userId: number, name: string) {
        const { accessToken } = await this.generateTokens(userId);
        // const hashedRT = await hash(refreshToken());
        // await this.userService.updateHashedRefreshToken(userId, hashedRT);
        return {
            id: userId,
            name: name,
            // role,
            accessToken,
            refreshToken,
        };
    }

    async generateTokens(userId: number) {
        const payload: AuthJwtPayload = { sub: userId };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async validateJwtUser(userId: number) {
        const user = await this.userService.findOne(userId);
        if(!user) throw new UnauthorizedException("User not found");
        return {id: user.id};
    }
}

