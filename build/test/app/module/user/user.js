"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("../../../../core/ts/decorator");
// function Inject(className:string){
//     console.log(className);
//     return className;
// }
/**
 * 测试用户
 */
class UserQuery {
    constructor(params) {
        // console.log(params);
    }
    /**
     * 获取用户信息
     */
    getInfo() {
        return {
            success: true,
            result: {
                userId: 1,
                userName: 'yang',
                date: this.dateHandler.tickerToDTString((new Date()).valueOf())
            }
        };
    }
}
__decorate([
    decorator_1.Inject("DateHandler")
], UserQuery.prototype, "dateHandler", void 0);
exports.UserQuery = UserQuery;
//# sourceMappingURL=user.js.map