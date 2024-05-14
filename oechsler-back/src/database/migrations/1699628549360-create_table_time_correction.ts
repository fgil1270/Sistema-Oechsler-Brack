import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTimeCorrection1699628549360
  implements MigrationInterface
{
  name = 'CreateTableTimeCorrection1699628549360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`time_correction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`approved\` tinyint NOT NULL DEFAULT 0, \`comment\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`createdById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`time_correction\` ADD CONSTRAINT \`FK_7590e710cec4d4b00e9cc4da0f2\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`time_correction\` ADD CONSTRAINT \`FK_32c612b56946843bcb92043123d\` FOREIGN KEY (\`createdById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`time_correction\` DROP FOREIGN KEY \`FK_32c612b56946843bcb92043123d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`time_correction\` DROP FOREIGN KEY \`FK_7590e710cec4d4b00e9cc4da0f2\``,
    );
    await queryRunner.query(`DROP TABLE \`time_correction\``);
  }
}
