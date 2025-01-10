/*
https://docs.nestjs.com/providers#services
*/
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';


@Injectable()
export class TaskService {
    
    //verificar status de solicitud al sat
    @Cron('*/1 * * * *')
    solicitudSatXML() {
        
    }

    //enviar correo cada hora
    // 0 01 * * *
    @Cron('*/1 * * * *', {
        timeZone: 'America/Mexico_City',// Especifica la zona horaria de México
        //o si se requiere un offset se puede usar utcOffset
        //utcOffset: '-06:00' // ejemplo para centro de mexico
    })
    async enviarCorreo() {
        
        //const fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        
    }

    @Cron('0 0 */2 * *')
    async enviarCorreoCada48Horas() {
        
        /* const subject = 'Correo cada 48 horas';
        const mailData = {
        dia: new Date().toISOString(),
        employeeAutoriza: 'Sistema',
        };
        const to = ['recipient@example.com'];
        await this.mailService.sendEmailCreateIncidence(subject, mailData, to); */
    }
}
