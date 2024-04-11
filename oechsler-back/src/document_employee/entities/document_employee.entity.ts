import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Document_employee')
export class DocumentEmployee {
    @PrimaryGeneratedColumn() id:string;
}
