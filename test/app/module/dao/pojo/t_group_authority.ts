import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_authority} from "./t_authority";
import {t_group} from "./t_group";


@Entity("t_group_authority" ,{schema:"codement" } )
@Index("FK_GROUPAUTH_REF_AUTH",["authority",])
@Index("FK_GROUP_AU_REF_GROUP",["group",])
export class t_group_authority {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"group_authority_id"
        })
    group_authority_id:string;
        

   
    @ManyToOne(()=>t_authority, (t_authority: t_authority)=>t_authority.tGroupAuthoritys,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'authority_id'})
    authority:t_authority | null;


   
    @ManyToOne(()=>t_group, (t_group: t_group)=>t_group.tGroupAuthoritys,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'group_id'})
    group:t_group | null;

}
