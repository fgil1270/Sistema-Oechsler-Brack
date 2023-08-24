import { MigrationInterface, QueryRunner } from "typeorm";

export class Incidence1692639785555 implements MigrationInterface {
    name = 'Incidence1692639785555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_incidence\` (\`id\` int NOT NULL AUTO_INCREMENT, \`descripcion\` text NULL, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`total_hour\` int NOT NULL DEFAULT '0', \`start_hour\` time NULL, \`end_hour\` time NULL, \`date_aproved_leader\` date NOT NULL, \`date_aproved_rh\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`incidenceCatologueId\` int NULL, \`leaderId\` int NULL, \`rhId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`incidence_catologue\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(20) NOT NULL, \`code_band\` varchar(255) NOT NULL, \`approval_double\` tinyint NOT NULL DEFAULT 0, \`require_description\` tinyint NOT NULL DEFAULT 0, \`require_range_hrs\` tinyint NOT NULL DEFAULT 0, \`unique_day\` tinyint NOT NULL DEFAULT 0, \`total_vacation\` tinyint NOT NULL DEFAULT 0, \`half_day\` tinyint NOT NULL DEFAULT 0, \`automatic_approval\` tinyint NOT NULL DEFAULT 0, \`total_hours\` tinyint NOT NULL DEFAULT 0, \`repor_nomina\` tinyint NOT NULL DEFAULT 0, \`require_shift\` tinyint NOT NULL DEFAULT 0, \`creatted_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`incidence_catologue_roles_role\` (\`incidenceCatologueId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_61b954f37f29555f9070b36700\` (\`incidenceCatologueId\`), INDEX \`IDX_87c94d3821916e616f8854d967\` (\`roleId\`), PRIMARY KEY (\`incidenceCatologueId\`, \`roleId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD CONSTRAINT \`FK_a5b64a691ec80fda173b57f4e08\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD CONSTRAINT \`FK_20cc77741c661d6be8f959ba7a4\` FOREIGN KEY (\`incidenceCatologueId\`) REFERENCES \`incidence_catologue\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD CONSTRAINT \`FK_a14cc713a816c18b5731dc41d10\` FOREIGN KEY (\`leaderId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` ADD CONSTRAINT \`FK_96666aee830969b52106f420723\` FOREIGN KEY (\`rhId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`incidence_catologue_roles_role\` ADD CONSTRAINT \`FK_61b954f37f29555f9070b367002\` FOREIGN KEY (\`incidenceCatologueId\`) REFERENCES \`incidence_catologue\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`incidence_catologue_roles_role\` ADD CONSTRAINT \`FK_87c94d3821916e616f8854d9671\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`incidence_catologue_roles_role\` DROP FOREIGN KEY \`FK_87c94d3821916e616f8854d9671\``);
        await queryRunner.query(`ALTER TABLE \`incidence_catologue_roles_role\` DROP FOREIGN KEY \`FK_61b954f37f29555f9070b367002\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP FOREIGN KEY \`FK_96666aee830969b52106f420723\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP FOREIGN KEY \`FK_a14cc713a816c18b5731dc41d10\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP FOREIGN KEY \`FK_20cc77741c661d6be8f959ba7a4\``);
        await queryRunner.query(`ALTER TABLE \`employee_incidence\` DROP FOREIGN KEY \`FK_a5b64a691ec80fda173b57f4e08\``);
        await queryRunner.query(`DROP INDEX \`IDX_87c94d3821916e616f8854d967\` ON \`incidence_catologue_roles_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_61b954f37f29555f9070b36700\` ON \`incidence_catologue_roles_role\``);
        await queryRunner.query(`DROP TABLE \`incidence_catologue_roles_role\``);
        await queryRunner.query(`DROP TABLE \`incidence_catologue\``);
        await queryRunner.query(`DROP TABLE \`employee_incidence\``);
    }

}
