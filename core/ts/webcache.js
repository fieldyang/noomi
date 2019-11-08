"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var ncache_1 = require("./ncache");
var application_1 = require("./application");
/**
 * web 缓存类
 */
var WebCache = /** @class */ (function () {
    function WebCache() {
    }
    /**
     * 初始化
     */
    WebCache.init = function (cfg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.maxAge = cfg.max_age | 0;
                this.fileTypes = cfg.file_type || ['*'];
                this.noCache = cfg.no_cache || false;
                this.noStore = cfg.no_store || false;
                this.isPublic = cfg.public || false;
                this.isPrivate = cfg.private || false;
                this.mustRevalidation = cfg.must_revalidation || false;
                this.proxyRevalidation = cfg.proxy_revalidation || false;
                this.expires = cfg.expires || 0;
                //创建cache
                this.cache = new ncache_1.NCache({
                    name: 'NWEBCACHE',
                    maxSize: cfg.max_size || 0,
                    saveType: cfg.save_type,
                    redis: cfg.redis
                });
                return [2 /*return*/];
            });
        });
    };
    /**
     * 添加资源
     * @param url   url 请求url
     * @param path  url对应路径
     * @param data  path对应数据
     */
    WebCache.add = function (url, path, data, response) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, pathMdl, addFlag, stat, lastModified, hash, etag, extName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs = application_1.App.fs;
                        pathMdl = application_1.App.path;
                        addFlag = false;
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                fs.stat(path, function (err, data) {
                                    resolve(data);
                                });
                            })];
                    case 1:
                        stat = _a.sent();
                        lastModified = stat.mtime.toUTCString();
                        hash = application_1.App.crypto.createHash('md5');
                        hash.update(data, 'utf8');
                        etag = hash.digest('hex');
                        //非全部类型，需要进行类型判断
                        if (this.fileTypes[0] === '*') {
                            addFlag = true;
                        }
                        else {
                            extName = pathMdl.extname(url);
                            if (this.fileTypes.includes(extName)) {
                                addFlag = true;
                            }
                        }
                        if (!addFlag) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.cache.set({
                                key: url,
                                value: {
                                    etag: etag,
                                    lastModified: lastModified,
                                    data: data
                                }
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (response) {
                            this.writeCacheToClient(response, etag, lastModified);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 加载资源
     * @param request   request
     * @param response  response
     * @param url       url
     * @return          0不用回写数据 或 数据
     */
    WebCache.load = function (request, response, url) {
        return __awaiter(this, void 0, void 0, function () {
            var rCheck, _a, map;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.check(request, url)];
                    case 1:
                        rCheck = _b.sent();
                        _a = rCheck;
                        switch (_a) {
                            case 0: return [3 /*break*/, 2];
                            case 1: return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 2: return [2 /*return*/, 0];
                    case 3: return [4 /*yield*/, this.cache.getMap(url)];
                    case 4:
                        map = _b.sent();
                        if (map !== null && map.data && map.data !== '') {
                            this.writeCacheToClient(response, map.etag, map.lastModified);
                            return [2 /*return*/, map.data];
                        }
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 写cache到客户端
     * @param response          httpresponse
     * @param etag              etag
     * @param lastModified      lasmodified
     */
    WebCache.writeCacheToClient = function (response, etag, lastModified) {
        //设置etag
        response.setHeader('Etag', etag);
        //设置lastmodified
        response.setHeader('Last-Modified', lastModified);
        //设置expire
        if (this.expires && this.expires > 0) {
            response.setHeader('Expires', new Date(new Date().getTime() + this.expires * 1000).toUTCString());
        }
        //设置cache-control
        var cc = [];
        this.isPublic ? cc.push('public') : '';
        this.isPrivate ? cc.push('private') : '';
        this.noCache ? cc.push('no-cache') : '';
        this.noStore ? cc.push('no-store') : '';
        this.maxAge > 0 ? cc.push('max-age=' + this.maxAge) : '';
        this.mustRevalidation ? cc.push('must-revalidation') : '';
        this.proxyRevalidation ? cc.push('proxy-revalidation') : '';
        response.setHeader('cache-control', cc.join(','));
    };
    /**
     * 资源check，如果需要更改，则从服务器获取
     * @param request
     * @return          0从浏览器获取 1已更新 2资源不在缓存
     */
    WebCache.check = function (request, url) {
        return __awaiter(this, void 0, void 0, function () {
            var exist, modiSince, r, result, etag, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cache.has(url)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) {
                            return [2 /*return*/, 2];
                        }
                        modiSince = request.getHeader('If-Modified_Since');
                        r = false;
                        if (!modiSince) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.cache.get(url, 'lastModified')];
                    case 2:
                        result = _a.sent();
                        r = (modiSince === result);
                        if (!r) {
                            return [2 /*return*/, 1];
                        }
                        _a.label = 3;
                    case 3:
                        etag = request.getHeader('If-None-Match');
                        if (!etag) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.cache.get(url, 'etag')];
                    case 4:
                        result = _a.sent();
                        r = (result === etag);
                        if (!r) {
                            return [2 /*return*/, 1];
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/, r ? 0 : 1];
                }
            });
        });
    };
    return WebCache;
}());
exports.WebCache = WebCache;
