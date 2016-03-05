(function ($) {
    $.extend($.fn.datagrid.defaults.editors, {
        checkbox: {
            init: function (container, _62a) {
                var _62b = $("<input type=\"checkbox\">").appendTo(container);
                _62b.val(_62a.on);
                _62b.attr("offval", _62a.off);
                return _62b;
            }, getValue: function (target) {
                if ($(target).is(":checked")) {
                    return true;
                } else {
                    return false;
                }
            }, setValue: function (target, value) {
                //alert(value);
                $(target)._propAttr("checked", value);
            }
        },
        //用法eg:
        //{ field: 'Spec', title: '产品规格', width: 120, formatter: $.fn.datagrid.defaults.editors.products.gdFormartter, editor: { type: 'products', options: { required: true } } }
        products: {
            PDD: null,
            init: function (container, options) {

                var input = $("<div><input class='pdn' /><br /><input class='reg' /></div>").appendTo(container);


                return input;
            },
            destroy: function (target) {
                $(target).remove();
            },
            getValue: function (target) {
                return $(target).find(".reg").val();
            },
            setValue: function (target, value) {
                var pdn = $(target).find(".pdn");
                var reg = $(target).find(".reg");
                var pdData = this.loadPd();
                var regData0 = null;
                var regd = null;
                if (value) {
                    regd = this.loadSReg(value);
                }

                regData0 = this.loadReg(regd ? regd.ProductNameId : pdData[0].Id);
                $(target).panel({ fit: true });
                GM.Editor.txtToEnumCombobox(pdn, pdData, regd ? regd.ProductNameId : pdData[0].Id, false, null, "Id", "Name", function (record) {
                    var d = $.fn.datagrid.defaults.editors.products.loadReg(record.Id);
                    reg.combobox({ data: d, value: (d.length > 0 ? d[0].Id : "") });
                    $(target).find(".reg").val(d.length > 0 ? d[0].Id : "");
                });
                GM.Editor.txtToEnumCombobox(reg, regData0, (regd) ? regd.Id : (regData0.length > 0 ? regData0[0].Id : ""), false, null, "Id", "Name");

            },
            resize: function (target, width) {
                $(target)._outerWidth(width);
            },
            loadPd: function () {
                if ($.fn.datagrid.defaults.editors.products.PDD == null) {
                    var res;
                    var sobj = {
                        BusObjs: [{ BusObjName: "ProductName" }], Props: [{ LExp: "Id" }, { LExp: "Name" }]

                            , Orders: [{ PropName: "Name", OrderType: "DESC" }]
                    };
                    GM.Core.doPostAction("Base.ProductName.Query", sobj, function (json) {
                        $.fn.datagrid.defaults.editors.products.PDD = json.data.rows;
                    }, false);
                }
                return $.fn.datagrid.defaults.editors.products.PDD;
            },
            loadReg: function (pid) {
                var res;
                var sobj = {
                    BusObjs: [{ BusObjName: "Specification" }], Props: [{ LExp: "Id" }, { LExp: "Name" }, { LExp: "ProductNameId" }]
                        , Wheres: [{ LExp: "ProductNameId", RExp: "@pid" }]
                        , Params: [{ LExp: "@pid", RExp: pid }]
                        , Orders: [{ PropName: "Name", OrderType: "DESC" }]
                };
                GM.Core.doPostAction("Base.Specification.Query", sobj, function (json) {
                    res = json.data.rows;
                }, false);
                return res;
            },
            loadSReg: function (id) {
                var res;
                var sobj = {
                    BusObjs: [{ BusObjName: "Specification" }], Props: [{ LExp: "Id" }, { LExp: "Name" }, { LExp: "ProductNameId" }]
                        , Wheres: [{ LExp: "Id", RExp: "@id" }]
                        , Params: [{ LExp: "@id", RExp: isNaN(id) ? 0 : id }]
                        , Orders: [{ PropName: "Name", OrderType: "DESC" }]
                };
                GM.Core.doPostAction("Base.Specification.Query", sobj, function (json) {

                    res = json.data.rows.length > 0 ? json.data.rows[0] : null;
                }, false);
                return res;
            },
            gdFormartter: function (val, row) {

                if (!val || isNaN(val)) return val;

                var d1 = $.fn.datagrid.defaults.editors.products.loadPd();
                var regd = $.fn.datagrid.defaults.editors.products.loadSReg(val);

                var d2 = $.fn.datagrid.defaults.editors.products.loadReg(regd.ProductNameId);

                var res = "";
                for (var i = 0; i < d2.length; i++) {
                    if (d2[i].Id == val) { res += d2[i].Name; regd = d2[i]; }
                }
                if (regd) {
                    for (var i = 0; i < d1.length; i++) {
                        if (d1[i].Id == regd.ProductNameId) res = d1[i].Name + res;
                    }
                }
                return res;
            }
        },
        searchbox: {
            init: function (container, options) {
                var input = $('<input>').appendTo(container);
                options = $.extend({}, options);
                return input.searchbox(options);
            },
            destroy: function (target) {
                $(target).remove();
            },
            getValue: function (target) {
                return $(target).searchbox('getValue');
            },
            setValue: function (target, value) {
                $(target).searchbox("setValue", value);
            },
            resize: function (target, width) {
                var input = $(target);
                input.searchbox("resize", width);
                //if ($.boxModel == true) {
                //    input.searchbox("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    input.searchbox("resize", width);
                //}
            }
        },
        dialogselector: {
            init: function (container, options) {
                var input = $('<input>').appendTo(container);
                return input.dialogselector(options);
            },
            destroy: function (target) {
                $(target).remove();
            },
            getValue: function (target) {
                return $(target).dialogselector('getValue');
            },
            setValue: function (target, value) {
                $(target).dialogselector("setValue", value);
            },
            resize: function (target, width) {
                var input = $(target);
                input.dialogselector("resize", width);
                //if ($.boxModel == true) {
                //    input.dialogselector("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    input.dialogselector("resize", width);
                //}
            }
        },
        selector: {
            init: function (container, options) {
                var input = $('<input>').appendTo(container);
                //尹熊加 刷新连带功能
                var comboReloadClass = "";
                if (options.action) {
                    comboReloadClass = "combo-reload-" + options.action.replace(/\./gm, '_');
                    input.addClass(comboReloadClass);
                }
                options = $.extend({ panelHeight: 'auto', comboReloadClass: comboReloadClass }, options);
                 
                input.combobox(options);
                if ($.valid(options.initVal)) {
                    input.val(options.initVal);
                    input.combobox("setValue", options.initVal);
                }
                input.combobox("loadEnum", { action: options.action, category: options.category, extendData: options.otherData, isbool: options.isbool, opts: { FillterId: options.FillterId, FillterType: options.FillterType }});
                return input;
            },
            destroy: function (target) {
                $(target).remove();
            },
            getValue: function (target) {
                var input = $(target);
                var options = input.combobox("options");
                if (options.multiple)
                    return input.combobox("getValues");
                else
                    return input.combobox("getValue");
            },
            setValue: function (target, value) {
                var input = $(target);
                var options = input.combobox("options");
                if (!options.initVal || $.valid(value)) {
                    if (options.multiple) {
                        if (value)
                        {
                            if (!$.isArray(value)) {
                                value = value.split(",");
                            }
                        }
                        GM.UIHelper.waiting(function () { input.combobox("setValues", value); });
                    }
                    else
                        input.combobox("setValue", value);
                }
            },
            resize: function (target, width) {
                var input = $(target);
                input.combobox("resize", width);
                //if ($.boxModel == true) {
                //    input.combobox("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    input.combobox("resize", width);
                //}
            }
        },
        specification: {
            init: function (container, options) {
                options.pushValue = false;
                var input = $('<input>').appendTo(container).specification(options);
                return input;
            },
            destroy: function (target) {
                $(target).specification("destroy");
            },
            getValue: function (target) {
                return $(target).specification('getValue');
            },
            setValue: function (target, value) {
                var input = $(target);
                input.specification("setValue", value);
            },
            resize: function (target, width) {
                var input = $(target);
                input.specification("resize", width);
                //if ($.boxModel == true) {
                //    input.specification("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    input.specification("resize", width - 4);
                //}
            },
            formatter: function (value, row, index) {
                return GM.Core.getEnumText('ProductName.Enum.List', '', GM.Core.getParentEnumValue('Specification.Enum.List', '', value)) +
                    GM.Core.getEnumText('Specification.Enum.List', '', value);
            }
        },
        priceselector: {
            init: function (container, options) {
                var input = $('<input>').appendTo(container).priceselector(options);
                return input;
            },
            destroy: function (target) {
                $(target).priceselector("destroy");
            },
            getValue: function (target) {
                return $(target).priceselector('getValue');
            },
            setValue: function (target, value) {
                var input = $(target);
                input.priceselector("setValue", value);
            },
            resize: function (target, width) {
                var input = $(target);
                input.priceselector("resize", width);
                //if ($.boxModel == true) {
                //    input.priceselector("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    input.priceselector("resize", width - 4);
                //}
            }
        },
        calculableselector: {
            init: function (container, options) {
                var input = $('<input>').appendTo(container).calculableselector(options);
                return input;
            },
            destroy: function (target) {
                $(target).calculableselector("destroy");
            },
            getValue: function (target) {
                return $(target).calculableselector('getValue');
            },
            setValue: function (target, value) {
                var input = $(target);
                input.calculableselector("setValue", value);
            },
            resize: function (target, width) {
                var input = $(target);
                input.calculableselector("resize", width);
                //if ($.boxModel == true) {
                //    input.calculableselector("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    input.calculableselector("resize", width - 4);
                //}
            }
        },
        my97datebox: {
            init: function (container, options) {
                var input = $('<input>').appendTo(container);
                return input.my97datebox($.extend({}, options));
            },
            destroy: function (target) {
                $(target).parent().remove();
            },
            getValue: function (target) {
                return $(target).my97datebox('getValue');
            },
            setValue: function (target, value) {
                $(target).my97datebox("setValue", value);
            },
            resize: function (target, width) {
                var input = $(target);
                input.my97datebox("resize", width);
                //if ($.boxModel == true) {
                //    //input.width(width - (input.outerWidth() - input.width()));
                //    input.my97datebox("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    //input.width(width);
                //    input.my97datebox("resize", width);
                //}
            }
        },
        numberspinner: {
            init: function (container, options) {
                var input = $('<input>').appendTo(container);
                return input.numberspinner($.extend({}, options));
            },
            destroy: function (target) {
                $(target).parent().remove();
            },
            getValue: function (target) {
                return $(target).numberspinner('getValue');
            },
            setValue: function (target, value) {
                $(target).numberspinner("setValue", value);
            },
            resize: function (target, width) {
                var input = $(target);
                input.numberspinner("resize", width);
                //if ($.boxModel == true) {
                //    //input.width(width - (input.outerWidth() - input.width()));
                //    input.numberspinner("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    //input.width(width);
                //    input.numberspinner("resize", width);
                //}
            }
        },
        selectuser: {
            init: function (container, options) {

                function newGuid() {
                    var guid = '';
                    for (var i = 1; i <= 16; i++) {
                        var n = Math.floor(Math.random() * 16.0).toString(16);
                        guid += n;
                        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                            guid += '-';
                    }
                    return guid;
                }

                var guid = newGuid();
                var input = $('<input id="' + guid + '">').appendTo(container);
                return GM.Editor.txtToUserComboGrid(guid, '', $.extend({ height: 22 }, options));
            },
            destroy: function (target) {
                $(target).parent().remove();
            },
            getValue: function (target) {
                return $(target).combobox('getValue');
            },
            setValue: function (target, value) {
                $(target).combobox("setValue", value);
            },
            resize: function (target, width) {
                var input = $(target);
                input.combobox("resize", width);
                //if ($.boxModel == true) {
                //    input.combobox("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    input.combobox("resize", width);
                //}
            }
        },
        text: {
            init: function (container, options) {
                var input = $('<input>').appendTo(container);
                return input.textbox($.extend({}, options));
            },
            destroy: function (target) {
                $(target).textbox("destroy");
                $(target).parent().remove();
            },
            getValue: function (target) {
                return $(target).textbox('getValue');
            },
            setValue: function (target, value) {
                $(target).textbox("setValue", value);
            },
            resize: function (target, width) {
                var input = $(target);
                input.textbox("resize", width);
                //if ($.boxModel == true) {
                //    //input.width(width - (input.outerWidth() - input.width()));
                //    input.textbox("resize", width - (input.outerWidth() - input.width()));
                //} else {
                //    //input.width(width);
                //    input.textbox("resize", width);
                //}
            }
        }
    });
})(jQuery);
