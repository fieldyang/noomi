import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_menu} from "./t_menu";
import {t_group} from "./t_group";


@Entity("t_group_menu" ,{schema:"codement" } )
@Index("FK_GROUP_MENU_REF_GROUP",["group",])
@Index("FK_GROUP_MENU_REF_MENU",["menu",])
export class t_group_menu {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"group_menu_id"
        })
    group_menu_id:string;
        

   
    @ManyToOne(()=>t_menu, (t_menu: t_menu)=>t_menu.tGroupMenus,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'menu_id'})
    menu:t_menu | null;


   
    @ManyToOne(()=>t_group, (t_group: t_group)=>t_group.tGroupMenus,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'group_id'})
    group:t_group | null;

}
