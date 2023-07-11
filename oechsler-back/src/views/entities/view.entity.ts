import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToMany,
    JoinTable
} from "typeorm";

import { Role } from "../../roles/entities/role.entity";

@Entity()
export class View {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255})
    name: string;

    @Column({ type: 'varchar', length: 255})
    description: string;

    @ManyToMany(() => Role, (role) => role.views)
    @JoinTable({
        joinColumn: {
            name: 'roleId'
        },
        inverseJoinColumn: {
            name: 'viewId'
        }
    })
    roles: Role[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    
}
