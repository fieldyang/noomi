import {BaseEntity,Entity,Column,Id,OneToMany,EntityProxy, OneToOne} from 'relaen';
import {GroupUser} from './groupuser';
import {UserInfo} from './userinfo';

@Entity("t_user",'test')
export class User extends BaseEntity{
	@Id()
	@Column({
		name:'user_id',
		type:'int',
		nullable:false
	})
	private userId:number;

	@Column({
		name:'user_name',
		type:'string',
		nullable:true,
		length:32
	})
	private userName:string;

	@Column({
		name:'user_pwd',
		type:'string',
		nullable:true,
		length:32
	})
	private userPwd:string;

	@OneToMany({
		entity:'GroupUser',
		mappedBy:'user'
	})
	private groupUsers:Array<GroupUser>;

	@OneToOne({
		entity:'UserInfo',
		mappedBy:'user'
	})
	private userInfo:Array<UserInfo>;

	constructor(idValue?:number){
		super();
		this.userId = idValue;
	}
	public getUserId():number{
		return this.userId;
	}
	public setUserId(value:number){
		this.userId = value;
	}

	public getUserName():string{
		return this.userName;
	}
	public setUserName(value:string){
		this.userName = value;
	}

	public getUserPwd():string{
		return this.userPwd;
	}
	public setUserPwd(value:string){
		this.userPwd = value;
	}

	public async getGroupUsers():Promise<Array<GroupUser>>{
		return await EntityProxy.get(this,'groupUsers');
	}
	public setGroupUsers(value:Array<GroupUser>){
		this.groupUsers = value;
	}

	public async getUserInfo():Promise<Array<UserInfo>>{
		return await EntityProxy.get(this,'userInfo');
	}
	public setUserInfo(value:Array<UserInfo>){
		this.userInfo = value;
	}

}