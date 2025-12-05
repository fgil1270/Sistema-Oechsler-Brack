import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTrainingTable1762542964448 implements MigrationInterface {
    name = 'UpdateTrainingTable1762542964448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history_training\` ADD \`trainer_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`training\` ADD \`trainer_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`history_training\` ADD CONSTRAINT \`FK_49c5b97af04379b665b9ff73b21\` FOREIGN KEY (\`trainer_id\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`training\` ADD CONSTRAINT \`FK_9dded50e9d758b07b941a0daa1d\` FOREIGN KEY (\`trainer_id\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training\` DROP FOREIGN KEY \`FK_9dded50e9d758b07b941a0daa1d\``);
        await queryRunner.query(`ALTER TABLE \`history_training\` DROP FOREIGN KEY \`FK_49c5b97af04379b665b9ff73b21\``);
        await queryRunner.query(`ALTER TABLE \`training\` DROP COLUMN \`trainer_id\``);
        await queryRunner.query(`ALTER TABLE \`history_training\` DROP COLUMN \`trainer_id\``);
    }

}
