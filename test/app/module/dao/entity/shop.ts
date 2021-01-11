import {BaseEntity,Entity,Column,Id,JoinColumn,ManyToOne,EntityProxy} from 'relaen';
import {UserInfo} from './userinfo';

@Entity("t_shop",'test')
export class Shop extends BaseEntity{
	@Id()
	@Column({
		name:'shop_id',
		type:'int',
		nullable:false
	})
	private shopId:number;

	@ManyToOne({entity:'UserInfo'})
	@JoinColumn({
		name:'owner_id',
		refName:'user_id',
		nullable:true
	})
	private owner:UserInfo;

	@ManyToOne({entity:'UserInfo'})
	@JoinColumn({
		name:'manager_id',
		refName:'user_id',
		nullable:true
	})
	private manager:UserInfo;

	@Column({
		name:'shop_name',
		type:'string',
		nullable:true,
		length:32
	})
	private shopName:string;

	@Column({
		name:'address',
		type:'string',
		nullable:true,
		length:128
	})
	private address:string;

	constructor(idValue?:number){
		super();
		this.shopId = idValue;
	}
	public getShopId():number{
		return this.shopId;
	}
	public setShopId(value:number){
		this.shopId = value;
	}

	public async getOwner():Promise<UserInfo>{
		return await EntityProxy.get(this,'owner');
	}
	public setOwner(value:UserInfo){
		this.owner = value;
	}

	public async getManager():Promise<UserInfo>{
		return await EntityProxy.get(this,'manager');
	}
	public setManager(value:UserInfo){
		this.manager = value;
	}

	public getShopName():string{
		return this.shopName;
	}
	public setShopName(value:string){
		this.shopName = value;
	}

	public getAddress():string{
		return this.address;
	}
	public setAddress(value:string){
		this.address = value;
	}

}