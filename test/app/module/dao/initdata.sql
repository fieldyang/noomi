insert into t_user(user_id,user_name,user_pwd,enabled) values(1,'field','123456',1);
insert into t_user(user_id,user_name,user_pwd,enabled) values(2,'yang','123456',1);
insert into t_user(user_id,user_name,user_pwd,enabled) values(3,'zhangs','123456',1);
insert into t_user(user_id,user_name,user_pwd,enabled) values(4,'tangb','123456',1);
insert into t_user(user_id,user_name,user_pwd,enabled) values(5,'lis','123456',1);

insert into t_authority(authority_id,authority) values(1,'auth1');
insert into t_authority(authority_id,authority) values(2,'auth2');
insert into t_authority(authority_id,authority) values(3,'auth3');
insert into t_authority(authority_id,authority) values(4,'auth4');

insert into t_group(group_id,group_name) values(1,'admin');
insert into t_group(group_id,group_name) values(2,'custom');

insert into t_resource(resource_id,url) values(1,'/getuserinfo');
insert into t_resource(resource_id,url) values(2,'/showuserinfo');
insert into t_resource(resource_id,url) values(3,'/upload');


insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values (1,1,1);
insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values (2,1,2);
insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values (3,1,3);
insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values (4,1,4);
insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values (5,1,1);
insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values (6,2,2);
insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values (7,2,3);
insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values (8,2,4);
insert into t_resource_authority(resource_authority_id,resource_id,authority_id) values (9,3,1);

insert into t_group_user(group_user_id,group_id,user_id) values(1,1,1);
insert into t_group_user(group_user_id,group_id,user_id) values(2,2,2);
insert into t_group_user(group_user_id,group_id,user_id) values(3,2,3);
insert into t_group_user(group_user_id,group_id,user_id) values(4,2,4);

insert into t_group_authority(group_authority_id,group_id,authority_id) values(1,1,1);
insert into t_group_authority(group_authority_id,group_id,authority_id) values(2,1,2);
insert into t_group_authority(group_authority_id,group_id,authority_id) values(3,1,3);
insert into t_group_authority(group_authority_id,group_id,authority_id) values(4,1,4);
insert into t_group_authority(group_authority_id,group_id,authority_id) values(5,2,2);
insert into t_group_authority(group_authority_id,group_id,authority_id) values(6,2,3);
insert into t_group_authority(group_authority_id,group_id,authority_id) values(7,2,4);
