import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local'){
    constructor(private authService: AuthService){
        super();
    }

    async validate(name: string, passport: string){
        
        const user = await this.authService.validateUser(name, passport);
        
        if(!user){
            throw new UnauthorizedException('not allow');
        }
        return user;
    }
}