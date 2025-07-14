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

    //cada minuto
    @Cron('*/1 * * * *', {
        name: 'updateCronRequestCourse',
        timeZone: 'America/Mexico_City',// Especifica la zona horaria de México
        //o si se requiere un offset se puede usar utcOffset
        //utcOffset: '-06:00' // ejemplo para centro de mexico
    })
    async updateCronRequestCourse() {
        const fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        //this.logger.debug('Enviando correo cada minuto'); //mostrar en consola en formato log
        //mostrar en archivo de log
        try {
            await this.requestCourseService.updateCronRequestCourse();
            this.log.log(`Obtener solicitud de curso con status Asignado ${fechaMexico}`);
            //se obtienen las solicitudes de curso con status Asignado


        } catch (err) {
            this.log.error('Error al enviar correo', err);
        }
    }
}