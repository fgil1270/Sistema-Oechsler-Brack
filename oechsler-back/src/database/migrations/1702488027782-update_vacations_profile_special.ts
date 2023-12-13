import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateVacationsProfileSpecial1702488027782 implements MigrationInterface {
    name = 'UpdateVacationsProfileSpecial1702488027782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vacations_profile_special\` ADD \`employeeId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vacations_profile_special\` ADD CONSTRAINT \`FK_4c3e43a29a6a5541321266a155c\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vacations_profile_special\` DROP FOREIGN KEY \`FK_4c3e43a29a6a5541321266a155c\``);
        await queryRunner.query(`ALTER TABLE \`vacations_profile_special\` DROP COLUMN \`employeeId\``);
    }

}
