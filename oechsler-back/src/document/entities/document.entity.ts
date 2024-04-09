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

@Entity('Document')
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
}
