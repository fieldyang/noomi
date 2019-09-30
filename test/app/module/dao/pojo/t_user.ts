import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_group_member} from "./t_group_member";
import {t_login_log} from "./t_login_log";
import {t_token} from "./t_token";


@Entity("t_user" ,{schema:"codement" } )
export class t_user {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"user_id"
        })
    user_id:string;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"user_name"
        })
    user_name:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:32,
        name:"user_pwd"
        })
    user_pwd:string | null;
        

    @Column("tinyint",{ 
        nullable:true,
        width:1,
        name:"enabled"
        })
    enabled:boolean | null;
        

   
    @OneToMany(()=>t_group_member, (t_group_member: t_group_member)=>t_group_member.user,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tGroupMembers:t_group_member[];
    

   
    @OneToMany(()=>t_login_log, (t_login_log: t_login_log)=>t_login_log.user,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tLoginLogs:t_login_log[];
    

   
    @OneToOne(()=>t_token, (t_token: t_token)=>t_token.user,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tToken:t_token | null;

}
