import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {
  Repository,
  In,
  Not,
  IsNull,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
  Code,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

import { DocumentClasificationDto } from '../dto/document_clasification.dto';
import { DocumentClasification } from '../entities/document_clasification.entity';
import { DocumentService } from '../../document/service/document.service';
import { DocumentEmployeeService } from '../../document_employee/service/document_employee.service';
import { EmployeesService } from '../../employees/service/employees.service';
import { JobDocumentService } from '../../job_document/service/job-document.service';
import { JobsService } from '../../jobs/service/jobs.service';

@Injectable()
export class DocumentClasificationService {
  constructor(
    @InjectRepository(DocumentClasification)
    private documentClasificationRepository: Repository<DocumentClasification>,
    @Inject(forwardRef(() => DocumentService))
    private documentService: DocumentService,
    private documentEmployeeService: DocumentEmployeeService,
    private employeesService: EmployeesService,
    private jobDocumentService: JobDocumentService,
    private jobsService: JobsService,
  ) { }

  async create(data: DocumentClasificationDto) {
    const createDocumentClasification = this.documentClasificationRepository.create(data);
    const documentClasification = await this.documentClasificationRepository.save(createDocumentClasification);
    return documentClasification;
  }

  async findAll() {
    const documentClasification = await this.documentClasificationRepository.find();
    return documentClasification;
  }

  async findById(id: number) {
    const documentClasification = await this.documentClasificationRepository.findOne({
      where: {
        id: id,
      },
    });
    return documentClasification;
  }

  //buscar documentos por id de empleado
  async findByIdsEmployee(ids: number[]) {
    const employee = await this.employeesService.findMore(ids);
    const DocumentClasification = await this.documentClasificationRepository.find();
    const documentClasificationFiles = await this.documentClasificationRepository.find({
      relations: {
        document: {
          documentEmployee: {
            employee: true,
          },
        },
      },
      where: {
        document: {
          documentEmployee: {
            employee: {
              id: In(ids),
            },
          },
        },
      },
    });
    const jobs = await this.jobsService.findOne(employee.emps[0].job.id);
    const jobDocuments = await this.jobDocumentService.findByJobId(jobs.id);


    return {
      clasificacion: DocumentClasification,
      files: documentClasificationFiles,
      job: jobs,
      jobDocuments: jobDocuments,
    };
  }

  async findByName(name: string) {
    const documentClasification =
      await this.documentClasificationRepository.findOne({ where: { name } });
    return documentClasification;
  }

  //subir archivos
  async uploadFile(files: Express.Multer.File[]) {
    const urls: string[] = [];
    try {
      for (let index = 0; index < files.length; index++) {
        const archivo = files[index];
        const name = archivo.originalname.split('-');
        let newDocumentClasification: any;
        let newDocument: any;
        let newfile: any;
        let path: any;
        let filepath: any;

        if (name[1] == 'DP') {


          const job = await this.jobsService.findOne(Number(name[0]));
          path = join(
            __dirname,
            `../../../documents/puestos/${job.cv_name}`,
          );
          filepath = join(path, name[2]);

          const createJobDocument = await this.jobDocumentService.create({
            name: name[2],
            route: `documents/puestos/${job.cv_name}`,
            jobId: job.id,
          });


        } else {
          const employee = await this.employeesService.findByEmployeeNumber([
            name[0],
          ]);
          const documentClasification = await this.findByName(name[1]);
          //si no existe la clasificacion de documentos
          //crearla
          newDocumentClasification = documentClasification
            ? documentClasification
            : await this.create({ name: name[1] });


          const document = await this.documentService.findByNameAndClasification(name[2], newDocumentClasification.id);


          //si no existe el documento
          //crearlo
          const nameDocument = name[2].split('.');
          newDocument = document ? document : await this.documentService.create({
            name: nameDocument[0],
            required: true,
            documentClasificationId: Number(newDocumentClasification.id),
          });

          path = join(
            __dirname,
            `../../../documents/empleados/${name[0]}/${newDocumentClasification.name}/${newDocument.name}`,
          );
          filepath = join(path, name[2]);

          //si el archivo ya existe
          //se actualiza
          const file =
            await this.documentEmployeeService.findByEmployeeAndDocumentNameAndDocument(
              employee.emps[0].id,
              name[2],
              Number(newDocument.id),
              documentClasification.id
            );

          if (file) {

            file.route = `documents/empleados/${name[0]}/${newDocumentClasification.name}`;
            const updateFile = await this.documentEmployeeService.update(file.id);
          } else {
            const url = `documents/empleados/${name[0]}/${newDocumentClasification.name}`;
            newfile = file
              ? file
              : await this.documentEmployeeService.create({
                name: name[2],
                employeeId: employee.emps[0].id,
                documentId: newDocument.id,
                route: url,
              });

          }
        }



        // Verifica si la ruta existe, si no, la crea
        if (!existsSync(path)) {
          mkdirSync(path, { recursive: true });
        }

        // Guarda el archivo en la ruta especificada
        writeFileSync(filepath, new Uint8Array(archivo.buffer));

      }
      return {
        error: false,
        message: 'Archivos subidos con éxito',
      };
    } catch (error) {
      return {
        error: true,
        message: error,
      };
    }
  }

  async getFilePath(idFile: number, type: string) {

    let file: any;
    let ruta: string;
    if (type == 'Puestos') {
      file = await this.jobDocumentService.findById(idFile);
    } else {
      file = await this.documentEmployeeService.findById(idFile);
    }

    ruta = type == 'Puestos' ? '' : file.document.name;

    return {
      path: join(
        __dirname,
        `../../../${file.route}/${ruta}`,
        file.name,
      ),
      fileName: file.name,
    };
  }
}
