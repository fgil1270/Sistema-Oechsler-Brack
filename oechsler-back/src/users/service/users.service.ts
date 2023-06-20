import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

import { User } from "../entity/user.entity";
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { string } from 'joi';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService,
    ){}

    async create(user: CreateUserDto) {
        const newUser = this.userRepository.create(user);
        this.hashPassword(newUser.password).then((x) => {
            newUser.password = x
        });
        
        return await this.userRepository.save(newUser);
    }

    async findAll() {
        const userAll = await this.userRepository.count();
        const users = await this.userRepository.find();
        return {
            total: userAll,
            users: users
        }
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOneBy({id:id});
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }
        return {
            user
        }
    }

    async findByName(name: string){
        
        const user = await this.userRepository.findOneBy({
            name : name
        });
        //console.log({peticion: "buscar nombres", name: name, user: user});
        if (!user) {
            throw new NotFoundException(`User "${name}" not found`);
        }
        return user;
        
    }
    
    async update(id: number, userData: UpdateUserDto){
        const user = await this.userRepository.findOneBy({id});
        if (userData.password) {
            await this.hashPassword(userData.password).then((x) => {
                userData.password = x
            });
        }
        this.userRepository.merge(user, userData);
        return await this.userRepository.update(id, user);
    }


    async delete(id: number) {
        const user = await this.findOne(id);
        const deleteUser = await this.userRepository.softDelete(id);
        if(!deleteUser) {
            throw new NotFoundException('No se puedo eliminar el usuario');
        }
        return  {
            user: id,
            affected: deleteUser.affected

        };
        
    }

    async hashPassword(password: string){
        if (!password) return;

        const salt = await bcrypt.genSaltSync(10);

        const newPassword = await bcrypt.hashSync(password, salt);
        return newPassword;
    }


}
