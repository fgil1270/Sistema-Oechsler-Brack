import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDocumentClasificationTable1713200217926 implements MigrationInterface {
    name = 'CreateDocumentClasificationTable1713200217926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`document_clasification\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`required\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`documentClasificationId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document_employee\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`required\` tinyint NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`documentId\` int NULL, \`employeeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`document\` ADD CONSTRAINT \`FK_f0ee16d93c7c2c775bd3ba0b3a1\` FOREIGN KEY (\`documentClasificationId\`) REFERENCES \`document_clasification\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document_employee\` ADD CONSTRAINT \`FK_a09fa8dfcfc12ef3f53ff26127f\` FOREIGN KEY (\`documentId\`) REFERENCES \`document\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document_employee\` ADD CONSTRAINT \`FK_74cd023a07fe768272efb56533f\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`document_employee\` DROP FOREIGN KEY \`FK_74cd023a07fe768272efb56533f\``);
        await queryRunner.query(`ALTER TABLE \`document_employee\` DROP FOREIGN KEY \`FK_a09fa8dfcfc12ef3f53ff26127f\``);
        await queryRunner.query(`ALTER TABLE \`document\` DROP FOREIGN KEY \`FK_f0ee16d93c7c2c775bd3ba0b3a1\``);
        await queryRunner.query(`DROP TABLE \`document_employee\``);
        await queryRunner.query(`DROP TABLE \`document\``);
        await queryRunner.query(`DROP TABLE \`document_clasification\``);
    }

}
