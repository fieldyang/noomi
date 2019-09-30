import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_authority} from "./t_authority";
import {t_resource} from "./t_resource";


@Entity("t_resource_authority" ,{schema:"codement" } )
@Index("FK_RES_AUTH_REF_AUTH",["authority",])
@Index("FK_RES_AUTH_REF_RES",["resource",])
export class t_resource_authority {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"resource_authority_id"
        })
    resource_authority_id:string;
        

   
    @ManyToOne(()=>t_authority, (t_authority: t_authority)=>t_authority.tResourceAuthoritys,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'authority_id'})
    authority:t_authority | null;


   
    @ManyToOne(()=>t_resource, (t_resource: t_resource)=>t_resource.tResourceAuthoritys,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'resource_id'})
    resource:t_resource | null;

}
