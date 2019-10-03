import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import { Authority } from "./authority";
import { Resource } from "./resource";


@Entity("t_resource_authority" ,{schema:"codement" } )
@Index("FK_RES_AUTH_REF_AUTH",["authority",])
@Index("FK_RES_AUTH_REF_RES",["resource",])
export class ResourceAuthority {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"resource_authority_id"
        })
    resourceAuthorityId:number;
        

   
    @ManyToOne(()=>Authority, (authority: Authority)=>authority.resourceAuthorities,{ onDelete: 'CASCADE',onUpdate: 'CASCADE',eager:true })
    @JoinColumn({ name:'authority_id'})
    authority:Authority | null;


   
    @ManyToOne(()=>Resource, (resource: Resource)=>resource.resourceAuthorities,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' ,eager:true})
    @JoinColumn({ name:'resource_id'})
    resource:Resource | null;

}
