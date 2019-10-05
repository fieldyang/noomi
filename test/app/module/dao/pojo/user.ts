import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import { Group } from "./group";
import { GroupUser } from "./groupuser";

@Entity("t_user" ,{schema:"codement" } )
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"user_id"
        })
    userId:number;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"user_name"
        })
    userName:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:32,
        name:"user_pwd"
        })
    userPwd:string | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        name:"enabled"
        })
    enabled:boolean | null;
    
    @OneToMany(()=>GroupUser, (groupUser: GroupUser)=>groupUser.user,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    groupUsers:GroupUser[];
    // @ManyToMany(type=>Group,group=>group.users)
    // @JoinTable({
    //     name:'t_group_user',
    //     joinColumn:{
    //         name:'user_id'
    //     },
    //     inverseJoinColumn:{
    //         name:'group_id'
    //     }
    // })
    // groups:Group[];
}
