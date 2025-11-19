import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubCompetenceTrainingTable1763579773760 implements MigrationInterface {
    name = 'CreateSubCompetenceTrainingTable1763579773760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`sub_competence_training\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`competence_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sub_competence_training\` ADD CONSTRAINT \`FK_70de92d8a15cec0b47df192d9fe\` FOREIGN KEY (\`competence_id\`) REFERENCES \`competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sub_competence_training\` DROP FOREIGN KEY \`FK_70de92d8a15cec0b47df192d9fe\``);
        await queryRunner.query(`DROP TABLE \`sub_competence_training\``);
    }

}
