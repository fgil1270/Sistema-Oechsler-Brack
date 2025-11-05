import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductionAreaTable1762371756145 implements MigrationInterface {
    name = 'CreateProductionAreaTable1762371756145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`training_machine\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`comment\` text NOT NULL, \`total_employees\` int NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`production_area_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`production_area\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`comment\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`training_machine\` ADD CONSTRAINT \`FK_e34ab0182643979ba8c85a206c0\` FOREIGN KEY (\`production_area_id\`) REFERENCES \`production_area\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_machine\` DROP FOREIGN KEY \`FK_e34ab0182643979ba8c85a206c0\``);
        await queryRunner.query(`DROP TABLE \`production_area\``);
        await queryRunner.query(`DROP TABLE \`training_machine\``);
    }

}
