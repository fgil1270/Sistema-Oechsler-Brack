import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateChecadorTable1758732550348 implements MigrationInterface {
    name = 'UpdateChecadorTable1758732550348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Esta migración no hace nada porque las tablas ya existen
        // Solo sirve para registrar que las tablas fueron "creadas"
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Calendar\` DROP FOREIGN KEY \`FK_c639f5856ced73ec0c67624e3a9\``);
        await queryRunner.query(`ALTER TABLE \`Checador\` DROP FOREIGN KEY \`FK_fb34636181a7401525b3f5a8774\``);
        await queryRunner.query(`ALTER TABLE \`Checador\` DROP FOREIGN KEY \`FK_ce6ad54ec41daa24d405aa24b31\``);
        await queryRunner.query(`DROP TABLE \`Calendar\``);
        await queryRunner.query(`DROP TABLE \`Checador\``);
    }

}
