"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Group = void 0;
var typeorm_1 = require("typeorm");
var groupauthority_1 = require("./groupauthority");
var groupuser_1 = require("./groupuser");
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        typeorm_1.Column("bigint", {
            nullable: false,
            primary: true,
            name: "group_id"
        })
    ], Group.prototype, "groupId");
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 50,
            name: "group_name"
        })
    ], Group.prototype, "groupName");
    __decorate([
        typeorm_1.Column("varchar", {
            nullable: true,
            length: 200,
            name: "remarks"
        })
    ], Group.prototype, "remarks");
    __decorate([
        typeorm_1.OneToMany(function () { return groupuser_1.GroupUser; }, function (groupUser) { return groupUser.group; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    ], Group.prototype, "groupUsers");
    __decorate([
        typeorm_1.OneToMany(function () { return groupauthority_1.GroupAuthority; }, function (groupAuthority) { return groupAuthority.group; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    ], Group.prototype, "groupAuthorities");
    Group = __decorate([
        typeorm_1.Entity("t_group", { schema: "codement" })
    ], Group);
    return Group;
}(typeorm_1.BaseEntity));
exports.Group = Group;
