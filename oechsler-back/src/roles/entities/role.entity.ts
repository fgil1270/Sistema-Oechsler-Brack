import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    ManyToMany,
    JoinTable,
    CreateDateColumn, 
    UpdateDateColumn, 
    DeleteDateColumn 
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { View } from "../../views/entities/view.entity";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, type: 'varchar', length: 255})
    name: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];

    @ManyToMany(() => View, (view) => view.roles)
    views: View[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
    
}