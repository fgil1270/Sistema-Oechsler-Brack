import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateJobCompetenceToEntity1773000000000
  implements MigrationInterface
{
  name = 'MigrateJobCompetenceToEntity1773000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Crear tabla nueva (si no existe) con estructura compatible con la entidad JobCompetence.
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`job_competence\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`jobId\` int NOT NULL,
        \`competenceId\` int NOT NULL,
        \`domain\` varchar(255) NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_job_competence_jobId_competenceId\` (\`jobId\`, \`competenceId\`),
        KEY \`IDX_job_competence_jobId\` (\`jobId\`),
        KEY \`IDX_job_competence_competenceId\` (\`competenceId\`),
        CONSTRAINT \`FK_job_competence_job\` FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT \`FK_job_competence_competence\` FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);

    // 2) Migrar datos desde la tabla pivot vieja (si existe), sin duplicar.
    const oldPivotExists = await queryRunner.hasTable('job_competence_competence');

    if (oldPivotExists) {
      await queryRunner.query(`
        INSERT INTO \`job_competence\` (\`jobId\`, \`competenceId\`, \`domain\`)
        SELECT oldJc.\`jobId\`, oldJc.\`competenceId\`, NULL
        FROM \`job_competence_competence\` oldJc
        LEFT JOIN \`job_competence\` newJc
          ON newJc.\`jobId\` = oldJc.\`jobId\`
         AND newJc.\`competenceId\` = oldJc.\`competenceId\`
        WHERE newJc.\`id\` IS NULL;
      `);

      // 3) Eliminar tabla vieja solo al final para evitar perdida de datos ante fallos previos.
      await queryRunner.query(`DROP TABLE \`job_competence_competence\``);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1) Re-crear tabla pivot vieja.
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`job_competence_competence\` (
        \`jobId\` int NOT NULL,
        \`competenceId\` int NOT NULL,
        INDEX \`IDX_6d82d5033fcfd007a8a6f72a7a\` (\`jobId\`),
        INDEX \`IDX_e7e836228da776ab01fc79084f\` (\`competenceId\`),
        PRIMARY KEY (\`jobId\`, \`competenceId\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      ALTER TABLE \`job_competence_competence\`
      ADD CONSTRAINT \`FK_6d82d5033fcfd007a8a6f72a7a4\`
      FOREIGN KEY (\`jobId\`) REFERENCES \`job\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE \`job_competence_competence\`
      ADD CONSTRAINT \`FK_e7e836228da776ab01fc79084f5\`
      FOREIGN KEY (\`competenceId\`) REFERENCES \`competence\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);

    // 2) Regresar datos desde la tabla nueva (sin duplicar).
    const newPivotExists = await queryRunner.hasTable('job_competence');

    if (newPivotExists) {
      await queryRunner.query(`
        INSERT INTO \`job_competence_competence\` (\`jobId\`, \`competenceId\`)
        SELECT newJc.\`jobId\`, newJc.\`competenceId\`
        FROM \`job_competence\` newJc
        LEFT JOIN \`job_competence_competence\` oldJc
          ON oldJc.\`jobId\` = newJc.\`jobId\`
         AND oldJc.\`competenceId\` = newJc.\`competenceId\`
        WHERE oldJc.\`jobId\` IS NULL;
      `);

      await queryRunner.query('DROP TABLE \`job_competence\`');
    }
  }
}
