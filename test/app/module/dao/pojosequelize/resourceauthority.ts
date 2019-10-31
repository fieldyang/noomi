import{Table,Column,Model,HasMany, ForeignKey, BelongsTo} from 'sequelize-typescript';
import { Resource } from './resource';
import { Authority } from './authority';

@Table({tableName:'t_resource_authority'})

class ResourceAuthority extends Model<ResourceAuthority>{
    @Column({
        primaryKey:true,
        field:'resource_authority_id'
    })
    resourceAuthorityId:number;

    @ForeignKey(()=>Resource)
    @Column({
        field:'resource_id'
    })
    resourceId:number;

    @BelongsTo(()=>Resource)
    resource:Resource

    @ForeignKey(()=>Authority)
    @Column({
        field:'authority_id'
    })
    authorityId:number;

    @BelongsTo(()=>Authority)
    authority:Authority;
}

export {ResourceAuthority}