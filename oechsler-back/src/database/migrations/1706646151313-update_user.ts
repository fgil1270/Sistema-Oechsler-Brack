import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1706646151313 implements MigrationInterface {
    name = 'UpdateUser1706646151313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`renew_pass\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`renew_pass\``);
    }

}
