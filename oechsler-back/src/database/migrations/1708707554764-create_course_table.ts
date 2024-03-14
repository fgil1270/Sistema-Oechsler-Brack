import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourseTable1708707554764 implements MigrationInterface {
    name = 'CreateCourseTable1708707554764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`req_efficiency\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`competenceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD CONSTRAINT \`FK_4483b0f7089c4400155a3418e9d\` FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP FOREIGN KEY \`FK_4483b0f7089c4400155a3418e9d\``);
        await queryRunner.query(`DROP TABLE \`course\``);
    }

}
