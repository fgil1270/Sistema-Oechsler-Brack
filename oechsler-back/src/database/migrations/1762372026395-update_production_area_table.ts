import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductionAreaTable1762372026395 implements MigrationInterface {
    name = 'UpdateProductionAreaTable1762372026395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`training_machine\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`training_machine\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`training_machine\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`production_area\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`production_area\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`production_area\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`training_machine\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`training_machine\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`training_machine\` ADD \`deleted_at\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`production_area\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`production_area\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`production_area\` ADD \`deleted_at\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`production_area\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`production_area\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`production_area\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`training_machine\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`training_machine\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`training_machine\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`production_area\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`production_area\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`production_area\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`training_machine\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`training_machine\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`training_machine\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
