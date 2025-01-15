/*
https://docs.nestjs.com/providers#services
*/
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';


import { EmployeeIncidenceService } from './employee_incidence.service';
import { CustomLoggerService } from 'src/logger/logger.service';

@Injectable()
export class CronSendEmailPendingIncidenceService {
    private readonly logger = new Logger(CronSendEmailPendingIncidenceService.name);
    private log = new CustomLoggerService();
    
    constructor(private readonly employeeIncidenceService: EmployeeIncidenceService) { }
    
    //* * * * * enviar correo cada segundo
    //*/10 * * * * * enviar correo cada 10 segundos
    //*/1 * * * * enviar correo cada minuto
    //0 */5 * * * * enviar correo cada 5 minutos
    // 0 01 * * * enviar correo cada hora
    //0 0-23/1 * * * enviar correo cada hora
    //0 04 * * * enviar correo cada dia a las 4 am
    @Cron('*/10 * * * * *', {
        timeZone: 'America/Mexico_City',// Especifica la zona horaria de México
        //o si se requiere un offset se puede usar utcOffset
        //utcOffset: '-06:00' // ejemplo para centro de mexico
    })
    async enviarCorreo() {
        const fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        this.logger.debug('Enviando correo cada 10 segundos'); //mostrar en consola en formato log
        this.log.log('Enviando correo cada 10 segundos');//mostrar en archivo de log
        if(process.env.PORT == '3501') {
            
            //await this.employeeIncidenceService.getReportPendingIncidence();
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
