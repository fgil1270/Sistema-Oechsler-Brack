/*
https://docs.nestjs.com/providers#services
*/
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { EmployeeIncidenceService } from './employee_incidence.service';

@Injectable()
export class CronSendEmailPendingIncidenceService {
    
    constructor(private readonly employeeIncidenceService: EmployeeIncidenceService ) {}
    //verificar status de solicitud al sat
    @Cron('*/1 * * * *')
    solicitudSatXML() {
        //console.log('Solicitud de descarga de XML cada minuto');
    }

    
    // 0 01 * * * enviar correo cada hora
    @Cron('*/1  * * * *', {
        timeZone: 'America/Mexico_City',// Especifica la zona horaria de México
        //o si se requiere un offset se puede usar utcOffset
        //utcOffset: '-06:00' // ejemplo para centro de mexico
    })
    async enviarCorreo() {
        const fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        await this.employeeIncidenceService.getReportPendingIncidence();
    }

    @Cron('0 0 */2 * *')
    async enviarCorreoCada48Horas() {
        //console.log('Enviar correo cada 48 horas');
        /* const subject = 'Correo cada 48 horas';
        const mailData = {
        dia: new Date().toISOString(),
        employeeAutoriza: 'Sistema',
        };
        const to = ['recipient@example.com'];
        await this.mailService.sendEmailCreateIncidence(subject, mailData, to); */
    }
}
