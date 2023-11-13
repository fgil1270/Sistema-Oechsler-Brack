import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateChecador1699632946583 implements MigrationInterface {
    name = 'UpdateChecador1699632946583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Checador\` ADD  column \`comment\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`Checador\` ADD  column \`createdById\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`Checador\` ADD CONSTRAINT \`FK_fb34636181a7401525b3f5a8774\` FOREIGN KEY (\`createdById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION` );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Checador\` DROP FOREIGN KEY \`FK_fb34636181a7401525b3f5a8774\``);
        await queryRunner.query(`ALTER TABLE \`Checador\` DROP COLUMN \`comment\``);
    }

}
