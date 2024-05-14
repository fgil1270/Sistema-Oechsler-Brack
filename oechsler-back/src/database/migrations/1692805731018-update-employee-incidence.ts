import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEmployeeIncidence1692805731018
  implements MigrationInterface
{
  name = 'UpdateEmployeeIncidence1692805731018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` CHANGE \`date_aproved_leader\` \`date_aproved_leader\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`employee_incidence\` CHANGE \`date_aproved_rh\` \`date_aproved_rh\` date NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
