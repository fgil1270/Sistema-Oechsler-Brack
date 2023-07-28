import { MigrationInterface, QueryRunner } from "typeorm";

export class EmployeeShift1690580779947 implements MigrationInterface {
    name = 'EmployeeShift1690580779947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_shift\` (\`id\` int NOT NULL AUTO_INCREMENT, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`shiftId\` int NULL, \`patternId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_shift\` ADD CONSTRAINT \`FK_53f55b09df66c4f36a0c8ef3e10\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_shift\` ADD CONSTRAINT \`FK_65c7aef4c6bec67a1a7e8561049\` FOREIGN KEY (\`shiftId\`) REFERENCES \`shift\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_shift\` ADD CONSTRAINT \`FK_b86b18f9f3bf072cbe4e02f01dc\` FOREIGN KEY (\`patternId\`) REFERENCES \`pattern\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_shift\` DROP FOREIGN KEY \`FK_b86b18f9f3bf072cbe4e02f01dc\``);
        await queryRunner.query(`ALTER TABLE \`employee_shift\` DROP FOREIGN KEY \`FK_65c7aef4c6bec67a1a7e8561049\``);
        await queryRunner.query(`ALTER TABLE \`employee_shift\` DROP FOREIGN KEY \`FK_53f55b09df66c4f36a0c8ef3e10\``);
        await queryRunner.query(`DROP TABLE \`employee_shift\``);
    }

}
