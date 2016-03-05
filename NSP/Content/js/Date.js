//---------------------------------------------------   
// 判断闰年   
//---------------------------------------------------   
Date.prototype.isLeapYear = function () {
    if (!this)
        return false;
    return (0 == this.getYear() % 4 && ((this.getYear() % 100 != 0) || (this.getYear() % 400 == 0)));
};

Date.Format = function (date, formatStr)
{
    if(date)
    {
        return date.Format(formatStr);
    }
    return "";
}

Date.Compare = function (date1, date2) {
    var d1 = Date.StringToDate(date1);
    var d2 = Date.StringToDate(date2);
    if (d1) {
        if (d2)
        {
            return d1 > d2 ? 1 : (d1 < d2 ? -1 : 0);
        }
        return 1;
    }
    if (d2)
        return -1;
    return 0;
}

//---------------------------------------------------   
// 日期格式化   
// 格式 YYYY/yyyy/YY/yy 表示年份   
// MM/M 月份   
// W/w 星期   
// dd/DD/d/D 日期   
// hh/HH/h/H 时间   
// mm/m 分钟   
// ss/SS/s/S 秒   
//---------------------------------------------------   
Date.prototype.Format = function (formatStr) {
    if (!this)
        return "";

    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

    var M = this.getMonth() + 1;
    str = str.replace(/MM/, M > 9 ? M.toString() : '0' + M);
    str = str.replace(/M/g, M);

    str = str.replace(/w|W/g, Week[this.getDay()]);

    var d = this.getDate();
    str = str.replace(/dd|DD/, d > 9 ? d.toString() : '0' + d);
    str = str.replace(/d|D/g, d);

    var h = this.getHours();
    str = str.replace(/hh|HH/, h > 9 ? h.toString() : '0' + h);
    str = str.replace(/h|H/g, h);
    var m = this.getMinutes();
    str = str.replace(/mm/, m > 9 ? m.toString() : '0' + m);
    str = str.replace(/m/g, m);

    var s = this.getSeconds();
    str = str.replace(/ss|SS/, s > 9 ? s.toString() : '0' + s);
    str = str.replace(/s|S/g, s);

    return str;
};
   
//+---------------------------------------------------   
//| 求两个时间的天数差 日期格式为 YYYY-MM-dd    
//+---------------------------------------------------   
function daysBetween(DateOne, DateTwo) {
    var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
    var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
    var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

    var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
    var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
    var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

    var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
    return Math.abs(cha);
};
   
   
//+---------------------------------------------------   
//| 日期计算   
//+---------------------------------------------------   
Date.prototype.DateAdd = function (strInterval, number) {
    if (!this)
        return;
    var date = this; 
    switch (strInterval) {
        case "y": return new Date(date.setFullYear(date.getFullYear() + number));
        case "m": return new Date(date.setMonth(date.getMonth() + number));
        case "d": return new Date(date.setDate(date.getDate() + number));
        case "w": return new Date(date.setDate(date.getDate() + 7 * number));
        case "h": return new Date(date.setHours(date.getHours() + number));
        case "n": return new Date(date.setMinutes(date.getMinutes() + number));
        case "s": return new Date(date.setSeconds(date.getSeconds() + number));
        case "l": return new Date(date.setMilliseconds(date.getMilliseconds() + number));
    }
};
   
//+---------------------------------------------------   
//| 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串   
//+---------------------------------------------------   
Date.prototype.DateDiff = function (interval, dtEnd, margin) {
    if (!this)
        return;
    if (!margin)
        margin = 0;

    var dtStart = this;
    if (typeof dtEnd == 'string')//如果是字符串转换为日期型   
    {
        dtEnd = Date.StringToDate(dtEnd);
    }
    if (dtEnd) {
        var long = dtEnd.getTime() - dtStart.getTime(); //相差毫秒
        switch (interval.toLowerCase()) {
            case "y": return parseInt(dtEnd.getFullYear() - dtStart.getFullYear()) + margin;
            case "m": return parseInt((dtEnd.getFullYear() - dtStart.getFullYear()) * 12 + (dtEnd.getMonth() - dtStart.getMonth())) + margin;
            case "d": return parseInt(long/1000/60 / 60 / 24) + margin;
            case "w": return parseInt(long/1000/60 / 60 / 24 / 7) + margin;
            case "h": return parseInt(long/1000/60 / 60) + margin;
            case "n": return parseInt(long/1000/60) + margin;
            case "s": return parseInt(long/1000) + margin;
            case "l": return parseInt(long) + margin;
        }
    }
};
   
//+---------------------------------------------------   
//| 日期输出字符串，重载了系统的toString方法   
// 为兼容ie11 toLocaleDateString 调用 toString 产生递归
//+---------------------------------------------------  
Date.prototype.sysDateToString = Date.prototype.toString;
Date.prototype.toString = function (showWeek) {
    if (!this)
        return "";
    var str;
    if (!this.isOld) {
        this.isOld = true;
        try {
            var myDate = this;
            str = myDate.toLocaleDateString();
            if (showWeek) {
                var Week = ['日', '一', '二', '三', '四', '五', '六'];
                str += ' 星期' + Week[myDate.getDay()];
            }
        } finally {
            delete this.isOld;
        }
    } else {
        str = Date.prototype.sysDateToString.call(this, arguments);
    }
    return str;
};
   
//+---------------------------------------------------   
//| 日期合法性验证   
//| 格式为：YYYY-MM-DD或YYYY/MM/DD   
//+---------------------------------------------------   
function IsValidDate(DateStr) {
    if (!DateStr)
        return false;

    var sDate = DateStr.replace(/(^\s+|\s+$)/g, ''); //去两边空格;    
    if (sDate == '') return true;
    //如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''    
    //数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式    
    var s = sDate.replace(/[\d]{ 4,4 }[\-/]{ 1 }[\d]{ 1,2 }[\-/]{ 1 }[\d]{ 1,2 }/g, '');
    if (s == '') //说明格式满足YYYY-MM-DD或YYYY-M-DD或YYYY-M-D或YYYY-MM-D    
    {
        var t = new Date(sDate.replace(/\-/g, '/'));
        var ar = sDate.split(/[-/:]/);
        if (ar[0] != t.getYear() || ar[1] != t.getMonth() + 1 || ar[2] != t.getDate()) {
            //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');    
            return false;
        }
    }
    else {
        //alert('错误的日期格式！格式为：YYYY-MM-DD或YYYY/MM/DD。注意闰年。');    
        return false;
    }
    return true;
};
   
//+---------------------------------------------------   
//| 日期时间检查   
//| 格式为：YYYY-MM-DD HH:MM:SS   
//+---------------------------------------------------   
function CheckDateTime(str) {
    var reg = /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/;
    var r = str.match(reg);
    if (r == null) return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
    if (d.getFullYear() != r[1]) return false;
    if (d.getMonth() != r[2]) return false;
    if (d.getDate() != r[3]) return false;
    if (d.getHours() != r[4]) return false;
    if (d.getMinutes() != r[5]) return false;
    if (d.getSeconds() != r[6]) return false;
    return true;
};
   
//+---------------------------------------------------   
//| 把日期分割成数组   
//+---------------------------------------------------   
Date.prototype.toArray = function () {
    if (!this)
        return;
    var myDate = this;
    var myArray = Array();
    myArray[0] = myDate.getFullYear();
    myArray[1] = myDate.getMonth();
    myArray[2] = myDate.getDate();
    myArray[3] = myDate.getHours();
    myArray[4] = myDate.getMinutes();
    myArray[5] = myDate.getSeconds();
    return myArray;
};
   
//+---------------------------------------------------   
//| 取得日期数据信息   
//| 参数 interval 表示数据类型   
//| y 年 m月 d日 w星期 ww周 h时 n分 s秒   
//+---------------------------------------------------   
Date.prototype.DatePart = function (interval) {
    if (!this)
        return;
    var myDate = this;
    var partStr = '';
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    switch (interval) {
        case 'y': partStr = myDate.getFullYear(); break;
        case 'm': partStr = myDate.getMonth() + 1; break;
        case 'd': partStr = myDate.getDate(); break;
        case 'w': partStr = Week[myDate.getDay()]; break;
        case 'ww': partStr = myDate.WeekNumOfYear(); break;
        case 'h': partStr = myDate.getHours(); break;
        case 'n': partStr = myDate.getMinutes(); break;
        case 's': partStr = myDate.getSeconds(); break;
    }
    return partStr;
};
   
//+---------------------------------------------------   
//| 取得当前日期所在月的最大天数   
//+---------------------------------------------------   
Date.prototype.MaxDayOfDate = function () {
    if (!this)
        return;
    var myDate = this;
    var myDate = this;
    var ary = myDate.toArray();
    var date1 = (new Date(ary[0], ary[1] + 1, 1));
    var date2 = date1.dateAdd(1, 'm', 1);
    var result = dateDiff(date1.Format('yyyy-MM-dd'), date2.Format('yyyy-MM-dd'));
    return result;
};
   
//+---------------------------------------------------   
//| 取得当前日期所在周是一年中的第几周   
//+---------------------------------------------------   
Date.prototype.WeekNumOfYear = function () {
    if (!this)
        return;
    var myDate = this;
    var myDate = this;
    var ary = myDate.toArray();
    var year = ary[0];
    var month = ary[1] + 1;
    var day = ary[2];
    document.write('< script language=VBScript\> \n');
    document.write("myDate = DateValue(''+month+'-'+day+'-'+year+'') \n");
    document.write("result = DatePart('ww', myDate) \n");
    document.write(' \n');
    return result;
};
   
//+---------------------------------------------------   
//| 字符串转成日期类型    
//| 格式 MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd   
//+---------------------------------------------------   
Date.StringToDate = function (DateStr) {
    if (DateStr) {
        DateStr = DateStr.toString();
        var converted = Date.parse(DateStr);
        var myDate = new Date(converted);
        if (isNaN(myDate)) {
            //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';   
            var str = DateStr.split(/T| /);
            var arys = str[0].split('-');
            var y = 1985;
            var m = 2;
            var d = 27;
            if (arys.length > 0) {
                y = parseInt(arys[0], 10);
                if (arys.length > 1) {
                    m = parseInt(arys[1], 10);
                    if (arys.length > 2) {
                        d = parseInt(arys[2], 10);
                    }
                }
            }
            var h = 0;
            var t = 0;
            var s = 0;
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                if (str.length > 1) {
                    var tms = str[1].split(":");
                    if (tms.length > 0) {
                        h = parseInt(tms[0], 10);
                        if (tms.length > 1) {
                            t = parseInt(tms[1], 10);
                            if (tms.length > 2) {
                                s = parseInt(tms[2], 10);
                            }
                        }
                    }
                    if (!isNaN(h) && !isNaN(t) && !isNaN(s)) {
                        return new Date(y, --m, d, h, t, s);
                    }
                }
                return new Date(y, --m, d);
            }
        } else
            return myDate;
    }
};
Date.stringReg = /^\s*(\d{2,4}\s*[-|/]\s*\d{2}\s*[-|/]\s*\d{2})\s*(T\s*\d{2}\s*:\s*\d{2}\s*:\s*\d{2}(.\d{2,4})?\s*(\+\s*\d{2}\s*:\s*\d{2})?\s*)?$/i;
Date.isDateString = function (DateStr) {
    if (DateStr) {
        return Date.stringReg.test(DateStr);
    }
    return false;
};
