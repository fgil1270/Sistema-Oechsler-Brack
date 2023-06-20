import { 
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne
} from "typeorm";
import { ModuleViews } from "../../modules/entities/module.entity";

@Entity()
export class View {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255})
    name: string;

    @Column({ type: 'varchar', length: 255})
    path: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @ManyToOne(() => ModuleViews, (moduleViews) => moduleViews.views)
    moduleViews: ModuleViews;
}
