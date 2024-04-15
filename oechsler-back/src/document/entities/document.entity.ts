import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { DocumentClasification } from '../../document_clasification/entities/document_clasification.entity';
import { DocumentEmployee } from '../../document_employee/entities/document_employee.entity';

@Entity()
export class Document {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'boolean', default: 1 })
    required: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => DocumentClasification, post => post.document)
    @JoinColumn()
    documentClasification: DocumentClasification;

    @OneToMany(() => DocumentEmployee, post => post.document)
    documentEmployee: DocumentEmployee[];

}
