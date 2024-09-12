import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEnabledCreateIncidenceTable1726084281132 implements MigrationInterface {
    name = 'CreateEnabledCreateIncidenceTable1726084281132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`enabled_create_incidence\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`enabled\` tinyint NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`enabled_create_incidence\` ADD CONSTRAINT \`FK_a9e0bca681709b3923fd958a238\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`enabled_create_incidence\` DROP FOREIGN KEY \`FK_a9e0bca681709b3923fd958a238\``);
        await queryRunner.query(`DROP TABLE \`enabled_create_incidence\``);
    }

}
