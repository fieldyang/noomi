// import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
// import { Authority } from "./authority";
// import { ResourceAuthority } from "./resourceauthority";

// @Entity("t_resource" ,{schema:"codement" } )
// export class Resource extends BaseEntity{

//     @PrimaryGeneratedColumn()
//     @Column("bigint",{ 
//         nullable:false,
//         primary:true,
//         name:"resource_id"
//         })
//     resourceId:number;
    
//     @Column("varchar",{ 
//         nullable:true,
//         length:500,
//         name:"url"
//         })
//     url:string | null;
        

//     @Column("varchar",{ 
//         nullable:true,
//         length:50,
//         name:"title"
//         })
//     title:string | null;

//     @OneToMany(()=>ResourceAuthority, (resourceAuthority: ResourceAuthority)=>resourceAuthority.authority,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
//     resourceAuthorities:ResourceAuthority[];
//     // @ManyToMany(type=>Authority,authority=>authority.resources)
//     // authorities:Authority[];
// }
