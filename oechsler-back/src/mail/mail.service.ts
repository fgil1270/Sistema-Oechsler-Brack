/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail(subject: string, message:string, name:string = '' ) {

        await this.mailerService.sendMail({
            //to: 'E.Munoz@oechsler.mx',
            to: 'f.gil@oechsler.mx',
            from: 'notificationes@oechsler.mx',
            subject: subject,
            template: 'confirmation', // `.hbs` extension is appended automatically
            context: {  // ✏️ filling curly brackets with content
                code: 'cf1a3f828287', 
                name: name,
                url: 'www.google.com',
                message:message
            },
        }) 
        .then((success) => {
        console.log('correcto:', success)
        })
        .catch((err) => {
            return true;
        });
    }



 }
