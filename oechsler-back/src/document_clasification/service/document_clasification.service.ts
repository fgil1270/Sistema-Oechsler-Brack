import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between, Code } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { createWriteStream } from 'fs';
import { join } from 'path';

import { DocumentClasificationDto } from '../dto/document_clasification.dto';
import { DocumentClasification } from '../entities/document_clasification.entity';

@Injectable()
export class DocumentClasificationService {
    constructor(
        @InjectRepository(DocumentClasification) private documentClasificationRepository: Repository<DocumentClasification>
    ){}

    async create(data: DocumentClasificationDto){

    }

    async uploadFile(files: Express.Multer.File[]){
        const urls: string[] = [];
        files.forEach(archivo => {
            console.log('archivo', archivo);
            let name = archivo.originalname.split('-');

           
            const path = join(__dirname, '../../../documents/clasificacion', name[1], name[2]);
            console.log(path) // Cambiar 'archivos' por la ruta donde deseas almacenar los archivos
            return;
            urls.push(path);
            const fileStream = createWriteStream(path);
            fileStream.write(archivo.buffer);
            fileStream.end();
        });
        return urls;
        console.log('files', files);
    }
}
