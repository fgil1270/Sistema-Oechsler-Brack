import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateJobDescriptionDto } from '../dto/create_job_description.dto';
import { JobDescription } from '../entities/job_description.entity';
import { JobActivity } from '../entities/job_activities.entity';
import { CustomLoggerService } from 'src/logger/logger.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { JobsService } from '../../jobs/service/jobs.service';



@Injectable()
export class JobDescriptionService {
  private log = new CustomLoggerService();
  constructor(
    @InjectRepository(JobDescription) private jobDescriptionRepository: Repository<JobDescription>,
    @InjectRepository(JobActivity) private jobActivityRepository: Repository<JobActivity>,
    private employeesService: EmployeesService,
    private JobsService: JobsService
  ) { }

  //crear un nuevo job-description
  async create(createJobDescriptionDto: CreateJobDescriptionDto, user: any) {
    console.log(createJobDescriptionDto);

    return;
    try {
      let userCreate = await this.employeesService.findOne(user.idEmployee);
      let job = await this.JobsService.findOne(createJobDescriptionDto.jobId);

      if (!userCreate?.emp) {
        throw new BadRequestException('No se encontro el empleado del usuario autenticado');
      }

      if (!job) {
        throw new BadRequestException('No se encontro el puesto asociado al job description');
      }

      //Crear el job description
      const createdJobDescription = this.jobDescriptionRepository.create();
      createdJobDescription.type_job = createJobDescriptionDto.employeeType;
      createdJobDescription.status = 'Pendiente';
      createdJobDescription.description = createJobDescriptionDto.description;
      createdJobDescription.authorizeLeader = userCreate.emp;
      createdJobDescription.lead_authorized_at = new Date();
      createdJobDescription.job = job;

      console.log('Created Job Description:', createdJobDescription);
      // Guardar el job description en la base de datos
      const savedJobDescription = await this.jobDescriptionRepository.save(createdJobDescription);

      // Crear las actividades relacionadas al job description
      const jobActivities = createJobDescriptionDto.responsibilities.map((activity) =>
        this.jobActivityRepository.create({
          activity: activity.responsibility,
          jobDescription: savedJobDescription,
        }),
      );

      await this.jobActivityRepository.save(jobActivities);



    } catch (error) {
      console.log('Error creating job description:', error);
      throw new BadRequestException('Failed to create job description');
    }


    return 'This action adds a new job-description';
  }

  //buscar todos los job-description
  findAll() {
    return `This action returns all job-descriptions`;
  }

  //buscar un job-description por id
  findOne(id: number) {
    return `This action returns a #${id} job-description`;
  }


}
