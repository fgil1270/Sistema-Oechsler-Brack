import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnabledCreateIncidenceTable1727449779406 implements MigrationInterface {
    name = 'UpdateEnabledCreateIncidenceTable1727449779406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`enabled_create_incidence\` ADD \`payrollId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`enabled_create_incidence\` ADD CONSTRAINT \`FK_9503ecf7c5ba48011a2677c1102\` FOREIGN KEY (\`payrollId\`) REFERENCES \`payroll\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`enabled_create_incidence\` DROP FOREIGN KEY \`FK_9503ecf7c5ba48011a2677c1102\``);
        await queryRunner.query(`ALTER TABLE \`enabled_create_incidence\` DROP COLUMN \`payrollId\``);
    }

}
