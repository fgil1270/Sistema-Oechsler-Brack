import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSupplierTable1715715612741 implements MigrationInterface {
    name = 'CreateSupplierTable1715715612741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`supplier\` (\`id\` int NOT NULL AUTO_INCREMENT, \`business_name\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`rfc\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`street\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teacher\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`paternal_surname\` varchar(255) NOT NULL, \`maternal_surname\` varchar(255) NOT NULL, \`type\` varchar(255) NULL, \`gender\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`supplierId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` ADD \`teacherId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`teacher\` ADD CONSTRAINT \`FK_d6a9ded0a5d5bc6bdec114d1b83\` FOREIGN KEY (\`supplierId\`) REFERENCES \`supplier\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` ADD CONSTRAINT \`FK_8c70d2be48cde6e4e41b452fa84\` FOREIGN KEY (\`teacherId\`) REFERENCES \`teacher\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` DROP FOREIGN KEY \`FK_8c70d2be48cde6e4e41b452fa84\``);
        await queryRunner.query(`ALTER TABLE \`teacher\` DROP FOREIGN KEY \`FK_d6a9ded0a5d5bc6bdec114d1b83\``);
        await queryRunner.query(`ALTER TABLE \`request_course_assignment\` DROP COLUMN \`teacherId\``);
        await queryRunner.query(`DROP TABLE \`teacher\``);
        await queryRunner.query(`DROP TABLE \`supplier\``);
    }

}
