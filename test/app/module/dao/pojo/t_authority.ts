import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_group_authority} from "./t_group_authority";
import {t_resource_authority} from "./t_resource_authority";


@Entity("t_authority" ,{schema:"codement" } )
export class t_authority {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"authority_id"
        })
    authority_id:string;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"authority"
        })
    authority:string;
        

   
    @OneToMany(()=>t_group_authority, (t_group_authority: t_group_authority)=>t_group_authority.authority,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tGroupAuthoritys:t_group_authority[];
    

   
    @OneToMany(()=>t_resource_authority, (t_resource_authority: t_resource_authority)=>t_resource_authority.authority,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tResourceAuthoritys:t_resource_authority[];
    
}
