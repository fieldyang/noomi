"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ResourceAuthority = void 0;
var typeorm_1 = require("typeorm");
var authority_1 = require("./authority");
var resource_1 = require("./resource");
var ResourceAuthority = /** @class */ (function () {
    function ResourceAuthority() {
    }
    __decorate([
        typeorm_1.Column("bigint", {
            nullable: false,
            primary: true,
            name: "resource_authority_id"
        })
    ], ResourceAuthority.prototype, "resourceAuthorityId");
    __decorate([
        typeorm_1.ManyToOne(function () { return authority_1.Authority; }, function (authority) { return authority.resourceAuthorities; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true }),
        typeorm_1.JoinColumn({ name: 'authority_id' })
    ], ResourceAuthority.prototype, "authority");
    __decorate([
        typeorm_1.ManyToOne(function () { return resource_1.Resource; }, function (resource) { return resource.resourceAuthorities; }, { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true }),
        typeorm_1.JoinColumn({ name: 'resource_id' })
    ], ResourceAuthority.prototype, "resource");
    ResourceAuthority = __decorate([
        typeorm_1.Entity("t_resource_authority", { schema: "codement" }),
        typeorm_1.Index("FK_RES_AUTH_REF_AUTH", ["authority",]),
        typeorm_1.Index("FK_RES_AUTH_REF_RES", ["resource",])
    ], ResourceAuthority);
    return ResourceAuthority;
}());
exports.ResourceAuthority = ResourceAuthority;
