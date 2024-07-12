import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCalendarTable1720801934092 implements MigrationInterface {
    name = 'UpdateCalendarTable1720801934092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Calendar\` ADD \`suggest\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Calendar\` DROP COLUMN \`suggest\``);
    }

}
