import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileTrainingTable1762381631667 implements MigrationInterface {
    name = 'CreateFileTrainingTable1762381631667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`file_training\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`route\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`training_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`history_training\` (\`id\` int NOT NULL AUTO_INCREMENT, \`start_date\` datetime NOT NULL, \`end_date\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`training_id\` int NULL, \`training_machine_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`file_training\` ADD CONSTRAINT \`FK_e3fc96ab323c5a938ed04b9a452\` FOREIGN KEY (\`training_id\`) REFERENCES \`training\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history_training\` ADD CONSTRAINT \`FK_90a0c394c11b1cdcc874c658a75\` FOREIGN KEY (\`training_id\`) REFERENCES \`training\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history_training\` ADD CONSTRAINT \`FK_1c4dc098590b48dce6bea3dbd87\` FOREIGN KEY (\`training_machine_id\`) REFERENCES \`training_machine\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history_training\` DROP FOREIGN KEY \`FK_1c4dc098590b48dce6bea3dbd87\``);
        await queryRunner.query(`ALTER TABLE \`history_training\` DROP FOREIGN KEY \`FK_90a0c394c11b1cdcc874c658a75\``);
        await queryRunner.query(`ALTER TABLE \`file_training\` DROP FOREIGN KEY \`FK_e3fc96ab323c5a938ed04b9a452\``);
        await queryRunner.query(`DROP TABLE \`history_training\``);
        await queryRunner.query(`DROP TABLE \`file_training\``);
    }

}
