import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between, Code } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { createWriteStream } from 'fs';
import { join } from 'path';
import { mkdirSync, existsSync, writeFileSync } from 'fs';

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
            const path = join(__dirname, `../../../documents/empleados/${name[1]}`);
           
            const filepath = join(path, name[2]);
            console.log(filepath) // Cambiar 'archivos' por la ruta donde deseas almacenar los archivos

            // Verifica si la ruta existe, si no, la crea
            if (!existsSync(path)) {
                mkdirSync(path, { recursive: true });
            }

            // Guarda el archivo en la ruta especificada
            writeFileSync(filepath, archivo.buffer);
        });
        return;
        return urls;
        console.log('files', files);
    }
}
