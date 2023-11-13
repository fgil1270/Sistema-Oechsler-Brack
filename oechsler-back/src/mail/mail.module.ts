
/*
https://docs.nestjs.com/modules
*/
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

import { MailService } from './mail.service';


@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async () => ({
                transport: {
                    host: 'smtp.gmail.com', //host: '192.168.26.180', smtp.gmail.com
                    //port: 587,
                    secure: false, // true for 465, false for other ports
                    //ignoreTLS: true,
                    auth: {
                        user: 'erikmv021@gmail.com', // generated ethereal user
                        pass: 'nhic fewe fvxf nbrc', // generated ethereal password
                    },
                    /* tls: {
                        // do not fail on invalid certs
                        rejectUnauthorized: false,
                    }, */
                    
                },
                defaults: {
                    from: '"No Reply" <notificationes@oechsler.mx>',
                },
                template: {
                    dir: join(__dirname, './templates'),
                    adapter: new HandlebarsAdapter(), // or new PugAdapter()
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
    ],
    controllers: [],
    providers: [
        MailService,
    ],
    exports: [
        MailService
    ]
})
export class MailModule { }
