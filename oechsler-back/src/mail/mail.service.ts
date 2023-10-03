/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail() {

        await this.mailerService.sendMail({
            to: 'f.gil@oechsler.mx',
            from: 'notification@oechsler.mx',
            subject: 'Testing Nest MailerModule ✔',
            template: 'confirmation', // `.hbs` extension is appended automatically
            context: {  // ✏️ filling curly brackets with content
                code: 'cf1a3f828287', 
                name: 'john doe',
                url: 'www.google.com'
            },
        }) 
        .then((success) => {
        console.log('correcto:', success)
        })
        .catch((err) => {
            throw new NotFoundException('Error al enviar el correo');
        });
    }



 }
