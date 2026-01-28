import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductionMachineEmployeeTable1769447606547 implements MigrationInterface {
    name = 'CreateProductionMachineEmployeeTable1769447606547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_2a0d8124b1ae18435ade100ac7\` ON \`request_course_assignment\``);
        await queryRunner.query(`CREATE TABLE \`production_machine_employee\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`production_machine_id\` int NULL, \`employee_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`production_machine_employee\` ADD CONSTRAINT \`FK_5fc84fbee73832295b41223bbae\` FOREIGN KEY (\`production_machine_id\`) REFERENCES \`production_machine\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`production_machine_employee\` ADD CONSTRAINT \`FK_4cd6cc2d9c0237c5a8ad351d515\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`production_machine_employee\` DROP FOREIGN KEY \`FK_4cd6cc2d9c0237c5a8ad351d515\``);
        await queryRunner.query(`ALTER TABLE \`production_machine_employee\` DROP FOREIGN KEY \`FK_5fc84fbee73832295b41223bbae\``);
        await queryRunner.query(`DROP TABLE \`production_machine_employee\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_2a0d8124b1ae18435ade100ac7\` ON \`request_course_assignment\` (\`eventRequestCourseLeaderId\`)`);
    }

}
