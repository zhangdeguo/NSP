var _WeightCache = {};//件重缓存
var Tools = {
    //-----------工具类定义start----------------//
    getActionURI: function (action, pa) {
        return config.businessOptions.PageFunRouterURL + "?act=" + action + "&json=" + O2String(pa);
    }
    , getFullUrl: function (path, param) {
        var idx = path.lastIndexOf("?");
        if (idx >= 0) {
            var idx2 = path.lastIndexOf("&");
            if (idx < path.length && idx2 < path.length)
                return path + "&" + Tools.OToGetParamStr(param);
            else
                return path + Tools.OToGetParamStr(param);
        }
        return path + "?" + Tools.OToGetParamStr(param);
    }
    , getQueryNumeric: function (pname) {
        var pv = parseFloat(Tools.getQueryString(pname));
        if ($.isNumeric(pv))
            return pv;
    }
    // QueryString提取
, getQueryString: function (pname) {
    var quup = Tools.GetUpcaseQueryArgs();
    if (pname)
        return quup[pname.toUpperCase()];
    return "";
}
, currentQuery: null
, upcaseQuery: null
    //对象转成p1=v1&p2=v2
, OToGetParamStr: function (obj) {
    var pstr = "";
    for (var p in obj) {
        pstr += p + "=" + escape(obj[p]) + "&";
    }
    return pstr;
}
, GetUpcaseQueryArgs: function () {
    if (Tools.upcaseQuery == null) {
        Tools.upcaseQuery = {};
        var qu = Tools.GetQueryArgs();
        $.each(qu, function (key, value) {
            Tools.upcaseQuery[key.toUpperCase()] = value;
        })
    }
    return Tools.upcaseQuery;
}
    //p1=v1&p2=v2转成对象
, GetQueryArgs: function () {
    if (Tools.currentQuery == null) {
        Tools.currentQuery = {};
        var query = location.search.substring(1); // Get query string
        var pairs = query.split("&"); // Break at ampersand
        for (var i = 0; i < pairs.length; i++) {
            var vs = pairs[i].split('=');
            if (vs.length > 0) {
                var argname = $.trim(vs[0].toString()); // Extract the name
                if (argname != "") {
                    var value = vs.length > 1 ? vs[1] : ""; // Extract the value
                    value = decodeURIComponent(value); // Decode it, if needed
                    Tools.currentQuery[argname] = value; // Store as a property
                }
            }
        }
    }
    return Tools.currentQuery; // Return the object
}

    //--------------查询条件 start--------------//
, O2String: function (O) {
    //return JSON.stringify(jsonobj); 

    var S = [];
    var J = "";
    if (O != null && O !== undefined && typeof (O) != "undefined") {
        var prototype = Object.prototype.toString.apply(O);
        if (prototype === '[object Number]') {
            J = O;
        }
        else if (prototype === '[object Array]') {
            for (var i = 0; i < O.length; i++) {
                if (O[i])
                    S.push(this.O2String(O[i]));
            }
            J = '[' + S.join(',') + ']';
        }
        else if (prototype === '[object String]') {
            J = '"' + O + '"';
        }
        else if (prototype === '[object Null]') {
            J = '""';
        }
        else if (prototype === '[object Date]') {
            J = "new Date(" + O.getTime() + ")";
        }
        else if (prototype === '[object RegExp]' || prototype === '[object Function]') {
            J = O.toString();
        }
        else if (prototype === '[object Object]') {
            for (var i in O) {
                if (O[i] != null && typeof (O[i]) != "undefined") {
                    var v = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? this.O2String(O[i]) : O[i]);
                    if (i == "") continue;
                    S.push("\"" + i + "\"" + ':' + v);
                }
            }
            J = '{' + S.join(',') + '}';
        }
    }
    return J;
},
    String2O: function (str) {
        var prototype = Object.prototype.toString.apply(str);
        if (prototype === '[object String]') {
            str = $.trim(str);
            if (str != undefined && str != null && str != "")
                return eval("(" + str + ")");
        }
        return str;
    },
    //--------------主表初始化 end--------------//
    getCommQueryParams: function (searchConditions) {
        var data = {};
        data.params = [];
        data.wheres = [];
        data.inputs = [];
        var mid = "#" + searchConditions.searchboxid;
         
        //浮动panel
        var eid = mid + '_ext';
        var inputs = $("*[col]", $(mid + ',' + eid));
        inputs.each(function () {
            var curObj = $(this);
            var pname = curObj.attr("id");
            var val = "";
            if (curObj.is('.textbox-f')) {
                //由于对easyui的控件取值没有用标准方法getvalue,对某些控件设置特殊的取值方式
                val = curObj.textbox("getValue");
            }
            else {
                var ele = $(this).parent().find("*[name='" + pname + "']");
                val = ele.val();
            }

            var onGetValue = curObj.data("onGetValue");
            if ($.isFunction(onGetValue)) {
                val = onGetValue.call(curObj, val, searchConditions);
            }
            if (val && val.length > 0)
                val = val.replace("[", "%").replace("]", "%");
            
            var LExp = $(this).attr("col");
            Condition = $(this).attr("oper");
            if (Condition == 'Param') {
                if (LExp) {
                    var w = {};
                    if (val && val.length > 0) {
                        w.LExp = LExp;
                        w.RExp = "@" + pname;
                        data.params.push(w);
                        var v = {};
                        v.LExp = "@" + pname;
                        v.RExp = val === "ISNULL" ? "-1" : val;
                        data.inputs.push(v);
                    } else {
                        w.LExp = LExp;
                        w.RExp = "DEFAULT";
                        data.params.push(w);
                    }
                }
            } else {
                if (val && val.length > 0) {
                    if (val === "ISNULL")
                        Condition = "IsNull";
                    if (LExp && Condition) {
                        var w = {};
                        w.LExp = LExp;
                        w.RExp = "@" + pname;
                        w.Condition = Condition;
                        data.wheres.push(w);
                        var v = {};
                        v.LExp = "@" + pname;
                        v.RExp = val;
                        if (w.Condition == "Like") v.RExp = "%" + v.RExp + "%";
                        data.inputs.push(v);
                    }
                }
            }
        });

        for (var i = 0; i < data.wheres.length; i++) {
            if (i != data.wheres.length - 1)
                data.wheres[i].AndOr = "AND";
        }
        return data;
        //var data = {};
        //data.wheres = [];
        //data.inputs = [];
        //var ele;
        //for (var i = 0; i < searchConditions.items.length; i++) {
        //    var pname = searchConditions.searchboxid + "_" + searchConditions.items[i].filed.replace('.', '_') + i;
        //    ele = $("*[name='" + pname + "'], textarea[name='" + pname + "']");
        //    if (ele.val().length > 0) {
        //        var w = {};
        //        w.LExp = searchConditions.items[i].filed;
        //        w.RExp = "@" + pname;//searchConditions.items[i].filed;
        //        w.Condition = searchConditions.items[i].oper;
        //        if (i != searchConditions.items.length - 1);
        //        data.wheres.push(w);
        //        var v = {};
        //        v.LExp = "@" + pname;//searchConditions.items[i].filed;
        //        v.RExp = $("*[name='" + pname + "']").val();//ele.val()
        //        if (w.Condition == "Like") v.RExp = "%" + v.RExp + "%";
        //        data.inputs.push(v);
        //    }
        //}
        //for (var i = 0; i < data.wheres.length; i++) {
        //    if (i != data.wheres.length - 1)
        //        data.wheres[i].AndOr = "AND";
        //}
        //return data;
    },
    getSearchParams: function (searchConditions) {
    var data = {};
    var mid = "#" + searchConditions.searchboxid;
         
        //浮动panel
    var eid = mid + '_ext';
    var inputs = $("*[col]", $(mid + ',' + eid));
    inputs.each(function () {
        var curObj = $(this);
        var pname = curObj.attr("id");
        var val = "";
        if (curObj.is('.textbox-f')) {
            //由于对easyui的控件取值没有用标准方法getvalue,对某些控件设置特殊的取值方式
            val = curObj.textbox("getValue");
        }
        else {
            var ele = $(this).parent().find("*[name='" + pname + "']");
            val = ele.val();
        }

        var onGetValue = curObj.data("onGetValue");
        if ($.isFunction(onGetValue)) {
            val = onGetValue.call(curObj, val, searchConditions);
        }
        if (val && val.length > 0)
            val = val.replace("[", "%").replace("]", "%");
            
        var LExp = $(this).attr("col");
        data[LExp] = val;
    });
    return data;      
}
 , DateSmaller: function (val) {
     if (Date.isDateString(val)) {
         return Date.StringToDate(Date.StringToDate(val).DateAdd('d', 1).Format('yyyy-MM-dd') + " 00:00:00").DateAdd('s', -1).Format('yyyy-MM-dd HH:mm:ss');
     }
 }
 , removeCommQueryParam: function (params, key) {
     for (var i = 0; i < params.length; i++) {
         var item = params[i];
         if (item.LExp == '@' + key) {
             item.LExp = '';
             break;
         }
     }
 }
,
    getCommQueryParamValue: function (params, key) {
        for (var i = 0; i < params.length; i++) {
            var item = params[i];
            if (item.LExp == '@' + key) {
                return item.RExp;
            }
        }
    }
 , calc_HJ: function (fields, hjname) {
     if (hjname == undefined || hjname == null) hjname = "btns";
     var obj = {};
     obj[hjname] = -100;
     var mt = $('#mainTable');
     var rows = mt.datagrid("getRows");
     for (var i = 0; i < rows.length; i++) {
         var row = rows[i];
         var index = mt.datagrid("getRowIndex", row);
         if (fields && fields.length > 0) {
             for (var j = 0; j < fields.length; j++) {
                 var field = fields[j];
                 if (obj[field] == undefined || obj[field] == null)
                     obj[field] = 0;
                 var ed = mt.datagrid('getEditor', { index: index, field: field });
                 if ($.valid(ed)) {
                     if ($(ed.target).val() != "")
                         obj[field] = parseFloat(obj[field]) + parseFloat($(ed.target).val());
                 } else {
                     if (row[field] != undefined && row[field] != "")
                         obj[field] = parseFloat(obj[field]) + parseFloat(row[field]);
                 }
             }
         }
     }
     return obj;
 },
    sum: function (rows, fields, hjname) {
        if (hjname == undefined || hjname == null) hjname = "btns";
        var obj = {};
        obj[hjname] = -100;
        for (var j = 0; j < fields.length; j++) {
            obj[fields[j]] = 0;
        }
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (fields && fields.length > 0) {
                for (var j = 0; j < fields.length; j++) {
                    var field = fields[j];
                    var val = parseFloat(row[field]);
                    if (isNaN(val))
                        val = 0;
                    obj[field] += val;
                }
            }
        }
        return obj;
    },
    removeEditor: function (tbid, param) {
        if (param instanceof Array) {
            $.each(param, function (index, item) {
                var e = $(tbid).datagrid('getColumnOption', item);
                if (e != undefined && e != null)
                    e.editor = {};
            });
        } else {
            var e = $(tbid).datagrid('getColumnOption', param);
            e.editor = {};
        }
    },
    addEditor: function (tbid, param) {
        if (param instanceof Array) {
            $.each(param, function (index, item) {
                var e = $(tbid).datagrid('getColumnOption', item.field);
                if (e != undefined && e != null)
                    e.editor = item.editor;
            });
        } else {
            var e = $(tbid).datagrid('getColumnOption', param.field);
            e.editor = param.editor;
        }
    },
    bindEditCellEvent: function (index, field, event, callback) {
        var ed = $('#mainTable').datagrid('getEditor', { index: index, field: field });
        if (ed != null) {
            $(ed.target).bind(event, function () {
                if ($.isFunction(callback))
                    callback();
            });
        }
    },
    bindEditCellCalcComAmountEvent: function (index, fieldAmount, fieldQuantity, fieldPrice, event, callback) {
        var numericReg = /[^0-9|\.|\-|\+]/ig;

        var edAmount = $('#mainTable').datagrid('getEditor', { index: index, field: fieldAmount });
        var edQuantity = $('#mainTable').datagrid('getEditor', { index: index, field: fieldQuantity });
        var edPrice = $('#mainTable').datagrid('getEditor', { index: index, field: fieldPrice });

        function calcComAmount(me) {

            if (me.attr('issel') == 1) {
                me.attr('issel', 0);
                var val1 = $(edQuantity.target).val().replace(numericReg, '');
                var val2 = $(edPrice.target).val().replace(numericReg, '').replace('', '');
                var amount = Math.AccMul(parseFloat(val1), parseFloat(val2));
                $(edAmount.target).val(amount);
                edAmount.actions.setValue(edAmount.target, amount);
            }
            if ($.isFunction(callback)) {
                callback();
            }
        }

        if (edAmount != null) {
            $(edAmount.target).bind(event, function () {
                calcComAmount($(this));
            });
        }
        if (edQuantity != null) {
            $(edQuantity.target).bind(event, function () {
                calcComAmount($(this));
            });
        }
        if (edPrice != null) {
            $(edPrice.target).bind(event, function () {
                calcComAmount($(this));
            });
        }
    },
    bindEditCellCalcComAmountClieckEvent: function (index, fieldAmount, fieldQuantity, fieldPrice) {

        var edQuantity = $('#mainTable').datagrid('getEditor', { index: index, field: fieldQuantity });
        var edPrice = $('#mainTable').datagrid('getEditor', { index: index, field: fieldPrice });

        if (edQuantity != null) {
            $(edQuantity.target).bind('focus', function () {
                $(this).attr('issel', 1);
            });
        }
        if (edPrice != null) {
            $(edPrice.target).bind('focus', function () {
                $(this).attr('issel', 1);
            });
        }
    },
    onSelectCalcComAmount: function (rowIndex, fieldAmount, fieldQuantity, fieldPrice, ent) {
        if (ent == undefined) ent = "blur";
        Tools.bindEditCellCalcComAmountEvent(rowIndex, fieldAmount, fieldQuantity, fieldPrice, ent, loadS_HJ);
        //当鼠标获取焦点后，在对象上设置一个标示值，只有标示值为“1”的时候采取进行计算
        Tools.bindEditCellCalcComAmountClieckEvent(rowIndex, fieldAmount, fieldQuantity, fieldPrice);
    }
    ,
    //其它回调方法调用
    calcComAmount: function (index, fieldAmount, fieldQuantity, fieldPrice, callback) {
        var numericReg = /[^0-9|\.|\-|\+]/ig;
        var edAmount = $('#mainTable').datagrid('getEditor', { index: index, field: fieldAmount });
        var edQuantity = $('#mainTable').datagrid('getEditor', { index: index, field: fieldQuantity });
        var edPrice = $('#mainTable').datagrid('getEditor', { index: index, field: fieldPrice });

        var val1 = $(edQuantity.target).val().replace(numericReg, '');
        var val2 = $(edPrice.target).val().replace(numericReg, '').replace('', '');
        var amount = Math.AccMul(parseFloat(val1), parseFloat(val2));
        $(edAmount.target).val(amount);
        edAmount.actions.setValue(edAmount.target, amount);
        if ($.isFunction(callback)) {
            callback();
        }
    },
    NoToChinese: function (num) {
        if (!/^\d*(\.\d*)?$/.test(num)) { alert("Number is wrong!"); return "Number is wrong!"; }
        var AA = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
        var BB = new Array("", "拾", "佰", "仟", "萬", "億", "点", "");
        var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
        for (var i = a[0].length - 1; i >= 0; i--) {
            switch (k) {
                case 0: re = BB[7] + re; break;
                case 4: if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                    re = BB[4] + re; break;
                case 8: re = BB[5] + re; BB[7] = BB[5]; k = 0; break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
            if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re; k++;
        }

        if (a.length > 1) //加上小数部分(如果有小数部分) 
        {
            re += BB[6];
            for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
        }
        return re;
    },
    convertNumberToChinese: function (currencyDigits, unit) {
        if (isNaN(currencyDigits)) {
            alert("不是一个有效的数字，请重新输入！");
        }
        else {
            var money1 = new Number(currencyDigits);
            if (money1 > 1000000000000000000) {
                alert("您输入的数字太大，重新输入！");
                return;
            }
            var monee = Math.round(money1 * 100).toString(10)
            var i, j;
            j = 0;
            var leng = monee.length;
            var monval = "";
            for (i = 0; i < leng; i++) {
                monval = monval + Tools.to_upper(monee.charAt(i)) + Tools.to_mon(leng - i - 1);
            }
            return Tools.repace_acc(monval);
        };

    },
    to_upper: function to_upper(a) {
        switch (a) {
            case '0': return '零'; break;
            case '1': return '壹'; break;
            case '2': return '贰'; break;
            case '3': return '叁'; break;
            case '4': return '肆'; break;
            case '5': return '伍'; break;
            case '6': return '陆'; break;
            case '7': return '柒'; break;
            case '8': return '捌'; break;
            case '9': return '玖'; break;
            default: return '';
        }
    },
    to_mon: function to_mon(a) {
        if (a > 10) {
            a = a - 8;
            return (to_mon(a));
        }
        switch (a) {
            case 0: return '分'; break;
            case 1: return '角'; break;
            case 2: return '元'; break;
            case 3: return '拾'; break;
            case 4: return '佰'; break;
            case 5: return '仟'; break;
            case 6: return '万'; break;
            case 7: return '拾'; break;
            case 8: return '佰'; break;
            case 9: return '仟'; break;
            case 10: return '亿'; break;
        }
    },
    repace_acc: function repace_acc(Money) {
        Money = Money.replace("零分", "");
        Money = Money.replace("零角", "零");
        var yy;
        var outmoney;
        outmoney = Money;
        yy = 0;
        while (true) {
            var lett = outmoney.length;
            outmoney = outmoney.replace("零元", "元");
            outmoney = outmoney.replace("零万", "万");
            outmoney = outmoney.replace("零亿", "亿");
            outmoney = outmoney.replace("零仟", "零");
            outmoney = outmoney.replace("零佰", "零");
            outmoney = outmoney.replace("零零", "零");
            outmoney = outmoney.replace("零拾", "零");
            outmoney = outmoney.replace("亿万", "亿零");
            outmoney = outmoney.replace("万仟", "万零");
            outmoney = outmoney.replace("仟佰", "仟零");
            yy = outmoney.length;
            if (yy == lett) break;
        }
        yy = outmoney.length;
        if (outmoney.charAt(yy - 1) == '零') {
            outmoney = outmoney.substring(0, yy - 1);
        }
        yy = outmoney.length;
        if (outmoney.charAt(yy - 1) == '元') {
            outmoney = outmoney + '整';
        }
        return outmoney;
    },
    //品名规格、产地 、材质 得到 件重
    loadUnitWeight: function (obj, inputOptions) {
        if (_isBeforeBeginEdit == true) {
            return;
        }
        var val = "";
        var editors = $("#mainTable").datagrid("getEditorsWithElement", obj);
        var vSpecificationsId = 0;
        var vOrigin = 0;
        var vMaterialId = 0;
        var vLength = "";
        if ($.valid(obj)) {
            if ($.valid(editors.SpecificationsId))
                vSpecificationsId = editors.SpecificationsId.actions.getValue(editors.SpecificationsId.target);
            if ($.valid(editors.Origin))
                vOrigin = editors.Origin.actions.getValue(editors.Origin.target);
            if ($.valid(editors.MaterialId))
                vMaterialId = editors.MaterialId.actions.getValue(editors.MaterialId.target);
            if ($.valid(editors.Length))
                vLength = editors.Length.actions.getValue(editors.Length.target);

        }
        if (vMaterialId == null)
        {
            vMaterialId = 0;
        }
        if ($.valid(inputOptions) && $.valid(inputOptions.inputSpecificationsId))
            vSpecificationsId = inputOptions.inputSpecificationsId;
        if ($.valid(inputOptions) && $.valid(inputOptions.inputOrigin))
            vOrigin = inputOptions.inputOrigin;
        if ($.valid(inputOptions) && $.valid(inputOptions.inputMaterialId))
            vMaterialId = inputOptions.inputMaterialId;
        if ($.valid(inputOptions) && $.valid(inputOptions.Length))
            vLength = inputOptions.inputLength;
        var vLarr = [];
        vLarr.push(vLength);
        vLarr.push("''");
        //alert(vSpecificationsId + '--' + vOrigin + '--' + vMaterialId + '--' + vLarr.join(","))
        
        if ($.valid(vSpecificationsId) && $.valid(vOrigin) && $.valid(vMaterialId) && vSpecificationsId > 0 && vOrigin > 0 && vMaterialId>=0) {
            var sobj = {
                BusObjs: [{ BusObjName: "VUnitWeightQuery" }],
                Props: [{ LExp: "SpecificationsId" },
                        { LExp: "Origin" },
                        { LExp: "MaterialId" },
                        { LExp: "Val" }
                ]
                , Wheres: [
                    { LExp: "SpecificationsId", RExp: vSpecificationsId, Condition: "Equal" },
                    { LExp: "Origin", RExp: vOrigin, Condition: "Equal" },
                    { LExp: "MaterialId", RExp: vMaterialId, Condition: "Equal" }, 
                    { LExp: "Length", RExp: vLarr.join(","), Condition: "In" }
                ]
                , Orders: [{ PropName: "Length" }]
            };
            var _key = vSpecificationsId + ',' + vOrigin + ',' + vMaterialId + ',' + vMaterialId + ',' + vLarr.join(",");
            if (_WeightCache[_key] != undefined && _WeightCache[_key] != "") { 
                editors.UnitWeight.actions.setValue(editors.UnitWeight.target, _WeightCache[_key]);
                return;
            }
            GM.Core.doPostAction(listAction, sobj, function (json) {
                if (json.status == 0 && json.data.rows.length > 0) {
                    if ($.valid(editors) && $.valid(editors.UnitWeight)) {
                        _WeightCache[_key] = json.data.rows[0].Val;
                        editors.UnitWeight.actions.setValue(editors.UnitWeight.target, json.data.rows[0].Val);
                    }
                    if ($.valid(inputOptions) && $.valid(inputOptions.setId))
                        $("#" + inputOptions.setId).numberbox('setValue', json.data.rows[0].Val); 
                }
            });
        }
    },
    doCalcEditors: function (dom, tid, type, isAudit) {
    var tb = $("#" + tid);
    var editors = tb.datagrid("getEditorsWithElement", dom);
    if ($.valid(editors)) {
        var tmap = {};
        tmap["UnitNumber"] = editors.UnitNumber;
        tmap["AuditUnitNumber"] = editors.AuditUnitNumber;
        tmap["UnitWeight"] = editors.UnitWeight;

        tmap["Quantity"] = editors.Quantity;
        tmap["Price"] = editors.Price;
        tmap["Amount"] = editors.Amount;


        tmap["ProxyPrice"] = editors.ProxyPrice;
        tmap["ProxyAmount"] = editors.ProxyAmount;

        tmap["AuditPrice"] = editors.AuditPrice;
        tmap["AuditQuantity"] = editors.AuditQuantity;
        tmap["AuditAmount"] = editors.AuditAmount;

        tmap["AuditProxyPrice"] = editors.AuditProxyPrice;
        tmap["AuditProxyAmount"] = editors.AuditProxyAmount;

            tmap["SplitUnitNumber"] = editors.SplitUnitNumber;
            tmap["SplitQuantity"] = editors.SplitQuantity;
            tmap["SplitPrice"] = editors.SplitPrice;
            tmap["SplitAmount"] = editors.SplitAmount;
            tmap["SplitProxyPrice"] = editors.SplitProxyPrice;
            tmap["SplitProxyAmount"] = editors.SplitProxyAmount;

        //件数change 
        if (type == "ByUnitNumberUnitWeight") {
            doCalcQuantity(tmap, isAudit);
            doCalcAmount(tmap, isAudit);
            doCalcProxyAmount(tmap, isAudit); 
        }
        //数量change
        if (type == "ByQuantity") {
            doCalcAmount(tmap, isAudit);
            doCalcProxyAmount(tmap, isAudit);
        } 
        //单价change
        if (type == "ByPrice") {
            doCalcAmount(tmap, isAudit);
        }
        //代理单价change
        if (type == "ByProxyPrice") {
            doCalcProxyAmount(tmap, isAudit);
        }
    }

    function doCalcQuantity(tmap, isAudit) {
        if (isAudit) {
                if ($.valid(tmap["AuditQuantity"]) && $.valid(tmap["AuditUnitNumber"]) && $.valid(tmap["UnitWeight"])) {
                    doCalcByParam(tmap["AuditUnitNumber"], tmap["UnitWeight"], tmap["AuditQuantity"], true);
            }
        } else {
            if ($.valid(tmap["Quantity"]) && $.valid(tmap["UnitNumber"]) && $.valid(tmap["UnitWeight"])) {
                doCalcByParam(tmap["UnitNumber"], tmap["UnitWeight"], tmap["Quantity"], true);
            }
            }
            if ($.valid(tmap["SplitQuantity"]) && $.valid(tmap["SplitUnitNumber"]) && $.valid(tmap["UnitWeight"])) {
                doCalcByParam(tmap["SplitUnitNumber"], tmap["UnitWeight"], tmap["SplitQuantity"], true);
        }
            if ($.valid(tmap["SplitQuantity"]) && $.valid(tmap["SplitUnitNumber"]) && $.valid(tmap["UnitWeight"])) {
                doCalcByParam(tmap["SplitUnitNumber"], tmap["UnitWeight"], tmap["SplitQuantity"], true);
            }
    }
    function doCalcAmount(tmap, isAudit) {
        if (isAudit) {
            if ($.valid(tmap["AuditPrice"]) && $.valid(tmap["AuditQuantity"]) && $.valid(tmap["AuditAmount"])) {
                doCalcByParam(tmap["AuditQuantity"], tmap["AuditPrice"], tmap["AuditAmount"]);
            }
        } else {
            if ($.valid(tmap["Price"]) && $.valid(tmap["Quantity"]) && $.valid(tmap["Amount"])) {
                doCalcByParam(tmap["Quantity"], tmap["Price"], tmap["Amount"]);
            }
            }
            if ($.valid(tmap["SplitPrice"]) && $.valid(tmap["SplitQuantity"]) && $.valid(tmap["SplitAmount"])) {
                doCalcByParam(tmap["SplitQuantity"], tmap["SplitPrice"], tmap["SplitAmount"]);
        }
            if ($.valid(tmap["SplitPrice"]) && $.valid(tmap["SplitQuantity"]) && $.valid(tmap["SplitAmount"])) {
                doCalcByParam(tmap["SplitQuantity"], tmap["SplitPrice"], tmap["SplitAmount"]);
            }
    }
    function doCalcProxyAmount(tmap, isAudit) {
        if (isAudit) {
            if ($.valid(tmap["AuditProxyPrice"]) && $.valid(tmap["AuditQuantity"]) && $.valid(tmap["AuditProxyAmount"])) {
                doCalcByParam(tmap["AuditQuantity"], tmap["AuditProxyPrice"], tmap["AuditProxyAmount"]);
            }
        } else {
            if ($.valid(tmap["ProxyPrice"]) && $.valid(tmap["Quantity"]) && $.valid(tmap["ProxyAmount"])) {
                doCalcByParam(tmap["Quantity"], tmap["ProxyPrice"], tmap["ProxyAmount"]);
            }
            }
            if ($.valid(tmap["SplitProxyPrice"]) && $.valid(tmap["SplitQuantity"]) && $.valid(tmap["SplitProxyAmount"])) {
                doCalcByParam(tmap["SplitQuantity"], tmap["SplitProxyPrice"], tmap["SplitProxyAmount"]);
        }
            if ($.valid(tmap["SplitProxyPrice"]) && $.valid(tmap["SplitQuantity"]) && $.valid(tmap["SplitProxyAmount"])) {
                doCalcByParam(tmap["SplitQuantity"], tmap["SplitProxyPrice"], tmap["SplitProxyAmount"]);
            }
    }
        function doCalcByParam(arg1, arg2, targetParam, isQuantity) {
        var _arg1 = arg1.actions.getValue(arg1.target);
        var _arg2 = arg2.actions.getValue(arg2.target);
        if ($.isNumeric(_arg1) && $.isNumeric(_arg2)) {
            if (isQuantity)
                targetParam.actions.setValue(targetParam.target, Math.AccMul.Quantity(_arg1, _arg2));
            else
                targetParam.actions.setValue(targetParam.target, Math.AccMul(_arg1, _arg2));
        }
    }
    },
    CheckRowsConformity: function (rows, columns, dataGrid) {
        var backObj = "";
        var checkValue = new Array();
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            for (var j = 0; j < columns.length; j++) {
                var columnName = columns[j];
                if (i == 0) {
                    checkValue.push(row[columnName]);
                }
                else {
                    if (checkValue[j] != row[columnName]) {
                        var Option = dataGrid.datagrid("getColumnOption", columnName);
                        backObj = Option.title+"不一致";
                        return backObj;
                    }
                }
            }
        }
        return 0;
    },
    RotateObj: function (target, degree) {
        var userAgent = navigator.userAgent,
	    isIE = /msie/i.test(userAgent) && !window.opera,
	    isWebKit = /webkit/i.test(userAgent),
	    isFirefox = /firefox/i.test(userAgent);
        var oldDegree = degree;
        if (isWebKit) {
            target.style.webkitTransform = "rotate(" + degree + "deg)";
        } else if (isFirefox) {
            target.style.MozTransform = "rotate(" + degree + "deg)";
        } else if (isIE) {
            //chessDiv.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + degree + ")";
            degree = degree / 180 * Math.PI;
            var sinDeg = Math.sin(degree);
            var cosDeg = Math.cos(degree);
            if (!$.support.leadingWhitespace) {
                target.style.filter = "progid:DXImageTransform.Microsoft.Matrix(" +
                        "M11=" + cosDeg + ",M12=" + (-sinDeg) + ",M21=" + sinDeg + ",M22=" + cosDeg + ",SizingMethod='auto expand')";
            }
            else {
                target.style.transform = "rotate(" + oldDegree + "deg)";
            }
        } else {
            target.style.transform = "rotate(" + degree + "deg)";
        }
    },
    toString: function (value) {
        if (value)
            return value.toString();
        return "";
    },
    doReadOnlyCompany: function (CompanyId, FinancialLevel, CompanyIdVal, FinancialLevelType) {
        //return;  
        var dom = $("#" + CompanyId);
        var opt = $.extend(dom.combobox("options"),
            {
                initVal: CompanyIdVal,
                FinancialLevel: FinancialLevel,
                FinancialLevelType: FinancialLevelType,
                readonly: FinancialLevel > 0 && (FinancialLevel == 1 || (FinancialLevelType == 2 && FinancialLevel <= 2)) ? true : false
            });
        if (FinancialLevel == 0 && opt.extendData.length <= 0) {
            opt.attitem = [{ value: '', text: '' }];
        }
        dom.combobox("readonly", opt.readonly);
        //GM.Editor.setEnumCombobox(CompanyId, "Company.Enum.List", opt);
        if (CompanyIdVal && CompanyIdVal > 0) {
            dom.combobox('setValue', CompanyIdVal);
        }
    }
};
if (window.GM == undefined)
    window.GM = {};
GM.Tools = Tools;