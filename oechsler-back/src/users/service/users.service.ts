import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Repository, UpdateResult, DeleteResult, IsNull, Not, Like, In } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

import { User } from "../entity/user.entity";
import { Role } from "../../roles/entities/role.entity";
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { EmployeesService } from '../../employees/service/employees.service';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        private configService: ConfigService,
        private employeeService: EmployeesService
    ){}

    async create(user: CreateUserDto) {
        const userSearch = await this.userRepository.findOneBy({
                name: Like(`%${user.name}%`)
        });
        if (userSearch?.id) {
            throw new BadRequestException(`El usuario ya existe`);
        }
        const emp = await this.employeeService.findOne(user.employee);
        const mapUser = await this.userRepository.create(
            {
                name: user.name,
                password: user.password,
                email: user.email
            }
        );
        
        
        this.hashPassword(mapUser.password).then((x) => {
            mapUser.password = x
        });
        mapUser.employee = emp.emp;
        const rolesIds = user.rolesIds;
        const roles = await this.roleRepository.findBy({ id: In(rolesIds) });
        mapUser.roles = roles;
        return  await this.userRepository.save(mapUser);
        
    }

    async findAll() {
        const userAll = await this.userRepository.count();
        const users = await this.userRepository.find({
            relations: {
                roles: true,
                employee: true
            }
        });
        return {
            total: userAll,
            users: users
        }
    }

    async findAllDeleted() {
        const userAll = await this.userRepository.count();
        const users = await this.userRepository.find({ 
            relations: {
                roles: true
            },
            where: { deleted_at: Not(IsNull()) },
            withDeleted: true 
        });
        return {
            total: userAll,
            users: users
        }
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({
            relations: {
                roles: true,
                employee: true
            },
            where: {
                id: id
            },
            withDeleted: true
        });
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }
        return {
            user
        }
    }

    async findByName(name: string){
        
        const user = await this.userRepository.findOne({
            relations: {
                roles:true,
                employee: true
            },
            where: {
                name: name
            }
        });
        
        if (!user) {
            throw new NotFoundException(`User "${name}" not found`);
        }
        return user;
    }
    
    async update(id: number, userData: UpdateUserDto){
        const user = await this.findOne(id);
        //const mapUser = await this.userRepository.create(userData);
        const emp = await this.employeeService.findOne(userData.employee);
        const mapUser = await this.userRepository.create(
            {
                name: userData.name,
                //password: userData.password,
                email: userData.email,
                //employee: emp.emp
            }
        );

        if (userData.password) {
            await this.hashPassword(userData.password).then((x) => {
                mapUser.password = x
            });
        }
        const rolesIds = userData.rolesIds;
        const roles = await this.roleRepository.findBy({ id: In(rolesIds) });
        user.user.roles = roles;
        user.user.employee = emp.emp;
        
        //se editan primero los roles
        await this.userRepository.save(user.user);
        //se actualiza la informacion del usuario
        return await this.userRepository.update(id, mapUser);
    }

    async updatePassword(id: number, password: string){
        const user = await this.findOne(id);
        let newPaswword = "";
        console.log(password);
        if (user) {
            await this.hashPassword(password).then((x) => {
                newPaswword = x
            });
        }

        //se actualiza la informacion del usuario
        return await this.userRepository.update(id, {password: newPaswword});
        
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

    async restore(id: number) {
        return await this.userRepository.restore(id);
    }

    async rolesViews( rolesName: string[] ){
        const roleView = await this.roleRepository.find({ 
            relations: {
                views:true
            },
            where: {
                name: In(rolesName) 
            }
            
        });
        

        return roleView;
    }


}
