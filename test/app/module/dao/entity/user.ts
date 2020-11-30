import {UserType} from './usertype'
import { Entity, BaseEntity, Id, Column, ManyToOne, JoinColumn, EntityProxy } from 'relaen';

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
		nullable:false
	})
	private userName:string;

	@Column({
		name:'age',
		type:'int',
		nullable:false
	})
	private age:number;

	@Column({
		name:'sexy',
		type:'string',
		nullable:false
	})
	private sexy:string;

	@ManyToOne({entity:'UserType'})
	@JoinColumn({name:'user_type_id',refName:'user_type_id'})
	private userType:UserType;

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

	public getAge():number{
		return this.age;
	}
	public setAge(value:number){
		this.age = value;
	}

	public getSexy():string{
		return this.sexy;
	}
	public setSexy(value:string){
		this.sexy = value;
	}

	public async getUserType():Promise<UserType>{
		return await EntityProxy.get(this,'userType');
	}
	public setUserType(value:UserType){
		this.userType = value;
	}

}