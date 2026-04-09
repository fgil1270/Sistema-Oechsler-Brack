import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateJobDescriptionTable1775634654151 implements MigrationInterface {
    name = 'UpdateJobDescriptionTable1775634654151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_competence\` DROP FOREIGN KEY \`FK_job_competence_competence\``);
        await queryRunner.query(`ALTER TABLE \`job_competence\` DROP FOREIGN KEY \`FK_job_competence_job\``);
        await queryRunner.query(`DROP INDEX \`IDX_job_competence_competenceId\` ON \`job_competence\``);
        await queryRunner.query(`DROP INDEX \`IDX_job_competence_jobId\` ON \`job_competence\``);
        await queryRunner.query(`DROP INDEX \`UQ_job_competence_jobId_competenceId\` ON \`job_competence\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` CHANGE \`area\` \`area\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`job_competence\` ADD CONSTRAINT \`FK_5eddb207a223305cda8b17a577c\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_competence\` ADD CONSTRAINT \`FK_7e827866b1d474cad79e219416c\` FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_competence\` DROP FOREIGN KEY \`FK_7e827866b1d474cad79e219416c\``);
        await queryRunner.query(`ALTER TABLE \`job_competence\` DROP FOREIGN KEY \`FK_5eddb207a223305cda8b17a577c\``);
        await queryRunner.query(`ALTER TABLE \`job_description\` CHANGE \`area\` \`area\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_job_competence_jobId_competenceId\` ON \`job_competence\` (\`jobId\`, \`competenceId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_job_competence_jobId\` ON \`job_competence\` (\`jobId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_job_competence_competenceId\` ON \`job_competence\` (\`competenceId\`)`);
        await queryRunner.query(`ALTER TABLE \`job_competence\` ADD CONSTRAINT \`FK_job_competence_job\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`job_competence\` ADD CONSTRAINT \`FK_job_competence_competence\` FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
