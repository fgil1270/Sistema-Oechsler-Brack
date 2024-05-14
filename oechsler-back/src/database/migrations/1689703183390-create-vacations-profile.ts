import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVacationsProfile1689703183390 implements MigrationInterface {
  name = 'CreateVacationsProfile1689703183390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`vacations_profile\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cv_code\` varchar(255) NOT NULL, \`cv_description\` varchar(255) NOT NULL, \`special\` tinyint NOT NULL DEFAULT 0, \`premium_percentage\` decimal(10,2) NOT NULL DEFAULT '0.00', \`day\` int NOT NULL DEFAULT '0', \`total\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_ba52b233c0bc42059f5dbf8d40\` (\`cv_code\`), UNIQUE INDEX \`IDX_3c6ab43ecfc3c9f16b7a701e57\` (\`cv_description\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `INSERT INTO vacations_profile (id, cv_code, cv_description, special, premium_percentage, day, total) VALUES(1, 'VE', 'Vacaciones Especiales', 1, 0, 0, 0)`,
    );
    await queryRunner.query(
      `INSERT INTO vacations_profile (id, cv_code, cv_description, special, premium_percentage, day, total) VALUES(2, 'M', 'Quincenal', 0, 0, 0, 0)`,
    );
    await queryRunner.query(
      `INSERT INTO vacations_profile (id, cv_code, cv_description, special, premium_percentage, day, total) VALUES(3, 'V1_2023', 'VAC1', 0, 0, 0, 0)`,
    );
    await queryRunner.query(
      `INSERT INTO vacations_profile (id, cv_code, cv_description, special, premium_percentage, day, total) VALUES(4, 'S_2023', 'Semanal', 0, 0, 0, 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_3c6ab43ecfc3c9f16b7a701e57\` ON \`vacations_profile\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ba52b233c0bc42059f5dbf8d40\` ON \`vacations_profile\``,
    );
    await queryRunner.query(`DROP TABLE \`vacations_profile\``);
  }
}
