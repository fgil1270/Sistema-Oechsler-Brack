import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePercentageTable1705698567870 implements MigrationInterface {
  name = 'CreatePercentageTable1705698567870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`percentage_definition\` (\`id\` int NOT NULL AUTO_INCREMENT, \`year\` int NOT NULL, \`value_objetive\` int NOT NULL, \`value_performance\` int NOT NULL, \`value_competence\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`percentage_definition\``);
  }
}
