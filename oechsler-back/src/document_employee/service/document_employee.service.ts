import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual } from "typeorm";
import { InjectRepository } from '@nestjs/typeorm';

import { CreateDocumentEmployeeDto } from '../dto/document_employee.dto';
import { DocumentEmployee } from '../entities/document_employee.entity';


@Injectable()
export class DocumentEmployeeService {

    constructor() {
        
    }

}
