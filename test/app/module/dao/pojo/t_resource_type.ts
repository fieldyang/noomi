import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_resource} from "./t_resource";


@Entity("t_resource_type" ,{schema:"codement" } )
export class t_resource_type {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"resource_type_id"
        })
    resource_type_id:string;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"type_name"
        })
    type_name:string | null;
        

   
    @OneToMany(()=>t_resource, (t_resource: t_resource)=>t_resource.resourceType,{ onDelete: 'SET NULL' ,onUpdate: 'CASCADE' })
    tResources:t_resource[];
    
}
