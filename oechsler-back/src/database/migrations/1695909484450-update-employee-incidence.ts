import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeIncidence1695909484450 implements MigrationInterface {
    name = 'UpdateEmployeeIncidence1695909484450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` CHANGE \`date_cancelled\` \`date_canceled\` date NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` CHANGE \`date_canceled\` \`date_cancelled\` date NULL`);
    }

}
