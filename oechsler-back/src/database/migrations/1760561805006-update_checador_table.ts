import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateChecadorTable1760561805006 implements MigrationInterface {
    name = 'UpdateChecadorTable1760561805006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`checador\` ADD \`idHikvision\` bigint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`checador\` DROP COLUMN \`idHikvision\``);
    }

}
