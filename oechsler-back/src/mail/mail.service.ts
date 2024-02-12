/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface MailData {
    employee: string;
    employyeNumber: number;
    incidence: string;
    dia: string;
}

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmailCreateIncidence(subject: string, mailData: MailData, to: string[] ) {

        await this.mailerService.sendMail({
            
            //to: 'E.Munoz@oechsler.mx',
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

    async sendEmailAutorizaIncidence(subject: string, mailData: MailData, to: string[] ) {

        await this.mailerService.sendMail({
            to: to,
            from: 'notificationes@oechsler.mx',
            subject: subject,
            template: 'autoriza_incidencia', // `.hbs` extension is appended automatically
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

    async sendEmailRechazaIncidence(subject: string, mailData: MailData, to: string[] ) {

        await this.mailerService.sendMail({
            to: to,
            from: 'notificationes@oechsler.mx',
            subject: subject,
            template: 'rechaza_incidencia', // `.hbs` extension is appended automatically
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



 }
