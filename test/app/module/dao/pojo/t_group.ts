import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_group_authority} from "./t_group_authority";
import {t_group_member} from "./t_group_member";
import {t_group_menu} from "./t_group_menu";


@Entity("t_group" ,{schema:"codement" } )
export class t_group {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"group_id"
        })
    group_id:string;
        

    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"group_name"
        })
    group_name:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:200,
        name:"remarks"
        })
    remarks:string | null;
        

   
    @OneToMany(()=>t_group_authority, (t_group_authority: t_group_authority)=>t_group_authority.group,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tGroupAuthoritys:t_group_authority[];
    

   
    @OneToMany(()=>t_group_member, (t_group_member: t_group_member)=>t_group_member.group,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tGroupMembers:t_group_member[];
    

   
    @OneToMany(()=>t_group_menu, (t_group_menu: t_group_menu)=>t_group_menu.group,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tGroupMenus:t_group_menu[];
    
}
