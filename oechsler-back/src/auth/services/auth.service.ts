import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "../../users/service/users.service";
import { RolesService } from "../../roles/service/roles.service";


@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService, 
        private jwtService: JwtService,
        private roleService: RolesService
    ) {}

    async validateUser(name: string, password: string) {

        const user = await this.usersService.findByName(name);
        const isMatch = await bcrypt.compare(password, user.password); 
        const roleUser = user.roles.map( r => r.name);
        let roleView = await this.usersService.rolesViews(roleUser);
       
        if(user && isMatch){
            
            //user.roles.forEach(role => roles.push(role.name))
            const roles = roleView.map(role => (
                {
                    id: role.id,
                    name: role.name,
                    vistas: role.views.map(vista => (
                        {
                            name: vista.name,
                        }
                    ))
                }
            ))
            //DATOS DEL USUARIO LOGUEADO
            const payload = { 
                id: user.id, 
                username: user.name, 
                //roles: user.roles.map( r => r.name),
                roles: roles
            };
            
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
