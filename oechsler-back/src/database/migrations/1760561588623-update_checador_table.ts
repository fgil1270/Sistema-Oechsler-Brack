import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateChecadorTable1760561588623 implements MigrationInterface {
    name = 'UpdateChecadorTable1760561588623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`calendar\` DROP FOREIGN KEY \`FK_c639f5856ced73ec0c67624e3a9\``);
        await queryRunner.query(`ALTER TABLE \`checador\` DROP FOREIGN KEY \`FK_ce6ad54ec41daa24d405aa24b31\``);
        await queryRunner.query(`ALTER TABLE \`checador\` DROP FOREIGN KEY \`FK_f6e73e62f31234ed056f5008214\``);
        await queryRunner.query(`ALTER TABLE \`checador\` DROP FOREIGN KEY \`FK_fb34636181a7401525b3f5a8774\``);
        await queryRunner.query(`ALTER TABLE \`calendar\` ADD CONSTRAINT \`FK_7eb04dbf329839727d3a01ebaac\` FOREIGN KEY (\`createdById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`checador\` ADD CONSTRAINT \`FK_6a598910e55e16ca1e766deef35\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`checador\` ADD CONSTRAINT \`FK_70de1d43d727bc23bc8ac1b588d\` FOREIGN KEY (\`createdById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`checador\` ADD CONSTRAINT \`FK_9991ca4307a29fb4b76a70e8cbd\` FOREIGN KEY (\`recordDeviceId\`) REFERENCES \`record_device\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`checador\` DROP FOREIGN KEY \`FK_9991ca4307a29fb4b76a70e8cbd\``);
        await queryRunner.query(`ALTER TABLE \`checador\` DROP FOREIGN KEY \`FK_70de1d43d727bc23bc8ac1b588d\``);
        await queryRunner.query(`ALTER TABLE \`checador\` DROP FOREIGN KEY \`FK_6a598910e55e16ca1e766deef35\``);
        await queryRunner.query(`ALTER TABLE \`calendar\` DROP FOREIGN KEY \`FK_7eb04dbf329839727d3a01ebaac\``);
        await queryRunner.query(`ALTER TABLE \`checador\` ADD CONSTRAINT \`FK_fb34636181a7401525b3f5a8774\` FOREIGN KEY (\`createdById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`checador\` ADD CONSTRAINT \`FK_f6e73e62f31234ed056f5008214\` FOREIGN KEY (\`recordDeviceId\`) REFERENCES \`record_device\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`checador\` ADD CONSTRAINT \`FK_ce6ad54ec41daa24d405aa24b31\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`calendar\` ADD CONSTRAINT \`FK_c639f5856ced73ec0c67624e3a9\` FOREIGN KEY (\`createdById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
