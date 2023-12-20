import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployeeIncidence1693946220523 implements MigrationInterface {
    name = 'UpdateEmployeeIncidence1693946220523'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`status\` varchar(255) NOT NULL AFTER \`date_aproved_rh\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`date_cancelled\` date NULL AFTER \`status\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD \`cancelledById\` int NULL AFTER \`date_cancelled\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD CONSTRAINT \`FK_9ed0cfbecf9857f1e95f799a7e0\` FOREIGN KEY (\`cancelledById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP FOREIGN KEY \`FK_9ed0cfbecf9857f1e95f799a7e0\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`cancelledById\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`date_cancelled\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP COLUMN \`status\``);
    }

}
