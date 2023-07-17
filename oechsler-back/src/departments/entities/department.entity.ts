import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,  
    OneToMany
} from "typeorm";
import { TrainingBudget } from "./training-budget.entity";

@Entity()
export class Department {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, type: 'varchar', length: 255})
    cv_code: string;

    @Column({ unique: true, type: 'varchar', length: 255})
    cv_description: string;

    @OneToMany(() => TrainingBudget, post => post.departmentId)
    training_budgetId: TrainingBudget[]

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
