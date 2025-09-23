import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRequestCourseTable1756404161044 implements MigrationInterface {
    name = 'UpdateRequestCourseTable1756404161044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD \`definitionObjectiveAnnualId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`request_course\` ADD CONSTRAINT \`FK_383317dc5ff94ca7e2c3e1e3344\` FOREIGN KEY (\`definitionObjectiveAnnualId\`) REFERENCES \`definition_objective_annual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP FOREIGN KEY \`FK_383317dc5ff94ca7e2c3e1e3344\``);
        await queryRunner.query(`ALTER TABLE \`request_course\` DROP COLUMN \`definitionObjectiveAnnualId\``);
    }

}
