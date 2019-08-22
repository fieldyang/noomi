"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateHandler {
    tickerToDTString(ticker) {
        let d = new Date(ticker);
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let date = d.getDate();
        let hour = d.getHours();
        let minute = d.getMinutes();
        let second = d.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
}
exports.DateHandler = DateHandler;
//# sourceMappingURL=datehandler.js.map