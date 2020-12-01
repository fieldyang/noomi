// import {BaseEntity,Column,Entity,Index,JoinColumn,JoinTable,ManyToMany,ManyToOne,OneToMany,OneToOne,PrimaryColumn,PrimaryGeneratedColumn,RelationId} from "typeorm";
// import { User } from "./user";
// import { Authority } from "./authority";
// import { GroupAuthority } from "./groupauthority";
// import { GroupUser } from "./groupuser";

// @Entity("t_group" ,{schema:"codement" } )
// export class Group  extends BaseEntity{
//     @PrimaryGeneratedColumn()
//     @Column("bigint",{ 
//         nullable:false,
//         primary:true,
//         name:"group_id"
//         })
//     groupId:number;
 
//     @Column("varchar",{ 
//         nullable:true,
//         length:50,
//         name:"group_name"
//         })
//     groupName:string | null;
        

//     @Column("varchar",{ 
//         nullable:true,
//         length:200,
//         name:"remarks"
//         })
//     remarks:string | null;
    
//     @OneToMany(()=>GroupUser, (groupUser: GroupUser)=>groupUser.group,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
//     groupUsers:GroupUser[];

//     @OneToMany(()=>GroupAuthority, (groupAuthority: GroupAuthority)=>groupAuthority.group,{ onDelete: 'CASCADE' ,onUpdate: 'CASCADE' })
//     groupAuthorities:GroupAuthority[];
    
//     // @ManyToMany(type=>User,user=>user.groups)
//     // users:User[];

//     // @ManyToMany(type=>Authority,authority=>authority.groups)
//     // @JoinTable()
//     // authorities:Promise<Authority[]>;
// }
