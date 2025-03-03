import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourseEfficiencyQuestionTable1741019830455 implements MigrationInterface {
    name = 'CreateCourseEfficiencyQuestionTable1741019830455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`course_efficiency_question\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` text NULL, \`calification\` decimal(5,2) NOT NULL DEFAULT '0.00', \`is_number\` tinyint NOT NULL DEFAULT 0, \`comment\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`courseEfficiencyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`course_efficiency_question\` ADD CONSTRAINT \`FK_f353c8de47cacc41b95431bcb94\` FOREIGN KEY (\`courseEfficiencyId\`) REFERENCES \`course_efficiency\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course_efficiency_question\` DROP FOREIGN KEY \`FK_f353c8de47cacc41b95431bcb94\``);
        await queryRunner.query(`DROP TABLE \`course_efficiency_question\``);
    }

}
