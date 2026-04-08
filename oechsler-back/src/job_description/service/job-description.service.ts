import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateJobDescriptionDto } from '../dto/create_job_description.dto';
import { JobDescription } from '../entities/job_description.entity';
import { JobActivity } from '../entities/job_activities.entity';
import { JobReportHim } from '../entities/job_report_him.entity';
import { JobHelp } from '../entities/job_help.entity';
import { JobAbsenceDelegate } from '../entities/job_absence_delegate.entity';
import { JobInteractionArea } from '../entities/job_interaction_area.entity';
import { JobDegree } from '../entities/job_degree.entity';
//import { JobCompetence } from '../../jobs/entities/job_competence.entity';
import { JobAreaExperience } from '../entities/job_area_experience.entity';
import { CustomLoggerService } from '../../logger/logger.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { JobsService } from '../../jobs/service/jobs.service';
import { CompetenceService } from '../../competence/service/competence.service';



@Injectable()
export class JobDescriptionService {
  private log = new CustomLoggerService();
  constructor(
    @InjectRepository(JobDescription) private jobDescriptionRepository: Repository<JobDescription>,
    @InjectRepository(JobActivity) private jobActivityRepository: Repository<JobActivity>,
    @InjectRepository(JobReportHim) private jobReportHimRepository: Repository<JobReportHim>,
    @InjectRepository(JobHelp) private jobHelpRepository: Repository<JobHelp>,
    @InjectRepository(JobAbsenceDelegate) private jobAbsenceDelegateRepository: Repository<JobAbsenceDelegate>,
    @InjectRepository(JobInteractionArea) private jobInteractionAreaRepository: Repository<JobInteractionArea>,
    @InjectRepository(JobDegree) private jobDegreeRepository: Repository<JobDegree>,
    @InjectRepository(JobAreaExperience) private jobAreaExperienceRepository: Repository<JobAreaExperience>,
    //@InjectRepository(JobCompetence) private jobCompetence: Repository<JobCompetence>,
    private employeesService: EmployeesService,
    private JobsService: JobsService,
  ) { }

  //crear un nuevo job-description
  async create(createJobDescriptionDto: CreateJobDescriptionDto, user: any) {

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
      createdJobDescription.area = createJobDescriptionDto.areaName;
      createdJobDescription.description = createJobDescriptionDto.description;
      createdJobDescription.authorizeLeader = userCreate.emp;
      createdJobDescription.lead_authorized_at = new Date();
      createdJobDescription.job = job;

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

      //estructura organizacional
      //leader
      if (createJobDescriptionDto.estructuraOrganizacional.idJobLeader) {
        let jobLeader = await this.JobsService.findOne(createJobDescriptionDto.estructuraOrganizacional.idJobLeader);
        if (!jobLeader) {
          throw new BadRequestException('No se encontro el puesto líder asociado al job description');
        }
        savedJobDescription.jobLeader = jobLeader;
        await this.jobDescriptionRepository.save(savedJobDescription);
      }

      //le reportan
      if (createJobDescriptionDto.estructuraOrganizacional.idJobReportan && createJobDescriptionDto.estructuraOrganizacional.idJobReportan.length > 0) {
        const reportHimJobs = await Promise.all(
          createJobDescriptionDto.estructuraOrganizacional.idJobReportan.map(async (idJobReportHim) => {
            let jobReportHim = await this.JobsService.findOne(idJobReportHim);
            if (!jobReportHim) {
              throw new BadRequestException(`No se encontro el puesto que le reporta con ID ${idJobReportHim}`);
            }
            return this.jobReportHimRepository.create({
              job: jobReportHim,
              jobDescription: savedJobDescription,
            });
          })
        );
        await this.jobReportHimRepository.save(reportHimJobs);

      }

      //brindan apoyo a
      if (createJobDescriptionDto.estructuraOrganizacional.idApoya && createJobDescriptionDto.estructuraOrganizacional.idApoya.length > 0) {
        const helpJobs = await Promise.all(
          createJobDescriptionDto.estructuraOrganizacional.idApoya.map(async (idHelpJob) => {
            let jobHelp = await this.JobsService.findOne(idHelpJob);
            if (!jobHelp) {
              throw new BadRequestException(`No se encontro el puesto que brinda apoyo con ID ${idHelpJob}`);
            }
            return this.jobHelpRepository.create({
              job: jobHelp,
              jobDescription: savedJobDescription,
            });
          })
        );
        await this.jobHelpRepository.save(helpJobs);
      }

      //apoyado en cao de ausencia
      if (createJobDescriptionDto.estructuraOrganizacional.idApoyado && createJobDescriptionDto.estructuraOrganizacional.idApoyado.length > 0) {
        const absenceDelegateJobs = await Promise.all(
          createJobDescriptionDto.estructuraOrganizacional.idApoyado.map(async (idAbsenceDelegateJob) => {
            let jobAbsenceDelegate = await this.JobsService.findOne(idAbsenceDelegateJob);
            if (!jobAbsenceDelegate) {
              throw new BadRequestException(`No se encontro el puesto que puede apoyar por ausencia con ID ${idAbsenceDelegateJob}`);
            }
            return this.jobAbsenceDelegateRepository.create({
              job: jobAbsenceDelegate,
              jobDescription: savedJobDescription,
            });
          })
        );
        await this.jobAbsenceDelegateRepository.save(absenceDelegateJobs);
      }

      //areas de interaccion
      if (createJobDescriptionDto.interactions && createJobDescriptionDto.interactions.length > 0) {
        const interactionAreas = await Promise.all(
          createJobDescriptionDto.interactions.map(async (interaction) => {
            return this.jobInteractionAreaRepository.create({
              name: interaction.name,
              jobDescription: savedJobDescription,
            });
          })
        );
        await this.jobInteractionAreaRepository.save(interactionAreas);
      }

      //areas de estudio
      if (createJobDescriptionDto.estudios && createJobDescriptionDto.estudios.length > 0) {
        const degreeAreas = await Promise.all(
          createJobDescriptionDto.estudios.map(async (estudio) => {
            return this.jobDegreeRepository.create({
              degree: estudio.estudio,
              dominio: estudio.domain,
              jobDescription: savedJobDescription,
            });
          })
        );
        await this.jobDegreeRepository.save(degreeAreas);
      }

      //competencias
      if (createJobDescriptionDto.competencias && createJobDescriptionDto.competencias.length > 0) {
        const competenceNew = await Promise.all(
          createJobDescriptionDto.competencias.map(async (competencia) => {
            return await this.JobsService.createJobCompetence(job.id, competencia.idcompetencia, competencia.domain);
          })
        );

      }

      //areas de experiencia
      if (createJobDescriptionDto.experienceAreas && createJobDescriptionDto.experienceAreas.length > 0) {
        const experienceAreas = await Promise.all(
          createJobDescriptionDto.experienceAreas.map(async (area) => {
            return this.jobAreaExperienceRepository.create({
              area: area.name,
              experience: area.year,
              jobDescription: savedJobDescription,
            });
          })
        );
        await this.jobAreaExperienceRepository.save(experienceAreas);
      }
      return { accion: 'This action adds a new job-description' };
    } catch (error) {
      this.log.log(`Error creating job description: ${error.message}`);
      console.log('Error creating job description:', error.message);
      throw new Error(`Failed to create job description: ${error}`);
    }



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
