import{Table,Column,Model,HasMany} from 'sequelize-typescript';
import ResourceAuthority from './resourceauthority';


@Table({tableName:'t_authority'})
export default class Authority extends Model<Authority>{
    @Column({
        primaryKey:true,
        field:'authority_id'
    })
    authorityId:number;

    @Column
    authority:string;

    @HasMany(()=>ResourceAuthority)
    resourceAuthorities:ResourceAuthority[];
}
// export{Authority}
