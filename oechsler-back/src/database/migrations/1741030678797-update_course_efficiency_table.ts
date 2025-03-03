import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCourseEfficiencyTable1741030678797 implements MigrationInterface {
    name = 'UpdateCourseEfficiencyTable1741030678797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course_efficiency_question\` CHANGE \`calification\` \`calification\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course_efficiency_question\` CHANGE \`calification\` \`calification\` decimal(5,2) NOT NULL DEFAULT '0.00'`);
    }

}
