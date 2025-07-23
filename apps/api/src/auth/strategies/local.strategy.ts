import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "../auth.service";
import {Injectable} from "@nestjs/common";


// const s = new Strategy({
//     usernameField
// })

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: "email",
        });
    }

    validate(email: string, password: string) {
        return this.authService.validateLocalUser(email, password);
    }
}