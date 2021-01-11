import {BaseEntity,Entity,Column,Id,JoinColumn,OneToOne,OneToMany,EntityProxy} from 'relaen';
import {User} from './user';
import {Shop} from './shop';

@Entity("t_user_info",'test')
export class UserInfo extends BaseEntity{
	@Id()
	@Column({
		name:'user_id',
		type:'int',
		nullable:false
	})
	private userId:number;

	@OneToOne({entity:'User'})
	@JoinColumn({
		name:'user_id',
		refName:'user_id',
		nullable:true
	})
	private user:User;

	@Column({
		name:'real_name',
		type:'string',
		nullable:true,
		length:64
	})
	private realName:string;

	@Column({
		name:'age',
		type:'int',
		nullable:true
	})
	private age:number;

	@Column({
		name:'sexy',
		type:'string',
		nullable:true,
		length:1
	})
	private sexy:string;

	@Column({
		name:'remarks',
		type:'string',
		nullable:true,
		length:256
	})
	private remarks:string;

	@OneToMany({
		entity:'Shop',
		mappedBy:'owner'
	})
	private ownShops:Array<Shop>;

	@OneToMany({
		entity:'Shop',
		mappedBy:'manager'
	})
	private manageShops:Array<Shop>;

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

	public async getUser():Promise<User>{
		return await EntityProxy.get(this,'user');
	}
	public setUser(value:User){
		this.user = value;
	}

	public getRealName():string{
		return this.realName;
	}
	public setRealName(value:string){
		this.realName = value;
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

	public getRemarks():string{
		return this.remarks;
	}
	public setRemarks(value:string){
		this.remarks = value;
	}

	public async getOwnShops():Promise<Array<Shop>>{
		return await EntityProxy.get(this,'ownShops');
	}
	public setOwnShops(value:Array<Shop>){
		this.ownShops = value;
	}

	public async getManageShops():Promise<Array<Shop>>{
		return await EntityProxy.get(this,'manageShops');
	}
	public setManageShops(value:Array<Shop>){
		this.manageShops = value;
	}

}