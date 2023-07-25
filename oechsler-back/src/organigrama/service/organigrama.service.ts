import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateOrganigramaDto } from '../dto/create-organigrama.dto';
import { Organigrama } from "../entities/organigrama.entity";

@Injectable()
export class OrganigramaService {
  constructor(
    @InjectRepository(Organigrama) private organigramaRepository: Repository<Organigrama>
  ){}

  async create(createOrganigramaDto: CreateOrganigramaDto) {
    
  }

  async findAll() {
    return `This action returns all organigrama`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} organigrama`;
  }

  async update(id: number, updateOrganigramaDto: CreateOrganigramaDto) {
    return `This action updates a #${id} organigrama`;
  }

  async remove(id: number) {
    return `This action removes a #${id} organigrama`;
  }
}
