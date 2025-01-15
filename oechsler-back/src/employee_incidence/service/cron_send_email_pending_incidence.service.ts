/*
https://docs.nestjs.com/providers#services
*/
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { EmployeeIncidenceService } from './employee_incidence.service';

@Injectable()
export class CronSendEmailPendingIncidenceService {
    
    constructor(private readonly employeeIncidenceService: EmployeeIncidenceService ) {}
    
    //*/1 * * * * enviar correo cada minuto
    //0 */5 * * * * enviar correo cada 5 minutos
    // 0 01 * * * enviar correo cada hora
    //0 0-23/1 * * * enviar correo cada hora
    //0 04 * * * enviar correo cada dia a las 4 am
    @Cron('0 */3 * * * *', {
        timeZone: 'America/Mexico_City',// Especifica la zona horaria de México
        //o si se requiere un offset se puede usar utcOffset
        //utcOffset: '-06:00' // ejemplo para centro de mexico
    })
    async enviarCorreo() {
        const fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        
        if(process.env.PORT == '3501') {
            
            await this.employeeIncidenceService.getReportPendingIncidence();
        }
        
    }

    //0 04 * * * enviar correo cada dia a las 4 am
    @Cron('0 04 * * *', {
        timeZone: 'America/Mexico_City',// Especifica la zona horaria de México
        //o si se requiere un offset se puede usar utcOffset
        //utcOffset: '-06:00' // ejemplo para centro de mexico
    })
    async enviarCorreo48() {
        const fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        await this.employeeIncidenceService.getReportPendingIncidence48();
    }

}
