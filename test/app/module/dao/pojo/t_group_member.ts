import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_user} from "./t_user";
import {t_group} from "./t_group";


@Entity("t_group_member" ,{schema:"codement" } )
@Index("FK_GROUP_USER_REF_GROUP",["group",])
@Index("FK_GROUP_USER_REF_USER",["user",])
export class t_group_member {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"group_member_id"
        })
    group_member_id:string;
        

   
    @ManyToOne(()=>t_user, (t_user: t_user)=>t_user.tGroupMembers,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'user_id'})
    user:t_user | null;


   
    @ManyToOne(()=>t_group, (t_group: t_group)=>t_group.tGroupMembers,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'group_id'})
    group:t_group | null;

}
