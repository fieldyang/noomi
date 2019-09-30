import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_user} from "./t_user";


@Entity("t_token" ,{schema:"codement" } )
export class t_token {

   
    @OneToOne(()=>t_user, (t_user: t_user)=>t_user.tToken,{ primary:true, nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'user_id'})
    user:t_user | null;


    @Column("varchar",{ 
        nullable:true,
        length:32,
        name:"token"
        })
    token:string | null;
        

    @Column("bigint",{ 
        nullable:true,
        name:"create_time"
        })
    create_time:string | null;
        

    @Column("bigint",{ 
        nullable:true,
        name:"disable_time"
        })
    disable_time:string | null;
        
}
