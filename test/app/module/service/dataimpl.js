"use strict";
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
exports.DataImpl = void 0;
var connectionmanager_1 = require("../../../../core/database/connectionmanager");
var decorator_1 = require("../../../../core/tools/decorator");
var resource_1 = require("../dao/pojo/resource");
// @Transactioner()
var DataImpl = /** @class */ (function () {
    function DataImpl() {
    }
    DataImpl.prototype.addRes = function (url, id) {
        return __awaiter(this, void 0, void 0, function () {
            var res, manager, r1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = new resource_1.Resource();
                        res.resourceId = id;
                        res.url = url;
                        return [4 /*yield*/, connectionmanager_1.getManager()];
                    case 1:
                        manager = _a.sent();
                        return [4 /*yield*/, manager.save(res)];
                    case 2:
                        r1 = _a.sent();
                        return [2 /*return*/, 2];
                }
            });
        });
    };
    // @Transaction()
    DataImpl.prototype.addResAuth = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    DataImpl.prototype.add = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addRes('/testtran1')];
                    case 1:
                        r1 = _a.sent();
                        throw 'hahaha';
                }
            });
        });
    };
    DataImpl.prototype.methodA = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // try{
                    return [4 /*yield*/, this.mehtodB()];
                    case 1:
                        // try{
                        _a.sent();
                        // }catch(e){
                        //     console.log(e);
                        // }
                        // await this.methodC();
                        console.log('finished');
                        return [2 /*return*/];
                }
            });
        });
    };
    DataImpl.prototype.mehtodB = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // throw new Error('methodB failed');
                    return [4 /*yield*/, this.methodC()];
                    case 1:
                        // throw new Error('methodB failed');
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DataImpl.prototype.methodC = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('methodB failed');
            });
        });
    };
    __decorate([
        decorator_1.Transaction()
    ], DataImpl.prototype, "addRes");
    __decorate([
        decorator_1.Transaction()
    ], DataImpl.prototype, "add");
    DataImpl = __decorate([
        decorator_1.Instance('dataImpl')
    ], DataImpl);
    return DataImpl;
}());
exports.DataImpl = DataImpl;
