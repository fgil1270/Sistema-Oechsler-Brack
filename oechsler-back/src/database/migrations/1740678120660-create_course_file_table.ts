import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourseFileTable1740678120660 implements MigrationInterface {
    name = 'CreateCourseFileTable1740678120660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`course_file\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`route\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`course_file\` ADD CONSTRAINT \`FK_4e79364d35f678d113ab708c459\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course_file\` DROP FOREIGN KEY \`FK_4e79364d35f678d113ab708c459\``);
        await queryRunner.query(`DROP TABLE \`course_file\``);
    }

}
