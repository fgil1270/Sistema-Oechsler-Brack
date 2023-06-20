import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "../../users/service/users.service";
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService
    ) {}

    async validateUser(name: string, password: string) {

        const user = await this.usersService.findByName(name);
        console.log({peticion: "validar usuario", datos: user});
        
        const isMatch = await bcrypt.compare(password, user.password); 
        console.log(isMatch);
        
        if(user && isMatch){
            const payload = { id: user.id, username: user.name};
            const access_token = this.generateJWT(payload);
            return access_token;
        }
        
        throw new NotFoundException(`Contraseña incorrecta`);
        
    }

    generateJWT(user: any){
        return {
            access_token: this.jwtService.sign(user),
            user,
        };
    }
}
