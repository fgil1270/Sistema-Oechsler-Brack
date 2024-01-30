import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCompetenceTable1705704715842 implements MigrationInterface {
    name = 'CreateCompetenceTable1705704715842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`type_competence\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`type_element_competence\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`competence\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`typeCompetenceId\` int NULL, \`typeElementCompetenceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`job_competence_competence\` (\`jobId\` int NOT NULL, \`competenceId\` int NOT NULL, INDEX \`IDX_6d82d5033fcfd007a8a6f72a7a\` (\`jobId\`), INDEX \`IDX_e7e836228da776ab01fc79084f\` (\`competenceId\`), PRIMARY KEY (\`jobId\`, \`competenceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`competence\` ADD CONSTRAINT \`FK_604cda2b4db1785856b91876c68\` FOREIGN KEY (\`typeCompetenceId\`) REFERENCES \`type_competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`competence\` ADD CONSTRAINT \`FK_9183684780355a2090aeef8264f\` FOREIGN KEY (\`typeElementCompetenceId\`) REFERENCES \`type_element_competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`job_competence_competence\` ADD CONSTRAINT \`FK_6d82d5033fcfd007a8a6f72a7a4\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`job_competence_competence\` ADD CONSTRAINT \`FK_e7e836228da776ab01fc79084f5\` FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`job_competence_competence\` DROP FOREIGN KEY \`FK_e7e836228da776ab01fc79084f5\``);
        await queryRunner.query(`ALTER TABLE \`job_competence_competence\` DROP FOREIGN KEY \`FK_6d82d5033fcfd007a8a6f72a7a4\``);
        await queryRunner.query(`ALTER TABLE \`competence\` DROP FOREIGN KEY \`FK_9183684780355a2090aeef8264f\``);
        await queryRunner.query(`ALTER TABLE \`competence\` DROP FOREIGN KEY \`FK_604cda2b4db1785856b91876c68\``);
        await queryRunner.query(`DROP INDEX \`IDX_e7e836228da776ab01fc79084f\` ON \`job_competence_competence\``);
        await queryRunner.query(`DROP INDEX \`IDX_6d82d5033fcfd007a8a6f72a7a\` ON \`job_competence_competence\``);
        await queryRunner.query(`DROP TABLE \`job_competence_competence\``);
        await queryRunner.query(`DROP TABLE \`competence\``);
        await queryRunner.query(`DROP TABLE \`type_element_competence\``);
        await queryRunner.query(`DROP TABLE \`type_competence\``);
    }

}
