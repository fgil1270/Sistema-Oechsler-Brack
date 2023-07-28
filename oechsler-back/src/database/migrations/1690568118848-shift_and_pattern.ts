import { MigrationInterface, QueryRunner } from "typeorm";

export class ShiftAndPattern1690568118848 implements MigrationInterface {
    name = 'ShiftAndPattern1690568118848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`shift\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`start_time\` time NOT NULL DEFAULT '00:00:00', \`end_time\` time NOT NULL DEFAULT '00:00:00', \`day\` set ('L', 'M', 'X', 'J', 'V', 'S', 'D') NOT NULL, \`color\` varchar(255) NOT NULL, \`special\` tinyint NOT NULL DEFAULT 0, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` tinyint NOT NULL DEFAULT 0, \`deleted_at\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pattern\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`empalme\` tinyint NOT NULL DEFAULT 0, \`periodicity\` int NOT NULL DEFAULT '0', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pattern_shifts_shift\` (\`patternId\` int NOT NULL, \`shiftId\` int NOT NULL, INDEX \`IDX_50a8c3e97512b31b4f72d66b80\` (\`patternId\`), INDEX \`IDX_a8af91f2e20d01177f870b7850\` (\`shiftId\`), PRIMARY KEY (\`patternId\`, \`shiftId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`pattern_shifts_shift\` ADD CONSTRAINT \`FK_50a8c3e97512b31b4f72d66b808\` FOREIGN KEY (\`patternId\`) REFERENCES \`pattern\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`pattern_shifts_shift\` ADD CONSTRAINT \`FK_a8af91f2e20d01177f870b78503\` FOREIGN KEY (\`shiftId\`) REFERENCES \`shift\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pattern_shifts_shift\` DROP FOREIGN KEY \`FK_a8af91f2e20d01177f870b78503\``);
        await queryRunner.query(`ALTER TABLE \`pattern_shifts_shift\` DROP FOREIGN KEY \`FK_50a8c3e97512b31b4f72d66b808\``);
        await queryRunner.query(`DROP INDEX \`IDX_a8af91f2e20d01177f870b7850\` ON \`pattern_shifts_shift\``);
        await queryRunner.query(`DROP INDEX \`IDX_50a8c3e97512b31b4f72d66b80\` ON \`pattern_shifts_shift\``);
        await queryRunner.query(`DROP TABLE \`pattern_shifts_shift\``);
        await queryRunner.query(`DROP TABLE \`pattern\``);
        await queryRunner.query(`DROP TABLE \`shift\``);
    }

}
