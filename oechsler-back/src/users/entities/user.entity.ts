import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    joinColumn: {
      name: 'userId',
    },
    inverseJoinColumn: {
      name: 'roleId',
    },
  })
  roles: Role[];

  @ManyToOne(() => Employee, (post) => post.userId)
  @JoinColumn()
  employee: Employee;

  //@CreateDateColumn({nullable: true})
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ type: 'boolean', default: false })
  renew_pass: boolean;
}
