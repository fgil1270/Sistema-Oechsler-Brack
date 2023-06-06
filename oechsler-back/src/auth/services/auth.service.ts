import { Injectable } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "../../users/users.service";
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService
    ) {}

    async validateUser(name: string, password) {
        const user = await this.usersService.findByName(name);
        const isMatch = await bcrypt.compare(password, user.password); 
        
        if(user && isMatch){
            return user;
        }
        return null;
    }

    generateJWT(user: User){
        const payload = { role: user.name, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }
}
