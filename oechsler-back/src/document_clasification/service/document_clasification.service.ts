import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between, Code } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { DocumentClasificationDto } from '../dto/document_clasification.dto';
import { DocumentClasification } from '../entities/document_clasification.entity';

@Injectable()
export class DocumentClasificationService {
    constructor(
        @InjectRepository(DocumentClasification) private documentClasificationRepository: Repository<DocumentClasification>
    ){}

    async create(data: DocumentClasificationDto){

    }
}
