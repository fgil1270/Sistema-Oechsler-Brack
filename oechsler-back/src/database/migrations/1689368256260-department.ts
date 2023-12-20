import { MigrationInterface, QueryRunner } from "typeorm";

export class Department1689368256260 implements MigrationInterface {
    name = 'Department1689368256260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`training_budget\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`available\` decimal(10,2) NOT NULL DEFAULT '0.00', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`departmentIdId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`department\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cv_code\` varchar(255) NOT NULL, \`cv_description\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_08853da987ab90c666a0665e2f\` (\`cv_code\`), UNIQUE INDEX \`IDX_aeaccdecd96b09e0676ec7e379\` (\`cv_description\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`training_budget\` ADD CONSTRAINT \`FK_4aa737f7f66fc971d7e7403100f\` FOREIGN KEY (\`departmentIdId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_budget\` DROP FOREIGN KEY \`FK_4aa737f7f66fc971d7e7403100f\``);
        await queryRunner.query(`DROP INDEX \`IDX_aeaccdecd96b09e0676ec7e379\` ON \`department\``);
        await queryRunner.query(`DROP INDEX \`IDX_08853da987ab90c666a0665e2f\` ON \`department\``);
        await queryRunner.query(`DROP TABLE \`department\``);
        await queryRunner.query(`DROP TABLE \`training_budget\``);
    }

}
