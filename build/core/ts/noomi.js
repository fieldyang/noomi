"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instancefactory_1 = require("./instancefactory");
const routefactory_1 = require("./routefactory");
const noomihttp_1 = require("./noomihttp");
class noomi {
    constructor(port) {
        const mdlPath = require('path');
        this.init(mdlPath.join(__dirname, '../../config'));
        const http = require("http");
        const url = require("url");
        const querystring = require("querystring");
        http.createServer((req, res) => {
            let path = url.parse(req.url).pathname;
            const paramstr = url.parse(req.url).query;
            const params = querystring.parse(paramstr);
            let re = routefactory_1.RouteFactory.handleRoute(path, params);
            if (re) {
                re.then((result) => {
                    noomihttp_1.NoomiHttp.writeDataToClient(res, {
                        data: result,
                        charset: 'utf8'
                    });
                });
            }
            else { //静态资源判断
                //判断是否在static包含目录中
            }
        }).listen(port);
    }
    /**
     * 初始化
     */
    init(basePath) {
        const fs = require('fs');
        let iniJson = null;
        const path = require('path');
        try {
            let iniStr = fs.readFileSync(path.resolve('config', 'noomi.ini'), 'utf-8');
            iniJson = JSON.parse(iniStr);
        }
        catch (e) {
            throw e;
        }
        //上下文初始化
        if (iniJson.hasOwnProperty('contextpath')) {
            let ctxPath = iniJson['contextpath'];
            if (ctxPath !== null && (ctxPath = ctxPath.trim()) !== '') {
                // path.resolve('config',ctxPath);
                // let p = basePath + '/' + ctxPath;
                // p = p.replace(/\/\//g,'/');
                this.loadCtx(path.resolve('config', ctxPath), iniJson['modulepath']);
            }
        }
        //路由初始化
        if (iniJson.hasOwnProperty('routepath')) {
            let rPath = iniJson['routepath'];
            if (rPath !== null && (rPath = rPath.trim()) !== '') {
                // let p = basePath + '/' + rPath;
                // p = p.replace(/\/\//g,'/');
                this.loadRoute(path.resolve('config', rPath));
            }
        }
        //aop初始化
    }
    /**
     * 加载context
     * @param path
     */
    loadCtx(path, mdlPath) {
        instancefactory_1.InstanceFactory.parseFile(path, mdlPath);
    }
    /**
     * 加载路由
     * @param path
     */
    loadRoute(path) {
        routefactory_1.RouteFactory.parseFile(path);
    }
}
exports.noomi = noomi;
//# sourceMappingURL=noomi.js.map