import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import * as bcrypt from "bcrypt";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService,
    ){}

    async findByName(name: string): Promise<User> {
        return await this.userRepository.findOne({
            where: {
                name: name,
            }
        });
        //const isMatch = await bcrypt.compare(password, hash);
    }

    async findAll(): Promise<User[]> {
        console.log();
        const users = this.userRepository.find();
        return await this.userRepository.find();
    }

    async create(user: User): Promise<User> {
        const hashPass = await bcrypt.hash(user.name, 10)
        user.password = hashPass;
        return await this.userRepository.save(user);
    }

    async update(user: User): Promise<UpdateResult> {
        return await this.userRepository.update(user.id, user);
    }

    async delete(id): Promise<DeleteResult> {
        return await this.userRepository.softDelete(id);
    }


}
