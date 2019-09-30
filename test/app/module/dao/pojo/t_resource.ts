import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_resource_type} from "./t_resource_type";
import {t_resource_authority} from "./t_resource_authority";


@Entity("t_resource" ,{schema:"codement" } )
@Index("FK_RES_REF_RES_TYPE",["resourceType",])
export class t_resource {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"resource_id"
        })
    resource_id:string;
        

   
    @ManyToOne(()=>t_resource_type, (t_resource_type: t_resource_type)=>t_resource_type.tResources,{ onDelete: 'SET NULL',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'resource_type_id'})
    resourceType:t_resource_type | null;


    @Column("varchar",{ 
        nullable:true,
        length:500,
        name:"url"
        })
    url:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"title"
        })
    title:string | null;
        

   
    @OneToMany(()=>t_resource_authority, (t_resource_authority: t_resource_authority)=>t_resource_authority.resource,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tResourceAuthoritys:t_resource_authority[];
    
}
