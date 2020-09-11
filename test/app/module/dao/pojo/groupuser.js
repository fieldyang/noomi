"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GroupUser = void 0;
var typeorm_1 = require("typeorm");
var user_1 = require("./user");
var group_1 = require("./group");
var GroupUser = /** @class */ (function () {
    function GroupUser() {
    }
    __decorate([
        typeorm_1.Column("bigint", {
            nullable: false,
            primary: true,
            name: "group_user_id"
        })
    ], GroupUser.prototype, "groupUserId");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_1.User; }, function (user) { return user.groupUsers; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true }),
        typeorm_1.JoinColumn({ name: 'user_id' })
    ], GroupUser.prototype, "user");
    __decorate([
        typeorm_1.ManyToOne(function () { return group_1.Group; }, function (group) { return group.groupUsers; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true }),
        typeorm_1.JoinColumn({ name: 'group_id' })
    ], GroupUser.prototype, "group");
    GroupUser = __decorate([
        typeorm_1.Entity("t_group_user", { schema: "codement" }),
        typeorm_1.Index("FK_GROUP_USER_REF_GROUP", ["group",]),
        typeorm_1.Index("FK_GROUP_USER_REF_USER", ["user",])
    ], GroupUser);
    return GroupUser;
}());
exports.GroupUser = GroupUser;
