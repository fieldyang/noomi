const NUITipWords = {
    uploading: '上传中...',
    total: '共',
    record: '条',
    NO: '第',
    page: '页',
    weekday: {
        sunday: '日',
        monday: '一',
        tuesday: '二',
        wednesday: '三',
        thursday: '四',
        friday: '五',
        saturday: '六'
    },
    buttons: {
        ok: '确定',
        cancel: '取消',
        close: '关闭',
        yes: '是',
        no: '否',
        today: '今天',
        now: '此时'
    }
};
document.oncontextmenu = function (e) {
    e.preventDefault();
};
class UITool {
    static clearSpace(src) {
        if (src && typeof src === 'string') {
            return src.replace(/\s+/g, '');
        }
    }
    static adjustPosAndSize(module, key, x, y, distance, bodyHeight, changeSize) {
        let el = module.container.querySelector("[key='" + key + "']");
        if (!el) {
            setTimeout(() => {
                UITool.adjustPosAndSize(module, key, x, y, distance, document.body.scrollHeight, changeSize);
            }, 0);
        }
        else {
            let scTop = document.documentElement.scrollTop || document.body.scrollTop;
            y += scTop;
            let height = bodyHeight > window.innerHeight ? bodyHeight : window.innerHeight;
            if (changeSize) {
                el.style.maxHeight = (window.innerHeight - 50) + 'px';
            }
            if (y + el.offsetHeight > height && y > el.offsetHeight + distance) {
                el.style.transform = 'translate(0,' + -(el.offsetHeight + distance) + 'px)';
            }
            else {
                el.style.transform = 'translate(0,0)';
            }
        }
    }
    static handleUIParam(dom, defDom, paramArr, props, defaultValues) {
        let error = false;
        for (let i = 0; i < paramArr.length; i++) {
            let pName = props[i];
            let p = paramArr[i];
            let type;
            let pa;
            if (p.includes('|')) {
                pa = p.split('|');
                p = pa[0];
                type = pa[1];
            }
            let v = dom.getProp(p);
            if (v) {
                v = this.clearSpace(v);
                if (v !== '') {
                    switch (type) {
                        case 'number':
                            if (!nodom.Util.isNumberString(v)) {
                                error = true;
                            }
                            else {
                                defDom[pName] = parseInt(v);
                            }
                            break;
                        case 'array':
                            let va = v.split(',');
                            if (pa.length === 3) {
                                if (nodom.Util.isNumberString(pa[2])) {
                                    if (parseInt(pa[2]) > va.length) {
                                        error = true;
                                    }
                                }
                                else {
                                    if (pa[2] === 'number') {
                                        for (let i = 0; i < va.length; i++) {
                                            let v1 = va[i];
                                            if (!nodom.Util.isNumberString(v1)) {
                                                error = true;
                                                break;
                                            }
                                            va[i] = parseInt(v1);
                                        }
                                    }
                                }
                            }
                            if (!error) {
                                defDom[pName] = va;
                            }
                            break;
                        case 'bool':
                            if (v === 'true') {
                                defDom[pName] = true;
                            }
                            break;
                        default:
                            defDom[pName] = v;
                    }
                }
            }
            if (!v || v === '') {
                if (defaultValues && defaultValues[i] !== null) {
                    defDom[pName] = defaultValues[i];
                }
                else {
                    if (type === 'bool') {
                        if (dom.hasProp(p)) {
                            defDom[pName] = true;
                        }
                        else {
                            defDom[pName] = false;
                        }
                    }
                    else {
                        error = true;
                    }
                }
            }
            dom.delProp(p);
            if (error) {
                throw new nodom.NodomError('config1', defDom.tagName, p);
            }
        }
    }
}
class UIEventRegister {
    static addEvent(eventName, moduleId, domKey, handler) {
        if (!this.listeners.has(eventName)) {
            this.listeners.set(eventName, []);
            window.addEventListener(eventName, (e) => {
                let target = e.target;
                let key = target.getAttribute('key');
                let evts = this.listeners.get(eventName);
                for (let evt of evts) {
                    let module = nodom.ModuleFactory.get(evt.module);
                    let dom = module.renderTree.query(evt.dom);
                    if (!dom) {
                        continue;
                    }
                    let inOrOut = dom.key === key || dom.query(key) ? true : false;
                    if (typeof evt.handler === 'function') {
                        evt.handler.apply(dom, [module, dom, inOrOut, e]);
                    }
                }
            }, false);
        }
        let arr = this.listeners.get(eventName);
        let find = arr.find(item => item.dom === domKey);
        if (find) {
            return;
        }
        arr.push({
            module: moduleId,
            dom: domKey,
            handler: handler
        });
    }
}
UIEventRegister.listeners = new Map();
function request(cfg) {
    return nodom.request(cfg);
}
class UIAccordion extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-ACCORDION';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    if (o === 'children') {
                        if (Array.isArray(params[o])) {
                            for (let c of params[o]) {
                                if (typeof c !== 'object') {
                                    continue;
                                }
                                let d = new nodom.Element(c.tagName || 'div');
                                for (let p in c) {
                                    if (p === 'tagName') {
                                        continue;
                                    }
                                    d.setProp(p, c[p]);
                                }
                                rootDom.add(d);
                            }
                        }
                    }
                    else {
                        this[o] = params[o];
                    }
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        rootDom.addClass('nd-accordion');
        let firstDom = new nodom.Element();
        let secondDom = new nodom.Element();
        firstDom.tagName = 'DIV';
        secondDom.tagName = 'DIV';
        firstDom.addClass('nd-accordion-item');
        let activeName1;
        let activeName2;
        for (let i = 0; i < rootDom.children.length; i++) {
            let item = rootDom.children[i];
            if (!item.tagName) {
                continue;
            }
            if (item.hasProp('first')) {
                firstDom.addDirective(new nodom.Directive('repeat', item.getProp('data'), firstDom), true);
                item.addClass('nd-accordion-first');
                let methodId = '$nodomGenMethod' + nodom.Util.genId();
                item.addEvent(new nodom.NodomEvent('click', methodId + ':delg'));
                this.method1 = methodId;
                activeName1 = item.getProp('activename') || 'active';
                this.active1 = activeName1;
                firstDom.add(item);
                let span = new nodom.Element('span');
                span.children = item.children;
                item.children = [span];
                if (item.hasProp('icon')) {
                    span.addClass('nd-icon-' + item.getProp('icon'));
                }
                this.field1 = item.getProp('data');
                let icon = new nodom.Element('b');
                icon.addClass('nd-accordion-icon nd-icon-right');
                icon.directives.push(new nodom.Directive('class', "{'nd-accordion-open':'" + activeName1 + "'}", icon));
                item.add(icon);
                item.delProp(['activename', 'first']);
            }
            else if (item.hasProp('second')) {
                activeName2 = item.getProp('activename') || 'active';
                this.active2 = activeName2;
                item.addDirective(new nodom.Directive('repeat', item.getProp('data'), item));
                this.field2 = item.getProp('data');
                item.addClass('nd-accordion-second');
                if (item.hasProp('itemclick')) {
                    item.addEvent(new nodom.NodomEvent('click', item.getProp('itemclick') + ':delg'));
                }
                item.addDirective(new nodom.Directive('class', "{'nd-accordion-selected':'" + activeName2 + "'}", item));
                secondDom.addClass('nd-accordion-secondct');
                secondDom.add(item);
                secondDom.addDirective(new nodom.Directive('class', "{'nd-accordion-hide':'!" + activeName1 + "'}", secondDom), true);
            }
            item.delProp(['data', 'second']);
        }
        firstDom.add(secondDom);
        rootDom.children = [firstDom];
    }
    beforeRender(module, uidom) {
        const me = this;
        super.beforeRender(module, uidom);
        if (this.needPreRender) {
            module.methodFactory.add(this.method1, (dom, model, module, e) => {
                let pmodel = module.modelFactory.get(uidom.modelId);
                let data = pmodel.data[me.field1];
                let f = me.active1;
                for (let d of data) {
                    if (d[f] === true) {
                        d[f] = false;
                    }
                }
                model.set(f, true);
            });
            module.methodFactory.add(this.method2, (dom, model, module, e) => {
                let pmodel = module.modelFactory.get(uidom.modelId);
                let data = pmodel.data[me.field1];
                let f = me.active2;
                for (let d of data) {
                    for (let d1 of d[me.field2]) {
                        if (d1[f] === true) {
                            d1[f] = false;
                        }
                    }
                }
                model.set(f, true);
            });
        }
    }
}
nodom.PluginManager.add('UI-ACCORDION', UIAccordion);
class UIButton extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-BUTTON';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['size', 'icon', 'iconpos', 'theme', 'nobg|bool'], ['size', 'icon', 'iconPos', 'theme', 'nobg'], ['normal', '', 'left', '', null]);
                this.text = params.innerHTML.trim();
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'button';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let clsArr = ['nd-btn'];
        clsArr.push('nd-btn-' + this.size);
        if (this.icon !== '') {
            clsArr.push('nd-btn-' + this.iconPos);
        }
        if (this.nobg) {
            clsArr.push('nd-btn-nobg');
        }
        else if (this.theme !== '') {
            clsArr.push('nd-btn-' + this.theme);
        }
        if (this.text === '') {
            clsArr.push('nd-btn-notext');
        }
        rootDom.addClass(clsArr.join(' '));
        let txt = new nodom.Element();
        txt.textContent = this.text;
        let children = [txt];
        if (this.icon !== '') {
            let img = new nodom.Element('b');
            img.addClass('nd-icon-' + this.icon);
            switch (this.iconPos) {
                case 'left':
                    children.unshift(img);
                    break;
                case 'top':
                    children.unshift(img);
                    img.addClass('nd-btn-vert');
                    break;
                case 'right':
                    children.push(img);
                    break;
                case 'bottom':
                    children.push(img);
                    img.addClass('nd-btn-vert');
                    break;
            }
        }
        rootDom.children = children;
    }
}
nodom.PluginManager.add('UI-BUTTON', UIButton);
class UIButtonGroup extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-BUTTONGROUP';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    if (o === 'children') {
                        if (Array.isArray(params[o])) {
                            for (let c of params[o]) {
                                if (typeof c !== 'object') {
                                    continue;
                                }
                                rootDom.add(new UIButton(c).element);
                            }
                        }
                    }
                    else {
                        this[o] = params[o];
                    }
                }
            }
        }
        rootDom.addClass('nd-buttongroup');
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
}
nodom.PluginManager.add('UI-BUTTONGROUP', UIButtonGroup);
class UICheckbox extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-CHECKBOX';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['yesvalue', 'novalue'], ['yesValue', 'noValue'], ['true', 'false']);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'span';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        const me = this;
        let field = rootDom.getDirective('field');
        if (field) {
            this.dataName = field.value;
            rootDom.removeDirectives(['field']);
        }
        let icon = new nodom.Element('b');
        icon.addClass('nd-checkbox-uncheck');
        icon.addDirective(new nodom.Directive('class', "{'nd-checkbox-checked':'" + this.dataName + "==\"" + this.yesValue + "\"'}", icon));
        rootDom.children.unshift(icon);
        rootDom.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            let v = model.data[me.dataName];
            if (v == me.yesValue) {
                model.set(me.dataName, me.noValue);
            }
            else {
                model.set(me.dataName, me.yesValue);
            }
        }));
    }
}
nodom.PluginManager.add('UI-CHECKBOX', UICheckbox);
class UIDatetime extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-DATETIME';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['type'], ['type'], ['date']);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let me = this;
        rootDom.addClass('nd-datetime');
        let fieldDom = new nodom.Element('div');
        fieldDom.addClass('nd-datetime-field');
        let dateIco = new nodom.Element('b');
        dateIco.addClass(this.type === 'time' ? 'nd-datetime-time' : 'nd-datetime-date');
        let directive = rootDom.getDirective('field');
        if (directive) {
            this.dataName = directive.value;
            rootDom.removeDirectives(['field']);
        }
        let input = new nodom.Element('input');
        if (this.dataName) {
            input.addDirective(new nodom.Directive('field', this.dataName, input));
            input.setProp('value', new nodom.Expression(this.dataName), true);
        }
        fieldDom.add(input);
        fieldDom.add(dateIco);
        fieldDom.addEvent(new nodom.NodomEvent('click', (dom, model, module, e, el) => {
            me.showPicker(dom, model, module, e, el);
        }));
        this.extraDataName = '$ui_datetime_' + nodom.Util.genId();
        let pickerDom = new nodom.Element('div');
        pickerDom.addClass('nd-datetime-picker');
        pickerDom.addDirective(new nodom.Directive('model', this.extraDataName, pickerDom));
        pickerDom.addDirective(new nodom.Directive('show', 'show', pickerDom));
        let tblCt = new nodom.Element('div');
        tblCt.addClass('nd-datetime-tbl');
        pickerDom.add(tblCt);
        if (this.type === 'date' || this.type === 'datetime') {
            tblCt.add(this.genDatePicker());
        }
        if (this.type === 'time' || this.type === 'datetime') {
            tblCt.add(this.genTimePicker());
        }
        let btnCt = new nodom.Element('div');
        btnCt.addClass('nd-datetime-btnct');
        if (this.type === 'date') {
            let btnToday = new nodom.Element('button');
            btnToday.assets.set('innerHTML', NUITipWords.buttons.today);
            btnToday.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
                e.preventDefault();
                let nda = new Date();
                me.setValue(module, nda.getFullYear() + '-' + (nda.getMonth() + 1) + '-' + nda.getDate());
            }));
            btnCt.add(btnToday);
        }
        else if (this.type === 'datetime' || this.type === 'time') {
            let btn = new nodom.Element('button');
            btn.assets.set('innerHTML', NUITipWords.buttons.now);
            btn.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
                e.preventDefault();
                let nda = new Date();
                me.setValue(module, nda.getFullYear() + '-' + (nda.getMonth() + 1) + '-' + nda.getDate() + ' '
                    + nda.getHours() + ':' + nda.getMinutes() + ':' + nda.getSeconds());
            }));
            btnCt.add(btn);
        }
        let btnOk = new nodom.Element('button');
        btnOk.addClass('nd-btn-active');
        btnOk.assets.set('innerHTML', NUITipWords.buttons.ok);
        btnCt.add(btnOk);
        btnOk.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
            e.preventDefault();
            model.set('show', false);
            let pmodel = module.modelFactory.get(me.modelId);
            pmodel.set(this.dataName, me.genValueStr());
        }));
        pickerDom.add(btnCt);
        rootDom.children = [fieldDom, pickerDom];
    }
    beforeRender(module, uidom) {
        let me = this;
        super.beforeRender(module, uidom);
        this.listKey = uidom.children[1].key;
        let model = module.modelFactory.get(uidom.modelId);
        if (this.needPreRender) {
            model.set(this.extraDataName, {
                show: false,
                year: 2020,
                month: 1,
                date: 1,
                hour: 0,
                minute: 0,
                second: 0,
                time: '00:00:00',
                days: []
            });
            this.pickerModelId = model.get(this.extraDataName).id;
            if (this.type === 'date') {
                this.genDates(module);
            }
            else if (this.type === 'time') {
                this.genTimes(module);
            }
            else {
                this.genDates(module);
                this.genTimes(module);
            }
            UIEventRegister.addEvent('click', module.id, uidom.children[1].key, (module, dom, inOrOut, e) => {
                if (!inOrOut) {
                    model.query(me.extraDataName).show = false;
                }
            });
        }
        else {
            this.pickerModelId = model.get(this.extraDataName).id;
        }
    }
    genDatePicker() {
        let me = this;
        let pickerDom = new nodom.Element('div');
        pickerDom.addClass('nd-datetime-datetbl');
        let ymDom = new nodom.Element('div');
        ymDom.addClass('nd-datetime-ymct');
        pickerDom.add(ymDom);
        let leftDom1 = new nodom.Element('b');
        leftDom1.addClass('nd-datetime-leftarrow1');
        let leftDom = new nodom.Element('b');
        leftDom.addClass('nd-datetime-leftarrow');
        let rightDom = new nodom.Element('b');
        rightDom.addClass('nd-datetime-rightarrow');
        let rightDom1 = new nodom.Element('b');
        rightDom1.addClass('nd-datetime-rightarrow1');
        let contentDom = new nodom.Element('span');
        contentDom.addClass('nd-datetime-ym');
        let txtDom = new nodom.Element();
        txtDom.expressions = [new nodom.Expression('year'), '/', new nodom.Expression('month')];
        contentDom.add(txtDom);
        leftDom1.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            me.changeMonth(module, -12);
        }));
        leftDom.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            me.changeMonth(module, -1);
        }));
        rightDom.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            me.changeMonth(module, 1);
        }));
        rightDom1.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            me.changeMonth(module, 12);
        }));
        ymDom.children = [leftDom1, leftDom, contentDom, rightDom, rightDom1];
        let weekDom = new nodom.Element('div');
        weekDom.addClass('nd-datetime-weekdays');
        let days = Object.getOwnPropertyNames(NUITipWords.weekday);
        for (let d of days) {
            let span = new nodom.Element('span');
            let txt = new nodom.Element();
            txt.textContent = NUITipWords.weekday[d];
            span.add(txt);
            weekDom.add(span);
        }
        pickerDom.add(weekDom);
        let dateDom = new nodom.Element('div');
        dateDom.addClass('nd-datetime-dates');
        let daySpan = new nodom.Element('span');
        daySpan.addDirective(new nodom.Directive('repeat', 'days', daySpan));
        daySpan.addDirective(new nodom.Directive('class', "{'nd-datetime-today':'today','nd-datetime-disable':'disable','nd-datetime-selected':'selected'}", daySpan));
        let txt = new nodom.Element();
        txt.expressions = [new nodom.Expression('date')];
        daySpan.add(txt);
        daySpan.addEvent(new nodom.NodomEvent('click', ':delg', (dom, model, module) => {
            let data = model.data;
            if (data.disable) {
                return;
            }
            me.selectDate(module, model);
        }));
        dateDom.add(daySpan);
        pickerDom.add(dateDom);
        return pickerDom;
    }
    genTimePicker() {
        let me = this;
        let pickerDom = new nodom.Element('div');
        pickerDom.addClass('nd-datetime-timetbl');
        let showDom = new nodom.Element('input');
        showDom.addClass('nd-datetime-timeinput');
        showDom.setProp('value', new nodom.Expression('time'), true);
        pickerDom.add(showDom);
        let itemCt = new nodom.Element('div');
        itemCt.addClass('nd-datetime-timect');
        pickerDom.add(itemCt);
        let hourDom = new nodom.Element('div');
        let item = new nodom.Element('div');
        item.addClass('nd-datetime-timeitem');
        item.addDirective(new nodom.Directive('repeat', 'hours', item));
        item.addDirective(new nodom.Directive('class', "{'nd-datetime-itemselect':'selected'}", item));
        let txt = new nodom.Element();
        txt.expressions = [new nodom.Expression('v')];
        item.setProp('role', 'hour');
        item.add(txt);
        hourDom.add(item);
        item.addEvent(new nodom.NodomEvent('click', ':delg', (dom, model, module, e, el) => {
            me.selectTime(module, dom, model);
        }));
        let minuteDom = hourDom.clone(true);
        let secondDom = hourDom.clone(true);
        minuteDom.children[0].getDirective('repeat').value = 'minutes';
        minuteDom.children[0].setProp('role', 'minute');
        secondDom.children[0].getDirective('repeat').value = 'seconds';
        secondDom.children[0].setProp('role', 'second');
        itemCt.children = [hourDom, minuteDom, secondDom];
        return pickerDom;
    }
    genDates(module, year, month) {
        let cda = new Date();
        let cy = cda.getFullYear();
        let cm = cda.getMonth() + 1;
        let cd = cda.getDate();
        if (!year || !month) {
            year = cy;
            month = cm;
        }
        let days = this.cacMonthDays(year, month);
        let dayArr = [];
        let date = new Date(year + '-' + month + '-1');
        let wd = date.getDay();
        let lastMonthDays = this.cacMonthDays(year, month, -1);
        for (let d = lastMonthDays, i = 0; i < wd; i++, d--) {
            dayArr.unshift({
                disable: true,
                selected: false,
                date: d
            });
        }
        for (let i = 1; i <= days; i++) {
            dayArr.push({
                date: i,
                selected: this.year === year && this.month === month && this.date === i,
                today: cy === year && cm === month && cd === i
            });
        }
        date = new Date(year + '-' + month + '-' + days);
        wd = date.getDay();
        for (let i = wd + 1; i <= 6; i++) {
            dayArr.push({
                disable: true,
                selected: false,
                date: i - wd
            });
        }
        let model = module.modelFactory.get(this.pickerModelId);
        model.set('year', year);
        model.set('month', month);
        model.set('days', dayArr);
    }
    genTimes(module) {
        let model = module.modelFactory.get(this.pickerModelId);
        let hours = [];
        let minutes = [];
        let seconds = [];
        for (let i = 0; i < 60; i++) {
            let selected = i === 0 ? true : false;
            if (i < 24) {
                hours.push({
                    v: i < 10 ? '0' + i : i,
                    selected: selected,
                });
            }
            minutes.push({
                v: i < 10 ? '0' + i : i,
                selected: selected
            });
            seconds.push({
                v: i < 10 ? '0' + i : i,
                selected: selected
            });
        }
        model.set('hours', hours);
        model.set('minutes', minutes);
        model.set('seconds', seconds);
    }
    cacMonthDays(year, month, disMonth) {
        if (disMonth) {
            month += disMonth;
        }
        if (month <= 0) {
            year--;
            month += 12;
        }
        else if (month > 12) {
            year++;
            month -= 12;
        }
        if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
            return 31;
        }
        else if (month !== 2) {
            return 30;
        }
        else if (year % 400 === 0 || year % 4 === 0 && year % 100 !== 0) {
            return 29;
        }
        else {
            return 28;
        }
    }
    changeMonth(module, distance) {
        let model = module.modelFactory.get(this.pickerModelId);
        let year = model.query('year');
        let month = model.query('month');
        month += distance;
        if (month <= 0) {
            year--;
            month += 12;
        }
        else if (month > 12) {
            year++;
            month -= 12;
        }
        if (month <= 0) {
            year--;
            month += 12;
        }
        else if (month > 12) {
            year++;
            month -= 12;
        }
        this.genDates(module, year, month);
    }
    setValue(module, str) {
        if (str && str !== '') {
            str = str.trim();
            if (str === '') {
                return;
            }
            let model = module.modelFactory.get(this.modelId);
            let model1 = module.modelFactory.get(this.pickerModelId);
            if (this.type === 'date' || this.type === 'datetime') {
                let date = new Date(str);
                if (date.toTimeString() !== 'Invalid Date') {
                    this.year = date.getFullYear();
                    this.month = date.getMonth() + 1;
                    this.date = date.getDate();
                    this.genDates(module, this.year, this.month);
                    if (this.type === 'datetime') {
                        this.hour = date.getHours();
                        this.minute = date.getMinutes();
                        this.second = date.getSeconds();
                        model1.set('time', this.genValueStr('time'));
                        this.setTimeSelect(module);
                    }
                }
                else {
                    model.set(this.dataName, this.genValueStr());
                }
            }
            else if (this.type === 'time') {
                if (/^\d{1,2}:\d{1,2}(:\d{1,2})?$/.test(str)) {
                    let sa = str.split(':');
                    this.hour = parseInt(sa[0]);
                    this.minute = parseInt(sa[1]);
                    this.second = sa.length > 2 ? parseInt(sa[2]) : 0;
                    model1.set('time', this.genValueStr('time'));
                    this.setTimeSelect(module);
                }
            }
        }
    }
    selectDate(module, model) {
        let pmodel = module.modelFactory.get(this.pickerModelId);
        if (pmodel) {
            let days = pmodel.query('days');
            for (let d of days) {
                if (d.selected) {
                    d.selected = false;
                    break;
                }
            }
            this.year = pmodel.query('year');
            this.month = pmodel.query('month');
        }
        if (model) {
            model.set('selected', true);
            this.date = model.query('date');
        }
    }
    selectTime(module, dom, model) {
        let pmodel = module.modelFactory.get(this.pickerModelId);
        let role = dom.getProp('role');
        if (pmodel) {
            let datas = pmodel.query(role + 's');
            for (let d of datas) {
                if (d.selected) {
                    d.selected = false;
                    break;
                }
            }
        }
        if (!model) {
            model = module.modelFactory.get(dom.modelId);
        }
        if (model) {
            model.set('selected', true);
        }
        this[role] = parseInt(model.query('v'));
        pmodel.set('time', this.genValueStr('time'));
    }
    showPicker(dom, model, module, e, el) {
        let data = model.query(this.extraDataName);
        if (data) {
            if (data.show) {
                return;
            }
            data.show = true;
        }
        let pDom = dom.tagName === 'input' ? dom.getParent(module) : dom;
        this.setValue(module, model.query(this.dataName));
        model.set('show', true);
        let height = el.offsetHeight;
        let y = e.clientY + el.offsetHeight - e.offsetY;
        UITool.adjustPosAndSize(module, this.listKey, e.clientX, y, height, null, false);
    }
    setTimeSelect(module) {
        let me = this;
        let model = module.modelFactory.get(this.pickerModelId);
        let data = [this.hour, this.minute, this.second];
        ['hours', 'minutes', 'seconds'].forEach((item, i) => {
            let datas = model.query(item);
            for (let d of datas) {
                if (d.selected) {
                    d.selected = false;
                    break;
                }
            }
            datas[data[i]].selected = true;
        });
        setTimeout(scroll, 0);
        function scroll() {
            let uidom = me.element;
            let timeCt;
            if (uidom.children.length === 1) {
                setTimeout(scroll, 0);
                return;
            }
            if (me.type === 'datetime') {
                timeCt = uidom.children[1].children[0].children[1].children[1];
            }
            else if (me.type === 'time') {
                timeCt = uidom.children[1].children[0].children[0].children[1];
            }
            data.forEach((item, i) => {
                let el = module.container.querySelector("[key='" + timeCt.children[i].key + "']");
                el.scrollTo(0, data[i] * 30);
            });
        }
    }
    genValueStr(type) {
        if (!this.year) {
            this.year = 2020;
        }
        if (!this.month) {
            this.month = 1;
        }
        if (!this.date) {
            this.date = 1;
        }
        if (!this.hour) {
            this.hour = 0;
        }
        if (!this.minute) {
            this.minute = 0;
        }
        if (!this.second) {
            this.second = 0;
        }
        switch (type || this.type) {
            case 'datetime':
                return [this.year, this.month < 10 ? '0' + this.month : this.month, this.date < 10 ? '0' + this.date : this.date].join('-') +
                    ' ' +
                    [this.hour < 10 ? '0' + this.hour : this.hour, this.minute < 10 ? '0' + this.minute : this.minute, this.second < 10 ? '0' + this.second : this.second].join(':');
            case 'time':
                return [this.hour < 10 ? '0' + this.hour : this.hour, this.minute < 10 ? '0' + this.minute : this.minute, this.second < 10 ? '0' + this.second : this.second].join(':');
            default:
                return [this.year, this.month < 10 ? '0' + this.month : this.month, this.date < 10 ? '0' + this.date : this.date].join('-');
        }
    }
}
nodom.PluginManager.add('UI-DATETIME', UIDatetime);
class UIDialog extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-DIALOG';
        let rootDom = new nodom.Element();
        if (params) {
            let panel = new UIPanel(params);
            this.generate(rootDom, panel);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom, panel) {
        const me = this;
        this.dataName = '$ui_dialog_' + nodom.Util.genId();
        rootDom.addClass('nd-dialog');
        let panelDom = panel.element;
        rootDom.setProp('name', panelDom.getProp('name'));
        this.autoOpen = panelDom.hasProp('autoopen');
        this.onClose = panelDom.getProp('onclose');
        this.onOpen = panelDom.getProp('onopen');
        panelDom.delProp(['name', 'autoopen']);
        panel.addHeadBtn('close', () => {
            me.close();
        });
        rootDom.addDirective(new nodom.Directive('show', this.dataName, rootDom));
        let dialogBody = new nodom.Element('div');
        dialogBody.addClass('nd-dialog-body');
        dialogBody.add(panelDom);
        let coverDom = new nodom.Element('div');
        coverDom.addClass('nd-dialog-cover');
        rootDom.add(coverDom);
        rootDom.add(dialogBody);
    }
    beforeRender(module, dom) {
        super.beforeRender(module, dom);
        if (this.needPreRender) {
            if (this.autoOpen) {
                this.open();
            }
        }
    }
    open() {
        let module = nodom.ModuleFactory.get(this.moduleId);
        if (module) {
            let model = module.modelFactory.get(this.modelId);
            if (model) {
                model.set(this.dataName, true);
            }
            if (this.onOpen) {
                let foo = module.methodFactory.get(this.onOpen);
                if (foo) {
                    nodom.Util.apply(foo, model, [model, module]);
                }
            }
        }
    }
    close() {
        let module = nodom.ModuleFactory.get(this.moduleId);
        if (module) {
            let model = module.modelFactory.get(this.modelId);
            if (model) {
                model.set(this.dataName, false);
            }
            if (this.onClose) {
                let foo = module.methodFactory.get(this.onClose);
                if (foo) {
                    nodom.Util.apply(foo, model, [model, module]);
                }
            }
        }
    }
}
nodom.PluginManager.add('UI-DIALOG', UIDialog);
class UIFile extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-FILE';
        this.state = 0;
        this.maxCount = 1;
        this.count = 0;
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['valuefield', 'displayfield', 'multiple|bool', 'filetype', 'maxcount|number', 'uploadurl', 'deleteurl', 'uploadname'], ['valueField', 'displayField', 'multiple', 'fileType', 'maxCount', 'uploadUrl', 'deleteUrl', 'uploadName'], [null, null, null, '', 1, null, '', 'file']);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'span';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        rootDom.addClass('nd-file');
        this.extraDataName = '$ui_file_' + nodom.Util.genId();
        let field = rootDom.getDirective('field');
        if (field) {
            this.dataName = field.value;
            rootDom.removeDirectives(['field']);
            rootDom.events.delete('change');
        }
        if (!this.multiple) {
            this.maxCount = 1;
        }
        rootDom.children = [this.genShowDom(), this.genUploadDom()];
        rootDom.plugin = this;
        return rootDom;
    }
    genUploadDom() {
        const me = this;
        let uploadDom = new nodom.Element('div');
        uploadDom.addClass('nd-file-uploadct');
        uploadDom.addDirective(new nodom.Directive('show', this.dataName + '.length<' + this.maxCount, uploadDom));
        let fDom = new nodom.Element('input');
        fDom.setProp('type', 'file');
        fDom.addClass('nd-file-input');
        fDom.addEvent(new nodom.NodomEvent('change', (dom, model, module, e, el) => {
            if (!el.files) {
                return;
            }
            model.set(me.extraDataName + '.state', 1);
            model.set(me.extraDataName + '.uploading', NUITipWords.uploading);
            let form = new FormData();
            for (let f of el.files) {
                form.append(me.uploadName, f);
            }
            nodom.request({
                url: me.uploadUrl,
                method: 'POST',
                params: form,
                header: {
                    'Content-Type': 'multipart/form-data'
                },
                type: 'json'
            }).then((r) => {
                model.set(me.extraDataName + '.state', 0);
                model.query(me.dataName).push(r);
            });
        }));
        let uploadingDom = new nodom.Element('div');
        uploadingDom.addClass('nd-file-uploading');
        let span1 = new nodom.Element('span');
        span1.addClass('nd-file-add');
        span1.addDirective(new nodom.Directive('show', this.extraDataName + '.state==0', span1));
        uploadingDom.add(span1);
        let span2 = new nodom.Element('span');
        span2.addClass('nd-file-progress');
        span2.addDirective(new nodom.Directive('show', this.extraDataName + '.state==1', span2));
        let txt = new nodom.Element();
        txt.expressions = [new nodom.Expression((this.extraDataName + '.uploading') || NUITipWords.uploading)];
        span2.add(txt);
        uploadingDom.add(span2);
        uploadDom.add(uploadingDom);
        uploadDom.add(fDom);
        return uploadDom;
    }
    genShowDom() {
        const me = this;
        let ctDom = new nodom.Element('div');
        ctDom.addClass('nd-file-showct');
        ctDom.addDirective(new nodom.Directive('repeat', this.dataName, ctDom));
        let showDom = new nodom.Element('a');
        showDom.addClass('nd-file-content');
        showDom.setProp('target', 'blank');
        let expr = new nodom.Expression(this.displayField);
        showDom.setProp('href', expr, true);
        if (this.fileType === 'image') {
            let img = new nodom.Element('img');
            img.setProp('src', expr, true);
            showDom.add(img);
        }
        else {
            let txt = new nodom.Element();
            txt.expressions = [expr];
            showDom.add(txt);
        }
        ctDom.add(showDom);
        let delDom = new nodom.Element('b');
        delDom.addClass('nd-file-del');
        ctDom.add(delDom);
        delDom.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
            let params = {};
            let id = model.query(me.valueField);
            params[me.valueField] = id;
            if (this.deleteUrl !== '') {
                nodom.request({
                    url: me.deleteUrl,
                    params: params
                }).then((r) => {
                    me.removeFile(module, id);
                });
            }
            else {
                me.removeFile(module, id);
            }
        }));
        return ctDom;
    }
    removeFile(module, id) {
        let pm = module.modelFactory.get(this.modelId);
        let rows = pm.query(this.dataName);
        if (Array.isArray(rows)) {
            for (let i = 0; i < rows.length; i++) {
                if (rows[i][this.valueField] === id) {
                    rows.splice(i, 1);
                    break;
                }
            }
        }
    }
    beforeRender(module, dom) {
        super.beforeRender(module, dom);
        if (this.needPreRender) {
            let model = module.modelFactory.get(dom.modelId);
            if (model) {
                model.set(this.extraDataName, {
                    state: 0,
                    uploading: false
                });
            }
        }
    }
}
nodom.PluginManager.add('UI-FILE', UIFile);
class UIForm extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-FORM';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['labelwidth|number'], ['labelWidth'], [100]);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'form';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        rootDom.addClass('nd-form');
        for (let c of rootDom.children) {
            if (!c.tagName) {
                continue;
            }
            c.addClass('nd-form-item');
            if (c.children) {
                for (let c1 of c.children) {
                    if (c1.tagName === 'LABEL') {
                        c1.assets.set('style', 'width:' + this.labelWidth + 'px');
                        break;
                    }
                }
            }
        }
    }
}
nodom.PluginManager.add('UI-FORM', UIForm);
class UIGrid extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-GRID';
        this.fields = [];
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['dataname', 'rowalt|bool', 'sortable|bool', 'gridline', 'fixhead|bool', 'hidehead|bool', 'dataurl'], ['dataName', 'rowAlt', 'sortable', 'gridLine', 'fixHead', 'hideHead', 'dataUrl'], ['rows', null, null, '', null, null, null, null]);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            rootDom.tagName = 'div';
            rootDom = this.generate(rootDom);
        }
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        rootDom.addClass('nd-grid');
        this.extraDataName = '$ui_grid_' + nodom.Util.genId();
        if (this.fixHead) {
            rootDom.addClass('nd-grid-fixed');
        }
        let thead;
        if (!this.hideHead) {
            thead = new nodom.Element('div');
            thead.addClass('nd-grid-head');
        }
        let tbody = new nodom.Element('div');
        tbody.addClass('nd-grid-body');
        if (this.rowAlt) {
            tbody.addClass('nd-grid-body-rowalt');
        }
        let rowDom;
        let subDom;
        let pagination;
        for (let c of rootDom.children) {
            if (c.tagName === 'COLS') {
                rowDom = c;
            }
            else if (c.tagName === 'SUB') {
                subDom = c;
            }
            else if (c.plugin && c.plugin.tagName === 'UI-PAGINATION') {
                pagination = c;
            }
        }
        if (rowDom) {
            this.rowDomKey = rowDom.key;
            let filter;
            if (pagination) {
                this.selectPageMethodId = '$$nodom_method_gen_' + nodom.Util.genId();
                filter = new nodom.Filter('select:func:' + this.selectPageMethodId);
            }
            let directive = new nodom.Directive('repeat', this.extraDataName + '.' + this.dataName, rowDom);
            if (filter) {
                directive.filters = [filter];
            }
            rowDom.addDirective(directive);
            rowDom.tagName = 'div';
            let dataDom = new nodom.Element('div');
            dataDom.addClass('nd-grid-row');
            if (this.gridLine === 'col' || this.gridLine === 'both') {
                dataDom.addClass('nd-grid-col-line');
            }
            if (this.gridLine === 'row' || this.gridLine === 'both') {
                dataDom.addClass('nd-grid-row-line');
            }
            for (let i = 0; i < rowDom.children.length; i++) {
                let c = rowDom.children[i];
                if (!c.tagName) {
                    rowDom.children.splice(i--, 1);
                    continue;
                }
                if (c.hasProp('hide')) {
                    c.delProp('hide');
                    continue;
                }
                let field = c.getProp('field');
                if (field) {
                    field = field.trim();
                }
                this.fields.push({
                    title: c.getProp('title'),
                    field: field,
                    expressions: c.children[0].expressions
                });
                this.addToHead(c, i, thead, field);
                let tdIn = c.children[0];
                switch (c.getProp('type')) {
                    case 'img':
                        tdIn.tagName = 'img';
                        tdIn.setProp('src', tdIn.expressions, true);
                        c.children = [tdIn];
                        delete tdIn.expressions;
                        break;
                }
                c.tagName = 'div';
                c.addClass('nd-grid-row-item');
                if (c.hasProp('left')) {
                    c.addClass('nd-grid-row-item-left');
                }
                if (c.hasProp('width') && nodom.Util.isNumberString(c.getProp('width'))) {
                    c.setProp('style', 'flex:' + c.getProp('width'));
                }
                dataDom.add(c);
                c.delProp(['title', 'type', 'width', 'field', 'notsort', 'left']);
            }
            rowDom.children = [dataDom];
            rowDom.delProp('data');
            if (subDom) {
                this.handleSub(subDom, thead, dataDom, rowDom);
            }
            tbody.add(rowDom);
        }
        if (thead) {
            rootDom.children = [thead, tbody];
            if (this.gridLine === 'row' || this.gridLine === 'both') {
                rootDom.addClass('nd-grid-ct-row-line');
            }
        }
        else {
            rootDom.children = [tbody];
        }
        if (this.gridLine === 'row' || this.gridLine === 'both') {
            rootDom.addClass('nd-grid-ct-row-line');
        }
        if (this.gridLine === 'col' || this.gridLine === 'both') {
            rootDom.addClass('nd-grid-ct-col-line');
        }
        if (pagination) {
            let parentDom = new nodom.Element('div');
            parentDom.children = [rootDom, pagination];
            pagination.addClass('nd-grid-pager');
            this.handlePagination(pagination);
            return parentDom;
        }
        return rootDom;
    }
    addToHead(col, index, thead, field) {
        if (!thead) {
            return;
        }
        if (thead.children.length === 0) {
            let thCt = new nodom.Element('div');
            thCt.addClass('nd-grid-row');
            if (this.gridLine === 'col' || this.gridLine === 'both') {
                thCt.addClass('nd-grid-col-line');
            }
            if (this.gridLine === 'row' || this.gridLine === 'both') {
                thCt.addClass('nd-grid-row-line');
            }
            thead.add(thCt);
        }
        if (thead) {
            let th = new nodom.Element('div');
            th.addClass('nd-grid-row-item');
            th.setProp('style', 'flex:' + col.getProp('width') || 0);
            let span = new nodom.Element('span');
            span.assets.set('innerHTML', col.getProp('title'));
            th.add(span);
            if (this.sortable) {
                if (col.getProp('type') !== 'img' && !col.hasProp('notsort') && field) {
                    th.add(this.addSortBtn(index));
                }
            }
            thead.children[0].add(th);
        }
    }
    addSortBtn(index) {
        let updown = new nodom.Element('span');
        updown.addClass('nd-grid-sort');
        let up = new nodom.Element('B');
        up.addClass('nd-grid-sort-raise');
        up.tmpData = { index: index };
        let down = new nodom.Element('B');
        down.addClass('nd-grid-sort-down');
        down.tmpData = { index: index };
        const plugin = this;
        up.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
            plugin.sort(parseInt(dom.tmpData['index']), 'asc', module);
        }));
        down.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
            plugin.sort(parseInt(dom.tmpData['index']), 'desc', module);
        }));
        updown.add(up);
        updown.add(down);
        return updown;
    }
    handleSub(subDom, thead, dataDom, rowDom) {
        let th = new nodom.Element('div');
        th.addClass('nd-grid-iconcol');
        let b = new nodom.Element('b');
        b.addClass('nd-grid-sub-btn');
        th.add(b);
        if (thead) {
            thead.children[0].children.unshift(th);
        }
        let td = new nodom.Element('div');
        td.addClass('nd-grid-iconcol');
        b = new nodom.Element('b');
        b.addClass('nd-grid-sub-btn');
        b.addDirective(new nodom.Directive('class', "{'nd-grid-showsub':'$showSub'}", b));
        b.addEvent(new nodom.NodomEvent('click', ':delg', (dom, model, module, e) => {
            model.set('$showSub', !model.data['$showSub']);
        }));
        td.add(b);
        dataDom.children.unshift(td);
        subDom.tagName = 'div';
        rowDom.add(subDom);
        subDom.addDirective(new nodom.Directive('show', '$showSub', subDom));
        subDom.addClass('nd-grid-sub');
        if (subDom.hasProp('auto')) {
            subDom.children = [];
            let lw = subDom.getProp('labelwidth') || 100;
            let cols = subDom.hasProp('cols') ? parseInt(subDom.getProp('cols')) : 1;
            if (cols > 4) {
                cols = 4;
            }
            let cnt = 0;
            let rowCt;
            this.fields.forEach((item) => {
                if (cnt++ % cols === 0) {
                    rowCt = new nodom.Element('div');
                    rowCt.addClass('nd-grid-sub-row');
                    subDom.add(rowCt);
                }
                let itemCt = new nodom.Element('div');
                itemCt.addClass('nd-grid-sub-item');
                let label = new nodom.Element('label');
                label.assets.set('innerHTML', item['title'] + ':');
                label.assets.set('style', 'width:' + lw + 'px');
                itemCt.add(label);
                let span = new nodom.Element('span');
                span.addClass('nd-grid-sub-content');
                let txt = new nodom.Element();
                txt.expressions = item['expressions'];
                span.add(txt);
                itemCt.add(span);
                rowCt.add(itemCt);
                subDom.delProp(['auto', 'labelwidth']);
            });
        }
    }
    sort(index, asc, module) {
        let dom = module.virtualDom.query(this.rowDomKey);
        let directive = dom.getDirective('repeat');
        if (!directive) {
            return;
        }
        let f = this.fields[index];
        if (!f || !f['field']) {
            return;
        }
        let arr = ['orderby', f['field'], asc];
        if (!directive.filters) {
            directive.filters = [];
        }
        if (directive.filters.length <= 1) {
            directive.filters.push(new nodom.Filter(arr));
        }
        else {
            directive.filters[1] = new nodom.Filter(arr);
        }
        nodom.Renderer.add(module);
    }
    beforeRender(module, uidom) {
        let me = this;
        super.beforeRender(module, uidom);
        if (this.needPreRender) {
            let model = module.modelFactory.get(uidom.modelId);
            model.set(this.extraDataName, {});
            if (!this.pagination) {
                this.doReq(module, this.pagination);
            }
            if (this.selectPageMethodId) {
                module.methodFactory.add(this.selectPageMethodId, (arr) => {
                    let start = (me.currentPage - 1) * me.pageSize;
                    let end = start + me.pageSize;
                    return arr.slice(start, end);
                });
            }
        }
    }
    handlePagination(pagination) {
        let me = this;
        let df = pagination.plugin;
        this.pagination = df;
        df.dataUrl = this.dataUrl;
        if (df.currentPage) {
            this.currentPage = df.currentPage;
        }
        if (df.pageSize) {
            this.pageSize = df.pageSize;
        }
        if (!df.onChange) {
            df.onChange = (module) => {
                me.doReq(module, df);
            };
        }
    }
    doReq(module, pagination) {
        const me = this;
        let params = {};
        if (pagination) {
            let reqName = pagination.requestName;
            if (reqName.length === 2) {
                params[reqName[0]] = pagination.currentPage;
                params[reqName[1]] = pagination.pageSize;
            }
        }
        nodom.request({
            url: me.dataUrl,
            params: params,
            type: 'json'
        }).then(r => {
            if (!r) {
                return;
            }
            let model = module.modelFactory.get(me.modelId);
            model.set(this.extraDataName, r);
            if (pagination) {
                if (pagination.pageSize) {
                    this.pageSize = pagination.pageSize;
                }
                model.set(pagination.extraDataName + '.total', r[pagination.totalName]);
                pagination.changeParams(module);
            }
        });
    }
    getData() {
        let module = nodom.ModuleFactory.get(this.moduleId);
        let model = module.modelFactory.get(this.modelId);
        model = model.get(this.extraDataName);
        let data = model.getData();
        if (data) {
            return data[this.dataName];
        }
    }
}
nodom.PluginManager.add('UI-GRID', UIGrid);
class UILayout extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-LAYOUT';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        rootDom.addClass('nd-layout');
        this.extraDataName = '$ui_layout_' + nodom.Util.genId();
        let middleCt = new nodom.Element();
        middleCt.addClass('nd-layout-middle');
        middleCt.tagName = 'DIV';
        let items = {};
        let locs = ['north', 'west', 'center', 'east', 'south'];
        for (let i = 0; i < rootDom.children.length; i++) {
            let item = rootDom.children[i];
            if (!item.tagName) {
                continue;
            }
            for (let l of locs) {
                if (item.hasProp(l)) {
                    item.addClass('nd-layout-' + l);
                    items[l] = item;
                    if (l === 'west') {
                        this.handleEastAndWest(item, 0);
                    }
                    else if (l === 'east') {
                        this.handleEastAndWest(item, 1);
                    }
                    break;
                }
            }
        }
        rootDom.children = [];
        if (items['north']) {
            rootDom.children.push(items['north']);
        }
        if (items['west']) {
            middleCt.children.push(items['west']);
        }
        if (items['center']) {
            middleCt.children.push(items['center']);
        }
        if (items['east']) {
            middleCt.children.push(items['east']);
        }
        rootDom.children.push(middleCt);
        if (items['south']) {
            rootDom.children.push(items['south']);
        }
    }
    beforeRender(module, dom) {
        super.beforeRender(module, dom);
        if (this.needPreRender) {
            let model = module.modelFactory.get(dom.modelId);
            model.set(this.extraDataName, {
                openWest: true,
                openEast: true,
                westWidth: 0,
                eastWidth: 0
            });
        }
    }
    handleEastAndWest(dom, loc) {
        const me = this;
        if (dom.hasProp('title') || dom.hasProp('allowmin')) {
            let header = new nodom.Element('div');
            header.addClass('nd-layout-header');
            dom.children.unshift(header);
            let title;
            if (dom.hasProp('title')) {
                title = new nodom.Element('div');
                title.addClass('nd-layout-title');
                let txt = new nodom.Element();
                txt.textContent = dom.getProp('title');
                title.add(txt);
                header.add(title);
            }
            let icon;
            if (dom.hasProp('allowmin')) {
                icon = new nodom.Element('b');
                if (loc === 1) {
                    if (title) {
                        title.addDirective(new nodom.Directive('show', this.extraDataName + '.openEast', title));
                    }
                    icon.addDirective(new nodom.Directive('class', "{'nd-icon-arrow-right':'" + this.extraDataName + ".openEast','nd-icon-arrow-left':'!" + this.extraDataName + ".openEast'}", icon));
                    icon.addEvent(new nodom.NodomEvent('click', (dom, model, module, e, el) => {
                        let data = model.query(me.extraDataName);
                        let eastEl = el.parentNode.parentNode;
                        let compStyle = window.getComputedStyle(eastEl);
                        let width;
                        if (data.openEast) {
                            if (data.eastWidth === 0) {
                                data.eastWidth = compStyle.width;
                            }
                            width = '40px';
                        }
                        else {
                            width = data.eastWidth;
                        }
                        eastEl.style.width = width;
                        data.openEast = !data.openEast;
                    }));
                    header.children.unshift(icon);
                }
                else {
                    if (title) {
                        title.addDirective(new nodom.Directive('show', this.extraDataName + '.openWest', title));
                    }
                    icon.addDirective(new nodom.Directive('class', "{'nd-icon-arrow-left':'" + this.extraDataName + ".openWest','nd-icon-arrow-right':'!" + this.extraDataName + ".openWest'}", icon));
                    icon.addEvent(new nodom.NodomEvent('click', (dom, model, module, e, el) => {
                        let data = model.query(me.extraDataName);
                        let westEl = el.parentNode.parentNode;
                        let compStyle = window.getComputedStyle(westEl);
                        let width;
                        if (data.openWest) {
                            if (data.westWidth === 0) {
                                data.westWidth = compStyle.width;
                            }
                            width = '40px';
                        }
                        else {
                            width = data.westWidth;
                        }
                        westEl.style.width = width;
                        data.openWest = !data.openWest;
                    }));
                    header.add(icon);
                }
            }
        }
    }
}
nodom.PluginManager.add('UI-LAYOUT', UILayout);
class UIList extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-LIST';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['valuefield', 'displayfield', 'disablefield', 'listfield', 'type', 'itemclick', 'itemwidth|number', 'multiselect|bool'], ['valueField', 'displayField', 'disableName', 'listField', 'type', 'clickEvent', 'itemWidth', 'multiSelect'], ['', '', '', null, 'row', '', 0, null]);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let me = this;
        this.extraDataName = '$ui_list_' + nodom.Util.genId();
        rootDom.addDirective(new nodom.Directive('model', this.extraDataName, rootDom));
        if (this.type === 'row') {
            rootDom.addClass('nd-list');
        }
        else {
            rootDom.addClass('nd-list-horizontal');
        }
        let field = rootDom.getDirective('field');
        if (field) {
            this.dataName = field.value;
        }
        let itemDom;
        for (let c of rootDom.children) {
            if (!c.tagName) {
                continue;
            }
            itemDom = c;
            break;
        }
        if (!itemDom) {
            itemDom = new nodom.Element('div');
            if (this.displayField !== '') {
                let txt = new nodom.Element();
                txt.expressions = [new nodom.Expression(this.displayField)];
                itemDom.add(txt);
            }
        }
        itemDom.addClass('nd-list-item');
        itemDom.addDirective(new nodom.Directive('repeat', 'datas', itemDom));
        itemDom.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            if (me.disableName !== '' && model.query(me.disableName)) {
                return;
            }
            me.setValue(module, model);
        }));
        if (this.type === 'row') {
            let item = new nodom.Element('div');
            item.children = itemDom.children;
            item.addClass('nd-list-itemcontent');
            let icon = new nodom.Element('b');
            icon.addClass('nd-list-icon');
            itemDom.children = [item, icon];
        }
        if (this.disableName !== '') {
            itemDom.addDirective(new nodom.Directive('class', "{'nd-list-item-active':'selected','nd-list-item-disable':'" + this.disableName + "'}", itemDom));
        }
        else {
            itemDom.addDirective(new nodom.Directive('class', "{'nd-list-item-active':'selected'}", itemDom));
        }
        if (this.clickEvent) {
            itemDom.addEvent(new nodom.NodomEvent('click', this.clickEvent));
        }
        rootDom.children = [itemDom];
    }
    beforeRender(module, dom) {
        super.beforeRender(module, dom);
        let pmodel;
        let model;
        if (this.needPreRender) {
            pmodel = module.modelFactory.get(this.modelId);
            pmodel.set(this.extraDataName, {
                datas: []
            }).id;
        }
        if (!pmodel) {
            pmodel = module.modelFactory.get(this.modelId);
        }
        if (!model) {
            model = pmodel.get(this.extraDataName);
        }
        let data = model.data;
        if (this.listField && data.datas.length === 0 && pmodel.data[this.listField]) {
            let valueArr;
            if (this.dataName) {
                let value = pmodel.query(this.dataName);
                if (value && value !== '') {
                    valueArr = value.toString().split(',');
                }
            }
            let rows = pmodel.query(this.listField);
            if (rows && Array.isArray(rows)) {
                rows = nodom.Util.clone(rows);
                if (this.valueField !== '') {
                    for (let d of rows) {
                        if (valueArr && valueArr.includes(d[this.valueField] + '')) {
                            d.selected = true;
                        }
                        else {
                            d.selected = false;
                        }
                    }
                }
                model.set('datas', rows);
                this.setValue(module);
            }
        }
    }
    setValue(module, model) {
        let pmodel = module.modelFactory.get(this.modelId);
        let model1 = pmodel.get(this.extraDataName);
        let rows = model1.data['datas'];
        let valArr = [];
        if (this.multiSelect) {
            if (model) {
                model.set('selected', !model.data.selected);
            }
            if (this.valueField !== '' && this.dataName) {
                for (let d of rows) {
                    if (d.selected) {
                        valArr.push(d[this.valueField]);
                    }
                }
                pmodel.set(this.dataName, valArr.join(','));
            }
        }
        else {
            if (model) {
                for (let d of rows) {
                    if (d.selected) {
                        d.selected = false;
                        break;
                    }
                }
                model.set('selected', !model.data.selected);
            }
            for (let d of rows) {
                if (d.selected) {
                    if (this.valueField !== '' && this.dataName) {
                        pmodel.set(this.dataName, d[this.valueField]);
                    }
                    break;
                }
            }
        }
    }
}
nodom.PluginManager.add('UI-LIST', UIList);
class UIListTransfer extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-LISTTRANSFER';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['valuefield', 'displayfield', 'listfield'], ['valueField', 'displayField', 'listField']);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let me = this;
        this.extraDataName = '$ui_listtransfer_' + nodom.Util.genId();
        rootDom.addDirective(new nodom.Directive('model', this.extraDataName, rootDom));
        rootDom.addClass('nd-listtransfer');
        let field = rootDom.getDirective('field');
        if (field) {
            this.dataName = field.value;
        }
        let listDom = new nodom.Element('div');
        listDom.addClass('nd-list');
        let itemDom;
        for (let c of rootDom.children) {
            if (!c.tagName) {
                continue;
            }
            itemDom = c;
            break;
        }
        if (!itemDom) {
            itemDom = new nodom.Element('div');
            let txt = new nodom.Element();
            txt.expressions = [new nodom.Expression(this.displayField)];
            itemDom.add(txt);
        }
        itemDom.addClass('nd-list-item');
        itemDom.addDirective(new nodom.Directive('repeat', 'datas', itemDom, "select:value:{isValue:false}"));
        itemDom.addDirective(new nodom.Directive('class', "{'nd-list-item-active':'selected'}", itemDom));
        itemDom.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            model.set('selected', !model.data.selected);
        }));
        let item = new nodom.Element('div');
        item.children = itemDom.children;
        item.addClass('nd-list-itemcontent');
        let icon = new nodom.Element('b');
        icon.addClass('nd-list-icon');
        itemDom.children = [item, icon];
        listDom.children = [itemDom];
        let listDom1 = listDom.clone(true);
        listDom1.children[0].getDirective('repeat').filters = [new nodom.Filter("select:value:{isValue:true}")];
        let btnGrp = new nodom.Element('div');
        btnGrp.addClass('nd-listtransfer-btngrp');
        let btn1 = new nodom.Element('b');
        btn1.addClass('nd-listtransfer-right2');
        let btn2 = new nodom.Element('b');
        btn2.addClass('nd-listtransfer-right1');
        let btn3 = new nodom.Element('b');
        btn3.addClass('nd-listtransfer-left1');
        let btn4 = new nodom.Element('b');
        btn4.addClass('nd-listtransfer-left2');
        btnGrp.children = [btn1, btn2, btn3, btn4];
        btn1.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
            me.transfer(module, 1, true);
        }));
        btn2.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
            me.transfer(module, 1, false);
        }));
        btn3.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
            me.transfer(module, 2, false);
        }));
        btn4.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
            me.transfer(module, 2, true);
        }));
        rootDom.children = [listDom, btnGrp, listDom1];
        rootDom.plugin = this;
        return rootDom;
    }
    beforeRender(module, dom) {
        super.beforeRender(module, dom);
        let pmodel;
        if (this.needPreRender) {
            pmodel = module.modelFactory.get(this.modelId);
            let model = pmodel.set(this.extraDataName, {
                datas: []
            });
            this.extraModelId = model.id;
            let value = pmodel.query(this.dataName);
            let datas = pmodel.query(this.listField);
            let rows = [];
            if (Array.isArray(datas)) {
                let va = [];
                if (value) {
                    va = value.split(',');
                }
                rows = nodom.Util.clone(datas);
                for (let d of rows) {
                    d.selected = false;
                    d.isValue = false;
                    if (va && va.includes(d[this.valueField] + '')) {
                        d.isValue = true;
                    }
                }
            }
            model.set('datas', rows);
        }
    }
    transfer(module, direction, all) {
        let model = module.modelFactory.get(this.extraModelId);
        let datas = model.data.datas;
        let isValue = direction === 1 ? true : false;
        for (let d of datas) {
            if (all) {
                d.isValue = isValue;
            }
            else if (d.selected) {
                d.isValue = isValue;
            }
            d.selected = false;
        }
        this.updateValue(module);
    }
    updateValue(module) {
        let pmodel = module.modelFactory.get(this.modelId);
        let model = module.modelFactory.get(this.extraModelId);
        let a = [];
        for (let d of model.data.datas) {
            if (d.isValue) {
                a.push(d[this.valueField]);
            }
        }
        pmodel.set(this.dataName, a.join(','));
    }
}
nodom.PluginManager.add('UI-LISTTRANSFER', UIListTransfer);
class UIMenu extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-MENU';
        this.menuHeight = 30;
        this.direction = 0;
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['popup|bool', 'position', 'listfield', 'maxlevel|number', 'menuwidth|number'], ['popupMenu', 'position', 'listField', 'maxLevel', 'menuWidth'], [null, 'top', null, 3, 150]);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let me = this;
        this.activeName = '$nui_menu_' + nodom.Util.genId();
        this.menuStyleName = '$nui_menu_' + nodom.Util.genId();
        rootDom.addClass('nd-menu');
        if (this.position === 'left' || this.position === 'right') {
            this.popupMenu = true;
        }
        let menuNode;
        for (let i = 0; i < rootDom.children.length; i++) {
            if (rootDom.children[i].tagName) {
                menuNode = rootDom.children[i];
                menuNode.addClass('nd-menu-node');
                let b = new nodom.Element('b');
                menuNode.children.unshift(b);
                if (menuNode.hasProp('icon')) {
                    b.setProp('class', ['nd-icon-', new nodom.Expression(menuNode.getProp('icon'))], true);
                    menuNode.delProp('icon');
                }
                break;
            }
        }
        rootDom.children = [];
        let parentCt = new nodom.Element('div');
        parentCt.addClass('nd-menu-subct');
        if (this.popupMenu) {
            if (this.position === 'left' || this.position === 'right') {
                rootDom.addClass('nd-menu-left');
                rootDom.addEvent(new nodom.NodomEvent('mouseleave', (dom, model, module, e) => {
                    dom.assets.set('style', 'width:30px');
                }));
                parentCt.addEvent(new nodom.NodomEvent('mouseenter', (dom, model, module, e) => {
                    dom.assets.set('style', 'width:' + me.menuWidth + 'px');
                }));
            }
            else {
                rootDom.addClass('nd-menu-popup');
                parentCt.addClass('nd-menu-first');
                parentCt.setProp('style', new nodom.Expression(this.menuStyleName), true);
                parentCt.addEvent(new nodom.NodomEvent('mouseleave', (dom, model, module, e) => {
                    let parent = dom.getParent(module);
                    let pmodel = module.modelFactory.get(parent.modelId);
                    pmodel.set(me.activeName, false);
                    if (dom.hasClass('nd-menu-first')) {
                        this.direction = 0;
                    }
                }));
                parentCt.addDirective(new nodom.Directive('show', this.activeName, parentCt));
            }
        }
        else {
            parentCt.addClass('nd-menu-first-nopop');
        }
        rootDom.add(parentCt);
        for (let i = 0; i < this.maxLevel; i++) {
            parentCt.tmpData = { level: i + 1 };
            let itemCt = new nodom.Element('div');
            itemCt.directives.push(new nodom.Directive('repeat', this.listField, itemCt));
            itemCt.addClass('nd-menu-nodect');
            let item = menuNode.clone(true);
            itemCt.add(item);
            itemCt.tmpData = { level: (i + 1) };
            if (this.popupMenu || i > 0) {
                let icon1 = new nodom.Element('b');
                icon1.addDirective(new nodom.Directive('class', "{'nd-menu-subicon':'" + this.listField + "&&" + this.listField + ".length>0'}", icon1));
                item.add(icon1);
            }
            let openClose = this.initOpenAndClose();
            itemCt.addEvent(openClose[0]);
            itemCt.addEvent(openClose[1]);
            parentCt.add(itemCt);
            let subCt = new nodom.Element('div');
            subCt.addClass('nd-menu-subct');
            subCt.addEvent(new nodom.NodomEvent('mouseleave', (dom, model, module, e) => {
                let parent = dom.getParent(module);
                let pmodel = module.modelFactory.get(parent.modelId);
                pmodel.set(me.activeName, false);
            }));
            subCt.setProp('style', new nodom.Expression(this.menuStyleName), true);
            subCt.addDirective(new nodom.Directive('show', this.activeName, subCt));
            itemCt.add(subCt);
            parentCt = subCt;
        }
        rootDom.delProp(['listField', 'width', , 'maxlevels']);
    }
    beforeRender(module, uidom) {
        let me = this;
        super.beforeRender(module, uidom);
        if (this.needPreRender && this.popupMenu && this.position !== 'left' && this.position !== 'right') {
            UIEventRegister.addEvent('mousedown', module.id, uidom.key, (module, dom, inOrOut, e) => {
                if (e.button !== 2) {
                    return;
                }
                let x = e.clientX;
                let w = me.menuWidth;
                let model = module.modelFactory.get(uidom.modelId);
                let rows = model.query(me.listField);
                if (rows && rows.length > 0) {
                    let h = rows.length * me.menuHeight;
                    let loc = this.cacPos(null, e.clientX, e.clientY, this.menuWidth, h);
                    model.set(me.menuStyleName, 'width:' + me.menuWidth + 'px;left:' + loc[0] + 'px;top:' + loc[1] + 'px');
                    model.set(me.activeName, true);
                }
            });
        }
    }
    initOpenAndClose() {
        let me = this;
        let openEvent = new nodom.NodomEvent('mouseenter', (dom, model, module, e, el) => {
            if (model) {
                let rows = model.query(this.listField);
                if (!rows || rows.length === 0) {
                    return;
                }
                let firstNopop = dom.tmpData.level === 1 && !me.popupMenu;
                let h = rows.length * this.menuHeight;
                let w = this.menuWidth;
                let x, y;
                if (firstNopop) {
                    x = e.clientX - e.offsetX;
                    y = e.clientY - e.offsetY + h;
                }
                else {
                    x = e.clientX - e.offsetX + w;
                    y = e.clientY - e.offsetY;
                }
                let loc = this.cacPos(dom, x, y, w, h, el);
                model.set(this.menuStyleName, 'width:' + me.menuWidth + 'px;left:' + loc[0] + 'px;top:' + loc[1] + 'px');
                model.set(this.activeName, true);
            }
        });
        let closeEvent = new nodom.NodomEvent('mouseleave', (dom, model, module, e, el) => {
            if (model) {
                let rows = model.query(this.listField);
                if (rows && rows.length > 0) {
                    model.set(me.activeName, false);
                    if (this.direction === 1) {
                        if (me.popupMenu) {
                            if (dom.tmpData['level'] === 2) {
                                this.direction = 0;
                            }
                        }
                        else if (dom.tmpData['level'] === 1) {
                            this.direction = 0;
                        }
                    }
                }
            }
        });
        return [openEvent, closeEvent];
    }
    cacPos(dom, x, y, w, h, el) {
        let firstNopop = dom && !this.popupMenu && dom.tmpData['level'] === 1;
        let widthOut = x + w > window.innerWidth;
        let heightOut = y + h > window.innerHeight;
        let top = dom ? 0 : y;
        let left = dom ? 0 : x;
        if (firstNopop) {
            top = this.menuHeight;
        }
        else if (heightOut) {
            if (dom) {
                top = -h + this.menuHeight;
            }
            else {
                top = window.innerHeight - h;
            }
        }
        if (widthOut) {
            this.direction = 1;
        }
        if (this.direction === 1) {
            if (firstNopop) {
                if (widthOut) {
                    left = el.offsetWidth - w;
                }
            }
            else if (dom) {
                left -= w + 1;
            }
            else if (widthOut) {
                left -= w + 3;
            }
        }
        else {
            if (dom && !firstNopop) {
                left = w;
            }
        }
        return [left, top + 1];
    }
}
nodom.PluginManager.add('UI-MENU', UIMenu);
class UIPagination extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-PAGINATION';
        this.minPage = 1;
        this.maxPage = 1;
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['totalname', 'pagesize|number', 'currentpage|number', 'showtotal|bool', 'showgo|bool', 'shownum|number', 'sizechange|array|number', 'steps|number', 'onchange', 'requestname|array|2', 'dataurl'], ['totalName', 'pageSize', 'currentPage', 'showTotal', 'showGo', 'showNum', 'pageSizeData', 'steps', 'onChange', 'requestName', 'dataUrl'], ['total', 10, 1, null, null, 10, [], 5, '', [], '']);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let me = this;
        rootDom.addClass('nd-pagination');
        rootDom.children = [];
        this.extraDataName = '$ui_pagination_' + nodom.Util.genId();
        rootDom.addDirective(new nodom.Directive('model', this.extraDataName, rootDom));
        if (this.showTotal) {
            let totalDom = new nodom.Element('div');
            let txt = new nodom.Element();
            txt.textContent = NUITipWords.total;
            totalDom.add(txt);
            let span = new nodom.Element('span');
            span.addClass('nd-pagination-total');
            txt = new nodom.Element();
            txt.expressions = [new nodom.Expression('total')];
            span.add(txt);
            totalDom.add(span);
            txt = new nodom.Element();
            txt.textContent = NUITipWords.record;
            totalDom.add(txt);
            rootDom.add(totalDom);
        }
        if (this.pageSizeData && this.pageSizeData.length > 0) {
            let datas = [];
            for (let d of this.pageSizeData) {
                datas.push({
                    value: d,
                    text: d + NUITipWords.record + '/' + NUITipWords.page
                });
            }
            this.pageSizeDatas = datas;
            rootDom.add(new UISelect({
                dataName: 'pageSize',
                listField: 'sizeData',
                displayField: 'text',
                valueField: 'value',
                onChange: (model, module, newValue, oldValue) => {
                    me.changeParams(module);
                    me.update(module);
                }
            }).element);
        }
        let pageCt = new nodom.Element('div');
        pageCt.addClass('nd-pagination-pagect');
        let left1 = new nodom.Element('b');
        left1.addClass('nd-pagination-leftarrow1');
        left1.addDirective(new nodom.Directive('class', "{'nd-pagination-disable':'[1,3,5,7,9,11,13,15].includes(btnAllow)'}", left1));
        pageCt.add(left1);
        let left = new nodom.Element('b');
        left.addClass('nd-pagination-leftarrow');
        left.addDirective(new nodom.Directive('class', "{'nd-pagination-disable':'[2,3,6,7,10,11,15].includes(btnAllow)'}", left));
        pageCt.add(left);
        let page = new nodom.Element('span');
        page.addClass('nd-pagination-page');
        page.addDirective(new nodom.Directive('repeat', 'pages', page));
        page.addDirective(new nodom.Directive('class', "{'nd-pagination-active':'active'}", page), true);
        let txt = new nodom.Element();
        txt.expressions = [new nodom.Expression('no')];
        page.add(txt);
        pageCt.add(page);
        let right = new nodom.Element('b');
        right.addClass('nd-pagination-rightarrow');
        right.addDirective(new nodom.Directive('class', "{'nd-pagination-disable':'[4,5,6,7,12,13,15].includes(btnAllow)'}", right));
        pageCt.add(right);
        let right1 = new nodom.Element('b');
        right1.addClass('nd-pagination-rightarrow1');
        right1.addDirective(new nodom.Directive('class', "{'nd-pagination-disable':'[8,9,10,11,12,13,15].includes(btnAllow)'}", right1));
        pageCt.add(right1);
        rootDom.add(pageCt);
        page.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            me.changeParams(module, model.data['no']);
            me.update(module);
        }));
        left.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            if (dom.hasClass('nd-pagination-disable')) {
                return;
            }
            me.changeParams(module, -1, true);
            me.update(module);
        }));
        right.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            if (dom.hasClass('nd-pagination-disable')) {
                return;
            }
            me.changeParams(module, 1, true);
            me.update(module);
        }));
        left1.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            if (dom.hasClass('nd-pagination-disable')) {
                return;
            }
            me.changeParams(module, -me.steps, true);
            me.update(module);
        }));
        right1.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            if (dom.hasClass('nd-pagination-disable')) {
                return;
            }
            me.changeParams(module, me.steps, true);
            me.update(module);
        }));
        if (this.showGo) {
            let goDom = new nodom.Element('div');
            goDom.addClass('nd-pagination-go');
            let txt = new nodom.Element();
            txt.textContent = NUITipWords.NO;
            goDom.add(txt);
            let input = new nodom.Element('input');
            input.setProp('type', 'number');
            input.addDirective(new nodom.Directive('field', 'pageNo', input));
            input.setProp('value', new nodom.Expression('pageNo'), true);
            goDom.add(input);
            txt = new nodom.Element();
            txt.textContent = NUITipWords.page;
            goDom.add(txt);
            rootDom.add(goDom);
        }
        rootDom.plugin = this;
        return rootDom;
    }
    beforeRender(module, uidom) {
        super.beforeRender(module, uidom);
        this.handleInit(uidom, module);
    }
    update(module, current, isStep) {
        if (this.onChange !== '') {
            let foo;
            if (typeof this.onChange === 'string') {
                foo = module.methodFactory.get(this.onChange);
            }
            else if (nodom.Util.isFunction(this.onChange)) {
                foo = this.onChange;
            }
            if (foo) {
                foo.apply(this, [module, this.currentPage, this.pageSize]);
            }
        }
    }
    changeParams(module, current, isStep) {
        let model = module.modelFactory.get(this.modelId);
        let data = model.query(this.extraDataName);
        let total = data.total;
        if (!total) {
            let data1 = model.data;
            if (data1 && data1[this.totalName]) {
                total = data1[this.totalName];
            }
            if (total) {
                data.total = total;
            }
        }
        if (isStep) {
            current = this.currentPage + current;
        }
        if (!total) {
            return;
        }
        model = model.get(this.extraDataName);
        let pageSize = model.data['pageSize'];
        if (!current) {
            let d = model.query('pageNo');
            if (typeof d === 'string' && d !== '') {
                d = parseInt(d);
            }
            current = d || 1;
        }
        let pageCount = Math.ceil(total / pageSize);
        if (current > pageCount) {
            current = pageCount;
        }
        else if (current < 1) {
            current = 1;
        }
        let min = 1;
        let max;
        let btnAllow = 0;
        if (pageCount > this.showNum) {
            let center = (this.showNum + 1) / 2 | 0;
            if (current - center + 1 > 0) {
                min = current - center + 1;
            }
            if (min < 1) {
                min = 1;
            }
            else if (min + this.showNum - 1 > pageCount) {
                min = pageCount - this.showNum + 1;
            }
            max = min + this.showNum - 1;
            if (min === 1) {
                btnAllow += 1;
            }
            if (max === pageCount) {
                btnAllow += 8;
            }
        }
        else {
            min = 1;
            max = pageCount;
            btnAllow = 9;
        }
        if (current === pageCount) {
            btnAllow += 4;
        }
        if (current === 1) {
            btnAllow += 2;
        }
        if (model.query('pageSize') === this.pageSize && current === this.currentPage && min === this.minPage && max === this.maxPage) {
            return;
        }
        let pageArr = [];
        for (let i = min; i <= max; i++) {
            let active = i === current ? true : false;
            pageArr.push({
                no: i,
                active: active
            });
        }
        this.currentPage = current;
        this.minPage = min;
        this.maxPage = max;
        this.pageSize = model.data['pageSize'];
        model.set('pages', pageArr);
        model.set('pageSize', this.pageSize);
        model.set('pageNo', current);
        model.set('btnAllow', btnAllow);
    }
    handleInit(dom, module) {
        if (!this.needPreRender) {
            return;
        }
        let model = module.modelFactory.get(dom.modelId);
        let model1 = model.set(this.extraDataName, {
            total: 0,
            pageNum: 0,
            pageNo: this.currentPage || 1,
            pageSize: this.pageSize,
            btnAllow: 0,
            pages: [],
            sizeData: this.pageSizeDatas || [10, 20, 30, 50]
        });
        this.extraModelId = model1.id;
        this.changeParams(module, 1);
    }
}
nodom.PluginManager.add('UI-PAGINATION', UIPagination);
class UIPanel extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-PANEL';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['title', 'buttons|array'], ['title', 'buttons'], ['Panel', []]);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let me = this;
        rootDom.addClass('nd-panel');
        this.handleBody(rootDom);
        let headerDom = new nodom.Element('div');
        headerDom.addClass('nd-panel-header');
        if (this.title) {
            let titleCt = new nodom.Element('span');
            titleCt.addClass('nd-panel-title');
            titleCt.assets.set('innerHTML', this.title);
            headerDom.add(titleCt);
        }
        let headbarDom = new nodom.Element('div');
        headbarDom.addClass('nd-panel-header-bar');
        this.headerBtnDom = headbarDom;
        headerDom.add(headbarDom);
        rootDom.children.unshift(headerDom);
        for (let btn of this.buttons) {
            let a = btn.split('|');
            this.addHeadBtn(a[0], a[1]);
        }
    }
    handleBody(panelDom) {
        let bodyDom = new nodom.Element('div');
        bodyDom.addClass('nd-panel-body');
        let tbar;
        let btnGrp;
        for (let i = 0; i < panelDom.children.length; i++) {
            let item = panelDom.children[i];
            if (item.plugin) {
                if (item.plugin.tagName === 'UI-TOOLBAR') {
                    tbar = item;
                }
                else if (item.plugin.tagName === 'UI-BUTTONGROUP') {
                    btnGrp = item;
                }
            }
            else {
                bodyDom.add(item);
            }
        }
        panelDom.children = [];
        if (tbar) {
            panelDom.add(tbar);
        }
        panelDom.add(bodyDom);
        if (btnGrp) {
            panelDom.add(btnGrp);
        }
    }
    addHeadBtn(icon, handler) {
        let btn = new nodom.Element('b');
        btn.addClass('nd-icon-' + icon);
        btn.addClass('nd-canclick');
        this.headerBtnDom.add(btn);
        if (handler) {
            btn.addEvent(new nodom.NodomEvent('click', handler));
        }
    }
}
nodom.PluginManager.add('UI-PANEL', UIPanel);
class UIRadio extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-RADIO';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'span';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        rootDom.addClass('nd-radio');
        let field = rootDom.getDirective('field');
        if (field) {
            this.dataName = field.value;
            rootDom.removeDirectives(['field']);
        }
        for (let c of rootDom.children) {
            if (c.tagName) {
                let icon = new nodom.Element('b');
                icon.addClass('nd-radio-unactive');
                icon.addDirective(new nodom.Directive('class', "{'nd-radio-active':'" + this.dataName + "==\"" + c.getProp('value') + "\"'}", icon));
                c.children.unshift(icon);
                c.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
                    let v = model.data[this.dataName];
                    model.set(this.dataName, dom.getProp('value'));
                }));
            }
        }
    }
}
nodom.PluginManager.add('UI-RADIO', UIRadio);
class UIRelationMap extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-RELATIONMAP';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['valuefield|array|1', 'displayfield|array|2', 'listfield|array|2'], ['valueField', 'displayField', 'listField'], [null, null, null]);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'table';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let me = this;
        rootDom.addClass('nd-relationmap');
        this.mapName = '$ui_relationmap_' + nodom.Util.genId();
        let field = rootDom.getDirective('field');
        if (field) {
            this.dataName = field.value;
            rootDom.removeDirectives(['field']);
        }
        let rowHead = new nodom.Element('tr');
        rowHead.addClass('nd-relationmap-head');
        rootDom.add(rowHead);
        let td = new nodom.Element('td');
        rowHead.add(td);
        td = new nodom.Element('td');
        td.addDirective(new nodom.Directive('repeat', this.listField[0], td));
        let txt = new nodom.Element();
        txt.expressions = [new nodom.Expression(this.displayField[0])];
        td.add(txt);
        rowHead.add(td);
        let tr = new nodom.Element('tr');
        tr.addDirective(new nodom.Directive('repeat', '$$' + this.mapName, tr));
        tr.addClass('nd-relationmap-row');
        td = new nodom.Element('td');
        td.addClass('nd-relationmap-head');
        txt = new nodom.Element();
        txt.expressions = [new nodom.Expression('title')];
        td.add(txt);
        tr.add(td);
        td = new nodom.Element('td');
        td.addDirective(new nodom.Directive('repeat', 'cols', td));
        td.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            me.switchValue(module, dom, model);
        }));
        let b = new nodom.Element('b');
        b.addDirective(new nodom.Directive('class', "{'nd-relationmap-active':'active'}", b));
        td.add(b);
        tr.add(td);
        rootDom.children = [rowHead, tr];
    }
    beforeRender(module, uidom) {
        super.beforeRender(module, uidom);
        let model = module.modelFactory.get(uidom.modelId);
        let rowData = model.query(this.listField[1]);
        let colData = model.query(this.listField[0]);
        let data = model.query(this.dataName);
        let idRow = this.valueField[1];
        let idCol = this.valueField[0];
        if (!module.model.query(this.mapName)) {
            let mapData = [];
            let title;
            for (let d of rowData) {
                let a1 = [];
                let id1 = d[idRow];
                title = d[this.displayField[1]];
                for (let d1 of colData) {
                    let active = false;
                    if (data && data.length > 0) {
                        for (let da of data) {
                            if (da[idRow] === id1 && da[idCol] === d1[idCol]) {
                                active = true;
                                break;
                            }
                        }
                    }
                    a1.push({
                        id1: id1,
                        id2: d1[idCol],
                        active: active
                    });
                }
                mapData.push({ title: title, cols: a1 });
            }
            module.model.set(this.mapName, mapData);
        }
    }
    switchValue(module, dom, model) {
        let pmodel = module.modelFactory.get(this.modelId);
        let data = pmodel.query(this.dataName);
        let id1 = model.data['id1'];
        let id2 = model.data['id2'];
        let active = model.data['active'];
        let o = {};
        o[this.valueField[0]] = id2;
        o[this.valueField[1]] = id1;
        if (!data) {
            if (!active) {
                pmodel.set(this.dataName, [o]);
            }
        }
        else {
            if (!active) {
                data.push(o);
            }
            else {
                for (let i = 0; i < data.length; i++) {
                    let d = data[i];
                    if (d[this.valueField[0]] === id2 && d[this.valueField[1]] === id1) {
                        data.splice(i, 1);
                        break;
                    }
                }
            }
        }
        model.set('active', !active);
    }
}
nodom.PluginManager.add('UI-RELATIONMAP', UIRelationMap);
class UISelect extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-SELECT';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['valuefield', 'displayfield', 'multiselect|bool', 'listfield', 'listwidth|number', 'allowfilter|bool', 'onchange'], ['valueField', 'displayField', 'multiSelect', 'listField', 'listWidth', 'allowFilter', 'onChange'], [null, null, null, null, 0, null, '']);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let me = this;
        this.extraDataName = '$ui_select_' + nodom.Util.genId();
        rootDom.addClass('nd-select');
        let field = rootDom.getDirective('field');
        if (field) {
            this.dataName = field.value;
            rootDom.removeDirectives(['field']);
            rootDom.events.delete('change');
        }
        rootDom.addDirective(new nodom.Directive('model', this.extraDataName, rootDom));
        let listDom = new nodom.Element('div');
        listDom.addClass('nd-select-list');
        if (this.listWidth) {
            listDom.assets.set('style', 'width:' + this.listWidth + 'px');
        }
        listDom.addDirective(new nodom.Directive('show', 'show', listDom));
        let itemDom;
        for (let c of rootDom.children) {
            if (!c.tagName) {
                continue;
            }
            itemDom = c;
            break;
        }
        if (!itemDom) {
            itemDom = new nodom.Element('div');
            let txt = new nodom.Element();
            txt.expressions = [new nodom.Expression(this.displayField)];
            itemDom.add(txt);
        }
        let item = new nodom.Element('div');
        item.children = itemDom.children;
        item.addClass('nd-select-itemcontent');
        itemDom.addClass('nd-select-item');
        let directive = new nodom.Directive('repeat', 'datas', itemDom);
        itemDom.addDirective(directive);
        itemDom.addDirective(new nodom.Directive('class', "{'nd-select-selected':'selected'}", itemDom));
        let icon = new nodom.Element('b');
        icon.addClass('nd-select-itemicon');
        itemDom.children = [item, icon];
        itemDom.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
            me.setValue(module, model);
        }));
        let showDom = new nodom.Element('div');
        showDom.addClass('nd-select-inputct');
        let input = new nodom.Element('input');
        input.addClass('nd-select-show');
        if (this.multiSelect) {
            input.setProp('readonly', true);
        }
        input.setProp('value', new nodom.Expression('display'), true);
        showDom.add(input);
        icon = new nodom.Element('b');
        showDom.addEvent(new nodom.NodomEvent('click', (dom, model, module, e, el) => {
            if (model.data.show) {
                me.hideList(module, model);
            }
            else {
                model.set('show', true);
                let height = el.offsetHeight;
                let y = e.clientY + el.offsetHeight - e.offsetY;
                UITool.adjustPosAndSize(module, this.listKey, e.clientX, y, height, null, true);
            }
        }));
        if (this.allowFilter) {
            this.filterMethodId = '$$nodom_method_' + nodom.Util.genId();
            let filter = new nodom.Filter(['select', 'func', this.filterMethodId]);
            directive.filters = [filter];
            input.assets.set('readonly', 'true');
            let queryDom = new nodom.Element('input');
            queryDom.addClass('nd-select-search');
            queryDom.addDirective(new nodom.Directive('field', 'query', queryDom));
            queryDom.addDirective(new nodom.Directive('class', "{'nd-select-search-active':'show'}", queryDom));
            showDom.add(queryDom);
        }
        showDom.add(icon);
        listDom.children = [itemDom];
        rootDom.children = [showDom, listDom];
    }
    beforeRender(module, dom) {
        let me = this;
        super.beforeRender(module, dom);
        this.listKey = dom.children[1].key;
        let pmodel;
        let model;
        if (this.needPreRender) {
            pmodel = module.modelFactory.get(this.modelId);
            let model = pmodel.set(this.extraDataName, {
                show: false,
                display: '',
                query: '',
                datas: []
            });
            this.extraModelId = model.id;
            module.methodFactory.add(this.filterMethodId, function () {
                let model = this.modelFactory.get(me.extraModelId);
                let rows = model.query('datas');
                if (rows) {
                    return rows.filter((item) => {
                        return model.data.query === '' || item[me.displayField].indexOf(model.data.query) !== -1;
                    });
                }
                return [];
            });
            UIEventRegister.addEvent('click', module.id, dom.key, (module, dom, inOrout, e) => {
                let model = module.modelFactory.get(me.extraModelId);
                if (!inOrout && model.data.show) {
                    me.hideList(module, model);
                }
            });
            model = module.modelFactory.get(this.extraModelId);
        }
        if (!pmodel) {
            pmodel = module.modelFactory.get(this.modelId);
        }
        if (!model) {
            model = module.modelFactory.get(this.extraModelId);
        }
        let data = model.data;
        if (this.listField && data.datas.length === 0 && pmodel.data[this.listField]) {
            let valueArr;
            if (this.dataName) {
                let value = pmodel.query(this.dataName);
                if (value && value !== '') {
                    valueArr = value.toString().split(',');
                }
            }
            let txtArr = [];
            let rows = pmodel.query(this.listField);
            if (rows && Array.isArray(rows)) {
                rows = nodom.Util.clone(rows);
                for (let d of rows) {
                    if (valueArr && valueArr.includes(d[this.valueField] + '')) {
                        d.selected = true;
                        txtArr.push(d[this.displayField]);
                    }
                    else {
                        d.selected = false;
                    }
                }
                model.set('datas', rows);
                this.setValue(module);
            }
        }
    }
    setValue(module, model) {
        let pmodel = module.modelFactory.get(this.modelId);
        let model1 = module.modelFactory.get(this.extraModelId);
        let rows = model1.data['datas'];
        let txtArr = [];
        let valArr = [];
        let value;
        if (this.multiSelect) {
            if (model) {
                model.set('selected', !model.data.selected);
            }
            for (let d of rows) {
                if (d.selected) {
                    valArr.push(d[this.valueField]);
                    txtArr.push(d[this.displayField]);
                }
            }
            if (this.dataName) {
                value = valArr.join(',');
            }
            model1.set('display', txtArr.join(','));
        }
        else {
            if (model) {
                for (let d of rows) {
                    if (d.selected) {
                        d.selected = false;
                        break;
                    }
                }
                model.set('selected', !model.data.selected);
            }
            for (let d of rows) {
                if (d.selected) {
                    if (this.dataName) {
                        value = d[this.valueField];
                    }
                    model1.set('display', d[this.displayField]);
                    this.hideList(module, model1);
                    break;
                }
            }
        }
        if (value !== this.value) {
            pmodel.set(this.dataName, value);
            if (this.onChange !== '') {
                let foo;
                if (typeof this.onChange === 'string') {
                    foo = module.methodFactory.get(this.onChange);
                }
                else {
                    foo = this.onChange;
                }
                if (nodom.Util.isFunction(foo)) {
                    foo.apply(null, [model, module, value, this.value]);
                }
            }
            this.value = value;
        }
    }
    hideList(module, model) {
        if (!model) {
            model = module.modelFactory.get(this.extraModelId);
        }
        model.set('show', false);
        model.set('query', '');
    }
}
nodom.PluginManager.add('UI-SELECT', UISelect);
class UITab extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-TAB';
        this.tabs = [];
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['position', 'allowclose|bool', 'listField', 'height|number'], ['position', 'allowClose', 'listField', 'bodyHeight'], ['top', null, '', 0]);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        let me = this;
        this.extraDataName = '$ui_tab_' + nodom.Util.genId();
        this.name = rootDom.getProp('name');
        rootDom.addClass('nd-tab');
        if (this.position === 'left' || this.position === 'right') {
            rootDom.addClass('nd-tab-horizontal');
        }
        let headDom = new nodom.Element('div');
        headDom.addClass('nd-tab-head');
        let bodyDom = new nodom.Element('div');
        this.bodyKey = bodyDom.key;
        bodyDom.addClass('nd-tab-body');
        if (this.bodyHeight > 0) {
            bodyDom.assets.set('style', 'height:' + this.bodyHeight + 'px');
        }
        let index = 1;
        let activeIndex = 0;
        let itemDom;
        for (let c of rootDom.children) {
            if (!c.tagName) {
                continue;
            }
            let tabName = 'Tab' + index++;
            let title = c.getProp('title') || tabName;
            let active = c.getProp('active') || false;
            if (active) {
                activeIndex = index;
            }
            this.tabs.push({ title: title, name: tabName, active: active });
            let contentDom = new nodom.Element('div');
            contentDom.children = c.children;
            contentDom.addDirective(new nodom.Directive('show', this.extraDataName + '.' + tabName, contentDom));
            bodyDom.add(contentDom);
            if (itemDom) {
                continue;
            }
            c.tagName = 'div';
            c.delProp(['title', 'active', 'name']);
            c.addClass('nd-tab-item');
            let txt = new nodom.Element();
            txt.expressions = [new nodom.Expression('title')];
            c.children = [txt];
            if (this.allowClose) {
                let b = new nodom.Element('b');
                b.addClass('nd-tab-close');
                b.addEvent(new nodom.NodomEvent('click', ':nopopo', (dom, model, module) => {
                    me.delTab(model.data.name, module);
                }));
                c.add(b);
            }
            c.addDirective(new nodom.Directive('repeat', this.extraDataName + '.datas', c));
            c.addDirective(new nodom.Directive('class', "{'nd-tab-item-active':'active'}", c));
            c.addEvent(new nodom.NodomEvent('click', (dom, model, module) => {
                me.setActive(model.data.name, module);
            }));
            itemDom = c;
        }
        headDom.add(itemDom);
        if (activeIndex === 0 && this.tabs.length > 0) {
            this.tabs[0].active = true;
        }
        if (this.position === 'top' || this.position === 'left') {
            rootDom.children = [headDom, bodyDom];
        }
        else {
            rootDom.children = [bodyDom, headDom];
        }
    }
    beforeRender(module, dom) {
        super.beforeRender(module, dom);
        let pmodel;
        if (this.needPreRender) {
            pmodel = module.modelFactory.get(this.modelId);
            let data = {
                datas: this.tabs
            };
            for (let d of this.tabs) {
                data[d.name] = d.active;
            }
            this.bodyKey = dom.children[1].key;
            this.extraModelId = pmodel.set(this.extraDataName, data).id;
        }
    }
    addTab(cfg) {
        let module = nodom.ModuleFactory.get(this.moduleId);
        if (!module) {
            return;
        }
        let model = module.modelFactory.get(this.extraModelId);
        let index = nodom.Util.isNumber(cfg.index) ? cfg.index : model.data.datas.length;
        let tabName = cfg.name || ('Tab' + nodom.Util.genId());
        model.data.datas.splice(index, 0, {
            title: cfg.title,
            name: tabName,
            active: false
        });
        model.set(tabName, false);
        let bodyDom = module.virtualDom.query(this.bodyKey);
        let dom;
        if (cfg.content) {
            dom = nodom.Compiler.compile(cfg.content);
        }
        else if (cfg.module) {
            dom = new nodom.Element('div');
            let mdlStr = cfg.module;
            if (cfg.moduleName) {
                mdlStr += '|' + cfg.moduleName;
            }
            dom.addDirective(new nodom.Directive('module', mdlStr, dom));
            if (cfg.data) {
                dom.setProp('data', cfg.data);
            }
        }
        dom.addDirective(new nodom.Directive('show', this.extraDataName + '.' + tabName, dom));
        bodyDom.children.splice(index, 0, dom);
        if (cfg.active) {
            this.setActive(tabName, module);
        }
    }
    delTab(tabName, module) {
        if (!module) {
            module = nodom.ModuleFactory.get(this.moduleId);
        }
        let pmodel = module.modelFactory.get(this.extraModelId);
        let datas = pmodel.data.datas;
        let activeIndex;
        if (datas.length === 1) {
            return;
        }
        for (let i = 0; i < datas.length; i++) {
            if (datas[i].name === tabName) {
                if (datas[i].active) {
                    if (i < datas.length - 1) {
                        activeIndex = i;
                    }
                    else {
                        activeIndex = 0;
                    }
                }
                datas.splice(i, 1);
                pmodel.del(tabName);
                let bodyDom = module.virtualDom.query(this.bodyKey);
                bodyDom.children.splice(i, 1);
                break;
            }
        }
        if (activeIndex !== undefined) {
            this.setActive(datas[activeIndex].name, module);
        }
    }
    setActive(tabName, module) {
        if (!module) {
            module = nodom.ModuleFactory.get(this.moduleId);
        }
        let pmodel = module.modelFactory.get(this.extraModelId);
        let datas = pmodel.data.datas;
        let activeData;
        for (let o of datas) {
            if (o.active) {
                pmodel.data[o.name] = false;
                o.active = false;
            }
            if (o.name === tabName) {
                activeData = o;
            }
        }
        activeData.active = true;
        pmodel.data[tabName] = true;
    }
}
nodom.PluginManager.add('UI-TAB', UITab);
class UITip extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-TIP';
        this.needCheck = false;
        this.containers = {
            top: undefined,
            right: undefined,
            bottom: undefined,
            left: undefined
        };
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        rootDom.tagName = 'div';
        this.extraDataName = '$ui_tip_manager';
        rootDom.setProp('name', this.extraDataName);
        rootDom.addDirective(new nodom.Directive('model', this.extraDataName, rootDom));
        for (let loc of ['top', 'right', 'bottom', 'left']) {
            let ct = new nodom.Element('div');
            ct.addClass('nd-tip nd-tip-' + loc);
            ct.add(this.createTipDom(loc));
            rootDom.add(ct);
        }
    }
    beforeRender(module, dom) {
        super.beforeRender(module, dom);
        if (this.needPreRender) {
            let model = module.model;
            if (!model.get(this.extraDataName)) {
                let mdl = model.set(this.extraDataName, {
                    top: [],
                    left: [],
                    bottom: [],
                    right: []
                });
                this.modelId = mdl.id;
            }
        }
    }
    createTipDom(loc) {
        let me = this;
        let dom = new nodom.Element('div');
        dom.addDirective(new nodom.Directive('repeat', loc, dom));
        dom.setProp('class', new nodom.Expression("'nd-tip-item nd-box-' + theme"), true);
        let close = new nodom.Element('b');
        close.addClass('nd-tip-close');
        close.addDirective(new nodom.Directive('show', 'allowClose', close));
        close.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
            model.set('close', true);
            me.check(true);
        }));
        let contentDom = new nodom.Element('div');
        contentDom.addClass('nd-tip-content');
        let icon = new nodom.Element('b');
        icon.setProp('class', new nodom.Expression("'nd-icon-' + icon"), true);
        icon.addDirective(new nodom.Directive('show', 'icon', icon));
        let txt = new nodom.Element();
        txt.expressions = [new nodom.Expression('content')];
        contentDom.children = [txt];
        dom.children = [icon, contentDom, close];
        return dom;
    }
    check(force) {
        let me = this;
        if (force) {
            this.needCheck = true;
        }
        if (!this.needCheck || !this.modelId) {
            return;
        }
        let needCheck = false;
        let model = nodom.ModuleFactory.getMain().modelFactory.get(this.modelId);
        let ct = new Date().getTime();
        for (let loc of ['top', 'right', 'bottom', 'left']) {
            let data = model.data[loc];
            for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d.close || !d.allowClose && d.start + d.time <= ct) {
                    data.splice(i--, 1);
                }
                else if (!d.allowClose && d.start + d.time > ct) {
                    needCheck = true;
                }
            }
        }
        this.needCheck = needCheck;
        if (this.needCheck) {
            setTimeout(() => { me.check(); }, 100);
        }
    }
    show(config) {
        if (!nodom.Util.isObject(config)) {
            return;
        }
        let model = nodom.ModuleFactory.getMain().model.get(this.extraDataName);
        if (!model) {
            return;
        }
        let loc = config.loc || 'top';
        let allowClose = config.allowClose || false;
        let datas = model.data[loc];
        let data = {
            content: config.content || 'message',
            time: config.time || 3000,
            start: new Date().getTime(),
            allowClose: allowClose,
            icon: config.icon,
            theme: config.theme || 'black'
        };
        if (config.exclusive) {
            for (let d of datas) {
                datas.pop();
            }
            datas.push(data);
        }
        else {
            datas.push(data);
        }
        if (!allowClose) {
            this.check(true);
        }
    }
}
nodom.PluginManager.add('UI-TIP', UITip);
var nodom;
(function (nodom) {
    function tip(config) {
        let module = nodom.ModuleFactory.getMain();
        if (!module) {
            return null;
        }
        let manager = module.getPlugin('$ui_tip_manager');
        if (manager) {
            manager.show(config);
        }
    }
    nodom.tip = tip;
})(nodom || (nodom = {}));
class UIToolbar extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-TOOLBAR';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                nodom.Compiler.handleChildren(rootDom, params);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
        }
        rootDom.tagName = 'div';
        rootDom.addClass('nd-toolbar');
        rootDom.plugin = this;
        this.element = rootDom;
    }
}
nodom.PluginManager.add('UI-TOOLBAR', UIToolbar);
class UITree extends nodom.Plugin {
    constructor(params) {
        super(params);
        this.tagName = 'UI-TREE';
        let rootDom = new nodom.Element();
        if (params) {
            if (params instanceof HTMLElement) {
                nodom.Compiler.handleAttributes(rootDom, params);
                UITool.handleUIParam(rootDom, this, ['valuefield', 'displayfield', 'listfield', 'itemclick', 'checkname', 'maxlevel|number', 'icons|array|2'], ['valueField', 'displayField', 'listField', 'itemClick', 'checkName', 'maxLevel', 'iconArr'], ['', null, null, '', '', 3, []]);
            }
            else if (typeof params === 'object') {
                for (let o in params) {
                    this[o] = params[o];
                }
            }
            this.generate(rootDom);
        }
        rootDom.tagName = 'div';
        rootDom.plugin = this;
        this.element = rootDom;
    }
    generate(rootDom) {
        const me = this;
        rootDom.addClass('nd-tree');
        this.activeName = '$ui_tree_' + nodom.Util.genId();
        this.checkedChdNumName = '$ui_tree_' + nodom.Util.genId();
        let methodId = '$nodomGenMethod' + nodom.Util.genId();
        this.arrowClickId = methodId;
        let closeOpenEvent = new nodom.NodomEvent('click', methodId + ':delg');
        let itemClickEvent;
        if (this.itemClick !== '') {
            itemClickEvent = new nodom.NodomEvent('click', this.itemClick + ':delg');
        }
        let parentCt = rootDom;
        let item;
        for (let i = 0; i < this.maxLevel; i++) {
            let itemCt = new nodom.Element();
            itemCt.tagName = 'div';
            itemCt.directives.push(new nodom.Directive('repeat', this.listField, itemCt));
            itemCt.addClass('nd-tree-nodect');
            item = new nodom.Element();
            item.addClass('nd-tree-node');
            item.tagName = 'DIV';
            if (itemClickEvent) {
                item.addEvent(itemClickEvent);
            }
            let icon1 = new nodom.Element();
            icon1.tagName = 'SPAN';
            icon1.addClass('nd-tree-icon');
            icon1.addDirective(new nodom.Directive('class', "{'nd-tree-node-open':'" + this.activeName + "'," +
                "'nd-icon-right':'" + this.listField + "&&" + this.listField + ".length>0'}", icon1));
            icon1.addEvent(closeOpenEvent);
            itemCt.add(icon1);
            if (this.iconArr.length > 0) {
                let a = [];
                a.push("'nd-icon-" + this.iconArr[0] + "':'" + this.listField + "&&" + this.listField + ".length>0'");
                if (this.iconArr.length > 1) {
                    a.push("'nd-icon-" + this.iconArr[1] + "':'!" + this.listField + "||" + this.listField + ".length===0'");
                }
                let icon = new nodom.Element();
                icon.tagName = 'SPAN';
                icon.addClass('nd-tree-icon');
                let cls = '{' + a.join(',') + '}';
                icon.directives.push(new nodom.Directive('class', cls, icon));
                itemCt.add(icon);
            }
            if (this.checkName !== '') {
                let cb = new nodom.Element('b');
                cb.addClass('nd-tree-uncheck');
                cb.addDirective(new nodom.Directive('class', "{'nd-tree-checked':'" + this.checkName + "'}", cb));
                itemCt.add(cb);
                cb.addEvent(new nodom.NodomEvent('click', (dom, model, module, e) => {
                    me.handleCheck(model, module);
                }));
            }
            itemCt.add(item);
            let txt = new nodom.Element();
            txt.expressions = [new nodom.Expression(this.displayField)];
            item.add(txt);
            let subCt = new nodom.Element();
            subCt.addClass('nd-tree-subct');
            subCt.tagName = 'DIV';
            subCt.addDirective(new nodom.Directive('class', "{'nd-tree-show':'" + this.activeName + "'}", subCt));
            itemCt.add(subCt);
            parentCt.add(itemCt);
            parentCt = subCt;
        }
        rootDom.plugin = this;
        return rootDom;
    }
    beforeRender(module, uidom) {
        const me = this;
        super.beforeRender(module, uidom);
        if (this.needPreRender) {
            module.methodFactory.add(me.arrowClickId, (dom, model, module, e) => {
                let pmodel = module.modelFactory.get(dom.modelId);
                let rows = pmodel.data[me.listField];
                if (!rows || rows.length === 0) {
                    return;
                }
                model.set(me.activeName, !model.data[me.activeName]);
            });
        }
    }
    handleCheck(model, module) {
        let checked = !model.data[this.checkName];
        model.set(this.checkName, checked);
        this.handleSubCheck(model, module, checked);
        this.handleParentCheck(model, module, checked);
    }
    handleSubCheck(model, module, checked) {
        let rows = model.data[this.listField];
        if (!rows) {
            return;
        }
        if (checked) {
            model.set(this.checkedChdNumName, rows.length);
        }
        else {
            model.set(this.checkedChdNumName, 0);
        }
        for (let d of rows) {
            let m = module.modelFactory.get(d.$modelId);
            m.set(this.checkName, checked);
            this.handleSubCheck(m, module, checked);
        }
    }
    handleParentCheck(model, module, checked) {
        let pmodel = model.parent;
        if (!pmodel || pmodel === module.model) {
            return;
        }
        pmodel = pmodel.parent;
        if (!pmodel || pmodel === module.model) {
            return;
        }
        let data = pmodel.data;
        if (data[this.checkedChdNumName] === undefined) {
            pmodel.set(this.checkedChdNumName, 0);
        }
        if (checked) {
            data[this.checkedChdNumName]++;
        }
        else {
            data[this.checkedChdNumName]--;
        }
        let chk = data[this.checkName];
        if (data[this.checkedChdNumName] === 0) {
            pmodel.set(this.checkName, false);
        }
        else {
            pmodel.set(this.checkName, true);
        }
        if (chk !== data[this.checkName]) {
            this.handleParentCheck(pmodel, module, checked);
        }
    }
    getValue() {
        const me = this;
        if (this.valueField === '') {
            return;
        }
        let va = [];
        let module = nodom.ModuleFactory.get(this.moduleId);
        let model = module.modelFactory.get(this.modelId);
        getChecked(model.data[this.listField]);
        return va;
        function getChecked(rows) {
            if (Array.isArray(rows)) {
                for (let d of rows) {
                    if (d[me.checkName] === true) {
                        va.push(d[me.valueField]);
                    }
                    getChecked(d[me.listField]);
                }
            }
        }
    }
}
nodom.PluginManager.add('UI-TREE', UITree);