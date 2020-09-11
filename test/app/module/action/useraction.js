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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UserAction = void 0;
var decorator_1 = require("../../../../core/tools/decorator");
var baseroute_1 = require("../../../../core/main/route/baseroute");
/**
 * 测试用户
 */
var UserAction = /** @class */ (function (_super) {
    __extends(UserAction, _super);
    function UserAction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserAction.prototype.user = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { success: true, user: 'yes' }];
            });
        });
    };
    UserAction.prototype.addres = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.dataImpl.add()];
                    case 1:
                        r = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                result: r
                            }];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, { success: false, result: e_1.message }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserAction.prototype.getUserName = function () {
        return this.userName;
    };
    UserAction.prototype.getinfo = function (params) {
        console.log(this.model);
        if (params.type == 1) {
            this.userName = 'aaa';
            return 1;
        }
        else if (params.type == 2) {
            this.userName = 'bbb';
            return 2;
        }
        else if (params.type == 3) {
            this.downloadPath = '/test/js/app.js';
            return 3;
        }
        return {
            success: true,
            result: '哈哈12312!'
        };
    };
    UserAction.prototype.showinfo = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            if (params.userName === 'aaa') {
                                resolve({
                                    success: true,
                                    result: 1
                                });
                            }
                            else {
                                resolve({
                                    success: true,
                                    result: params.userName
                                });
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserAction.prototype.last = function (params) {
        return params.type;
        // return {
        //     info:"this is the last info"
        // }
    };
    UserAction.prototype.addtwo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userService.addTwoUser(this.model.id, this.model.name, this.model.age, this.model.mobile)];
                    case 1:
                        r = _a.sent();
                        return [2 /*return*/, { success: true }];
                    case 2:
                        e_2 = _a.sent();
                        return [2 /*return*/, { success: false, msg: e_2 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        decorator_1.Inject("userService")
    ], UserAction.prototype, "userService");
    __decorate([
        decorator_1.Inject("dataImpl")
    ], UserAction.prototype, "dataImpl");
    __decorate([
        decorator_1.Route({
            path: '/getinfo',
            results: [{
                    "value": 1,
                    "type": "redirect",
                    "url": "/user/showinfo",
                    "params": ["userName"]
                }, {
                    "value": 2,
                    "type": "chain",
                    "url": "/user/last",
                    "params": ["type"]
                }, {
                    value: 3,
                    type: 'stream',
                    // url:'/user/down',
                    params: ['downloadPath']
                }]
        })
    ], UserAction.prototype, "getinfo");
    __decorate([
        decorator_1.Route('/showinfo')
    ], UserAction.prototype, "showinfo");
    __decorate([
        decorator_1.Route('/last')
    ], UserAction.prototype, "last");
    UserAction = __decorate([
        decorator_1.Router({
            namespace: '/user',
            path: '/'
        })
    ], UserAction);
    return UserAction;
}(baseroute_1.BaseRoute));
exports.UserAction = UserAction;
