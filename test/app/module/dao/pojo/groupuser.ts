import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import { User } from "./user";
import { Group } from "./group";


@Entity("t_group_user" ,{schema:"codement" } )
@Index("FK_GROUP_USER_REF_GROUP",["group",])
@Index("FK_GROUP_USER_REF_USER",["user",])
export class GroupUser {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"group_user_id"
        })
    groupUserId:number;
        

   
    @ManyToOne(()=>User, (user: User)=>user.groupUsers,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' ,eager:true})
    @JoinColumn({ name:'user_id'})
    user:User | null;


   
    @ManyToOne(()=>Group, (group: Group)=>group.groupUsers,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' ,eager:true})
    @JoinColumn({ name:'group_id'})
    group:Group | null;

}
