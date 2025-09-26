import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateChecadorTable1758733127183 implements MigrationInterface {
    name = 'UpdateChecadorTable1758733127183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Checador\` ADD \`origin\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Checador\` DROP COLUMN \`origin\``);
    }

}
