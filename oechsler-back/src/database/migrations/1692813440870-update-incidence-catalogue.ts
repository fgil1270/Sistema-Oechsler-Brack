import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIncidenceCatalogue1692813440870
  implements MigrationInterface
{
  name = 'UpdateIncidenceCatalogue1692813440870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`incidence_catologue\` ADD \`color\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`incidence_catologue\` DROP COLUMN \`color\``,
    );
  }
}
