import { MigrationInterface, QueryRunner } from 'typeorm';

export class ShiftAndPattern1690576424958 implements MigrationInterface {
  name = 'ShiftAndPattern1690576424958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`pattern\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`empalme\` tinyint NOT NULL DEFAULT 0, \`periodicity\` int NOT NULL DEFAULT '0', \`serie_shifts\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`shift\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`start_time\` time NOT NULL DEFAULT '00:00:00', \`end_time\` time NOT NULL DEFAULT '00:00:00', \`day\` set ('L', 'M', 'X', 'J', 'V', 'S', 'D') NOT NULL, \`color\` varchar(255) NOT NULL, \`special\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` tinyint NOT NULL DEFAULT 0, \`deleted_at\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`shift\``);
    await queryRunner.query(`DROP TABLE \`pattern\``);
  }
}
