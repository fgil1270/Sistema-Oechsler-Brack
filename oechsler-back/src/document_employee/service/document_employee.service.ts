import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateDocumentEmployeeDto } from '../dto/document_employee.dto';
import { DocumentEmployee } from '../entities/document_employee.entity';
import { EmployeesService } from '../../employees/service/employees.service';
import { DocumentService } from '../../document/service/document.service';

@Injectable()
export class DocumentEmployeeService {
  constructor(
    @InjectRepository(DocumentEmployee)
    private documentEmployeeRepository: Repository<DocumentEmployee>,
    @Inject(forwardRef(() => EmployeesService))
    private employeesService: EmployeesService,
    @Inject(forwardRef(() => DocumentService))
    private documentService: DocumentService,
  ) {}

  async create(data: CreateDocumentEmployeeDto) {
    const file = await this.documentEmployeeRepository.findOne({
      relations: {
        employee: true,
        document: true,
      },
      where: {
        name: data.name,
        employee: {
          id: data.employeeId,
        },
        document: {
          id: data.documentId,
        },
      },
    });

    if (file) {
      return file;
    }
    const employee = await this.employeesService.findMore([data.employeeId]);
    const document = await this.documentService.findById(
      Number(data.documentId),
    );
    const createDocumentEmployee = this.documentEmployeeRepository.create(data);
    createDocumentEmployee.employee = employee.emps[0];
    createDocumentEmployee.document = document;
    const newFile = await this.documentEmployeeRepository.save(
      createDocumentEmployee,
    );
    return newFile;
  }

  async findById(id: number) {
    const file = this.documentEmployeeRepository.findOne({
      relations: {
        employee: true,
        document: true,
      },
      where: {
        id: id,
      },
    });

    return file;
  }

  async findByEmployeeId(id: number) {}

  async findByEmployeeAndDocumentNameAndDocument(
    employeeId: number,
    name: string,
    documentId: number,
  ) {
    const file = await this.documentEmployeeRepository.findOne({
      relations: {
        employee: true,
        document: true,
      },
      where: {
        name: name,
        employee: {
          id: employeeId,
        },
        document: {
          id: documentId,
        },
      },
    });

    return file;
  }

  async findByEmployeeAndDocumentId(employeeId: number, documentId: number) {
    const file = await this.documentEmployeeRepository.findOne({
      relations: {
        employee: true,
        document: true,
      },
      where: {
        employee: {
          id: employeeId,
        },
        document: {
          id: documentId,
        },
      },
    });

    return file;
  }

  async update(id: number) {
    const file = await this.documentEmployeeRepository.findOne({
      relations: {
        employee: true,
        document: true,
      },
      where: {
        id: id,
      },
    });
    if (!file) {
      return file;
      //throw new NotFoundException(`El archivo con el id ${id} no existe`);
    }
    file.updated_at = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'America/Mexico_City' }),
    );
    const updateFile = await this.documentEmployeeRepository.save(file);
    return updateFile;
  }
}
