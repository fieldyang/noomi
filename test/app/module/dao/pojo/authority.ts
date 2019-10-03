import {BaseEntity,Column,Entity,OneToMany, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import { Group } from "./group";
import { Resource } from "./resource";
import { GroupAuthority } from "./groupauthority";
import { ResourceAuthority } from "./resourceauthority";

@Entity("t_authority" ,{schema:"codement" } )
export class Authority extends BaseEntity{

    @PrimaryGeneratedColumn()
    @Column("bigint",{ 
        nullable:false,
        primary:true,
        name:"authority_id"
        })
    authorityId:number;
        

    @Column("varchar",{ 
        nullable:false,
        length:50,
        name:"authority"
        })
    authority:string;

    @OneToMany(()=>GroupAuthority, (groupAuthority: GroupAuthority)=>groupAuthority.authority,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    tGroupAuthoritys:GroupAuthority[];
    

   
    @OneToMany(()=>ResourceAuthority, (resourceAuthority: ResourceAuthority)=>resourceAuthority.authority,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
    resourceAuthorities:ResourceAuthority[];

    // @ManyToMany(type=>Group,group=>group.authorities)
    // groups:Group[];

    // @ManyToMany(type=>Resource,resource=>resource.authorities)
    // resources:Resource[];
}
