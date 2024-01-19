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

@Entity('Competence')
export class CompetenceEntity {
    @PrimaryGeneratedColumn() 
    id: number;
}
