"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webcache_1 = require("./webcache");
var errorfactory_1 = require("./errorfactory");
var sessionfactory_1 = require("./sessionfactory");
var application_1 = require("./application");
var pagefactory_1 = require("./pagefactory");
/**
 * web 配置
 */
var WebConfig = /** @class */ (function () {
    function WebConfig() {
    }
    /**
     * 获取参数
     * @param name
     */
    WebConfig.get = function (name) {
        if (!this.config || !this.config.hasOwnProperty(name)) {
            return null;
        }
        return this.config[name];
    };
    WebConfig.init = function (config) {
        if (config.hasOwnProperty('web_config')) {
            var cfg = config['web_config'];
            this.config = cfg;
            //cache
            if (cfg.cache === true) {
                var opt = cfg.cache_option;
                WebConfig.useServerCache = true;
                webcache_1.WebCache.init({
                    save_type: opt.save_type,
                    max_age: opt.max_age,
                    max_size: opt.max_size,
                    public: opt.public,
                    no_cache: opt.no_cache,
                    no_store: opt.no_store,
                    file_type: opt.file_type
                });
            }
        }
        if (config.hasOwnProperty('session')) {
            sessionfactory_1.SessionFactory.init(config['session']);
        }
        //errorPage
        if (config.hasOwnProperty('error_page')) {
            this.setErrorPages(config['error_page']);
        }
    };
    /**
     * 解析路由文件
     * @param path  文件路径
     * @param ns    命名空间，默认 /
     */
    WebConfig.parseFile = function (path) {
        //读取文件
        var json;
        try {
            var jsonStr = application_1.App.fs.readFileSync(application_1.App.path.join(process.cwd(), path), 'utf-8');
            json = JSON.parse(jsonStr);
        }
        catch (e) {
            throw new errorfactory_1.NoomiError("2100") + e;
        }
        this.init(json);
    };
    /**
     * 设置异常提示页面
     * @param pages page配置（json数组）
     */
    WebConfig.setErrorPages = function (pages) {
        if (Array.isArray(pages)) {
            pages.forEach(function (item) {
                //需要判断文件是否存在
                if (application_1.App.fs.existsSync(application_1.App.path.join(process.cwd(), item.location))) {
                    pagefactory_1.PageFactory.addErrorPage(item.code, item.location);
                }
            });
        }
    };
    WebConfig.useServerCache = false;
    return WebConfig;
}());
exports.WebConfig = WebConfig;
