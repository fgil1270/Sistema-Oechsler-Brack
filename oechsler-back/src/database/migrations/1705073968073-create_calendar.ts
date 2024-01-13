import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCalendar1705073968072 implements MigrationInterface {
    name = 'CreateCalendar1705073968072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Calendar\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`date\` date NULL, \`label\` varchar(15) NOT NULL, \`holiday\` tinyint NOT NULL DEFAULT 0, \`description\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`createdById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Calendar\` ADD CONSTRAINT \`FK_c639f5856ced73ec0c67624e3a9\` FOREIGN KEY (\`createdById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Calendar\` DROP FOREIGN KEY \`FK_c639f5856ced73ec0c67624e3a9\``);
        await queryRunner.query(`DROP TABLE \`Calendar\``);
    }

}
