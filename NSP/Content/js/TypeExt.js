///-----------基础扩展start----------------//
(function($)
{
    $.valid = function (v) {
        return v != null && typeof (v) != "undefined";
    };

    $.fn.extend(
        {
            serializeObject: function () {
                function arrayToObject(arr) {
                    var ret = {};
                    for (var i = 0; i < arr.length; i++) {
                        ret[arr[i].name] = arr[i].value;
                    }
                    return ret;
                }
                var arrobj;
                var myform = $(this);
                var disabled = myform.find(':input:disabled').removeAttr('disabled');
                try {
                    arrobj = myform.serializeArray();
                }
                finally {
                    disabled.attr('disabled', 'disabled');
                }
                return arrayToObject(arrobj);
            }
        });
    $.Hashtable = function() {
        this.items = new Array();
        this.itemsCount = 0;
        this.add = function (key, value) {
            if (!this.containsKey(key)) {
                this.itemsCount++;
            }
            this.items[key] = value;
        }
        this.get = function(key) {
            if (this.containsKey(key))
                return this.items[key];
            else
                return null;
        }

        this.remove = function(key) {
            if (this.containsKey(key)) {
                delete this.items[key];
                this.itemsCount--;
            }
        }
        this.containsKey = function(key) {
            return typeof (this.items[key]) != "undefined";
        }
        this.containsValue = function containsValue(value) {
            for (var item in this.items) {
                if (this.items[item] == value)
                    return true;
            }
            return false;
        }
        this.contains = function(keyOrValue) {
            return this.containsKey(keyOrValue) || this.containsValue(keyOrValue);
        }
        this.clear = function() {
            this.items = new Array();
            itemsCount = 0;
        }
        this.size = function() {
            return this.itemsCount;
        }
        this.isEmpty = function() {
            return this.size() == 0;
        }
        this.toArray = function()
        {
            var ret = [];
            for (var item in items)
                ret.push(items[item]);
            return ret;
        }
    };
    $.Querable = function (set) {
        var _self = this;
        function valid(v) {
            return v != null && typeof (v) != "undefined";
        }
        _self.isQuerable = function (v)
        {
            return v && $.isFunction(v.execute);
        }
        if ($.isArray(set)) {
            _self.lamda = function (any) {
                if (any)
                    return set.length > 0;
                else
                    return set;
            };
        }
        else if (_self.isQuerable(set)) {
            _self.lamda = function (any) {
                if (any)
                    return set.execute();
                else
                    return set.any();
            }
        } else {
            _self.lamda = function (any) {
                if (any)
                    return [set];
                else
                    return $.valid(set);
            }
        }
        _self.reset = function () {
            delete _self.ret;
        }
        _self.execute = function () {
            if (!$.isArray(_self.ret)) {
                if ($.isFunction(_self.lamda)) {
                    _self.ret = _self.lamda();
                } else
                    _self.ret = [];
            }
            return _self.ret;
        }
        _self.toArray = function () {
            return _self.execute();
        }
        _self.count = function () {
            return _self.execute().length;
        }
        _self.any = function()
        {
            if (!$.isArray(_self.ret)) {
                if ($.isFunction(_self.lamda)) {
                    return _self.lamda(true);
                } else
                    return $.valid(_self.ret);
            }
            return _self.ret.length > 0;
        }
        _self.first = function ()
        {
            if (!$.isArray(_self.ret))
            {
                if ($.isFunction(_self.lamda))
                {
                    var temp = _self.lamda(false, 1);
                    return temp.length > 0 ? temp[0] : null;
                }
                else
                    return null;
            }
            return null;
        }
        _self.where = function (func)
        {
            if ($.isFunction(func)) {
                var ret = new $.Querable(_self);
                ret.lamda = function (any,getcount) {
                    if (any) {
                        var p = _self.execute();
                        for (var item = 0; item < p.length; item++) {
                            var iv = p[item];
                            if (func(iv)) {
                                return true;
                            }
                        }
                        return false;
                    } else {
                        var arr = [];
                        var p = _self.execute();
                        var validValuesCount = 0;
                        for (var item = 0; item < p.length; item++)
                        {
                            if (getcount && getcount>-1 && validValuesCount >= getcount)
                                break;
                            var iv = p[item];
                            if (func(iv))
                            {
                                arr.push(iv);
                                validValuesCount++;
                            }
                        }
                        return arr;
                    }
                }
                return ret;
            }
            return _self;
        }
        _self.select = function (func) {
            if ($.isFunction(func)) {
                var ret = new $.Querable(_self);
                ret.lamda = function (any) {
                    if (any) {
                        return _self.any();
                    } else {
                        var arr = [];
                        var p = _self.execute();
                        for (var item = 0; item < p.length; item++) {
                            var iv = p[item];
                            if (valid(iv)) {
                                var c = func(iv)
                                if (valid(c))
                                    arr.push(c);
                            }
                        }
                        return arr;
                    }
                }
                return ret;
            }
            return _self;
        }
        _self.unionAll = function (uset) {
            var ret = new $.Querable();
            ret.lamda = function (any) {
                if (any) {
                    var sany = _self.any();
                    if (sany)
                        return true;
                    if ($.isArray(uset)) {
                        return uset.length > 0;
                    }
                    else if (_self.isQuerable(uset)) {
                        return uset.any();
                    } else {
                        return $.valid(uset);
                    }
                    return false;
                } else {
                    var p = [];
                    var p1 = _self.execute();
                    if (p1.length > 0) {
                        for (var pi1 = 0; pi1 < p1.length; pi1++) {
                            var iv = p1[pi1];
                            if (valid(iv))
                                p.push(iv);
                        }
                    }
                    var p2;
                    if ($.isArray(uset)) {
                        p2 = uset;
                    }
                    else if (_self.isQuerable(uset)) {
                        p2 = uset.execute();
                    } else {
                        p2 = [uset];
                    }
                    if (p2.length > 0) {
                        for (var pi2 = 0; pi2 < p2.length; pi2++) {
                            var iv = p2[pi2];
                            if (valid(iv))
                                p.push(iv);
                        }
                    }
                    return p;
                }
            }
            return ret;
        }
        _self.union = function (uset, compare) {
            var ret = new $.Querable();
            ret.lamda = function (any) {
                if (any) {
                    var sany = _self.any();
                    if (sany)
                        return true;
                    if ($.isArray(uset)) {
                        return uset.length > 0;
                    }
                    else if (_self.isQuerable(uset)) {
                        return uset.any();
                    } else {
                        return $.valid(uset);
                    }
                    return false;
                } else {
                    var p = [];
                    var p1 = _self.execute();
                    if (p1.length > 0) {
                        for (var pi1 = 0; pi1 < p1.length; pi1++) {
                            var iv = p1[pi1];
                            if (valid(iv))
                                p.push(iv);
                        }
                    }
                    var p2;
                    if ($.isArray(uset)) {
                        p2 = uset;
                    }
                    else if (_self.isQuerable(uset)) {
                        p2 = uset.execute();
                    } else {
                        p2 = [uset];
                    }
                    if (p2.length > 0) {
                        if (!$.isFunction(compare))
                            compare = function (t1, t2) {
                                return t1 === t2;
                            };
                        for (var pi2 = 0; pi2 < p2.length; pi2++) {
                            var iv2 = p2[pi2];
                            if (valid(iv2)) {
                                var find = false;
                                for (var pi1 = 0; pi1 < p.length; pi1++) {
                                    var iv1 = p[pi1];
                                    if (valid(iv1)) {
                                        if (compare(iv1, iv2)) {
                                            find = true;
                                            break;
                                        }
                                    }
                                }
                                if (!find)
                                    p.push(iv2);
                            }
                        }
                    }
                    return p;
                }
            }
            return ret;
        }
        _self.intersection = function (uset, compare) {
            var ret = new $.Querable();
            ret.lamda = function (any) {
                if (any) {
                    var p1 = _self.execute();
                    var p2;
                    if ($.isArray(uset)) {
                        p2 = uset;
                    }
                    else if (_self.isQuerable(uset)) {
                        p2 = uset.execute();
                    } else {
                        p2 = [uset];
                    }
                    if (p2.length > 0) {
                        if (!$.isFunction(compare))
                            compare = function (t1, t2) {
                                return t1 === t2;
                            };
                        for (var pi2 = 0; pi2 < p2.length; pi2++) {
                            var iv2 = p2[pi2];
                            if (valid(iv2)) {
                                for (var pi1 = 0; pi1.length; pi1++) {
                                    var iv1 = p1[pi1];
                                    if (valid(iv1)) {
                                        if (compare(iv1, iv2)) {
                                            return true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return false;
                } else {
                    var retset = [];
                    var p1 = _self.execute();
                    var p2;
                    if ($.isArray(uset)) {
                        p2 = uset;
                    }
                    else if (_self.isQuerable(uset)) {
                        p2 = uset.execute();
                    } else {
                        p2 = [uset];
                    }
                    if (p2.length > 0) {
                        if (!$.isFunction(compare))
                            compare = function (t1, t2) {
                                return t1 === t2;
                            };
                        for (var pi2 = 0; pi2 < p2.length; pi2++) {
                            var iv2 = p2[pi2];
                            if (valid(iv2)) {
                                for (var pi1 = 0; pi1.length; pi1++) {
                                    var iv1 = p1[pi1];
                                    if (valid(iv1)) {
                                        if (compare(iv1, iv2)) {
                                            retset.push(iv1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return retset;
                }
            }
            return ret;
        }
        //_self.removeAt = function (idx) {
        //}
    }

    //String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    //    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
    //        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    //    } else {
    //        return this.replace(reallyDo, replaceWith);
    //    }
    //}
    String.prototype.startWith = function (s) {
        if (s == null || s == "" || this.length == 0 || s.length > this.length)
            return false;
        if (this.substr(0, s.length) == s)
            return true;
        else
            return false;
        return true;
    }
    String.prototype.endWith = function (s) {
        if (s == null || s == "" || this.length == 0 || s.length > this.length)
            return false;
        if (this.substring(this.length - s.length) == s)
            return true;
        else
            return false;
        return true;
    }
    Array.prototype.isContain = function (v, prop) {
        if ($.isArray(this)) {
            if ($.isArray(v)) {
                if (prop) {
                    for (var i = 0; i < this.length; i++) {
                        if (v.isContain(this[i][prop]))
                            return true;
                    }
                } else {
                    for (var i = 0; i < this.length; i++) {
                        if (v.isContain(this[i]))
                            return true;
                    }
                }
            } else {
                if (prop) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i][prop] == v)
                            return true;
                    }
                } else {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == v)
                            return true;
                    }
                }
            }
        }
        return false;
    }
    Array.prototype.toHashtable = function (prop) {
        var ret = new $.Hashtable();
        if ($.isArray(this) && prop) {
            for (var i = 0; i < this.length; i++) {
                ret.add(this[i][prop], ret);
            }
        }
        return ret;
    }
    Array.prototype.toQuerable = function()
    {
        return new $.Querable(this);
    }
    Array.prototype.removeAt = function (dx) {
        if (isNaN(dx) || dx > this.length) { return false; }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this[i] != this[dx]) {
                this[n++] = this[i]
            }
        }
        this.length -= 1
    }
    //Date.prototype.Format = function (fmt) { //author: meizz 
    //    var o = {
    //        "M+": this.getMonth() + 1, //月份 
    //        "d+": this.getDate(), //日 
    //        "h+": this.getHours(), //小时 
    //        "m+": this.getMinutes(), //分 
    //        "s+": this.getSeconds(), //秒 
    //        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    //        "S": this.getMilliseconds() //毫秒 
    //    };
    //    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    //    for (var k in o)
    //        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    //    return fmt;
    //}

    //Number重写toFixed，统一四舍五入,屏蔽chrome,firefox的5凑偶
    Number.prototype.toFixed = function (len) {
        if (isNaN(this))
            return NaN;

        var value = Math.abs(this);
        var tempNum = 0;
        var s, temp;
        var s1 = this + "";
        var start = s1.indexOf(".");

        //截取小数点后,0之后的数字，判断是否大于5，如果大于5这入为1  

        if (start >= 0) {
            var pos = start + (len / 1) + 1;
            if (pos < s1.length && s1.substr(pos, 1) >= 5)
                tempNum = 1;
        }

        //计算10的len次方,把原数字扩大它要保留的小数位数的倍数  
        var temp = Math.pow(10, len);
        //求最接近this * temp的最小数字  
        //floor() 方法执行的是向下取整计算，它返回的是小于或等于函数参数，并且与之最接近的整数  
        s = Math.floor(Math.AccMul(value, temp)) + tempNum;
        return (this < 0) ? -Math.AccDiv(s, temp) : Math.AccDiv(s, temp);
    };

    //-----------扩展end----------------//


    function propareNumbericValue(value) {
        //var numericReg = /[^0-9|\.|\-|\+]/ig;
        if (!value)
            return 0;
        value = parseFloat(value.toString());
        if (!value)
            return 0;
        return value;
    }

    function testNumbericValue(value)
    {
        if (value == null || value == undefined || isNaN(value))
            return false;
        value = parseFloat(value.toString());
        if (value == null || value == undefined || isNaN(value))
            return false;
        return true;
    }

    //除法函数，用来得到精确的除法结果
    //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
    //调用：accDiv(arg1,arg2)
    //返回值：arg1除以arg2的精确结果
    Math.AccDiv = function (arg1, arg2) {
        arg1 = propareNumbericValue(arg1);
        arg2 = propareNumbericValue(arg2);
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }
    //乘法函数，用来得到精确的乘法结果
    //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
    //调用：accMul(arg1,arg2)
    //返回值：arg1乘以arg2的精确结果
    Math.AccMul = function (arg1, arg2) {
        arg1 = propareNumbericValue(arg1);
        arg2 = propareNumbericValue(arg2);
        var m = 0;
        var s1 = arg1.toString();
        var s2 = arg2.toString();

        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }

        return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
    }
    //加法函数，用来得到精确的加法结果
    //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    //调用：accAdd(arg1,arg2)
    //返回值：arg1加上arg2的精确结果
    Math.AccAdd = function (arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg1 = propareNumbericValue(arg1);
        arg2 = propareNumbericValue(arg2);
        arg3 = propareNumbericValue(arg3);
        arg4 = propareNumbericValue(arg4);
        arg5 = propareNumbericValue(arg5);
        arg6 = propareNumbericValue(arg6);
        arg7 = propareNumbericValue(arg7);
        arg8 = propareNumbericValue(arg8);
        var r1, r2, r3, r4, r5, r6, r7, r8, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        try { r3 = arg3.toString().split(".")[1].length } catch (e) { r3 = 0 }
        try { r4 = arg4.toString().split(".")[1].length } catch (e) { r4 = 0 }
        try { r5 = arg5.toString().split(".")[1].length } catch (e) { r5 = 0 }
        try { r6 = arg6.toString().split(".")[1].length } catch (e) { r6 = 0 }
        try { r7 = arg7.toString().split(".")[1].length } catch (e) { r7 = 0 }
        try { r8 = arg8.toString().split(".")[1].length } catch (e) { r8 = 0 }
        m = Math.pow(10, Math.max(r1, r2, r3, r4, r5, r6, r7, r8));
        return (arg1 * m + arg2 * m + arg3 * m + arg4 * m + arg5 * m + arg6 * m + arg7 * m + arg8 * m) / m;
    }

    //提高加法的精度
    Math.AccAddEx = function (arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg1 = propareNumbericValue(arg1);
        arg2 = propareNumbericValue(arg2);
        arg3 = propareNumbericValue(arg3);
        arg4 = propareNumbericValue(arg4);
        arg5 = propareNumbericValue(arg5);
        arg6 = propareNumbericValue(arg6);
        arg7 = propareNumbericValue(arg7);
        arg8 = propareNumbericValue(arg8);
        var r1, r2, r3, r4, r5, r6, r7, r8, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        try { r3 = arg3.toString().split(".")[1].length } catch (e) { r3 = 0 }
        try { r4 = arg4.toString().split(".")[1].length } catch (e) { r4 = 0 }
        try { r5 = arg5.toString().split(".")[1].length } catch (e) { r5 = 0 }
        try { r6 = arg6.toString().split(".")[1].length } catch (e) { r6 = 0 }
        try { r7 = arg7.toString().split(".")[1].length } catch (e) { r7 = 0 }
        try { r8 = arg8.toString().split(".")[1].length } catch (e) { r8 = 0 }
        m = Math.pow(10, Math.max(r1, r2, r3, r4, r5, r6, r7, r8));
        return (Math.AccMul(arg1, m) + Math.AccMul(arg2, m) + Math.AccMul(arg3, m) + Math.AccMul(arg4, m) + Math.AccMul(arg5, m) + Math.AccMul(arg6, m) + Math.AccMul(arg7, m) + Math.AccMul(arg8, m)) / m;
    }
    //减法函数
    Math.AccSub = function (arg1, arg2) {
        if (testNumbericValue(arg1) || testNumbericValue(arg2)) {
            arg1 = propareNumbericValue(arg1);
            arg2 = propareNumbericValue(arg2);
            var r1, r2, m, n;
            try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
            try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
            m = Math.pow(10, Math.max(r1, r2));

            //动态控制精度长度
            n = (r1 >= r2) ? r1 : r2;
            return ((arg2 * m - arg1 * m) / m).toFixed(n);
        }
    }
    //转换为带小数点的数字
    Math.Format = function (_value, _decimalPlaces) {
        _value = propareNumbericValue(_value);
        //process dots
        var _value = _value.toString();
        var _dotIndex = _value.indexOf(".");
        if (_value == "") _value = 0;
        if (_decimalPlaces <= 0 && _dotIndex >= 0) {
            if (_dotIndex == 0) _value = "0." + _value;
            return _value;
        }

        if (_dotIndex > 0) {
            var _tempStr = _value.substr(_dotIndex, _value.length - _dotIndex);
            var _dotNum = _tempStr.length - 1;

            if (_tempStr.length - 1 > _decimalPlaces) {
                _value = _value.substring(0, _dotIndex) + _tempStr.substring(0, _decimalPlaces + 1);
            }
            else {
                for (var i = _dotNum; i < _decimalPlaces; i++) {
                    _value = _value + "0";
                }
            }
        }
        else if (_decimalPlaces > 0) {
            _value = _value + ".0";

            for (var i = 1; i < _decimalPlaces; i++) {
                _value = _value + "0";
            }
        }

        return _value;
    }

    Math.AccMul.Quantity = function (arg1, arg2) {
        var precision = (config && config.businessOptions.QuantityPrecision ? config.businessOptions.QuantityPrecision : 4);
        arg1 = propareNumbericValue(arg1);
        arg2 = propareNumbericValue(arg2);
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) { }
        try { m += s2.split(".")[1].length } catch (e) { }
        return (Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)).toFixed(precision);
    }
    if (!String.prototype.trim)
        String.prototype.trim = function () { return Trim(this); };
    function LTrim(str) {
        var i;
        for (i = 0; i < str.length; i++) {
            if (str.charAt(i) != " " && str.charAt(i) != " ") break;
        }
        str = str.substring(i, str.length);
        return str;
    }
    function RTrim(str) {
        var i;
        for (i = str.length - 1; i >= 0; i--) {
            if (str.charAt(i) != " " && str.charAt(i) != " ") break;
        }
        str = str.substring(0, i + 1);
        return str;
    }
    function Trim(str) {
        return LTrim(RTrim(str));
    }
})(jQuery)