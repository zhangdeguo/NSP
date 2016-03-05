(function ($) {
    //$.extend($.fn.validatebox.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.numberbox.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.spinner.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.combo.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.combobox.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.numberspinner.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.timespinner.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.combotree.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.combogrid.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.datebox.defaults, {
    //    tipPosition: "bottom"
    //});
    ////$.extend($.fn.combo2.defaults, {
    ////    tipPosition: "bottom"
    ////});
    ////$.extend($.fn.combobox2.defaults, {
    ////    tipPosition: "bottom"
    ////});
    //$.extend($.fn.dialogselector.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.my97datebox.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.specification.defaults, {
    //    tipPosition: "bottom"
    //});
    //$.extend($.fn.textbox.defaults, {
    //    tipPosition: "bottom"
    //});
    function createMessageBox(title, content, btns) {
        var win = $("<div class=\"messager-body\"></div>").appendTo("body");
        win.append(content);
        if (btns) {
            var tb = $("<div class=\"messager-button\"></div>").appendTo(win);
            for (var btn in btns) {
                $("<a></a>").attr("href", "javascript:void(0)").text(btn).css("margin-left", 10).bind("click", eval(btns[btn])).appendTo(tb).linkbutton();
            }
        }
        win.window({
            title: title, noheader: (title ? false : true), width: 300, height: "auto", modal: true, collapsible: false, minimizable: false, maximizable: false, resizable: false, onClose: function () {
                setTimeout(function () {
                    win.window("destroy");
                }, 100);
            },
            onDestroy: function () {
                win.isDestroy = true;
            }
        });
        win.window("window").addClass("messager-window");
        win.children("div.messager-button").children("a:first").focus();
        return win;
    };
    $.extend($.messager.defaults, { close: '关闭' });
    $.extend($.messager, {
        endWaitFor: function (win) {
            if (!win.isDestroy)
                win.window("close");
        },
        waitFor: function (msg, action, options) {
            if (!msg)
                msg = "正在等待操作完成，如长时间无响应请刷新页面。";
            options = $.extend({ title: '', msg: "正在等待操作完成，如长时间无响应请刷新页面。", timeout: 60000, timeoutMsg: "操作超时，点击关闭结束等待。" }, options, { msg: msg });
            var btn = {};
            btn[$.messager.defaults.close] = function () {
                $.messager.endWaitFor(win);
            };
            var content = "<div class=\"messager-waitfor\"><div class=\"messager-icon messager-info\"></div><div class=\"messager-w-msg\"></div><div style=\"width:100%;height:24px;\" class=\"messager-w-icon icon-progress\"></div></div>";
            var win = createMessageBox(options.title, content, btn);
            win.find("div.messager-button").hide();
            if (options.timeout >= 0) {
                var timeout = setTimeout(function () {
                    win.find("div.messager-w-msg").html(options.timeoutMsg);
                    win.find("div.messager-button").show();
                }, options.timeout);
            }
            try {
                win.find("div.messager-w-msg").html(msg);
                if ($.isFunction(action)) {
                    action(function () { $.messager.endWaitFor(win); });
                }
            } catch (e) {
                $.messager.endWaitFor(win);
                throw e;
            }
            return win;
        }
    });
    $.timestemp = function () {
        return (new Date()) * 1000 + Math.floor(Math.random() * 1000);
        //return now.getFullYear() + '$' + now.getMonth() + '$' + now.getDay() + '$' + now.getHours() + '$' + now.getMinutes() + '$' + now.getSeconds() + '$' + now.getMilliseconds();
    }

    var combo$srcShowPanel = $.fn.combo.methods.showPanel;
    function combo$showPanel(target) {
        var combo = $(target);
        var opts = combo.combo("options");
        combo$srcShowPanel.call(target, combo);
        var panel = $(target).combo('panel');
//        if (!opts.hideReloadButton) {
//            var state = $.data(target, 'combobox');
//            if (state && !state.refreshBtn) {
//                state.refreshBtn = $('<a href="javascript:void(0);">刷新</a>').appendTo($('<div style="background-color:#eee;height:24px;vertical-align:middle;line-height:24px;text-align:center;"></div>').insertAfter(panel.panel("body")));
//                state.refreshBtn.click(function () {
//                    //尹熊修改 刷新连带功能 
//                    if ($.valid(opts.comboReloadClass)) {
//                        $("." + opts.comboReloadClass).combobox("reload");
//                    }else{
//                        combo.combobox("reload");
//                    }
//                });
//            }
//        }

        var size = {};

        var cheight = opts.panelMaxHeight && opts.panelMaxHeight != 'auto';
        var cwidth = opts.panelMaxWidth && opts.panelMaxWidth != 'auto';
        var mheight = opts.panelMinHeight && opts.panelMinHeight != 'auto';
        var mwidth = opts.panelMinWidth && opts.panelMinWidth != 'auto'; 
        if (cheight) {
            size.height = Math.min(opts.panelMaxHeight, (panel[0].scrollHeight+2));
        }
        if (cwidth) {
            size.width = Math.min(opts.panelMaxWidth, panel[0].scrollWidth);
        }
        if (mheight) {
            size.height = Math.max(opts.panelMinHeight, cheight ? size.height : (panel[0].scrollHeight+2));
        }
        if (mwidth) {
            size.width = Math.max(opts.panelMinWidth, cwidth ? size.width : panel[0].scrollWidth);
        } 
        if (cwidth || cheight || mheight || mwidth)
            panel.panel("resize", size);
    }

    $.extend($.fn.combo.methods, {
        showPanel: function (jq) {
            return jq.each(function () {
                return combo$showPanel(this);
            });
        },
        reload: function (jq) {
        }
    });
    $.extend($.fn.combo.defaults, {
        panelMaxHeight: 192,
        panelMaxWidth: 'auto',
        panelMinHeight: 64,
        panelMinWidth: 'auto'
    });

    var combobox$srcSetValue = $.fn.combobox.methods.setValue;
    function combobox$setValue(target, data) {
        var combobox = $(target);
        try {
            var oldVal = combobox.combobox("getValue");
            combobox$srcSetValue.call(target, combobox, data);
            //修正他妈的SetValue不触发onChange，妈的脑残！
            combobox.combobox("options").onChange.call(target, data, oldVal);
        } catch (e) {

        }
        return combobox;
    }
    $.extend($.fn.combobox.methods, {
        setValue: function (jq, data) {
            return jq.each(function () {
                return combobox$setValue(this, data);
            });
        }
    });

    var combo$srcSetValue = $.fn.combo.methods.setValue;
    function combo$setValue(target, data) {
        var combo = $(target);
        var oldVal = combo.combo("getValue");
        combo$srcSetValue.call(target, combo, data);
        combo.combo("options").onChange.call(target, data, oldVal);
        return combo;
    }
    $.extend($.fn.combo.methods, {
        setValue: function (jq, data) {
            return jq.each(function () {
                return combo$setValue(this, data);
            });
        }
    });

    //为Combobox检查值是否存在于列表中，是否合法
    var validatebox$srcisValid = $.fn.validatebox.methods.isValid;
    function validatebox$isValid(target) {
        var dom = $(target);
        var ret = validatebox$srcisValid.call(target, dom);
        if (ret) {
            var msg;
            dom.parent(".combo").prev(".combobox-f").each(
                function () {
                    var opts = $(this).combobox("options");
                    msg = opts.notExistsMessage;
                    var data = $(this).combobox("getData");
                    $.each($(this).combobox("getValues"), function (index, value) {
                        if (value) {
                            ret = data.toQuerable().where(function (t) { return t[opts.valueField] == value }).any();
                        }
                        return ret;
                    });
                    return ret;
                });
            //设置不存在项目消息
            if (!ret)
                $.data(target, "validatebox").message = msg;
        }
        return ret
    };
    $.extend($.fn.validatebox.methods, {
        validate: function (jq) {
            return jq.each(
                function () {
                    if (!validatebox$isValid(this)) {
                        $(this).addClass("validatebox-invalid");
                        return false;
                    };
                    $(this).removeClass("validatebox-invalid");
                    return true;
                });
        },
        isValid: function (jq) {
            return validatebox$isValid(jq[0]);
        }
    });
    
    $.extend($.fn.form.methods, {
        validate: function (jq) {
            if ($.fn.validatebox) {
                var t = $(jq[0]);
                t.find(".validatebox-text").validatebox("validate");
                var noValidate = t.find(".validatebox-invalid");
                noValidate.first().focus();
                return noValidate.length == 0;
            }
            return true;
        }
    });

    function searchboxSetEnabled(target, enabled) {
        var data = $.data(target, "searchbox");
        var opts = data.options;
        var textbox = data.searchbox.find("input.searchbox-text");
        var mb = data.searchbox.find("a.searchbox-menu");
        if (enabled) {
            opts.disabled = true;
            $(target).attr("disabled", true);
            textbox.attr("disabled", true);
            if (mb.length) {
                mb.menubutton("disable");
            }
        } else {
            opts.disabled = false;
            $(target).removeAttr("disabled");
            textbox.removeAttr("disabled");
            $(target).removeAttr("readonly");
            textbox.removeAttr("readonly");
            if (mb.length) {
                mb.menubutton("enable");
            }
        }
    };

    $.extend($.fn.searchbox.methods, {
        disable: function (jq) {
            return jq.each(function () {
                searchboxSetEnabled(this, true);
                //_17(this);
            });
        }, enable: function (jq) {
            return jq.each(function () {
                searchboxSetEnabled(this, false);
                //_17(this);
            });
        }
    });
    //if ($.fn.datagrid) {
    //    $.fn.datagrid.defaults.loadMsg = ' ';
    //}

    if ($.fn.datebox) {
        $.fn.datebox.defaults.parser = function (s) {
            var rst = Date.StringToDate(s);
            if ($.valid(rst))
                return rst;
            return new Date();
        };
    }

    var datagrid$updateRow = $.fn.datagrid.methods.updateRow;
    var datagrid$appendRow = $.fn.datagrid.methods.appendRow;
    var datagrid$insertRow = $.fn.datagrid.methods.insertRow;
    var datagrid$deleteRow = $.fn.datagrid.methods.deleteRow;
    var datagrid$beginEdit = $.fn.datagrid.methods.beginEdit;
    var datagrid$endEdit = $.fn.datagrid.methods.endEdit;
    var datagrid$cancelEdit = $.fn.datagrid.methods.cancelEdit;
    var datagrid$validateRow = $.fn.datagrid.methods.validateRow;

    $.extend($.fn.datagrid.defaults, {
        onUpdateRow: function (param) { },
        onAppendRow: function (row) { },
        onInsertRow: function (param) { },
        onBeforeDeleteRow: function (index) { },
        onDeleteRow: function (index) { },
        onBeforeBeginEdit: function (rowIndex, rowData) { },
        onBeginEdit: function (rowIndex, rowData) { },
        onEndEdit: function (rowIndex, rowData) { },
        onBeforeEndEdit: function (index) { },
        onBeforeCancelEdit: function (index) { },
        onBeforeValidateRow: function (index, rowData) { },
        onEndValidateRow: function (index, rowData) { }
});

    $.extend($.fn.datagrid.methods, {
        getCheckedRows: function (jq, param) {
            var ret = [];
            var dom = $(jq[0]);
            var allrows = dom.datagrid('getRows');
            for (var i = 0; i < allrows.length; i++) {
                if(dom.datagrid('isChecked',i)){
                    ret.push(allrows[i]);
                }
            }
            return ret;
        },
        editCell: function(jq,param){
            return jq.each(function () {
                var opts = $(this).datagrid('options');
                var fields = $(this).datagrid('getColumnFields', true).concat($(this).datagrid('getColumnFields'));
                for (var i = 0; i < fields.length; i++) {
                    var col = $(this).datagrid('getColumnOption', fields[i]);
                    col.editorCache = col.editor;
                    if (fields[i] != param.field) {
                        col.editor = null;
                    }
                }
                $(this).datagrid('beginEdit', param.index);
                for (var i = 0; i < fields.length; i++) {
                    var col = $(this).datagrid('getColumnOption', fields[i]);
                    col.editor = col.editorCache;
                }
            });
        },
        isCheckRow: function (jq, param) {
            if ($.isNumeric(param)) {
                var opts = $(jq[0]).datagrid("options");
                var tr = opts.finder.getTr(jq[0], param, "body", 1);
                return tr.find("div.datagrid-cell-check input[type=checkbox]").is(":checked");
            } else {
                return $($(jq[0]).datagrid("getPanel")).find("div.datagrid-cell-check input[type=checkbox]").is(":checked") > 0;
            }
        },
        validateRow: function (jq, param) {
            var ret = true;
            jq.each(function () {
                var self = this;
                var rows = $(self).datagrid("getRows");
                var opts = $(self).datagrid("options");
                if ($.valid(param))
                    param = parseInt(param.toString());
                if ($.isNumeric(param)) {
                    if (opts.onBeforeValidateRow.call(self, param, rows[param]) !== false) {
                        ret = datagrid$validateRow.call(self, $(self), param);
                        opts.onEndValidateRow.call(self, param, rows[param]);
                    }
                }
                else {
                    opts.finder.getTr(self, 0, "allbody", 1).each(function () {
                        var idx = parseInt($(this).attr("datagrid-row-index"));
                        if (opts.onBeforeValidateRow.call(self, idx, rows[idx]) !== false) {
                            ret = datagrid$validateRow.call(self, $(self), idx);
                            opts.onEndValidateRow.call(self, idx, rows[idx]);
                        }
                    });
                }
            });
            return ret;
        },
        beginEdit: function (jq, param) {
            return jq.each(function () {
                var self = this;
                var rows = $(self).datagrid("getRows");
                var opts = $(self).datagrid("options");
                if ($.valid(param))
                    param = parseInt(param.toString());
                if ($.isNumeric(param)) {
                    var tr = opts.finder.getTr(self, param, "body", 1);
                    if (!$(tr).is(".datagrid-row-editing")) {
                        $(tr).data("orginal", $.extend(true, {}, rows[param]));
                        if (opts.onBeforeBeginEdit.call(self, param, rows[param]) !== false) {
                            datagrid$beginEdit.call(self, $(self), param);
                            opts.onBeginEdit.call(self, param, rows[param]);
                        }
                    }
                }
                else {
                    opts.finder.getTr(self, 0, "allbody", 1).not(".datagrid-row-editing").each(function () {
                        if (!$(this).is(".datagrid-row-editing")) {
                            var idx = parseInt($(this).attr("datagrid-row-index"));
                            $(this).data("orginal", $.extend(true, {}, rows[idx]));
                            if (opts.onBeforeBeginEdit.call(self, idx, rows[idx]) !== false) {
                                datagrid$beginEdit.call(self, $(self), idx);
                                opts.onBeginEdit.call(self, idx, rows[idx]);
                            }
                        }
                    });
                }
            });
        },
        endEdit: function (jq, param) {
            return jq.each(function () {
                var self = this;
                var rows = $(self).datagrid("getRows");
                var opts = $(self).datagrid("options");
                if ($.valid(param))
                    param = parseInt(param.toString());
                if ($.isNumeric(param)) {
                    if (opts.onBeforeEndEdit.call(self, param, rows[param]) !== false) {
                        datagrid$endEdit.call(self, $(self), param);
                        opts.onEndEdit.call(self, param, rows[param]);
                    }
                }
                else {
                    opts.finder.getTr(self, 0, "allbody", 1).each(function () {
                        if ($(this).is(".datagrid-row-editing")) {
                            var idx = parseInt($(this).attr("datagrid-row-index"));
                            if (opts.onBeforeEndEdit.call(self, idx, rows[idx]) !== false) {
                                datagrid$endEdit.call(self, $(self), idx);
                                opts.onEndEdit.call(self, idx, rows[idx]);
                            }
                        }
                    });
                }
            });
        },
        cancelEdit: function (jq, param) {
            return jq.each(function () {
                var self = this;
                var rows = $(self).datagrid("getRows");
                var opts = $(self).datagrid("options");
                if ($.valid(param))
                    param = parseInt(param.toString());
                if ($.isNumeric(param)) {
                    var tr = opts.finder.getTr(self, param, "body", 1);
                    if ($(tr).is(".datagrid-row-editing")) {
                        rows[param] = $(tr).data("orginal");
                        if (opts.onBeforeCancelEdit.call(self, param, rows[param]) !== false) {
                            datagrid$cancelEdit.call(self, $(self), param);
                        }
                    }
                }
                else {
                    opts.finder.getTr(self, 0, "allbody", 1).each(function () {
                        if ($(this).is(".datagrid-row-editing")) {
                            var idx = parseInt($(this).attr("datagrid-row-index"));
                            rows[idx] = $(this).data("orginal");
                            if (opts.onBeforeCancelEdit.call(self, idx, rows[idx]) !== false) {
                                datagrid$cancelEdit.call(self, $(self), idx);
                            }
                        }
                    });
                }
            });
        },
        updateRow: function (jq, param) {
            return jq.each(function () {
                datagrid$updateRow.call(this, $(this), param);
                $(this).datagrid("options").onUpdateRow.call(this, param);
            });
        },
        appendRow: function (jq, row) {
            return jq.each(function () {
                datagrid$appendRow.call(this, $(this), row);
                $(this).datagrid("options").onAppendRow.call(this, row);
            });
        },
        insertRow: function (jq, param) {
            return jq.each(function () {
                datagrid$insertRow.call(this, $(this), param);
                $(this).datagrid("options").onInsertRow.call(this, param);
            });
        },
        deleteRow: function (jq, index) {
            return jq.each(function () {
                var target = this;
                var opts = $.data(target, "datagrid").options;
                var data = $.data(target, "datagrid").data;
                opts.onBeforeDeleteRow.call(this, index);
                datagrid$deleteRow.call(this, $(this), index);
                $(this).datagrid("options").onDeleteRow.call(this, index);
            });
        },
        loading: function (jq) {
            return jq.each(function () {
                var opts = $.data(this, "datagrid").options;
                var data = $.data(jq[0], "datagrid");
                if (!data.loading) {
                    data.loading = { count: 0 };
                }
                if (!data.loading.count) {
                    $(this).datagrid("getPager").pagination("loading");
                    if (opts.loadMsg) {
                        var panel = $(this).datagrid("getPanel");
                        if (!panel.children("div.datagrid-mask").length) {
                            $("<div class=\"datagrid-mask\" style=\"display:block\"></div>").appendTo(panel);
                            var msg = $("<div class=\"datagrid-mask-msg\" style=\"display:block;top:40%;left:50%\"></div>").html(opts.loadMsg).appendTo(panel);
                            msg.outerHeight(47);
                            //msg.outerWidth(98);
                            msg.css({ marginLeft: (-msg.outerWidth() / 2), lineHeight: (msg.height() + "px") }).css({ paddingLeft: 40 });
                        }
                    }
                }
                data.loading.count++;
            });
        },
        loaded: function (jq) {
            return jq.each(function () {
                var data = $.data(jq[0], "datagrid");
                if (!data.loading) {
                    data.loading = { count: 0 };
                }
                if (data.loading.count > 0)
                    data.loading.count--;
                if (!data.loading.count) {
                    $(this).datagrid("getPager").pagination("loaded");
                    var panel = $(this).datagrid("getPanel");
                    panel.children("div.datagrid-mask-msg").remove();
                    panel.children("div.datagrid-mask").remove();
                }
            });
        },
        processSearchObj: function (jq, searchObj) {
            var dom = $(jq[0]);
            if ($.valid(searchObj)) {
                searchObj = $.extend(true, {}, searchObj);
                var options = dom.datagrid("options");
                //添加默认排序
                var orders = {};
                if ($.isArray(options.rearOrders)) {
                    for (var i = 0; i < options.rearOrders.length; i++) {
                        orders[options.rearOrders[i].PropName] = options.rearOrders[i];
                    }
                }
                if ($.isArray(searchObj.Orders)) {
                    for (var i = 0; i < searchObj.Orders.length; i++) {
                        orders[searchObj.Orders[i].PropName] = searchObj.Orders[i];
                    }
                }
                searchObj.Orders = [];
                for (var order in orders) {
                    searchObj.Orders.push(orders[order]);
                }
                //添加默认过滤
                if ($.valid(searchObj.wheres)) {
                    if ($.isArray(searchObj.wheres)) {
                        var wheres = obj.Wheres;
                        obj.Wheres = {};
                        obj.Wheres.SubSqlWhere = wheres;
                        obj.Wheres.OtherSqlWhere = [$.extend(true, {}, options.wheres)];
                    } else {
                        var wheres = obj.Wheres;
                        obj.Wheres = {};
                        obj.Wheres.OtherSqlWhere = [wheres, $.extend(true, {}, options.wheres)];
                    }
                } else {
                    searchObj.wheres = $.extend(true, {}, options.wheres);
                }
            }
            return searchObj;
        },
        getSearchObj: function (jq) {
            var ret = [];
            jq.each(function (index, ctrl) {
                ret.push($(ctrl).data('searchObj'));
            });
            if (ret.length > 0) {
                if (ret.length <= 1)
                    return ret[0];
                else
                    return ret;
            }
        },
        setSearchObj: function (jq, searchObj) {
            return jq.each(function (index, ctrl) {
                $(ctrl).data('searchObj', searchObj);
            });
        },
        refreshData: function (jq, action) {
            return jq.each(function (index, ctrl) {
                var obj = $(ctrl);
                var searchObj = obj.data('searchObj');
                if ($.valid(searchObj)) {
                    obj.datagrid('loading');
                    if (typeof action == 'string') {
                        GM.Core.doPostAction(action, obj.datagrid("processSearchObj", searchObj), function (json) {
                            if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError))
                                obj.datagrid("loadData", json.data);
                            obj.datagrid("loaded");
                        });
                    } else {
                        GM.Core.doPostAction(action.action, obj.datagrid("processSearchObj", searchObj), function (json) {
                            if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)) {
                                var datafilter = action.datafilter;
                                if ($.isFunction(datafilter)) {
                                    if ($.isArray(json.data.rows)) {
                                        for (var i = 0; i < json.data.rows.length; i++) {
                                            datafilter(json.data.rows[i], i, json.data.rows, 0);
                                        }
                                    }
                                    if ($.isArray(json.data.footer)) {
                                        for (var i = 0; i < json.data.footer.length; i++) {
                                            datafilter(json.data.footer[i], i, json.data.footer, 1);
                                        }
                                    }
                                }
                                obj.datagrid("loadData", json.data);
                            }
                            obj.datagrid("loaded");
                        });
                    }
                };
            });
        },
        clearData: function (jq) {
            return jq.each(function (index, ctrl) {
                $(ctrl).datagrid('loadData', { total: 0, rows: [] });
            });
        },
        sumChecked: function (jq, fields) {
            var dom = $(jq[0]);
            var rows = dom.datagrid("getChecked");
            var btnField;
            if (!$.isArray(fields)) {
                btnField = fields.btnField;
                fields = fields.fields;
            } else
                btnField = "btns";
            var obj = { IsFooter: true, btnField: -100 };
            if (fields && fields.length > 0) {
                for (var j = 0; j < fields.length; j++) {
                    var field = fields[j];
                    if (obj[field] == undefined || obj[field] == null)
                        obj[field] = 0;
                }
            }
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var index = dom.datagrid("getRowIndex", row);
                if (fields && fields.length > 0) {
                    for (var j = 0; j < fields.length; j++) {
                        var field = fields[j];
                        var ed = dom.datagrid('getEditor', { index: index, field: field });
                        if ($.valid(ed)) {
                            var ev = parseFloat(ed.getValue(ed.target));
                            if (!isNaN(ev))
                                obj[field] = obj[field] + ev;
                        } else {
                            var rv = parseFloat(row[field]);
                            if (!isNaN(rv))
                                obj[field] = obj[field] + rv;
                        }
                    }
                }
            }
            return [obj];
        },
        loadFooterWithSumChecked: function (jq, fields) {
            return jq.each(function (index, ctrl) {
                $(ctrl).datagrid('reloadFooter', $(ctrl).datagrid('sumChecked', fields));
            });
        },
        sum: function (jq, fields) {
            var numericReg = /[^0-9|\.]/ig;
            var dom = $(jq[0]);
            var rows = [];
            var allrows = dom.datagrid("getRows");
            
            if (dom.datagrid('options').idField != undefined && dom.datagrid('options').idField != "") {
                var chkrows = dom.datagrid("getChecked");
                var idField = dom.datagrid('options').idField;
                for (var i = 0; i < allrows.length; i++) {
                    var _idFiled1 = allrows[i][idField];
                    for (var j = 0; j < chkrows.length; j++) {
                        var _idFiled2 = chkrows[j][idField];
                        if (_idFiled1 == _idFiled2) {
                            rows.push(allrows[i]);
                        }
                    }
                }
            } else {
                rows = allrows;
            }
            
            var btnField;
            if (!$.isArray(fields)) {
                btnField = fields.btnField;
                fields = fields.fields;
            } else
                btnField = "btns";
            var obj = { IsFooter: true, btnField: -100 };
            if (fields && fields.length > 0) {
                for (var j = 0; j < fields.length; j++) {
                    var field = fields[j];
                    if (obj[field] == undefined || obj[field] == null)
                        obj[field] = 0;
                }
            }
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var index = dom.datagrid("getRowIndex", row);
                if (fields && fields.length > 0) {
                    for (var j = 0; j < fields.length; j++) {
                        var field = fields[j];
                        var ed = dom.datagrid('getEditor', { index: index, field: field });
                         
                        if ($.valid(ed)) {
                            var ev = 0;
                            //if (ed.getValue) {
                            //    alert(ed.getValue(ed.target).replace(numericReg, '').replace('', ''))
                            //    parseFloat(ed.getValue(ed.target).replace(numericReg, '').replace('', ''));
                            //} else {
                            //    parseFloat(ed.actions.getValue(ed.target).replace(numericReg, '').replace('', ''));
                            //}
                            if (ed != null) {
                                ev = $(ed.target).val().replace(numericReg, '').replace('', '');
                                ev = ev * ($(ed.target).val().indexOf("-") > -1 ? -1 : 1);
                            }
                            if (!isNaN(ev))
                                obj[field] = Math.AccAdd(parseFloat(obj[field]), ev);
                        } else {
                            var rv = parseFloat(row[field]);
                            if (!isNaN(rv))
                                obj[field] = Math.AccAdd(parseFloat(obj[field]), rv);
                        }
                    }
                }
            }
            return [obj];
        },
        loadFooterWithSum: function (jq, fields) {
            return jq.each(function (index, ctrl) {
                $(ctrl).datagrid('reloadFooter', $(ctrl).datagrid('sum', fields));
            });
        },
        setDataMonitor: function (jq, monitor) {
            if ($.isFunction(monitor)) {
                return jq.each(function (index, ctrl) {
                    var obj = $(ctrl);
                    var opt = obj.datagrid("options");
                    opt._onLoadSuccess = opt.onLoadSuccess;
                    opt._onAfterEdit = opt.onAfterEdit;
                    opt._onUpdateRow = opt.onUpdateRow;
                    opt._onAppendRow = opt.onAppendRow;
                    opt._onInsertRow = opt.onInsertRow;
                    opt._onDeleteRow = opt.onDeleteRow;

                    opt.onLoadSuccess = function (data) {
                        monitor.call(this, data);
                        opt._onLoadSuccess.call(this, data);
                    };
                    opt.onAfterEdit = function (rowIndex, rowData, changes) {
                        monitor.call(this, obj.datagrid("getData"));
                        opt._onAfterEdit.call(this, rowIndex, rowData, changes);
                    };
                    opt.onUpdateRow = function (param) {
                        monitor.call(this, obj.datagrid("getData"));
                        opt._onUpdateRow.call(this, param);
                    };
                    opt.onAppendRow = function (row) {
                        monitor.call(this, obj.datagrid("getData"));
                        opt._onAppendRow.call(this, row);
                    };
                    opt.onInsertRow = function (param) {
                        monitor.call(this, obj.datagrid("getData"));
                        opt._onInsertRow.call(this, param);
                    };
                    opt.onDeleteRow = function (index) {
                        monitor.call(this, obj.datagrid("getData"));
                        opt._onDeleteRow.call(this, index);
                    };
                });
            }
        },
        resetDataMonitor: function (jq) {
            return jq.each(function (index, ctrl) {
                var obj = $(ctrl);
                var opt = obj.datagrid("options");
                if ($.isFunction(opt._onLoadSuccess))
                    opt.onLoadSuccess = opt._onLoadSuccess;
                if ($.isFunction(opt._onAfterEdit))
                    opt.onAfterEdit = opt._onAfterEdit;
                if ($.isFunction(opt._onUpdateRow))
                    opt.onUpdateRow = opt._onUpdateRow;
                if ($.isFunction(opt._onAppendRow))
                    opt.onAppendRow = opt._onAppendRow;
                if ($.isFunction(opt._onInsertRow))
                    opt.onInsertRow = opt._onInsertRow;
                if ($.isFunction(opt._onDeleteRow))
                    opt.onDeleteRow = opt._onDeleteRow;
            });
        },
        getEditorWithElement: function (jq, element) {
            cell = $(element).parents("div.datagrid-editable");
            if (cell.length > 0)
                return $.data(cell[0], "datagrid.editor");
        },
        getEditorsWithElement: function (jq, element) {
            tr = $(element).parents("tr.datagrid-row");
            if (tr.length > 0) {
                var ret = [];
                tr.children("td").each(function () {
                    var cell = $(this).find("div.datagrid-editable");
                    if (cell.length) {
                        var ed = $.data(cell[0], "datagrid.editor");
                        if (ed) {
                            ret[ed.field] = ed;
                            ret.push(ed);
                        }
                    }
                });
                return ret;
            }
        },
        getEditorsWithIndex: function (jq, index) {
            var edts = $(jq[0]).datagrid("getEditors", index);
            var ret = {};
            for (var i = 0; i < edts.length; i++) {
                ret[edts[i].field] = edts[i];
            }
            return ret;
        },
        hasEditor: function (jq, target) {
            cell = $(target).parents("div.datagrid-editable");
            if (cell.length > 0)
                return $.valid($.data(cell[0], "datagrid.editor"));
        },
        isEditing: function (jq, index) {
            if ($.isNumeric(index)) {
                var opts = $(jq[0]).datagrid("options");
                var tr = opts.finder.getTr(jq[0], index, "body", 1);
                return $(tr).is(".datagrid-row-editing");
            } else {
                return $($(jq[0]).datagrid("getPanel")).find(".datagrid-row-editing").first().length > 0;
            }
        },
        isChecked: function (jq, index) {
            if ($.isNumeric(index)) {
                var opts = $(jq[0]).datagrid("options");
                var tr = opts.finder.getTr(jq[0], index, "body", 1);
                return $(tr).find(".datagrid-cell-check input").is(':checked');
            } else {
                return $($(jq[0]).datagrid("getPanel")).find(".datagrid-cell-check input:checked").length>0;
            }
        },
        getEditingRowIndex: function (jq) {
            var opts = $(jq[0]).datagrid("options");
            var rst = [];
            opts.finder.getTr(jq[0], 0, "allbody", 1).each(function () {
                if ($(this).is(".datagrid-row-editing"))
                    rst.push(parseInt($(this).attr("datagrid-row-index")));
            });
            return rst;
        },
        getRowIndexWithElement: function (jq, element) {
            return parseInt($(element).parents("tr.datagrid-row").first().attr("datagrid-row-index"));
        },
        resetToolBar: function (jq, toolbar) {
            return jq.each(function (index, ctrl) {
                var panel = $(ctrl).datagrid("getPanel");
                if (toolbar) {
                    if ($.isArray(toolbar)) {
                        $("div.datagrid-toolbar", panel).remove();
                        var tb = $("<div class=\"datagrid-toolbar\"><table cellspacing=\"0\" cellpadding=\"0\"><tr></tr></table></div>").prependTo(panel);
                        var tr = tb.find("tr");
                        for (var i = 0; i < toolbar.length; i++) {
                            var btn = toolbar[i];
                            if (btn == "-") {
                                $("<td><div class=\"datagrid-btn-separator\"></div></td>").appendTo(tr);
                            } else {
                                var td = $("<td></td>").appendTo(tr);
                                var tool = $("<a href=\"javascript:void(0)\"></a>").appendTo(td);
                                tool[0].onclick = eval(btn.handler || function () {
                                });
                                tool.linkbutton($.extend({}, btn, { plain: true }));
                            }
                        }
                    } else {
                        $(toolbar).addClass("datagrid-toolbar").prependTo(panel);
                        $(toolbar).show();
                    }
                } else {
                    $("div.datagrid-toolbar", panel).remove();
                }
            });
        }
    });
    var numberboxfilter = $.fn.numberbox.defaults.filter;
    $.extend($.fn.numberbox.defaults, {
        filter: function (e) {
            var key = e.which;
            if (key == 13) {
                var self = e.target;
                e.stopPropagation();
                e.preventDefault();
                window.setTimeout(function () {

                    var ipts = $("input:text:visible");

                    var idx = ipts.index(self);

                    if (idx == ipts.length - 1) {
                        ipts[0].select()
                    } else {
                        ipts[idx + 1].focus(); //  handles submit buttons
                        ipts[idx + 1].select();
                    }
                }, 50);
                return false;
            }
            return numberboxfilter.call(this, e);
        }
    });
    $.extend($.fn.combobox.defaults,
    {
        formatter: function (row) {
            var opts = $(this).combobox('options');
            var txt = row[opts.textField]
            if (txt == '' || txt == undefined || txt == null) {
                if (row.deleted)
                    return '<span style="color:red;">' + '(已删除)' + '</span>';
                if (row.isEnabled == false)
                    return '<span style="color:red;">' + '(非活动)' + '</span>';
                return "&nbsp;";
            }
            if (row.deleted)
                return '<span style="color:red;">' + txt + '(已删除)' + '</span>';
            if (row.isEnabled == false)
                return '<span style="color:red;">' + txt + '(非活动)' + '</span>';
            return txt;
        },
        defaultValueMode: -1
    });
    var combokeyHandlerenter = $.fn.combo.defaults.keyHandler.enter;
    $.extend($.fn.combo.defaults.keyHandler, {
        enter: function (e) {
            var self = $(e.target);
            e.stopPropagation();
            e.preventDefault();
            window.setTimeout(function () {

                var ipts = $("input:text:visible");

                var idx = ipts.index(self);

                if (idx == ipts.length - 1) {
                    ipts[0].select()
                } else {
                    ipts[idx + 1].focus(); //  handles submit buttons
                    ipts[idx + 1].select();
                }
            }, 50);
            return combokeyHandlerenter.call(this, e);
        }
    });
    var comboboxkeyHandlerenter = $.fn.combobox.defaults.keyHandler.enter;
    $.extend($.fn.combobox.defaults.keyHandler,{
        enter: function (e) {
            var self = $(e.target);
            e.stopPropagation();
            e.preventDefault();
            window.setTimeout(function () {

                var ipts = $("input:text:visible");

                var idx = ipts.index(self);

                if (idx == ipts.length - 1) {
                    ipts[0].select()
                } else {
                    ipts[idx + 1].focus(); //  handles submit buttons
                    ipts[idx + 1].select();
                }
            }, 50);
            return comboboxkeyHandlerenter.call(this, e);
        }
    });
    $.extend($.fn.combobox.methods, {
        setTotalData: function (jq, data) {
            return jq.each(function (index, ctrl) {
                $(ctrl).data('totalData', data);
            });
        },
        getTotalData: function (jq, data) {
            var ret = [];
            jq.each(function (index, ctrl) {
                var self = $(ctrl);
                var sdata = self.data('totalData');
                if ($.valid(sdata)) {
                    if ($.isArray(sdata)) {
                        for (var i = 0; i < sdata.length; i++)
                            ret.push(sdata[i]);
                    } else
                        ret.push(sdata);
                }
            });
            if (ret.length > 0)
                return ret;
        },
        reload: function (jq) {
            return jq.each(function (index, ctrl) {
                var self = $(this);
                var opts = self.combobox("options");
                var opt = $.extend({}, opts);
                
                if (opt.action) {
                    var oval = self.combobox("getValue");
                    GM.Core.loadEnumData(opt.action, opt.category,
                        function (data) {
                            if (data) {
                                var sopt = self.combobox("options");
                                var total = data.data;
                                if (opt.isbool) {
                                    if (opt.isedit)
                                        total = total.toQuerable().select(function (t) { t[opts.valueField] = t[opts.valueField] ? 'true' : 'false'; return t }).toArray();
                                    else {
                                        total = total.toQuerable().select(function (t) {
                                            var value = parseInt(t[opts.valueField]);
                                            if ($.isNumeric(value))
                                                value = value - 1;
                                            else
                                                value = 0;
                                            t[opts.valueField] = value.toString(); return t
                                        }).toArray();
                                    }
                                }
                                if ($.isArray(opt.extendData)) {
                                    total = opt.extendData.toQuerable().unionAll(total).toArray();
                                }
                                self.combobox("setTotalData", total);
                                if (opts.CompanyData) {
                                    opts.CompanyBankAccountDataIsreload = true;
                                }//处理公司银行多账户
                                var parentValue = self.combobox("getParentValue");
                                if (!$.valid(parentValue)) {
                                    var parentEnum = self.data("parentEnum");
                                    if ($.valid(parentEnum)) {
                                        parentValue = parentEnum.combobox("getValue");
                                        if (!$.valid(parentValue)) {
                                            var popts = parentEnum.combobox("options");
                                            var pdata = parentEnum.combobox("getData");
                                            if ($.isArray(pdata) && pdata.length > 0)
                                                parentValue = pdata[0][popts.valueField];
                                        }
                                    }
                                }

                                self.combobox("setParentValue", parentValue);
                            }
                        }, false, true, opt.IsIncludeNull, opt.FinancialLevelType, opt.FinancialLevel,opt.opts);
                }
            });
        },
        loadEnum: function (jq, opt) {
            return jq.each(function (index, ctrl) {
                var self = $(this);
                var opts = self.combobox("options");
                opt = $.extend({}, opt);
                if (!opt.action)
                    opt.action = "Base.Enum.List";
                $.extend(opts, opt);
                opts.filter = function (q, row)
                {
                    if (q) {
                        if (row) {
                            q = $.trim(q);
                            var opts = self.combobox("options");
                            var fv;
                            var vv;
                            var tv;
                            if (opts.filterField) {
                                fv = row[opts.filterField];
                            }
                            if (opts.valueField) {
                                vv = row[opts.valueField];
                            }
                            if (opts.textField) {
                                tv = row[opts.textField];
                            }
                            var ret =
                            (fv && fv.toString().toLowerCase().indexOf(q.toLowerCase()) >= 0) ||
                            (vv && vv.toString().indexOf(q) >= 0) ||
                            (tv && tv.toString().indexOf(q) >= 0);
                            return ret;
                        }
                        return false;
                    }
                    return true;
                };
               
                var oval = self.combobox("getValue");
                GM.Core.loadEnumData(opt.action, opt.category,
                    function (data)
                    {
                        if (data) {
                            var sopt = self.combobox("options");
                            var total = data;
                            if (opt.isbool) {
                                if (opt.isedit)
                                    total = total.toQuerable().select(function (t) { t[opts.valueField] = t[opts.valueField] ? 'true' : 'false'; return t }).toArray();
                                else {
                                    total = total.toQuerable().select(function (t) {
                                        var value = parseInt(t[opts.valueField]);
                                        if ($.isNumeric(value))
                                            value = value - 1;
                                        else
                                            value = 0;
                                        t[opts.valueField] = value.toString(); return t
                                    }).toArray();
                                }
                            }
                            if ($.isArray(opt.extendData)) {
                                total = opt.extendData.toQuerable().unionAll(total).toArray();
                            }
                            self.combobox("setTotalData", total); 
                            var parentValue = self.combobox("getParentValue");
                            if (!$.valid(parentValue)) {
                                var parentEnum = self.data("parentEnum");
                                if ($.valid(parentEnum)) {
                                    parentValue = parentEnum.combobox("getValue");
                                    if (!$.valid(parentValue)) {
                                        var popts = parentEnum.combobox("options");
                                        var pdata = parentEnum.combobox("getData");
                                        if ($.isArray(pdata) && pdata.length > 0)
                                            parentValue = pdata[0][popts.valueField];
                                    }
                                }
                            }
                            self.combobox("setParentValue", parentValue);
                        }
                    },
                    typeof (opt.async) == "undefined" ? true : opt.async,
                    typeof (opt.forceRefresh) == "undefined" ? false : opt.forceRefresh,
                    opts.IsIncludeNull,
                    opts.FinancialLevelType,
                    opts.FinancialLevel, opt.opts);
            });
        },
        getParentValue:function(jq){
            return $(jq[0]).data("parentValue");
        },
        setParentValue: function (jq, value) {
            return jq.each(function (index, ctrl) {
                var self = $(this);
                var sopt = self.combobox("options");
                var oval = self.combobox("getValue");
                self.data("parentValue", value);
                self.combobox('clear');
                var total = self.combobox("getTotalData");
                if (!$.valid(total)) {
                    total = self.combobox("getData");
                    self.combobox("setTotalData", total);
                }
                if ($.isArray(total))
                {
                    var setdata;
                    if ($.valid(value))
                    {
                        setdata = total.toQuerable().where(function (it)
                        {
                            var pv = it[sopt.parentField];
                            if ($.isArray(pv))
                                return pv.isContain(value);
                            return pv == value || pv === "" || !$.valid(pv)
                        }).toArray();
                    } else
                    {
                        self.removeData("parentValue");
                        var parentEnum = self.data("parentEnum");
                        if (parentEnum)
                        {
                            var popt = parentEnum.combobox("options");
                            var pdata = parentEnum.combobox("getData");
                            if (pdata)
                            {
                                setdata = total.toQuerable().where(function (it)
                                {
                                    var pv = it[sopt.parentField];
                                    if ($.isArray(pv))
                                        return pdata.isContain(pv, popt.valueField);
                                    return pdata.isContain(pv, popt.valueField) || pv === "" || !$.valid(pv)
                                }).toArray();;
                            }
                            else
                            {
                                setdata = total;
                            }
                        } else
                        {
                            setdata = total;
                        }
                    }
                    if ($.isArray(setdata)) {
                        self.combobox('loadData', setdata);
                    }
                    if (setdata.length > 0)
                    {
                        if (!$.valid(oval) || !setdata.toQuerable().where(function (t) { if (t[sopt.valueField] == oval) return t; }).any())
                        {
                            var v = speciallogic.getFirstNotEmptyComboValue(sopt, setdata, setdata[0][sopt.valueField]);
                            self.combobox("setValue", v);
                        }
                        else
                            self.combobox("setValue", oval);
                    } else
                        self.combobox("clear");
                }
            });
        },
        setParentEnum: function (jq, opt) { 
            if (!opt)
                opt = {};
            return jq.each(function (index, ctrl) {
                var isSelfChange = false;
                var self = $(ctrl);
                var sopt = self.combobox("options");
                $.extend(sopt, opt);
                var feedback = sopt.feedback;
                if (opt.parentEnum) {
                    var oldparentEnum = self.data("parentEnum");
                    if (!oldparentEnum) {
                        var parentEnum = $(opt.parentEnum);
                        self.data("parentEnum", parentEnum);
                        var popts = parentEnum.combobox("options");
                        sopt._onParentSelect = popts.onChange;
                        popts.onChange = function (nv, ov) { 
                            doOnSelect(nv);
                            if ($.isFunction(sopt._onParentSelect))
                                sopt._onParentSelect.call(ctrl, nv, ov);
                        };
                        var pval = parentEnum.combobox('getValue');
                        //doOnSelect(pval);
                        parentEnum.combobox(popts);
                        parentEnum.combobox('setValue', pval);
                        if (feedback) {
                            var sonselect = sopt.onChange;
                            sopt._onSelect = sonselect;
                            sopt.onChange = function (nv, ov) { 
                                doOnSelfSelect(nv);
                                if ($.isFunction(sonselect))
                                    sonselect.call(ctrl, nv, ov);
                            }
                            var sval = self.combobox('getValue');
                            self.combobox(sopt);
                            self.combobox('setValue', sval);
                        }
                    }
                } else {
                    var oldparentEnum = self.data("parentEnum");
                    self.removeData("parentEnum");
                    if ($.valid(oldparentEnum)) {
                        var popts = oldparentEnum.combobox("options");
                        if ($.isFunction(sopt._onParentSelect))
                            popts.onChange = sopt._onParentSelect;
                        delete sopt._onParentSelect;
                        oldparentEnum.combobox(popts);
                    }
                    if (feedback) {
                        var sopt = self.combobox("options");
                        if ($.isFunction(sopt._onSelect))
                            sopt.onChange = sopt._onSelect;
                        delete sopt._onSelect;
                        var sval = self.combobox('getValue');
                        self.combobox(sopt);
                        self.combobox('setValue', sval);
                    }
                    doOnSelect(null);
                }

                function doOnSelfSelect(value) { 
                    if (!isSelfChange) {
                        isSelfChange = true;
                        try {
                            var parentEnum = self.data("parentEnum");
                            if (parentEnum) {
                                var sopt = self.combobox("options");
                                var total = self.combobox("getTotalData");
                                if (!$.valid(total)) {
                                    total = self.combobox("getData");
                                    self.combobox("setTotalData", total);
                                }
                                if ($.isArray(total)) {
                                    var pvalue;
                                    var pdata = total.toQuerable().where(function (it) {
                                        return it[sopt.valueField] == value
                                    }).toArray();
                                    if (pdata.length > 0) {
                                        pvalue = pdata[0][sopt.parentField];
                                    }

                                    if ($.isArray(pvalue) && pvalue.length > 0) {
                                        if (!pvalue.isContain(parentEnum.combobox("getValue")))
                                            parentEnum.combobox("setValue", pvalue[0]);
                                    }
                                    else {
                                        if ($.valid(pvalue) && pvalue != parentEnum.combobox("getValue"))
                                            parentEnum.combobox("setValue", pvalue);
                                    }
                                }
                            }
                        } finally {
                            isSelfChange = false;
                        }
                    }
                }

                function doOnSelect(value) {
                    if (!isSelfChange) {
                        isSelfChange = true;
                        try {
                            self.combobox("setParentValue", value);
                        } finally {
                            isSelfChange = false;
                        }
                    }
                }
            });
        },
        getEnumText: function (jq, opt) {
            var text = "";
            if ($.valid(opt)) {
                jq.each(function (index, ctrl) {
                    var self = $(ctrl);
                    var opts = self.combobox("options");
                    text = GM.Core.getEnumText(opts.action, opts.category, opt, opts.textField, opts.valueField);
                    if ($.valid(text) && text != "")
                        return false;
                });
            }
            return text;
        },
        getSelectData: function (jq, opt) {
            var self = $(jq[0]);
            var opts = self.combobox("options");
            var sdata = self.combobox('getData');
            var value = self.combobox('getValue');
            if ($.valid(sdata)) {
                if ($.isArray(sdata)) {
                    for (var i = 0; i < sdata.length; i++) {
                        if (value == sdata[i][opts.valueField]) {
                            return sdata[i];
                        }
                    }
                } else if (value == sdata[opts.valueField])
                    return sdata
            }
        }
    });
    var form$load = $.fn.form.methods.load;

    $.extend($.fn.form.methods, {
        load: function (target, data) {
            if (!$.data(target, 'form')) {
                $.data(target, 'form', {
                    options: $.extend({}, $.fn.form.defaults)
                });
            }
            var opts = $.data(target, 'form').options;

            if (typeof data == 'string') {
                var param = {};
                if (opts.onBeforeLoad.call(target, param) == false) return;

                $.ajax({
                    url: data,
                    data: param,
                    dataType: 'json',
                    success: function (data) {
                        _load(data);
                    },
                    error: function () {
                        opts.onLoadError.apply(target, arguments);
                    }
                });
            } else {
                _load(data);
            }

            function _load(data) {
                var form = $(target);
                for (var name in data) {
                    var val = data[name];
                    if (Date.isDateString(val))
                        val = val.split(/T| /)[0];
                    var rr = _checkField(name, val);
                    if (!rr.length) {
                        //					var f = form.find('input[numberboxName="'+name+'"]');
                        //					if (f.length){
                        //						f.numberbox('setValue', val);	// set numberbox value
                        //					} else {
                        //						$('input[name="'+name+'"]', form).val(val);
                        //						$('textarea[name="'+name+'"]', form).val(val);
                        //						$('select[name="'+name+'"]', form).val(val);
                        //					}
                        var count = _loadOther(name, val);
                        if (!count) {
                            $('input[name="' + name + '"]', form).val(val);
                            $('textarea[name="' + name + '"]', form).val(val);
                            $('select[name="' + name + '"]', form).val(val);
                            if (val != null && val != undefined) {
                                $('span[name="' + name + '"]', form).text(val);
                                $('div[name="' + name + '"]', form).text(val);
                            }
                        }
                    }
                    _loadCombo(name, val);
                }
                opts.onLoadSuccess.call(target, data);
                form.form("validate");
            }

            /**
             * check the checkbox and radio fields
             */
            function _checkField(name, val) {
                var rr = $(target).find('input[name="' + name + '"][type=radio], input[name="' + name + '"][type=checkbox]');
                rr._propAttr('checked', false);
                rr.each(function () {
                    var f = $(this);
                    if (f.val() == String(val) || $.inArray(f.val(), $.isArray(val) ? val : [val]) >= 0) {
                        f._propAttr('checked', true);
                    }
                });
                return rr;
            }

            function _loadOther(name, val) {
                var count = 0;
                var pp = ['numberbox', 'slider'];
                for (var i = 0; i < pp.length; i++) {
                    var p = pp[i];
                    var f = $(target).find('input[' + p + 'Name="' + name + '"]');
                    if (f.length) {
                        f[p]('setValue', val);
                        count += f.length;
                    }
                }
                return count;
            }

            function _loadCombo(name, val) {
                var form = $(target);
                var cc = ['combobox', 'combotree', 'combogrid', 'datetimebox', 'datebox', 'combo'];
                var c = form.find('[comboName="' + name + '"]');
                if (c.length) {
                    for (var i = 0; i < cc.length; i++) {
                        var type = cc[i];
                        if (c.hasClass(type + '-f')) {
                            if (c[type]('options').multiple) {
                                c[type]('setValues', val);
                            } else {
                                c[type]('setValue', val);
                            }
                            return;
                        }
                    }
                }
            }
        }
        /*function (jq, para) {
            if (typeof para !== 'string') {
                if ($.valid(para)) {
                    $.each(para, function (name, value) {
                        if (Date.isDateString(value))
                            para[name] = value.split(/T| /)[0];
                    });
                }
            }
            return jq.each(function (index, ctrl) {
                form$load.call(this, $(this), para);
            });
        }*/,
        submitAction: function (jq, para) {
            return jq.each(function (index, ctrl) {
                var self = $(ctrl);
                var onsubmint = para.onSubmit;
                self.form('submit', $.extend(
                    para,
                    {
                        onSubmit: function (param) {
                            if ($.isFunction(onsubmint) && !onsubmint.call(self, param))
                                return false;
                            GM.WindowsUtility.waitFor(para.loadMsg, function (complete) {
                                GM.Core.doPostAction(
                                $.isFunction(para.action) ? para.action() : para.action,
                                $.isFunction(para.data) ? para.data() : para.data,
                                function (data) {
                                    complete();
                                    if ($.isFunction(para.success))
                                        para.success.call(self, data);
                                },
                                true,
                                function (XMLHttpRequest, textStatus, errorThrown) {
                                    complete();
                                    if ($.isFunction(para.error))
                                        para.error.call(self, XMLHttpRequest, textStatus, errorThrown);
                                },
                                $.isFunction(para.executeAction) ? para.executeAction() : para.executeAction);
                            }, para);
                            return false;
                        }
                    })
                );
            });
        }
    });
    $.extend($.fn.validatebox.defaults.rules, {
        regexTest: {
            validator: function (value, param) {
                if ($.isArray(param) && param.length > 0) {
                    if (param.length > 1)
                        $.fn.validatebox.defaults.rules.regexTest.message = param[1];
                    return !$.valid(value) || !$.valid(param[0]) || param[0].test(value);
                }
                return true;
            },
            message: '不是有效值'
        },
        nonregexTest: {
            validator: function (value, param) {
                if ($.isArray(param) && param.length > 0) {
                    if (param.length > 1)
                        $.fn.validatebox.defaults.rules.nonregexTest.message = param[1];
                    return !$.valid(value) || !$.valid(param[0]) || !param[0].test(value);
                }
                return true;
            },
            message: '不是有效值'
        }
    });
})(jQuery);



var speciallogic = {
    defaultValueMode: {
        normal: -1,
        firstValue: -2,
        lastValue: -3
    },
    getFirstNotEmptyComboValue: function (sopt, setdata, value) {
        if (!$.valid(sopt.defaultValueMode))
            sopt.defaultValueMode = speciallogic.defaultValueMode.normal;
        if (sopt.required
            && (value == null || value == "" || value == undefined)) {
            if (sopt.defaultValueMode == speciallogic.defaultValueMode.normal) {
                var set = setdata.toQuerable().where(function (t) { var vf = t[sopt.valueField]; return vf != null && vf != '' && vf != undefined }).toArray();
                if (set.length < 2 && set.length > 0)
                    return set[0][sopt.valueField];
            } else if (sopt.defaultValueMode == speciallogic.defaultValueMode.firstValue) {
                if (setdata.length > 0)
                    return setdata[0][sopt.valueField];
            } else if (sopt.defaultValueMode == speciallogic.defaultValueMode.lastValue) {
                if (setdata.length > 0)
                    return setdata[setdata.length - 1][sopt.valueField];
            } else if (sopt.defaultValueMode >= 0 && setdata.length > 0)
                return setdata[Math.min(setdata.length - 1, sopt.defaultValueMode)][sopt.valueField];
        }
        return value;
    }
};