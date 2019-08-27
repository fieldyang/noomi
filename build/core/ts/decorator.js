"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instancefactory_1 = require("./instancefactory");
function Inject(className) {
    return function (target, propertyName) {
        console.log(target, propertyName, className);
        let instance = instancefactory_1.InstanceFactory.getInstance(className);
        if (!instance) {
            throw "找不到指定类名对应的实例";
        }
        Reflect.set(target, propertyName, instance);
    };
    // console.log(this);
    // console.log(className);
    // console.log(arguments);
    // return className;
}
exports.Inject = Inject;
//# sourceMappingURL=decorator.js.map