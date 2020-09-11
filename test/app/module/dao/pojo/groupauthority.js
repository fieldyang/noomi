"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GroupAuthority = void 0;
var typeorm_1 = require("typeorm");
var authority_1 = require("./authority");
var group_1 = require("./group");
var GroupAuthority = /** @class */ (function () {
    function GroupAuthority() {
    }
    __decorate([
        typeorm_1.Column("bigint", {
            nullable: false,
            primary: true,
            name: "group_authority_id"
        })
    ], GroupAuthority.prototype, "group_authority_id");
    __decorate([
        typeorm_1.ManyToOne(function () { return authority_1.Authority; }, function (authority) { return authority.tGroupAuthoritys; }, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true }),
        typeorm_1.JoinColumn({ name: 'authority_id' })
    ], GroupAuthority.prototype, "authority");
    __decorate([
        typeorm_1.ManyToOne(function () { return group_1.Group; }, function (group) { return group.groupAuthorities; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true }),
        typeorm_1.JoinColumn({ name: 'group_id' })
    ], GroupAuthority.prototype, "group");
    GroupAuthority = __decorate([
        typeorm_1.Entity("t_group_authority", { schema: "codement" }),
        typeorm_1.Index("FK_GROUPAUTH_REF_AUTH", ["authority",]),
        typeorm_1.Index("FK_GROUP_AU_REF_GROUP", ["group",])
    ], GroupAuthority);
    return GroupAuthority;
}());
exports.GroupAuthority = GroupAuthority;
