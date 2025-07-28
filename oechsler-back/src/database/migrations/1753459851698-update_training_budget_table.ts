import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTrainingBudgetTable1753459851698 implements MigrationInterface {
    name = 'UpdateTrainingBudgetTable1753459851698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_budget\` DROP COLUMN \`available\``);
        await queryRunner.query(`ALTER TABLE \`training_budget\` ADD \`year\` year NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_budget\` DROP COLUMN \`year\``);
    }

}
