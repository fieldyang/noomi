import {BaseEntity,Entity,Column,Id,JoinColumn,ManyToOne,EntityProxy} from 'relaen';
import {User} from './user';
import {Group} from './group';

@Entity("t_group_user",'test')
export class GroupUser extends BaseEntity{
	@Id()
	@Column({
		name:'group_user_id',
		type:'int',
		nullable:false
	})
	private groupUserId:number;

	@ManyToOne({entity:'User'})
	@JoinColumn({
		name:'user_id',
		refName:'user_id',
		nullable:true
	})
	private user:User;

	@ManyToOne({entity:'Group'})
	@JoinColumn({
		name:'group_id',
		refName:'group_id',
		nullable:true
	})
	private group:Group;

	constructor(idValue?:number){
		super();
		this.groupUserId = idValue;
	}
	public getGroupUserId():number{
		return this.groupUserId;
	}
	public setGroupUserId(value:number){
		this.groupUserId = value;
	}

	public async getUser():Promise<User>{
		return await EntityProxy.get(this,'user');
	}
	public setUser(value:User){
		this.user = value;
	}

	public async getGroup():Promise<Group>{
		return await EntityProxy.get(this,'group');
	}
	public setGroup(value:Group){
		this.group = value;
	}

}