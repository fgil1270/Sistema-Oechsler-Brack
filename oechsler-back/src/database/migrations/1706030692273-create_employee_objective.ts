import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEmployeeObjective1706030692273 implements MigrationInterface {
    name = 'CreateEmployeeObjective1706030692273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`employee_objective_evaluation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`value_half_year\` int NOT NULL, \`comment_half_year\` text NOT NULL, \`value_end_year\` int NOT NULL, \`comment_end_year\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeObjectiveId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`employee_objective\` (\`id\` int NOT NULL AUTO_INCREMENT, \`area\` varchar(255) NOT NULL, \`goal\` varchar(255) NOT NULL, \`calculation\` varchar(255) NOT NULL, \`percentage\` int NOT NULL, \`comment\` text NOT NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`employeeId\` int NULL, \`percentageDefinitionId\` int NULL, \`evaluatedById\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`employee_objective_evaluation\` ADD CONSTRAINT \`FK_bd69eae63e3b34aa05f3d282f06\` FOREIGN KEY (\`employeeObjectiveId\`) REFERENCES \`employee_objective\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_objective\` ADD CONSTRAINT \`FK_dd5eb42e7f0cbfe7d40b90f2085\` FOREIGN KEY (\`employeeId\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_objective\` ADD CONSTRAINT \`FK_83123b870f936e6cb83a071934f\` FOREIGN KEY (\`percentageDefinitionId\`) REFERENCES \`percentage_definition\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`employee_objective\` ADD CONSTRAINT \`FK_9a16120a97495f0209879844489\` FOREIGN KEY (\`evaluatedById\`) REFERENCES \`employee\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`employee_objective\` DROP FOREIGN KEY \`FK_9a16120a97495f0209879844489\``);
        await queryRunner.query(`ALTER TABLE \`employee_objective\` DROP FOREIGN KEY \`FK_83123b870f936e6cb83a071934f\``);
        await queryRunner.query(`ALTER TABLE \`employee_objective\` DROP FOREIGN KEY \`FK_dd5eb42e7f0cbfe7d40b90f2085\``);
        await queryRunner.query(`ALTER TABLE \`employee_objective_evaluation\` DROP FOREIGN KEY \`FK_bd69eae63e3b34aa05f3d282f06\``);
        await queryRunner.query(`DROP TABLE \`employee_objective\``);
        await queryRunner.query(`DROP TABLE \`employee_objective_evaluation\``);
    }

}
