import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDncTables1708974069385 implements MigrationInterface {
    name = 'CreateDncTables1708974069385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`dnc_course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`train\` varchar(255) NOT NULL, \`priority\` varchar(255) NOT NULL, \`comment\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`definitionObjectiveAnnualId\` int NULL, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`dnc_course_manual\` (\`id\` int NOT NULL AUTO_INCREMENT, \`goal\` varchar(255) NOT NULL, \`train\` varchar(255) NOT NULL, \`priority\` varchar(255) NOT NULL, \`comment\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`definitionObjectiveAnnualId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`dnc_course\` ADD CONSTRAINT \`FK_290e8ce1a92cb9b15c35903215a\` FOREIGN KEY (\`definitionObjectiveAnnualId\`) REFERENCES \`definition_objective_annual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dnc_course\` ADD CONSTRAINT \`FK_0fa8ed01cb3f30ade2b593ce69f\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`dnc_course_manual\` ADD CONSTRAINT \`FK_fbb96cad7e7eb660a768565b581\` FOREIGN KEY (\`definitionObjectiveAnnualId\`) REFERENCES \`definition_objective_annual\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`dnc_course_manual\` DROP FOREIGN KEY \`FK_fbb96cad7e7eb660a768565b581\``);
        await queryRunner.query(`ALTER TABLE \`dnc_course\` DROP FOREIGN KEY \`FK_0fa8ed01cb3f30ade2b593ce69f\``);
        await queryRunner.query(`ALTER TABLE \`dnc_course\` DROP FOREIGN KEY \`FK_290e8ce1a92cb9b15c35903215a\``);
        await queryRunner.query(`DROP TABLE \`dnc_course_manual\``);
        await queryRunner.query(`DROP TABLE \`dnc_course\``);
    }

}
