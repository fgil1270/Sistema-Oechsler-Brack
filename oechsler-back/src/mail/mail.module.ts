
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
                    host: '192.168.26.6',
                    port: 25,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'test', // generated ethereal user
                        pass: 'test', // generated ethereal password
                    },
                },
                defaults: {
                    from: '"nest-modules" <test@oechslet.mx>',
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
