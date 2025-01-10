/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ICalCalendar } from 'ical-generator';
import * as fs from 'fs';
import * as path from 'path';

export interface MailData {
  employee: string;
  employeeNumber: number;
  incidence: string;
  efectivos: number;
  totalHours: number;
  dia: string;
  employeeAutoriza: string;
}

export interface MailDataPendingIncidence {
  totalIncidencias: number;
  totalTimeCorrection: number;
}

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService
  ) {}

  async sendEmailCreateIncidence(
    subject: string,
    mailData: MailData,
    to: string[],
  ) {
    await this.mailerService
      .sendMail({
        to: to,
        from: 'OechslerMX<notificationes@oechsler.mx>',
        subject: subject,
        template: 'crear_incidencia', // `.hbs` extension is appended automatically
        context: mailData,
      })
      .then((success) => {
        
        return true;
      })
      .catch((err) => {
        
        return true;
      });
  }

  async sendEmailAutorizaIncidence(
    subject: string,
    mailData: MailData,
    to: string[],
    calendar: ICalCalendar,
  ) {
    const envVariables = {
      port: process.env.PORT,
      // Agrega otras variables de entorno que necesites
    };

    await this.mailerService
      .sendMail({
        to: to,
        from: 'OechslerMX<notificationes@oechsler.mx>',
        subject: subject,
        template: 'autoriza_incidencia', // `.hbs` extension is appended automatically
        context: {...mailData, ...envVariables},
        /* headers: {
                'x-invite': {
                  prepared: true,
                  value: 'asd'
                }
              }, */
        icalEvent: {
          filename: 'evento.ics',
          method: 'REQUEST',
          content: calendar.toString(),
        },
        /*  attachments: [
                {
                    //contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
                    //contentDisposition: 'attachment', 
                    filename: 'evento.ics',
                    content: calendar.toString(),
                },
            ], */
        /* alternatives: [
                {
                    contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
                    content: calendar.toString(),
                },
            ], */
      })
      .then((success) => {
        
        return true;
      })
      .catch((err) => {
        
        return true;
      });
  }

  async sendEmailRechazaIncidence(subject: string, mailData: MailData, to: string[]) {
    let port = process.env.PORT || 3000;
    await this.mailerService
      .sendMail({
        to: to,
        from: 'OechslerMX<notificationes@oechsler.mx>',
        subject: subject,
        template: 'rechaza_incidencia', // `.hbs` extension is appended automatically
        context: mailData,
      })
      .then((success) => {
        
        return true;
      })
      .catch((err) => {
        
        return true;
      });
  }

  async sendEmailPDFFile(subject: string, pdfPath: any, to: string[]) {
    const resp = { error: false, msg: '' };
    const newpath: string = path.resolve(
      __dirname,
      `../../documents/temp/objetivos/${pdfPath}`,
    );

    
    try {
      await this.mailerService.sendMail({
        to: to,
        from: process.env.MAIL_USERNAME,
        subject: subject,
        html: '<b>Adjunto está el informe en PDF.</b>',
        attachments: [
          {
            filename: 'objetivos.pdf',
            content: fs.createReadStream(newpath), // file path or Buffer or Stream instance
            contentType: 'application/pdf',
          },
        ],
      });
      resp.msg = 'Email enviado con éxito.';
    } catch (error) {
      resp.error = true;
      resp.msg = error.message || 'Error al enviar el email.';
    }

    // Eliminar el archivo después de enviar el email
    try {
      await fs.unlinkSync(newpath);
    } catch (error) {
      resp.error = true;
      (resp.msg = error.message || 'Error al eliminar el archivo:'), error;

      // Aunque ocurra un error al eliminar el archivo, el email ya fue enviado correctamente
    }

    return resp;
  }


  //Enviar correo a los lideres que tengan incidencias pendientes por autorizar
  async sendEmailPendingIncidence(to: string[], subject: string, mailData: MailDataPendingIncidence) {
    const envVariables = {
      port: process.env.PORT,
      // Agrega otras variables de entorno que necesites
    };
    
    await this.mailerService
      .sendMail({
        to: ['f.gil@oechsler.mx'],
        from: 'OechslerMX<notificationes@oechsler.mx>',
        subject: subject,
        template: 'pending_incidence_authorize', // `.hbs` extension is appended automatically
        context: {...mailData, ...envVariables},
      })
      .then((success) => {
        
        return true;
      })
      .catch((err) => {
        
        return true;
      });
  }
}
