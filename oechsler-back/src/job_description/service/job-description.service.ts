import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, Between, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';

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
    @InjectDataSource() private dataSource: DataSource,
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
      createdJobDescription.status = 'Solicitado';
      createdJobDescription.area = createJobDescriptionDto.areaName;
      createdJobDescription.description = createJobDescriptionDto.description;
      //createdJobDescription.authorizeLeader = userCreate.emp;
      //createdJobDescription.lead_authorized_at = new Date();
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
              type: estudio.type,
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
            return await this.JobsService.createJobCompetence(job.id, competencia.idcompetencia, '');
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

      //leader que autorizara
      if (createJobDescriptionDto.authorization?.leader) {
        let leader = await this.employeesService.findOne(createJobDescriptionDto.authorization.leader);
        if (!leader) {
          throw new BadRequestException('No se encontro el empleado autorizador como líder');
        }
        savedJobDescription.authorizeLeader = leader.emp;
      }

      //manager que autorizara
      if (createJobDescriptionDto.authorization?.manager) {
        let manager = await this.employeesService.findOne(createJobDescriptionDto.authorization.manager);
        if (!manager) {
          throw new BadRequestException('No se encontro el empleado autorizador como jefe de area');
        }
        savedJobDescription.authorizeManager = manager.emp;
      }

      //rh que autorizara
      if (createJobDescriptionDto.authorization?.rh) {
        let rh = await this.employeesService.findOne(createJobDescriptionDto.authorization.rh);
        if (!rh) {
          throw new BadRequestException('No se encontro el empleado autorizador como RH');
        }
        savedJobDescription.authorizeRh = rh.emp;
      }

      return { accion: 'This action adds a new job-description' };
    } catch (error) {
      this.log.log(`Error creating job description: ${error.message}`);
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

  //buscar descripciones de puesto para autorizacion
  //la busqueda debe ser con base al usuario que se loguea
  async findDescriptionsForAuthorization(user: any) {
    try {
      // Si el usuario es admin, retornar todas las descripciones de puesto
      const isAdmin = user.roles?.some((r: { name: string }) => r.name === 'Admin');

      if (isAdmin) {
        let jobDescriptions = await this.jobDescriptionRepository.find({
          relations: {
            job: true,
          },
          where: {
            status: 'Solicitado',
          }
        });

        return jobDescriptions;
      }

      let employee = await this.employeesService.findOne(user.idEmployee);

      if (!employee?.emp) {
        throw new BadRequestException('No se encontro el empleado del usuario autenticado');
      }

      const jobDescriptions = await this.jobDescriptionRepository.find({
        relations: {
          job: true,
          authorizeLeader: true,
        },
        where: [
          {
            authorizeLeader: {
              id: employee.emp.id,
            },
            status: 'Solicitado',
          },
          {
            authorizeManager: {
              id: employee.emp.id,
            },
            status: 'Solicitado',
          },
          {
            authorizeRh: {
              id: employee.emp.id,
            },
            status: 'Solicitado',
          },
        ],
      });

      // Eliminar duplicados en caso de que el empleado aparezca en más de una condición
      const unique = Array.from(new Map(jobDescriptions.map(jd => [jd.id, jd])).values());

      return unique;
    } catch (error) {
    }
  }

  //actualizar un job-description por id
  async update(id: number, updateJobDescriptionDto: CreateJobDescriptionDto) {
    try {
      const jobDescription = await this.jobDescriptionRepository.findOne({
        where: {
          id: id
        },
        relations: {
          job: true,
        },
      });

      if (!jobDescription) {
        throw new NotFoundException(`No se encontro el job description con ID ${id}`);
      }

      let job = jobDescription.job;

      if (!job) {
        throw new BadRequestException('No se encontro el puesto asociado al job description');
      }

      jobDescription.type_job = updateJobDescriptionDto.employeeType;
      jobDescription.area = updateJobDescriptionDto.areaName;
      jobDescription.description = updateJobDescriptionDto.description;

      if (updateJobDescriptionDto.estructuraOrganizacional?.idJobLeader) {
        const jobLeader = await this.JobsService.findOne(updateJobDescriptionDto.estructuraOrganizacional.idJobLeader);
        if (!jobLeader) {
          throw new BadRequestException('No se encontro el puesto lider asociado al job description');
        }
        jobDescription.jobLeader = jobLeader;
      } else {
        jobDescription.jobLeader = null;
      }

      //leader que autorizara
      if (updateJobDescriptionDto.authorization?.leader) {
        let leader = await this.employeesService.findOne(updateJobDescriptionDto.authorization.leader);
        if (!leader) {
          throw new BadRequestException('No se encontro el empleado autorizador como líder');
        }
        jobDescription.authorizeLeader = leader.emp;
      }

      //manager que autorizara
      if (updateJobDescriptionDto.authorization?.manager) {
        let manager = await this.employeesService.findOne(updateJobDescriptionDto.authorization.manager);
        if (!manager) {
          throw new BadRequestException('No se encontro el empleado autorizador como jefe de area');
        }
        jobDescription.authorizeManager = manager.emp;
      }

      //rh que autorizara
      if (updateJobDescriptionDto.authorization?.rh) {
        let rh = await this.employeesService.findOne(updateJobDescriptionDto.authorization.rh);
        if (!rh) {
          throw new BadRequestException('No se encontro el empleado autorizador como RH');
        }
        jobDescription.authorizeRh = rh.emp;
      }

      const savedJobDescription = await this.jobDescriptionRepository.save(jobDescription);


      const currentActivities = await this.jobActivityRepository.find({
        where: { jobDescription: { id: savedJobDescription.id } },
      });
      //si en la actualización se envía una nueva lista de actividades, se eliminan los registros actuales y se crean los nuevos
      if (updateJobDescriptionDto.responsibilities && updateJobDescriptionDto.responsibilities.length > 0) {
        if (currentActivities.length > 0) {
          await this.jobActivityRepository.softRemove(currentActivities);
        }
      }


      const currentReportHim = await this.jobReportHimRepository.find({
        where: { jobDescription: { id: savedJobDescription.id } },
      });
      //si en la actualización se envía una nueva lista de puestos que le reportan, se eliminan los registros actuales y se crean los nuevos
      if (updateJobDescriptionDto.estructuraOrganizacional?.idJobReportan) {
        if (currentReportHim.length > 0) {
          await this.jobReportHimRepository.softRemove(currentReportHim);
        }
      }


      const currentHelp = await this.jobHelpRepository.find({
        where: { jobDescription: { id: savedJobDescription.id } },
      });
      //si en la actualización se envía una nueva lista de puestos que brindan apoyo, se eliminan los registros actuales y se crean los nuevos
      if (updateJobDescriptionDto.estructuraOrganizacional?.idApoya) {
        if (currentHelp.length > 0) {
          await this.jobHelpRepository.softRemove(currentHelp);
        }
      }


      const currentAbsenceDelegate = await this.jobAbsenceDelegateRepository.find({
        where: { jobDescription: { id: savedJobDescription.id } },
      });
      //si en la actualización se envía una nueva lista de puestos que pueden apoyar por ausencia, se eliminan los registros actuales y se crean los nuevos
      if (updateJobDescriptionDto.estructuraOrganizacional?.idApoyado) {
        if (currentAbsenceDelegate.length > 0) {
          await this.jobAbsenceDelegateRepository.softRemove(currentAbsenceDelegate);
        }
      }


      const currentInteractionAreas = await this.jobInteractionAreaRepository.find({
        where: { jobDescription: { id: savedJobDescription.id } },
      });
      //si en la actualización se envía una nueva lista de áreas de interacción, se eliminan los registros actuales y se crean los nuevos
      if (updateJobDescriptionDto.interactions && updateJobDescriptionDto.interactions.length > 0) {
        if (currentInteractionAreas.length > 0) {
          await this.jobInteractionAreaRepository.softRemove(currentInteractionAreas);
        }
      }


      const currentDegrees = await this.jobDegreeRepository.find({
        where: { jobDescription: { id: savedJobDescription.id } },
      });
      //si en la actualización se envía una nueva lista de áreas de estudio, se eliminan los registros actuales y se crean los nuevos
      if (updateJobDescriptionDto.estudios && updateJobDescriptionDto.estudios.length > 0) {
        if (currentDegrees.length > 0) {
          await this.jobDegreeRepository.softRemove(currentDegrees);
        }
      }

      const currentCompetences = await this.JobsService.getCompetencies(job.id);
      //si en la actualización se envía una nueva lista de competencias, se eliminan los registros actuales y se crean los nuevos
      if (updateJobDescriptionDto.competencias && updateJobDescriptionDto.competencias.length > 0) {
        if (currentCompetences.jobCompetences.length > 0) {
          await this.JobsService.deleteJobCompetences(currentCompetences.jobCompetences.map(jc => jc.id));
        }
      }


      const currentExperienceAreas = await this.jobAreaExperienceRepository.find({
        where: { jobDescription: { id: savedJobDescription.id } },
      });
      //si en la actualización se envía una nueva lista de áreas de experiencia, se eliminan los registros actuales y se crean los nuevos
      if (updateJobDescriptionDto.experienceAreas && updateJobDescriptionDto.experienceAreas.length > 0) {
        if (currentExperienceAreas.length > 0) {
          await this.jobAreaExperienceRepository.softRemove(currentExperienceAreas);
        }
      }


      if (updateJobDescriptionDto.responsibilities && updateJobDescriptionDto.responsibilities.length > 0) {
        const jobActivities = updateJobDescriptionDto.responsibilities.map((activity) =>
          this.jobActivityRepository.create({
            activity: activity.responsibility,
            jobDescription: savedJobDescription,
          }),
        );

        await this.jobActivityRepository.save(jobActivities);
      }

      if (updateJobDescriptionDto.estructuraOrganizacional?.idJobReportan && updateJobDescriptionDto.estructuraOrganizacional.idJobReportan.length > 0) {
        const reportHimJobs = await Promise.all(
          updateJobDescriptionDto.estructuraOrganizacional.idJobReportan.map(async (idJobReportHim) => {
            const jobReportHim = await this.JobsService.findOne(idJobReportHim);
            if (!jobReportHim) {
              throw new BadRequestException(`No se encontro el puesto que le reporta con ID ${idJobReportHim}`);
            }
            return this.jobReportHimRepository.create({
              job: jobReportHim,
              jobDescription: savedJobDescription,
            });
          }),
        );

        await this.jobReportHimRepository.save(reportHimJobs);
      }

      if (updateJobDescriptionDto.estructuraOrganizacional?.idApoya && updateJobDescriptionDto.estructuraOrganizacional.idApoya.length > 0) {
        const helpJobs = await Promise.all(
          updateJobDescriptionDto.estructuraOrganizacional.idApoya.map(async (idHelpJob) => {
            const jobHelp = await this.JobsService.findOne(idHelpJob);
            if (!jobHelp) {
              throw new BadRequestException(`No se encontro el puesto que brinda apoyo con ID ${idHelpJob}`);
            }
            return this.jobHelpRepository.create({
              job: jobHelp,
              jobDescription: savedJobDescription,
            });
          }),
        );
        await this.jobHelpRepository.save(helpJobs);
      }

      if (updateJobDescriptionDto.estructuraOrganizacional?.idApoyado && updateJobDescriptionDto.estructuraOrganizacional.idApoyado.length > 0) {
        const absenceDelegateJobs = await Promise.all(
          updateJobDescriptionDto.estructuraOrganizacional.idApoyado.map(async (idAbsenceDelegateJob) => {
            const jobAbsenceDelegate = await this.JobsService.findOne(idAbsenceDelegateJob);
            if (!jobAbsenceDelegate) {
              throw new BadRequestException(`No se encontro el puesto que puede apoyar por ausencia con ID ${idAbsenceDelegateJob}`);
            }
            return this.jobAbsenceDelegateRepository.create({
              job: jobAbsenceDelegate,
              jobDescription: savedJobDescription,
            });
          }),
        );
        await this.jobAbsenceDelegateRepository.save(absenceDelegateJobs);
      }

      if (updateJobDescriptionDto.interactions && updateJobDescriptionDto.interactions.length > 0) {
        const interactionAreas = await Promise.all(
          updateJobDescriptionDto.interactions.map(async (interaction) => {
            return this.jobInteractionAreaRepository.create({
              name: interaction.name,
              jobDescription: savedJobDescription,
            });
          }),
        );
        await this.jobInteractionAreaRepository.save(interactionAreas);
      }

      if (updateJobDescriptionDto.estudios && updateJobDescriptionDto.estudios.length > 0) {
        const degreeAreas = await Promise.all(
          updateJobDescriptionDto.estudios.map(async (estudio) => {
            return this.jobDegreeRepository.create({
              degree: estudio.estudio,
              dominio: estudio.domain,
              type: estudio.type,
              jobDescription: savedJobDescription,
            });
          }),
        );
        await this.jobDegreeRepository.save(degreeAreas);
      }

      if (updateJobDescriptionDto.competencias && updateJobDescriptionDto.competencias.length > 0) {
        await Promise.all(
          updateJobDescriptionDto.competencias.map(async (competencia) => {
            return await this.JobsService.createJobCompetence(job.id, competencia.idcompetencia, '');
          }),
        );
      }

      if (updateJobDescriptionDto.experienceAreas && updateJobDescriptionDto.experienceAreas.length > 0) {
        const experienceAreas = await Promise.all(
          updateJobDescriptionDto.experienceAreas.map(async (area) => {
            return this.jobAreaExperienceRepository.create({
              area: area.name,
              experience: area.year,
              jobDescription: savedJobDescription,
            });
          }),
        );
        await this.jobAreaExperienceRepository.save(experienceAreas);
      }


      return { accion: 'This action updates a job-description' };
    } catch (error) {
      this.log.log(`Error updating job description: ${error}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new Error(`Failed to update job description: ${error}`);
    }
  }

  //actualizar status de un job-description por id
  async updateStatus(id: number, status: string) {
    const jobDescription = await this.jobDescriptionRepository.findOne({
      where: {
        id: id
      },
    });

    if (!jobDescription) {
      throw new NotFoundException(`No se encontro el job description con ID ${id}`);
    }

    jobDescription.status = status;

    await this.jobDescriptionRepository.save(jobDescription);

    return { accion: `This action updates the status of a job-description to ${status}` };
  }

  //buscar los empleados que tengan rol de lider
  //buscar los empleados que su puesto tenga el nombre de Gerente
  //buscar los empleados que su rol sea RH
  async getEmployeesForAuthorization() {
    try {
      let leaders = [];
      let managers = [];
      let rh = [];
      const empleados = await this.dataSource.createQueryBuilder()
        .select('employee.id, employee.name, employee.paternal_surname, employee.maternal_surname, job.cv_name as job_name, role.name as role_name')
        .from('employee', 'employee')
        .innerJoin('job', 'job', 'job.id = employee.jobId')
        .innerJoin('user', 'user', 'user.employeeId = employee.id')
        .innerJoin('user_roles_role', 'userRole', 'userRole.userId = user.id')
        .innerJoin('role', 'role', 'role.id = userRole.roleId')

        .getRawMany();

      for (const emp of empleados) {
        if (emp.role_name === 'Jefe de Area') {
          leaders.push(emp);
        }

        if (String(emp.job_name).toLowerCase().includes('gerente')) {
          managers.push(emp);
        }

        if (emp.role_name === 'RH') {
          rh.push(emp);
        }

      }
      return { leaders, managers, rh };
    } catch (error) {
      this.log.log(`Error getting employees for authorization: ${error}`);
      throw new Error(`Failed to get employees for authorization: ${error}`);
    }
  }


}
