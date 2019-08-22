"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 测试用户
 */
class UserQuery {
    constructor(params) {
        console.log(params);
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
            }
        };
    }
}
exports.UserQuery = UserQuery;
//# sourceMappingURL=user.js.map