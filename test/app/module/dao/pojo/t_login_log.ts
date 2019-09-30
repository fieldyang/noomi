import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_user} from "./t_user";


@Entity("t_login_log" ,{schema:"codement" } )
@Index("FK_LOGIN_REF_USER",["user",])
export class t_login_log {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"login_id"
        })
    login_id:string;
        

   
    @ManyToOne(()=>t_user, (t_user: t_user)=>t_user.tLoginLogs,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'user_id'})
    user:t_user | null;


    @Column("bigint",{ 
        nullable:true,
        name:"login_time"
        })
    login_time:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"login_ip"
        })
    login_ip:string | null;
        
}
