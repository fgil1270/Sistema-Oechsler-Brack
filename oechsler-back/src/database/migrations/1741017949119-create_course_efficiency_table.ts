import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourseEfficiencyTable1741017949119 implements MigrationInterface {
    name = 'CreateCourseEfficiencyTable1741017949119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`course_efficiency\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date_evaluation\` timestamp NOT NULL, \`comment\` text NULL, \`comment_two\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`evaluatorId\` int NULL, \`requestCourseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`course_efficiency\` ADD CONSTRAINT \`FK_6a0dfbab911334c136426467f1e\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course_efficiency\` ADD CONSTRAINT \`FK_982cd3a46d3ef7160aec34f46eb\` FOREIGN KEY (\`evaluatorId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course_efficiency\` ADD CONSTRAINT \`FK_55aaba7849190e3fb2d11055efd\` FOREIGN KEY (\`requestCourseId\`) REFERENCES \`request_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course_efficiency\` DROP FOREIGN KEY \`FK_55aaba7849190e3fb2d11055efd\``);
        await queryRunner.query(`ALTER TABLE \`course_efficiency\` DROP FOREIGN KEY \`FK_982cd3a46d3ef7160aec34f46eb\``);
        await queryRunner.query(`ALTER TABLE \`course_efficiency\` DROP FOREIGN KEY \`FK_6a0dfbab911334c136426467f1e\``);
        await queryRunner.query(`DROP TABLE \`course_efficiency\``);
    }

}
