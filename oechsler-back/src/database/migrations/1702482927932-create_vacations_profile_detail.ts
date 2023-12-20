import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVacationsProfileDetail1702482927932 implements MigrationInterface {
    name = 'CreateVacationsProfileDetail1702482927932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`vacations_profile_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`year\` int NOT NULL DEFAULT '0', \`day\` int NOT NULL DEFAULT '0', \`total\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`vacationProfileId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vacations_profile_detail\` ADD CONSTRAINT \`FK_72cb492834082103f7a60ae4f87\` FOREIGN KEY (\`vacationProfileId\`) REFERENCES \`vacations_profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vacations_profile_detail\` DROP FOREIGN KEY \`FK_72cb492834082103f7a60ae4f87\``);
        await queryRunner.query(`DROP TABLE \`vacations_profile_detail\``);
    }

}
