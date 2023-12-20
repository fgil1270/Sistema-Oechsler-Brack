import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEmployee1689795240004 implements MigrationInterface {
    name = 'UpdateEmployee1689795240004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`employeeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_ab4a80281f1e8d524714e00f38f\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_ab4a80281f1e8d524714e00f38f\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`employeeId\``);
    }

}
