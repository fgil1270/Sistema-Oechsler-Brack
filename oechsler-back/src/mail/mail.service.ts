/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendEmail() {
        await this.mailerService.sendMail({
            to: 'f.gil@oechsler.mx',
            from: 'notificationes@oechsler.mx',
            subject: 'Testing Nest MailerModule ✔',
            template: 'confirmation', // `.hbs` extension is appended automatically
            context: {  // ✏️ filling curly brackets with content
                code: 'cf1a3f828287', 
                name: 'john doe',
                url: 'www.google.com'
            },
        });  
    }



 }
