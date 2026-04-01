
import { Injectable, Logger, } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';

import { CustomLoggerService } from '../../logger/logger.service';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class CronEmployeeService {

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly mailService: MailService
  ) { }

  private log = new CustomLoggerService();
  private fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

  // todos los dias a las 6 am '0 6 * * *'
  //0 06 * * * enviar correo cada dia a las 6 am
  //cada 5 minutos '*/5 * * * *'
  @Cron('0 06 * * *', {
    name: 'Cumpleaños',
    timeZone: 'America/Mexico_City',// Especifica la zona horaria de México
    //o si se requiere un offset se puede usar utcOffset
    //utcOffset: '-06:00' // ejemplo para centro de mexico
  })
  async updateCronRequestCourse() {
    //const fechaMexico = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
    //this.logger.debug('Enviando correo cada minuto'); //mostrar en consola en formato log
    //mostrar en archivo de log
    try {
      //se obtiene a los cumpleañeros del dia actual
      let cumpleaneros = await this.dataSource.manager
        .createQueryBuilder('employee', 'e')
        .innerJoinAndSelect('e.job', 'j')
        .where('DAY(e.birthdate) = DAY(CURRENT_DATE())')
        .andWhere('MONTH(e.birthdate) = MONTH(CURRENT_DATE())')
        .andWhere('e.deleted_at IS NULL')
        .orderBy('e.employee_number', 'ASC')
        .getMany();

      let jefeTurno = await this.dataSource.manager
        .createQueryBuilder('user', 'u')
        .innerJoinAndSelect('u.roles', 'r')
        .where('r.name = :roleName', { roleName: 'Jefe de Turno' })
        .getMany();

      //se obtienen a los lideres de los cumpleañeros
      let leaders = await this.dataSource.manager
        .createQueryBuilder('organigrama', 'o')
        .leftJoinAndSelect('o.employee', 'emp')
        .leftJoinAndSelect('o.leader', 'l')
        .where('o.employeeId IN (:...employeeIds)', { employeeIds: cumpleaneros.map(c => c.id) })
        .getMany();

      let correos: {
        idLeader: number;
        email: string;
        employee: {
          employee_number: number;
          name: string;
          job: string;
          yearAgo: number;
        }[]
      }[] = [];

      correos.push({
        idLeader: 365,
        email: 'd.kilian@oechsler.mx',
        employee: []
      });

      correos.push({
        idLeader: 600,
        email: 'ca.hernandez@oechsler.mx',
        employee: []
      });

      //se agrega los cumpleañeros a los directivos
      let directivoKilian = correos.find(c => c.email === 'd.kilian@oechsler.mx');
      let directivoCarlos = correos.find(c => c.email === 'ca.hernandez@oechsler.mx');



      //se envia el correo a los lideres
      for (const cumpleanero of cumpleaneros) {
        //si es puesto del cumpleañero es visible por jefe de turno
        //agrega al cumpleañero a los jefes de turno
        //y si no, lo agrega a su lider correspondiente
        if (cumpleanero.job.shift_leader) {

          for (const jefe of jefeTurno) {

            const existingEmail = correos.find(c => c.email === jefe.email);

            if (existingEmail) {
              // Si el correo ya existe, agregar el empleado al array
              existingEmail.employee.push({
                employee_number: cumpleanero.employee_number,
                name: cumpleanero.name + ' ' + cumpleanero.paternal_surname + ' ' + cumpleanero.maternal_surname,
                job: cumpleanero.job.cv_name,
                yearAgo: new Date().getFullYear() - new Date(cumpleanero.birthdate).getFullYear()
              });
            } else {
              // Si no existe, crear nuevo registro con el primer empleado
              correos.push({
                idLeader: jefe.id,
                email: jefe.email,
                employee: [{
                  employee_number: cumpleanero.employee_number,
                  name: cumpleanero.name + ' ' + cumpleanero.paternal_surname + ' ' + cumpleanero.maternal_surname,
                  job: cumpleanero.job.cv_name,
                  yearAgo: new Date().getFullYear() - new Date(cumpleanero.birthdate).getFullYear()
                }]
              });
            }


            //Daniel kilian
            directivoKilian.employee.push({
              employee_number: cumpleanero.employee_number,
              name: cumpleanero.name + ' ' + cumpleanero.paternal_surname + ' ' + cumpleanero.maternal_surname,
              job: cumpleanero.job.cv_name,
              yearAgo: new Date().getFullYear() - new Date(cumpleanero.birthdate).getFullYear()
            });
            //Carlos Hernandez
            directivoCarlos.employee.push({
              employee_number: cumpleanero.employee_number,
              name: cumpleanero.name + ' ' + cumpleanero.paternal_surname + ' ' + cumpleanero.maternal_surname,
              job: cumpleanero.job.cv_name,
              yearAgo: new Date().getFullYear() - new Date(cumpleanero.birthdate).getFullYear()
            });

          }

        } else {


          const leader = leaders.find(l => l.employee.id === cumpleanero.id)?.leader;

          if (leader) {

            const user = await this.dataSource.manager
              .createQueryBuilder('user', 'u')
              .where('u.employeeId = :employeeId', { employeeId: leader.id })
              .getOne();

            const existingEmail = correos.find(c => c.email === user.email);

            if (existingEmail) {
              // Si el correo ya existe, agregar el empleado al array
              existingEmail.employee.push({
                employee_number: cumpleanero.employee_number,
                name: cumpleanero.name + ' ' + cumpleanero.paternal_surname + ' ' + cumpleanero.maternal_surname,
                job: cumpleanero.job.cv_name,
                yearAgo: new Date().getFullYear() - new Date(cumpleanero.birthdate).getFullYear()
              });
            } else {
              // Si no existe, crear nuevo registro con el primer empleado
              correos.push({
                idLeader: leader.id,
                email: user.email,
                employee: [{
                  employee_number: cumpleanero.employee_number,
                  name: cumpleanero.name + ' ' + cumpleanero.paternal_surname + ' ' + cumpleanero.maternal_surname,
                  job: cumpleanero.job.cv_name,
                  yearAgo: new Date().getFullYear() - new Date(cumpleanero.birthdate).getFullYear()
                }]
              });

              //Daniel kilian
              directivoKilian.employee.push({
                employee_number: cumpleanero.employee_number,
                name: cumpleanero.name + ' ' + cumpleanero.paternal_surname + ' ' + cumpleanero.maternal_surname,
                job: cumpleanero.job.cv_name,
                yearAgo: new Date().getFullYear() - new Date(cumpleanero.birthdate).getFullYear()
              });
              //Carlos Hernandez
              directivoCarlos.employee.push({
                employee_number: cumpleanero.employee_number,
                name: cumpleanero.name + ' ' + cumpleanero.paternal_surname + ' ' + cumpleanero.maternal_surname,
                job: cumpleanero.job.cv_name,
                yearAgo: new Date().getFullYear() - new Date(cumpleanero.birthdate).getFullYear()
              });
            }

          }
        }

      }
      this.log.log(`Cumpleañeros del día ${this.fechaMexico}: ${JSON.stringify(correos)}`);
      //envio de correo
      correos.forEach(async (c: any) => {
        await this.mailService.sendEmail('Cumpleaños del día', { dia: new Date().toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City', day: '2-digit', month: '2-digit', year: 'numeric' }), employees: c.employee }, [c.email, 'f.gil@oechsler.mx'], 'cumpleanos');
        //await this.mailService.sendEmail('Cumpleaños del día', { dia: new Date().toLocaleDateString('es-MX', { timeZone: 'America/Mexico_City', day: '2-digit', month: '2-digit', year: 'numeric' }), employees: c.employee }, ['f.gil@oechsler.mx'], 'cumpleanos');

      });

    } catch (err) {
      this.log.error('Error al enviar correo', err);
    }
  }

}
