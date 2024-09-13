/*
https://docs.nestjs.com/providers#services
*/

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

import { DocumentDto } from '../dto/document.dto';
import { Document } from '../entities/document.entity';
import { DocumentClasificationService } from '../../document_clasification/service/document_clasification.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @Inject(forwardRef(() => DocumentClasificationService))
    private documentClasificationService: DocumentClasificationService,
  ) {}

  async create(data: DocumentDto) {
    const document = await this.documentRepository.findOne({
      relations: {
        documentClasification: true
      },
      where: {
        name: data.name,
        documentClasification: {
          id : data.documentClasificationId
        }
      },
    });

    if (document) {
      return document;
    }

    const documentClasification =
      await this.documentClasificationService.findById(
        data.documentClasificationId,
      );
    const create = this.documentRepository.create(data);
    create.documentClasification = documentClasification;

    const newDocument = await this.documentRepository.save(create);
    return newDocument;
  }

  async findByName(name: string) {
    const document = await this.documentRepository.findOne({ where: { name } });
    return document;
  }

  //buscar documento por nombre y clasificacion
  async findByNameAndClasification(name: string, clasificationId: number) {
    const document = await this.documentRepository.findOne({ 
      relations: {
        documentClasification: true
      },
      where: { 
        name: name,
        documentClasification: {
          id: clasificationId
        }
      } 
    });
    return document;
  }

  async findById(id: number) {
    const document = await this.documentRepository.findOne({
      where: { id },
    });
    return document;
  }
}
