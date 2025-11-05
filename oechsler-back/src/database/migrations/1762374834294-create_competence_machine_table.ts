import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompetenceMachineTable1762374834294 implements MigrationInterface {
    name = 'CreateCompetenceMachineTable1762374834294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`competence_machine\` (\`id\` int NOT NULL AUTO_INCREMENT, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`training_machine_id\` int NULL, \`competence_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`competence_machine\` ADD CONSTRAINT \`FK_fc29a02cfcb5506eaa530c5978e\` FOREIGN KEY (\`training_machine_id\`) REFERENCES \`training_machine\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`competence_machine\` ADD CONSTRAINT \`FK_220d30b449cff9d9aa56ee75eb4\` FOREIGN KEY (\`competence_id\`) REFERENCES \`competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`competence_machine\` DROP FOREIGN KEY \`FK_220d30b449cff9d9aa56ee75eb4\``);
        await queryRunner.query(`ALTER TABLE \`competence_machine\` DROP FOREIGN KEY \`FK_fc29a02cfcb5506eaa530c5978e\``);
        await queryRunner.query(`DROP TABLE \`competence_machine\``);
    }

}
