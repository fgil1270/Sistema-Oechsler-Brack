/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ICalCalendar } from 'ical-generator'
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

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmailCreateIncidence(subject: string, mailData: MailData, to: string[]) {

        await this.mailerService.sendMail({
            to: to,
            from: 'notificationes@oechsler.mx',
            subject: subject,
            template: 'crear_incidencia', // `.hbs` extension is appended automatically
            context: mailData,
        }) 
        .then((success) => {
        //console.log('correcto:', success);
        return true;
        })
        .catch((err) => {
            console.log('error:', err);
            return true;
        });
    }

    async sendEmailAutorizaIncidence(subject: string, mailData: MailData, to: string[], calendar: ICalCalendar ) {

        await this.mailerService.sendMail({
            to: to,
            from: 'OechslerMX<notificationes@oechsler.mx>',
            subject: subject,
            template: 'autoriza_incidencia', // `.hbs` extension is appended automatically
            context: mailData,
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
        //console.log('correcto:', success);
        return true;
        })
        .catch((err) => {
            console.log('error:', err);
            return true;
        });
    }

    async sendEmailRechazaIncidence(subject: string, mailData: MailData, to: string[] ) {

        await this.mailerService.sendMail({
            to: to,
            from: process.env.MAIL_USERNAME,
            subject: subject,
            template: 'rechaza_incidencia', // `.hbs` extension is appended automatically
            context: mailData
        }) 
        .then((success) => {
        //console.log('correcto:', success);
        return true;
        })
        .catch((err) => {
            console.log('error:', err);
            return true;
        });
    }

    async sendEmailPDFFile(subject: string, pdfPath: any, to: string[] ) {
        let resp = {error: false, msg: ''};
        let newpath: string = path.resolve(__dirname, `../../documents/temp/objetivos/${pdfPath}`);

        //console.log(newpath);
        await this.mailerService.sendMail({
            to: to,
            from: process.env.MAIL_USERNAME,
            subject: subject,
            //text: 'Adjunto está el informe en PDF.',
            html: '<b>Adjunto está el informe en PDF.</b>',  
            attachments: [
                /* {
                    filename: 'license.txt',
                    path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE',
                    contentType: 'text/plain'
                } */
                { 
                    filename: 'objetivos.pdf',
                    content: fs.createReadStream(newpath), // file path or Buffer or Stream instance
                    contentType: 'application/pdf',
                } 
            ],
        }).then((success) => {
        //console.log('correcto:', success);
            resp.error = false;
            resp.msg = 'success';
        })
        .catch((err) => {
            console.log('error:', err);
            resp.error = true;
            resp.msg = err;
        });

        

        fs.unlinkSync(newpath);
        return resp;


    }



 }
