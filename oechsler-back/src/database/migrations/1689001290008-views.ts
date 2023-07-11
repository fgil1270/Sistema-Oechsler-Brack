import { MigrationInterface, QueryRunner } from "typeorm";

export class Views1689001290008 implements MigrationInterface {
    name = 'Views1689001290008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_4be2f7adf862634f5f803d246b8\``);
        await queryRunner.query(`CREATE TABLE \`view\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`view_roles_role\` (\`roleId\` int NOT NULL, \`viewId\` int NOT NULL, INDEX \`IDX_13810c6598c5585d739a531c7a\` (\`roleId\`), INDEX \`IDX_fdc117537408710e3a39a6e946\` (\`viewId\`), PRIMARY KEY (\`roleId\`, \`viewId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_4be2f7adf862634f5f803d246b8\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`view_roles_role\` ADD CONSTRAINT \`FK_13810c6598c5585d739a531c7a6\` FOREIGN KEY (\`roleId\`) REFERENCES \`view\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`view_roles_role\` ADD CONSTRAINT \`FK_fdc117537408710e3a39a6e9460\` FOREIGN KEY (\`viewId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`view_roles_role\` DROP FOREIGN KEY \`FK_fdc117537408710e3a39a6e9460\``);
        await queryRunner.query(`ALTER TABLE \`view_roles_role\` DROP FOREIGN KEY \`FK_13810c6598c5585d739a531c7a6\``);
        await queryRunner.query(`ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_4be2f7adf862634f5f803d246b8\``);
        await queryRunner.query(`DROP INDEX \`IDX_fdc117537408710e3a39a6e946\` ON \`view_roles_role\``);
        await queryRunner.query(`DROP INDEX \`IDX_13810c6598c5585d739a531c7a\` ON \`view_roles_role\``);
        await queryRunner.query(`DROP TABLE \`view_roles_role\``);
        await queryRunner.query(`DROP TABLE \`view\``);
        await queryRunner.query(`ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_4be2f7adf862634f5f803d246b8\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
