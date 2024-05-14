import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRelationsRequestCourseAssignment1715633576252
  implements MigrationInterface
{
  name = 'CreateRelationsRequestCourseAssignment1715633576252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`request_course_assignment\` DROP FOREIGN KEY \`FK_ab21494bfb6811f7cae7651a782\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`request_course_assignment_request_course_request_course\` (\`requestCourseAssignmentId\` int NOT NULL, \`requestCourseId\` int NOT NULL, INDEX \`IDX_dc9220b4f4047b1f0c79fd770a\` (\`requestCourseAssignmentId\`), INDEX \`IDX_1864e9498d0fcf4da473c66b50\` (\`requestCourseId\`), PRIMARY KEY (\`requestCourseAssignmentId\`, \`requestCourseId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course_assignment\` DROP COLUMN \`requestCourseId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course_assignment_request_course_request_course\` ADD CONSTRAINT \`FK_dc9220b4f4047b1f0c79fd770a7\` FOREIGN KEY (\`requestCourseAssignmentId\`) REFERENCES \`request_course_assignment\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course_assignment_request_course_request_course\` ADD CONSTRAINT \`FK_1864e9498d0fcf4da473c66b509\` FOREIGN KEY (\`requestCourseId\`) REFERENCES \`request_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`request_course_assignment_request_course_request_course\` DROP FOREIGN KEY \`FK_1864e9498d0fcf4da473c66b509\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course_assignment_request_course_request_course\` DROP FOREIGN KEY \`FK_dc9220b4f4047b1f0c79fd770a7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course_assignment\` ADD \`requestCourseId\` int NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1864e9498d0fcf4da473c66b50\` ON \`request_course_assignment_request_course_request_course\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_dc9220b4f4047b1f0c79fd770a\` ON \`request_course_assignment_request_course_request_course\``,
    );
    await queryRunner.query(
      `DROP TABLE \`request_course_assignment_request_course_request_course\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`request_course_assignment\` ADD CONSTRAINT \`FK_ab21494bfb6811f7cae7651a782\` FOREIGN KEY (\`requestCourseId\`) REFERENCES \`request_course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
