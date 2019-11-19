import{Table,Column,Model,HasMany} from 'sequelize-typescript';
import ResourceAuthority from './resourceauthority';

@Table({tableName:'t_resource'})

export default class Resource extends Model<Resource>{
    @Column({
        primaryKey:true,
        field:'resource_id'
    })
    resourceId:number;

    @Column
    url:string;

    @HasMany(()=>ResourceAuthority)
    resourceAuthorities:ResourceAuthority[];
}
// export{Resource}
