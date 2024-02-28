import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCourseEvaluationTables1708976198552 implements MigrationInterface {
    name = 'CreateCourseEvaluationTables1708976198552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`course_evaluation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value_half_year\` int NOT NULL, \`comment_half_year\` text NOT NULL, \`value_end_year\` int NOT NULL, \`comment_end_year\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`dncCourseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course_evaluation_mannual\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value_half_year\` int NOT NULL, \`comment_half_year\` text NOT NULL, \`value_end_year\` int NOT NULL, \`comment_end_year\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`dncCourseManualId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`course_evaluation\` ADD CONSTRAINT \`FK_569c0dea11ce9975475a36c7b0c\` FOREIGN KEY (\`dncCourseId\`) REFERENCES \`dnc_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`course_evaluation_mannual\` ADD CONSTRAINT \`FK_7ff65477c2bdbe389c2a7a0390f\` FOREIGN KEY (\`dncCourseManualId\`) REFERENCES \`dnc_course_manual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course_evaluation_mannual\` DROP FOREIGN KEY \`FK_7ff65477c2bdbe389c2a7a0390f\``);
        await queryRunner.query(`ALTER TABLE \`course_evaluation\` DROP FOREIGN KEY \`FK_569c0dea11ce9975475a36c7b0c\``);
        await queryRunner.query(`DROP TABLE \`course_evaluation_mannual\``);
        await queryRunner.query(`DROP TABLE \`course_evaluation\``);
    }

}
