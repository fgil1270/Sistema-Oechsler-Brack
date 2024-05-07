import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTraininGoalTable1713805472223 implements MigrationInterface {
    name = 'CreateTraininGoalTable1713805472223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`trainin_goal\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD \`traininGoalId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`course\` ADD CONSTRAINT \`FK_7de46033be2c5b953310c5cf9d5\` FOREIGN KEY (\`traininGoalId\`) REFERENCES \`trainin_goal\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`course\` DROP FOREIGN KEY \`FK_7de46033be2c5b953310c5cf9d5\``);
        await queryRunner.query(`ALTER TABLE \`course\` DROP COLUMN \`traininGoalId\``);
        await queryRunner.query(`DROP TABLE \`trainin_goal\``);
    }

}
