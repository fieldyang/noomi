import {User} from './user'
import { BaseEntity, Entity, Id, Column, OneToMany, EFkConstraint, EntityProxy } from 'relaen';

@Entity("t_user_type",'test')
export class UserType extends BaseEntity{
	@Id()
	@Column({
		name:'user_type_id',
		type:'int',
		nullable:false
	})
	private userTypeId:number;

	@Column({
		name:'user_type_name',
		type:'string',
		nullable:false
	})
	private userTypeName:string;

	@OneToMany({entity:'User',onDelete:EFkConstraint.RESTRICT,onUpdate:EFkConstraint.RESTRICT,mappedBy:'userType'})
	private users:Array<User>;

	constructor(idValue?:number){
		super();
		this.userTypeId = idValue;
	}
	public getUserTypeId():number{
		return this.userTypeId;
	}
	public setUserTypeId(value:number){
		this.userTypeId = value;
	}

	public getUserTypeName():string{
		return this.userTypeName;
	}
	public setUserTypeName(value:string){
		this.userTypeName = value;
	}

	public async getUsers():Promise<Array<User>>{
		return await EntityProxy.get(this,'users');
	}
	public setUsers(value:Array<User>){
		this.users = value;
	}

}