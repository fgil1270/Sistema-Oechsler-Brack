import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChecadorTable1696876119963 implements MigrationInterface {
    name = 'CreateChecadorTable1696876119963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Checador\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` timestamp NOT NULL, \`numRegistroChecador\` int NOT NULL, \`employeeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Checador\` ADD CONSTRAINT \`FK_ce6ad54ec41daa24d405aa24b31\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Checador\` DROP FOREIGN KEY \`FK_ce6ad54ec41daa24d405aa24b31\``);
        await queryRunner.query(`DROP TABLE \`Checador\``);
    }

}
