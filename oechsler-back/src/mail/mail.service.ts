/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ICalCalendar } from 'ical-generator'

export interface MailData {
    employee: string;
    employeeNumber: number;
    incidence: string;
    efectivos: number;
    totalHours: number;
    dia: string;

}

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmailCreateIncidence(subject: string, mailData: MailData, to: string[],  event: ICalCalendar) {

        await this.mailerService.sendMail({
            to: to,
            from: 'notificationes@oechsler.mx',
            subject: subject,
            template: 'crear_incidencia', // `.hbs` extension is appended automatically
            context: mailData,
            alternatives: [
                {
                    contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
                    content: event.toString(),
                },
            ],
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

    async sendEmailAutorizaIncidence(subject: string, mailData: MailData, to: string[], event: ICalCalendar ) {

        await this.mailerService.sendMail({
            to: to,
            from: 'notificationes@oechsler.mx',
            subject: subject,
            template: 'autoriza_incidencia', // `.hbs` extension is appended automatically
            context: mailData,
            alternatives: [
                {
                    contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
                    content: event.toString(),
                },
            ],
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

    async sendEmailRechazaIncidence(subject: string, mailData: MailData, to: string[], event: ICalCalendar ) {

        await this.mailerService.sendMail({
            to: to,
            from: 'notificationes@oechsler.mx',
            subject: subject,
            template: 'rechaza_incidencia', // `.hbs` extension is appended automatically
            context: mailData,
            alternatives: [
                {
                    contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
                    content: event.toString(),
                },
            ],
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



 }
