//-----------ajax交互核心 start-----------//
var Core = {
    recreateWhere: function (qobj) {
        if ($.isArray(qobj)) {
            for (var i = 0; i < qobj.length; i++) {
                var obj = qobj[i];
                if ($.valid(obj)) {
                    if ($.isArray(obj.Wheres)) {
                        var wheres = obj.Wheres;
                        obj.Wheres = {};
                        obj.Wheres.SubSqlWhere = wheres;
                    }
                    if ($.isArray(obj.BusObjs)) {
                        for (var i = 0; i < obj.BusObjs.length; i++) {
                            var objWheres = obj.BusObjs[i].JoinConditions;
                            if ($.isArray(objWheres)) {
                                var wheres = objWheres;
                                objWheres = {};
                                objWheres.SubSqlWhere = wheres;
                                obj.BusObjs[i].JoinConditions = objWheres;
                            }
                        }
                    }
                }
            }
        } else {
            var obj = qobj;
            if ($.valid(obj)) {
                if ($.isArray(obj.Wheres)) {
                    var wheres = obj.Wheres;
                    obj.Wheres = {};
                    obj.Wheres.SubSqlWhere = wheres;
                }
                if ($.isArray(obj.BusObjs)) {
                    for (var i = 0; i < obj.BusObjs.length; i++) {
                        var objWheres = obj.BusObjs[i].JoinConditions;
                        if ($.isArray(objWheres)) {
                            var wheres = objWheres;
                            objWheres = {};
                            objWheres.SubSqlWhere = wheres;
                            obj.BusObjs[i].JoinConditions = objWheres;
                        }
                    }
                }
            }
        }
    },
    checkBizResult: function (data, error) {
        if (data.status) {
            if ($.isFunction(error))
                error(data.message, data.status);
            return false;
        }
        return true;
    },
    doPostAction: function (action, obj, callback, async, error, executeAction) {
        if (typeof (async) == "undefined") async = true;
        //Core.recreateWhere(obj);
        $.ajax({
            url: action,
            type: "POST",
            async: async,
            data: { json: Tools.O2String(obj) },
            dataType: "json",
            success: callback,
            statusCode: {
                403: function () {
                    if ($.isFunction(callback))
                        callback({ status: 403, message: '没有权限<br/>' + this.url });
                    else
                        GM.WindowsUtility.showMessage('错误[403]:没有权限<br/>' + this.url, 'error');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (!$.isFunction(error) || !error(XMLHttpRequest, textStatus, errorThrown)) {
                    if ($.isFunction(callback))
                        callback({ status: 255, message: '服务错误:' + errorThrown + '<br/>' + this.url });
                    else
                        GM.WindowsUtility.showAjaxError(XMLHttpRequest, textStatus, errorThrown, this.url);
            }
            }
        });
    },
    getJson: function (action, callback, async, error, executeAction) {
        if (typeof (async) == "undefined") async = true;
        //Core.recreateWhere(obj);
        $.ajax({
            url: action,
            type: "GET",
            async: async,
            //data: { json: Tools.O2String(obj) },
            //dataType: "json",
            success: callback,
            statusCode:{
                403:function(){
                    if ($.isFunction(callback))
                        callback({ status: 403, message: '没有权限<br/>' + this.url });
                    else
                        GM.WindowsUtility.showMessage('错误[403]:没有权限<br/>' + this.url, 'error');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (!$.isFunction(error) || !error(XMLHttpRequest, textStatus, errorThrown)) {
                    if ($.isFunction(callback))
                        callback({ status: 255, message: '服务错误:' + errorThrown + '<br/>' + this.url });
                    else
                        GM.WindowsUtility.showAjaxError(XMLHttpRequest, textStatus, errorThrown, this.url);
            }
            }
        });
    },
    loadEnumData: function (action, category, callback, async, forceRefresh, IsIncludeNull, FinancialLevelType, FinancialLevel, opts) {

        function loadremoteData(action, category, callback, async, IsIncludeNull, enumCache, cacheData, opts) {
            if ($.valid(callback))
                cacheData.callbacks.push(callback);
            var ret;  
            var opt = opts == null ? { Category: category } : $.extend({ Category: category }, opts);
            Core.getJson(action, function (json) {
                if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)) {
                    if (IsIncludeNull == false) {
                        for (var i = 0; i < json.length; i++) {
                            if (json[i].value == "ISNULL") {
                                json.removeAt(i); break;
                            }
                        }
                    }
                    
                    if (FinancialLevelType && FinancialLevelType > 0 && FinancialLevel && FinancialLevel>0) {
                        json.data = json.data.toQuerable().where(function (t) {
                            return FinancialLevel<=1?t.FinancialLevel==1:(FinancialLevelType == 1 ? t.FinancialLevel > 1 : t.FinancialLevel == FinancialLevel);
                        }).toArray();
                    }
                     
                    //var zdata = $.extend(true, {}, json);
                    zdata = json;
                    cacheData.enum = zdata;

                    $(document.body).data("enumCache", enumCache);

                    var cb = cacheData.callbacks.pop();
                    while ($.valid(cb)) {
                        if ($.isFunction(cb)) {
                            //cb($.extend(true, {}, cacheData.enum));
                            callback(json);
                        }
                        cb = cacheData.callbacks.pop();
                    }
                    ret = zdata;
                }
            }, async);
            if (!async)
                return ret;
        }

        if (!$.valid(async))
            async = $.isFunction(callback);
        var enumCache = $(document.body).data("enumCache");
        if (!$.valid(enumCache)) {
            enumCache = {};
            $(document.body).data("enumCache", enumCache);
        }

        if (!$.valid(action))
            action = "";
        if (!$.valid(category))
            category = "";
        var key = action + '$' + category;
        var data = enumCache[key];

        if (!$.valid(data)) {
            data = { callbacks: [] };
            enumCache[key] = data;
            $(document.body).data("enumCache", enumCache);
            return loadremoteData(action, category, callback, async, IsIncludeNull, enumCache, data,opts);
        } else {
            if ($.valid(data.enum)) {
                if (!forceRefresh) {
                    var dt = $.extend(true, {}, data.enum);
            if (async) {
                if ($.isFunction(callback))
                    callback(dt);
            }
            else {
                if ($.isFunction(callback))
                    callback(dt);
                return dt;
            }
        } else {
                    return loadremoteData(action, category, callback, async, IsIncludeNull, enumCache, data, opts);
                    }
                    }
            else {
                if ($.valid(callback))
                    data.callbacks.push(callback);
                }
        }
    },
    getEnumText: function (action, category, value, textField, valueField,opts) { 
        if (!$.valid(textField))
            textField = "text";
        if (!$.valid(valueField))
            valueField = "value";         

        var text = ""; 
        var data = Core.loadEnumData(action, category,null,null,null,null,null,null,opts);

        if ($.valid(data)) {
            if (value === true || value === 'true')
                value = 2
            else if (value === false || value === 'false' || value === 0)
                value = 1;

            var total = data.data;
            //处理数组的情况
            var isStrArr = false;
            var arrVal = null;
            if ($.isArray(value)) {
                arrVal = value;
            }
            else {
                var strVal = value + "";
                isStrArr = strVal.indexOf(",") != -1;
                if (isStrArr)
                {
                    arrVal = strVal.split(",");
                }
            }
            if (arrVal)
            {
                if ($.isArray(total)) {
                    for (var i = 0; i < arrVal.length; i++) {
                        var setdata = total.toQuerable().where(function (it) { return it[valueField] == arrVal[i] }).toArray();
                        if (setdata.length > 0) {
                            if (i != 0)
                            {
                                text = text + ",";
                            }
                            text =text+ setdata[0][textField];
                        }
                    }
                }
                return text;
            }
            if ($.isArray(total)) {
                var setdata = total.toQuerable().where(function (it) { return it[valueField] == value }).toArray();
                if (setdata.length > 0) {
                    text = setdata[0][textField];
                }
            } else if (total[valueField] == value) {
                text = total[textField];
            }
        }
        return text;
    },
    getParentEnumValue: function (action, category, value, valueField, parentField) {
        if (!$.valid(valueField))
            valueField = "value";

        if (!$.valid(parentField))
            parentField = "parentvalue";

        var pv;
        var data = Core.loadEnumData(action, category);
        if ($.valid(data)) {
            if (value === true || value === 'true')
                value = 2
            else if (value === false || value === 'false' || value === 0)
                value = 1;

            var total = data.data;
            if ($.isArray(total)) {
                var setdata = total.toQuerable().where(function (it) { return it[valueField] == value }).toArray();
                if (setdata.length > 0) {
                    pv = setdata[0][parentField];
                }
            } else if (total[valueField] == value) {
                pv = total[parentField];
            }
        }
        return pv;
    },
    getDefaultEnumValue: function (action, category, valueField, parentValue, parentField) {
        if (!$.valid(valueField))
            valueField = "value";
        var data = Core.loadEnumData(action, category);
        if ($.valid(data)) {
            var total = data.data;

            if ($.valid(parentValue))
            {
                if (!$.valid(parentField))
                    parentField = "parentvalue";
                var dd = total.toQuerable().where(function (it) { return it[parentField] == parentValue }).first();
                if (dd)
                    return dd[valueField];
            }

            if ($.isArray(total) && total.length > 0) {
                return total[0][valueField];
            } else {
                return total[valueField];
            }
        }
    },
    ctrlACAuth: function (dom) {
        //var acArr = [];
        //acCtrls.each(function () {
        //    var acs = $(this).attr("ac").split(',');
        //    for (var x = 0; x < acs.length; x++) {
        //        if(acs[x].length>0)
        //            acArr.push(acs[x]);
        //    }
        //});
        if (!dom)
            dom = $(document.body);

        Core.ACAuth([1], function (dataSet) {
            if (dataSet) {
                var acCtrls = $("*[ac]", dom);
                acCtrls.each(function () {
                    if (!Core.CheckAcAuth(dataSet, $(this).attr("ac")))
                        $(this).remove();
                });
            }
        });
    },
    CheckAcAuth: function (dataSet, ac) {
        if (ac) {
            var acs = ac.split(',');
            var hasAuth = false;
            for (var i = 0; i < acs.length; i++) {
                hasAuth = dataSet[acs[i].toString()] === 1;
                if (hasAuth)
                    return true;
            }
            return false;
        }
        return true;
    },
    ACAuth: function (acArr, callback) {
        if (acArr.length > 0) {
            var jsondata = $(document.body).data("AllACData");
            if (!jsondata) {
                Core.getJson("sys.Auth.SelectCurrentUserAllActions", 0, function (json)
                {
                    var dataSet = {};
                    dataSet.NotUseActionAuthorization = json.data[0] == "NotUseActionAuthorization";
                    if (!dataSet.NotUseActionAuthorization) {
                        for (var i = 1; i < json.data.length; i++) {
                            if (json.data[i]) {
                                var name = $.trim(json.data[i].toString());
                                if (name != '')
                                    dataSet[name] = 1;
                            }
                        }
                    }
                    $(document.body).data("AllACData", dataSet);
                    jsondata = dataSet;
                }, false);
            }
            if (jsondata.NotUseActionAuthorization) return;
            if (callback) callback(jsondata);
        }
    },
    currentOrderCode: null,
    getCurrentOrderCode: function () {
        if (!GM.Core.currentOrderCode) {
            GM.Core.currentOrderCode = config.orderCode;
            if (!GM.Core.currentOrderCode)
                GM.Core.currentOrderCode = window.location.hostname.split(".")[0];
        }
        return GM.Core.currentOrderCode;
    },
    upload: function (base64, bizInfo, callback) {
        //把QBOX的接口封装一下，支持从表单获取二进制文件，和base64字符串文件
        //把业务参数调用ac保存到临时表中
        //绑定好回调接口，
        //alert(); return;
        var bizInfo = Tools.O2String(bizInfo);
        bizInfo = bizInfo.replace(/"/g, "\\\"");
        //alert(bizInfo); return;
        GM.Core.doPostAction("File.UpLoad", { bizinfo: bizInfo }, function (result) {
            var token = result.data.token;
            if (token.length > 0) {
                var url = config.businessOptions.QiniuUploadAddr;
                var xhr = new XMLHttpRequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        //不管了
                    }
                }
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-Type", "application/octet-stream");
                xhr.setRequestHeader("Authorization", "UpToken " + token);
                xhr.send(base64);
                callback(result.data.attachId);
            }
        });
    },
    download: function (sobj, callback) {
        GM.Core.doPostAction("File.DownLoad", sobj, function (result) {
            callback(result.data);
        });
    }
};

if (window.GM == undefined)
    window.GM = {};
GM.Core = Core;
