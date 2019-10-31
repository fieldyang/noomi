import { RedisFactory } from "../../core/ts/redisfactory";
import { User } from "../app/module/dao/pojo/user";
import { UserAction } from "../app/module/action/useraction";
import { App } from "../../core/ts/application";
import { ResourceAuthority } from "../app/module/dao/pojosequelize/resourceauthority";
import { Resource } from "../app/module/dao/pojosequelize/resource";
import {Sequelize as SequelizeOrigin} from 'sequelize';
import { Sequelize } from "sequelize-typescript";
// import { Sequelize as SequelizeTS } from "sequelize-typescript";
import { Authority } from "../app/module/dao/pojosequelize/authority";

// const Promise = require('bluebird');

async function add(){
    const Promise = require('cls-bluebird');
    let cls = require('cls-hooked');
    let namespace = cls.createNamespace('tx-own');
    SequelizeOrigin.useCLS(namespace);
    
    let seq = new Sequelize({
        "dialect":"mysql",
        "host":"localhost",
        "port":3306,
        "username":"root",
        "password":"field",
        "database":"codement",
        "pool": {
            "max": 5,
            "min": 0,
            "acquire": 30000,
            "idle": 10000
        },
        "define": {
            "timestamps": false
        }
    });
    seq.addModels([Resource,ResourceAuthority,Authority]);
    
    

    let tr = await seq.transaction({autocommit:false});

    // try{
    //     await ResourceAuthority.create({
    //         resourceId:13,
    //         authorityId:2
    //     });
    //     await Resource.create({
    //         resourceId:13,
    //         url:'/test/test'
    //     });
    //     await tr.commit();
    // }catch(e){
    //     await tr.rollback();
    // }  
    
    

    seq.transaction(async (t)=>{
        // console.log(namespace.get('transaction'));
        await ResourceAuthority.create({
            resourceId:13,
            authorityId:2
        });

        await Resource.create({
            resourceId:13,
            url:'/test/test'
        });
        
    }).then(r=>{
        console.log(r);
    }).catch(e=>{
        console.log(e);
    });

    // return seq.transaction().then((t)=>{
    //     // console.log(t,namespace);
    //     console.log(namespace.get('transaction'));
    //     return ResourceAuthority.create({
    //         resourceId:13,
    //         authorityId:2
    //     }).then((r)=>{
    //         t.commit();
    //     }).catch(e=>{
    //         t.rollback();
    //     });

    //     /*await Resource.create({
    //         resourceId:13,
    //         url:'/test/test'
    //     },{transaction:t});
    //     */
    // }).then(r=>{
    //     console.log(r);

    // }).catch(e=>{
    //     console.log(e);
    // })
    
}

add();


