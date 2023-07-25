import { MigrationInterface, QueryRunner } from "typeorm";

export class Organigrama1690311110634 implements MigrationInterface {
    name = 'Organigrama1690311110634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`organigrama\` (\`id\` int NOT NULL AUTO_INCREMENT, \`evaluar\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`leaderId\` int NULL, \`employeeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee\` CHANGE \`work_term_date\` \`work_term_date\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`organigrama\` ADD CONSTRAINT \`FK_668d45a4fbd0b6a2b0c922f62bc\` FOREIGN KEY (\`leaderId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organigrama\` ADD CONSTRAINT \`FK_b0b9df1697f6f103d8f022fffd9\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organigrama\` DROP FOREIGN KEY \`FK_b0b9df1697f6f103d8f022fffd9\``);
        await queryRunner.query(`ALTER TABLE \`organigrama\` DROP FOREIGN KEY \`FK_668d45a4fbd0b6a2b0c922f62bc\``);
        await queryRunner.query(`ALTER TABLE \`employee\` CHANGE \`work_term_date\` \`work_term_date\` date NOT NULL`);
        await queryRunner.query(`DROP TABLE \`organigrama\``);
    }

}
