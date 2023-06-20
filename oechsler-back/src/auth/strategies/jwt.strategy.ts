import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigType } from "@nestjs/config";

import { ExtractJwt, Strategy } from "passport-jwt";
import config from "../../config";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        @Inject(config.KEY) configService: ConfigType<typeof config>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.jwtSecret
        });
    }

    validate(payload: any){
        return payload;
    }
}