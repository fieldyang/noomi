// import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
// import {Authority} from "./authority";
// import {Group} from "./group";


// @Entity("t_group_authority" ,{schema:"codement" } )
// @Index("FK_GROUPAUTH_REF_AUTH",["authority",])
// @Index("FK_GROUP_AU_REF_GROUP",["group",])
// export class GroupAuthority {

//     @Column("bigint",{ 
//         nullable:false,
//         primary:true,
//         name:"group_authority_id"
//         })
//     group_authority_id:number;
        

   
//     @ManyToOne(()=>Authority, (authority: Authority)=>authority.tGroupAuthoritys,{  nullable:false,onDelete: 'CASCADE',onUpdate: 'CASCADE' ,eager:true})
//     @JoinColumn({ name:'authority_id'})
//     authority:Authority | null;


   
//     @ManyToOne(()=>Group, (group: Group)=>group.groupAuthorities,{ onDelete: 'CASCADE',onUpdate: 'CASCADE' ,eager:true})
//     @JoinColumn({ name:'group_id'})
//     group:Group | null;

// }
