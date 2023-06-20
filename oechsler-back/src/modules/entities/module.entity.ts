import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany
 } from "typeorm";

import { View } from "src/views/entities/view.entity";

@Entity()
export class ModuleViews {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255})
    name: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => View, (view) => view.moduleViews)
    views: View[];
}
