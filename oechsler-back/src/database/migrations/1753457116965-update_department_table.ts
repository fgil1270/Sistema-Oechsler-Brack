import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDepartmentTable1753457116965 implements MigrationInterface {
    name = 'UpdateDepartmentTable1753457116965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`managerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`directorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`department\` ADD CONSTRAINT \`FK_2147eb9946aa96094b7f78b1954\` FOREIGN KEY (\`managerId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`department\` ADD CONSTRAINT \`FK_7ebd732af587ee49859f675f35e\` FOREIGN KEY (\`directorId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` DROP FOREIGN KEY \`FK_7ebd732af587ee49859f675f35e\``);
        await queryRunner.query(`ALTER TABLE \`department\` DROP FOREIGN KEY \`FK_2147eb9946aa96094b7f78b1954\``);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`directorId\``);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`managerId\``);
    }

}
