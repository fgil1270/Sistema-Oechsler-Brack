import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRecordDeviceTable1759777780917 implements MigrationInterface {
    name = 'UpdateRecordDeviceTable1759777780917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`record_device\` DROP COLUMN \`device_name\``);
        await queryRunner.query(`ALTER TABLE \`record_device\` ADD \`device_name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`record_device\` DROP COLUMN \`device_name\``);
        await queryRunner.query(`ALTER TABLE \`record_device\` ADD \`device_name\` timestamp NOT NULL`);
    }

}
