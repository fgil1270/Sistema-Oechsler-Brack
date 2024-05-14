import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayroll1689700321283 implements MigrationInterface {
  name = 'CreatePayroll1689700321283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`payroll\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_18daec4523c0ccb95647064462\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `INSERT INTO payroll (id, name) VALUES(1, 'Semanal')`,
    );
    await queryRunner.query(
      `INSERT INTO payroll (id, name) VALUES(2, 'Quincenal')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_18daec4523c0ccb95647064462\` ON \`payroll\``,
    );
    await queryRunner.query(`DROP TABLE \`payroll\``);
  }
}
