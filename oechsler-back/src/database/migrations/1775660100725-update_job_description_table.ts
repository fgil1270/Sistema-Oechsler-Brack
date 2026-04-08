import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobDescriptionTable1775660100725 implements MigrationInterface {
    name = 'UpdateJobDescriptionTable1775660100725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD \`jobLeaderId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`job_description\` ADD CONSTRAINT \`FK_3f8f141e4043feb2b8c27e291fc\` FOREIGN KEY (\`jobLeaderId\`) REFERENCES \`job\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP FOREIGN KEY \`FK_3f8f141e4043feb2b8c27e291fc\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` DROP COLUMN \`jobLeaderId\``);
    }

}
