import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
import {t_group_menu} from "./t_group_menu";


@Entity("t_menu" ,{schema:"codement" } )
@Index("FK_MENU_REF_PARENT",["parent",])
export class t_menu {

    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"menu_id"
        })
    menu_id:string;
        

   
    @ManyToOne(()=>t_menu, (t_menu: t_menu)=>t_menu.tMenus,{ onDelete: 'SET NULL',onUpdate: 'CASCADE' })
    @JoinColumn({ name:'parent_id'})
    parent:t_menu | null;


    @Column("varchar",{ 
        nullable:true,
        length:50,
        name:"title"
        })
    title:string | null;
        

    @Column("varchar",{ 
        nullable:true,
        length:500,
        name:"url"
        })
    url:string | null;
        

   
    @OneToMany(()=>t_group_menu, (t_group_menu: t_group_menu)=>t_group_menu.menu,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tGroupMenus:t_group_menu[];
    

   
    @OneToMany(()=>t_menu, (t_menu: t_menu)=>t_menu.parent,{ onDelete: 'SET NULL' ,onUpdate: 'CASCADE' })
    tMenus:t_menu[];
    
}
