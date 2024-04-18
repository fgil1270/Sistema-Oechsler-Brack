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

import { Document } from '../../document/entities/document.entity';

@Entity()
export class DocumentClasification {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column({ type: 'varchar' })
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => Document, post => post.documentClasification) 
    document: Document[];
}
