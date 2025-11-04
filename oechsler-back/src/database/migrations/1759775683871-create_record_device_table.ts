import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecordDeviceTable1759775683871 implements MigrationInterface {
    name = 'CreateRecordDeviceTable1759775683871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`record_device\` (\`id\` int NOT NULL AUTO_INCREMENT, \`device_name\` timestamp NOT NULL, \`description\` varchar(255) NULL, \`dev_serial_no\` varchar(255) NULL, \`resource_name\` varchar(255) NULL, \`origin\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Checador\` ADD \`recordDeviceId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`Checador\` ADD CONSTRAINT \`FK_f6e73e62f31234ed056f5008214\` FOREIGN KEY (\`recordDeviceId\`) REFERENCES \`record_device\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Checador\` DROP FOREIGN KEY \`FK_f6e73e62f31234ed056f5008214\``);
        await queryRunner.query(`ALTER TABLE \`Checador\` DROP COLUMN \`recordDeviceId\``);
        await queryRunner.query(`DROP TABLE \`record_device\``);
    }

}
