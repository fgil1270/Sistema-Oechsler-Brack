/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger, } from '@nestjs/common';
import {
    Repository,
    In,
    Not,
    IsNull,
    Like,
    MoreThanOrEqual,
    LessThanOrEqual,
    Between,
    QueryRunner,
    FindOptionsWhere,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';


import { RequestCourseService } from './request_course.service';
import { CustomLoggerService } from '../../logger/logger.service';

@Injectable()
export class CronRequestCourseService {
    constructor(
        private readonly requestCourseService: RequestCourseService
    ) { }

    private log = new CustomLoggerService();
    private fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

    // todos los dias a las 6 am '0 6 * * *'
    // cada minuto '*/1 * * * *'
    @Cron('0 6 * * *', {
        name: 'updateCronRequestCourse',
        timeZone: 'America/Mexico_City',// Especifica la zona horaria de México
        //o si se requiere un offset se puede usar utcOffset
        //utcOffset: '-06:00' // ejemplo para centro de mexico
    })
    async updateCronRequestCourse() {
        //const fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        //this.logger.debug('Enviando correo cada minuto'); //mostrar en consola en formato log
        //mostrar en archivo de log
        try {
            await this.requestCourseService.updateCronRequestCourse();
            this.log.log(`Actualiuzar status de solicitud de curso ${this.fechaMexico}`);
            //se obtienen las solicitudes de curso con status Asignado


        } catch (err) {
            this.log.error('Error al enviar correo', err);
        }
    }

    @Cron('0 6 * * *', {
        name: 'searchMissingDocumentRequestCourse',
        timeZone: 'America/Mexico_City',// Especifica la zona horaria de México
        //o si se requiere un offset se puede usar utcOffset
        //utcOffset: '-06:00' // ejemplo para centro de mexico
    })
    async searchMissingDocumentRequestCourse() {
        try {
            await this.requestCourseService.searchMissingDocumentRequestCourse();
            this.log.log(`Buscar solicitudes de curso con documentos faltantes ${this.fechaMexico}`);
        } catch (err) {
            this.log.error('Error al buscar solicitudes de curso con documentos faltantes', err);
        }
    }

}