import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';

import { CreateJobDto } from '../dto/create-job.dto';
import { Job } from '../entities/job.entity';

@Injectable()
export class JobsService {
  constructor(@InjectRepository(Job) private jobRepository: Repository<Job>) {}

  async create(createJobDto: CreateJobDto) {
    const jobCodeExist = await this.jobRepository.findOne({
      where: {
        cv_code: Like(`%${createJobDto.cv_code}%`),
      },
    });

    if (jobCodeExist) {
      throw new BadRequestException(`El Codigo ya existe`);
    }

    const jobNameExist = await this.jobRepository.findOne({
      where: {
        cv_name: Like(`%${createJobDto.cv_name}%`),
      },
    });

    if (jobNameExist) {
      throw new BadRequestException(`El Puesto ya existe`);
    }

    const job = await this.jobRepository.create(createJobDto);
    return await this.jobRepository.save(job);
  }

  async findAll() {
    const total = await this.jobRepository.count();
    const jobs = await this.jobRepository.find();

    if (!jobs) {
      throw new NotFoundException(`Jobs not found`);
    }
    return {
      total: total,
      jobs: jobs,
    };
  }

  async findOne(id: number) {
    const job = await this.jobRepository.findOne({
      relations: {
        jobDocument: true,
      },
      where: {
        id: id,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job #${id} not found`);
    }
    return job;
  }

  async findName(name: string) {
    const job = await this.jobRepository.findOne({
      where: {
        cv_name: Like(`%${name}%`),
      },
    });
    if (!job) {
      return null;
      //throw new NotFoundException(`Job #${name} not found`);
    }
    return { job };
  }

  async findFilesByJob(id: number) {
    const job = await this.jobRepository.findOne({
      relations: {
        jobDocument: true,
      },
      where: {
        id: id,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job #${id} not found`);
    }
    
    return { 
      path: join(
        __dirname,
        `../../../${job.jobDocument[0].route}`,
        job.jobDocument[0].name,
      ),
      fileName: job.jobDocument[0].name,
    };
  }

  async getCompetencies(id: number) {
    const job = await this.jobRepository.findOne({
      relations: {
        competence: true,
      },
      where: {
        id: id,
      },
    });

    return job;
  }

  async update(id: number, updateJobDto: CreateJobDto) {
    const job = await this.jobRepository.findOne({
      where: {
        id: id,
      },
    });

    
    //si el codigo es distinto verifica que no exista otro codigo igual
    if(job.cv_code != updateJobDto.cv_code){
      const jobCodeExist = await this.jobRepository.findOne({
        where: {
          cv_code: Like(`%${updateJobDto.cv_code}%`),
        },
      });

      if (jobCodeExist?.id) {
        throw new BadRequestException(`El Codigo ya existe`);
      }
    }
    //si el nombre es distinto verifica que no exista otro nombre igual
    if(job.cv_name != updateJobDto.cv_name){
      const jobNameExist = await this.jobRepository.findOne({
        where: {
          cv_name: Like(`%${updateJobDto.cv_name}%`),
        },
      });
  
      if (jobNameExist?.id) {
        throw new BadRequestException(`El Puesto ya existe`);
      }
    }
    

    return await this.jobRepository.update({ id }, updateJobDto);
  }

  async remove(id: number) {
    const job = await this.jobRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job #${id} not found`);
    }

    return await this.jobRepository.softDelete({ id });
  }
}
