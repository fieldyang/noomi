import {BaseEntity,Entity,Column,Id,OneToMany,EntityProxy} from 'relaen';
import {GroupUser} from './groupuser';

@Entity("t_group",'test')
export class Group extends BaseEntity{
	@Id()
	@Column({
		name:'group_id',
		type:'int',
		nullable:false
	})
	private groupId:number;

	@Column({
		name:'group_name',
		type:'string',
		nullable:true,
		length:32
	})
	private groupName:string;

	@OneToMany({
		entity:'GroupUser',
		mappedBy:'group'
	})
	private groupUsers:Array<GroupUser>;

	constructor(idValue?:number){
		super();
		this.groupId = idValue;
	}
	public getGroupId():number{
		return this.groupId;
	}
	public setGroupId(value:number){
		this.groupId = value;
	}

	public getGroupName():string{
		return this.groupName;
	}
	public setGroupName(value:string){
		this.groupName = value;
	}

	public async getGroupUsers():Promise<Array<GroupUser>>{
		return await EntityProxy.get(this,'groupUsers');
	}
	public setGroupUsers(value:Array<GroupUser>){
		this.groupUsers = value;
	}

}