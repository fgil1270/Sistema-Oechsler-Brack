import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVacationsProfileSpecial1702487660521 implements MigrationInterface {
    name = 'CreateVacationsProfileSpecial1702487660521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`vacations_profile_special\` (\`id\` int NOT NULL AUTO_INCREMENT, \`day\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`vacationProfileId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vacations_profile_special\` ADD CONSTRAINT \`FK_2deca51e0a4e69c58c5fad1c43c\` FOREIGN KEY (\`vacationProfileId\`) REFERENCES \`vacations_profile\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vacations_profile_special\` DROP FOREIGN KEY \`FK_2deca51e0a4e69c58c5fad1c43c\``);
        await queryRunner.query(`DROP TABLE \`vacations_profile_special\``);
    }

}
