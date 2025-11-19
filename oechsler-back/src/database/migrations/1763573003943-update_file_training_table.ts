import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFileTrainingTable1763573003943 implements MigrationInterface {
    name = 'UpdateFileTrainingTable1763573003943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_training\` DROP FOREIGN KEY \`FK_e3fc96ab323c5a938ed04b9a452\``);
        await queryRunner.query(`ALTER TABLE \`file_training\` DROP COLUMN \`training_id\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file_training\` ADD \`training_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`file_training\` ADD CONSTRAINT \`FK_e3fc96ab323c5a938ed04b9a452\` FOREIGN KEY (\`training_id\`) REFERENCES \`training\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
