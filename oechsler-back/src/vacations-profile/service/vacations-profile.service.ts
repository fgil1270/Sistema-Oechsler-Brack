import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateVacationsProfileDto } from '../dto/create-vacations-profile.dto';
import { VacationsProfile } from "../entities/vacations-profile.entity";

@Injectable()
export class VacationsProfileService {
  constructor(
    @InjectRepository(VacationsProfile) private vacationsProfileRepository: Repository<VacationsProfile>
  ){}

  async create(createVacationsProfileDto: CreateVacationsProfileDto) {
    const vacationsProfileExist = await this.vacationsProfileRepository.findOne({
      where: {
        cv_code: Like(`%${createVacationsProfileDto.cv_code}%`)
      }
    });

    if (vacationsProfileExist?.id) {
      throw new BadRequestException(`El Perfil de vacaciones ya existe`);
    }

    const vacationsProfile = this.vacationsProfileRepository.create(createVacationsProfileDto);
    return await this.vacationsProfileRepository.save(vacationsProfile);
  }

  async findAll() {
    const total = await this.vacationsProfileRepository.count();
    const vacationsProfiles = await this.vacationsProfileRepository.find();
    
    if (!vacationsProfiles) {
      throw new NotFoundException(`Views not found`);
    }
    return {
      total: total,
      vacationsProfiles: vacationsProfiles
    };
  }

  async findOne(id: number) {
    const vacationsProfile = await this.vacationsProfileRepository.findOne({
      where: {
        id: id
      }
    });
    if (!vacationsProfile) {
      throw new NotFoundException(`Vacations Profile #${id} not found`);
    }
    return {
      vacationsProfile
    };
  }

  async update(id: number, updateVacationsProfileDto: CreateVacationsProfileDto) {
    const vacationsProfile = await this.vacationsProfileRepository.findOneBy({id});
    this.vacationsProfileRepository.merge(vacationsProfile, updateVacationsProfileDto);
    return await this.vacationsProfileRepository.update(id, vacationsProfile);
  }

  async remove(id: number) {
    return await this.vacationsProfileRepository.softDelete(id);
  }
}
