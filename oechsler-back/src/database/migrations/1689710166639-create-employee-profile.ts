import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmployeeProfile1689710166639 implements MigrationInterface {
  name = 'CreateEmployeeProfile1689710166639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`employee_profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`delay_time\` time NOT NULL DEFAULT '00:00:00', \`work_week_hrs\` int NOT NULL DEFAULT '0', \`work_shift_hrs\` int NOT NULL DEFAULT '0', \`over_time_limit\` int NOT NULL DEFAULT '0', \`work_days\` set ('L', 'M', 'X', 'J', 'V', 'S', 'D') NOT NULL, \`apply_extra_hrs\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_fa04b9674709087c96dba8237d\` (\`code\`), UNIQUE INDEX \`IDX_14a6bd4b386e9e17d4baad0f16\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `INSERT INTO employee_profile (id, code, name, delay_time, work_week_hrs, work_shift_hrs, over_time_limit, work_days, apply_extra_hrs) VALUES(1, 'PA', 'PERFIL A - std piso', '00:10:00', 48, 8, 24, 'L,M,X,J,V,S', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO employee_profile (id, code, name, delay_time, work_week_hrs, work_shift_hrs, over_time_limit, work_days, apply_extra_hrs) VALUES(2, 'PB', 'PERFIL B - Planta sin TE', '00:10:00', 48, 8, 24, 'L,M,X,J,V', 1)`,
    );
    await queryRunner.query(
      `INSERT INTO employee_profile (id, code, name, delay_time, work_week_hrs, work_shift_hrs, over_time_limit, work_days, apply_extra_hrs) VALUES(3, 'PC', 'PERFIL C - Mixto', '01:00:00', 45, 9, 24, 'L,M,X,J,V', 1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_14a6bd4b386e9e17d4baad0f16\` ON \`employee_profile\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fa04b9674709087c96dba8237d\` ON \`employee_profile\``,
    );
    await queryRunner.query(`DROP TABLE \`employee_profile\``);
  }
}
