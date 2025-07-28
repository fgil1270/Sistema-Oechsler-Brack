import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { TrainingBudget } from './training-budget.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { RequestCourse } from '../../request_course/entities/request_course.entity';
import { EmployeeDepartmentHistory } from '../../employees/entities/employee_department_history.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('department')
@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Código del departamento' })
  @Column({ unique: true, type: 'varchar', length: 255 })
  cv_code: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  cv_description: string;

  @OneToMany(() => TrainingBudget, (post) => post.departmentId)
  training_budgetId: TrainingBudget[];

  @ApiProperty({ description: 'Centro de costo' })
  @Column({ type: 'int', default: 0 })
  cc: number;

  @OneToMany(() => Employee, (post) => post.department)
  employee: Employee[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ApiProperty({
    description: 'Solicitudes de curso del departamento',
    type: () => [RequestCourse],
  })
  @OneToMany(() => RequestCourse, (post) => post.department)
  requestDepartment: RequestCourse[];

  @OneToMany(() => EmployeeDepartmentHistory, (post) => post.department)
  employeeDepartmentHistory: EmployeeDepartmentHistory[];

  @ApiProperty({
    description: 'Id del gerente',
    type: () => [Employee],
  })
  @ManyToOne(() => Employee, (employee) => employee.managerDepartments)
  @JoinColumn()
  manager: Employee;

  @ApiProperty({
    description: 'Id de director',
    type: () => [Employee],
  })
  @ManyToOne(() => Employee, (employee) => employee.directorDepartments)
  @JoinColumn()
  director: Employee;

}

