(function ($)
{
    function options(target)
    {
        var state = $.data(target, 'specification');
        return state.options;
    }
    function getProduct(target)
    {
        var state = $.data(target, 'specification');
        var specification = $(target);
        var options = state.options;
        if (state.select)
            return state.select.s1.combobox("getValue");
        //var data = getValue(target);
        //return GM.Core.getParentEnumValue(options.opt2.action, options.opt2.category, data);
    }
    function getProductName(target)
    {
        var state = $.data(target, 'specification');
        var specification = $(target);
        var options = state.options;
        var pval = getProduct(target);
        return GM.Core.getEnumText(options.opt1.action, options.opt1.category, pval);
    }
    function getSpecitionsName(target)
    {
        var state = $.data(target, 'specification');
        var specification = $(target);
        var options = state.options;
        var data = getValue(target);
        return GM.Core.getEnumText(options.opt2.action, options.opt2.category, data);
    }
    function setValue(target, data)
    {
        var state = $.data(target, 'specification');
        var specification = $(target);
        var options = state.options;
        var pval
        $(target).val(data);
        specification.textbox("setValue", data);
        if ($.valid(data))
        {
            pval = GM.Core.getParentEnumValue(options.opt2.action, options.opt2.category, data);

            if (state.select)
            {
                var s1 = state.select.s1;
                var s2 = state.select.s2;
                if ($.valid(pval))
                    s1.combobox("select", pval);
                if ($.valid(data))
                    s2.combobox("select", data);
                specification.textbox("setValue",s2.combobox("getValue"));
                return;
            }
            specification.textbox("setValue", data);
        }
    }

    function getValue(target)
    {
        var state = $.data(target, 'specification');
        var options = state.options;
        if (state.select)
            return state.select.s2.combobox("getValue");
        var specification = $(target);
        var data = specification.textbox("getValue");
        if ($.valid(data))
            return data;
        var pv = GM.Core.getDefaultEnumValue(options.opt1.action, options.opt1.category);
        return GM.Core.getDefaultEnumValue(options.opt2.action, options.opt2.category, undefined, pv);
    }
    function getSelectData(target)
    {
        var self = $(target);
        var state = $.data(target, 'specification');
        var opts = state.options.opt2;
        var sdata = state.select.s2.combobox("getData");
        var value = state.select.s2.combobox("getValue");
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
    function clear(target)
    {
        var state = $.data(target, 'specification');
        var specification = $(target);
        specification.textbox("clear");
        if (state.select)
        {
            state.select.s1.combobox("clear");
            state.select.s2.combobox("clear");
        }
    }

    function resize(obj, width)
    {
        var options = $.data(obj, "specification").options;
        var select = $.data(obj, "specification").select;
        if (select && !isNaN(width))
        {
            var halfWidth = (width / 2) - 10;
            var s1text = select.s1;
            var s2text = select.s2;
            s1text.combobox("resize", halfWidth);
            s2text.combobox("resize", width - halfWidth);
        }
    };


    function pushValue(target) {
        var state = $.data(target, 'specification');
        var options = state.options;
        var specification = $(target);

        if (state.select) {
            var s1 = state.select.s1;
            var s2 = state.select.s2;
            var value = s2.combobox("getValue");
            specification.textbox("setValue", value);
        }
        else {
            var pval = GM.Core.getDefaultEnumValue(options.opt1.action, options.opt1.category);
            var data = GM.Core.getDefaultEnumValue(options.opt2.action, options.opt2.category, undefined, pval);
            var text = GM.Core.getEnumText(options.opt1.action, options.opt1.category, pval) + GM.Core.getEnumText(options.opt2.action, options.opt2.category, data);
            specification.textbox("setValue", text);
        }
    }

    function setSpecification(target)
    {
        var state = $.data(target, 'specification');
        var options = state.options;
        var specification = $(target);

        specification.addClass("specification");

        specification.textbox($.extend({}, options, {
        }));
        specification.parent("td").find(".textbox").css("display", "none");

        //尹熊加 刷新连带功能
        var comboReloadClass1 = "combo-reload-" + options.opt1.action.replace(/\./gm, "_");
        var comboReloadClass2 = "combo-reload-" + options.opt2.action.replace(/\./gm, "_");

        options.opt1 = $.extend({ comboReloadClass: comboReloadClass1 }, options.opt1);
        options.opt2 = $.extend({ comboReloadClass: comboReloadClass2 }, options.opt2);
        if (!state.select)
        {
            var panel = specification;
            var div = $('<div>').insertAfter(specification);
            s1 = $('<input>').addClass("combo-text").addClass(comboReloadClass1).appendTo(div);
            s2 = $('<input>').addClass("combo-text").addClass(comboReloadClass2).appendTo(div);

            state.select = { s1: s1, s2: s2 };
        }
        else
        {
            s1 = state.select.s1;
            s2 = state.select.s2;
        }

        options.opt1.onSelect = function (v)
        { 
            value = s2.combobox("getValue");
            specification.textbox("setValue", v.value);
        };

        options.opt2.onSelect = function (v)
        { 
            s1.combobox("hidePanel");
            specification.textbox("setValue", v.value);
        };

        s1.combobox(options.opt1).combobox("loadEnum", { action: options.opt1.action, category: options.opt1.category, extendData: options.opt1.otherData, isbool: options.opt1.isbool,async:options.async });
        s2.combobox(options.opt2).combobox("loadEnum", {
            action: options.opt2.action, category: options.opt2.category, extendData: options.opt2.otherData, isbool: options.opt2.isbool, async: options.async
        }).combobox('setParentEnum', { parentField: options.opt2.parentField, parentEnum: s1 });
        //IE10显示对宽度的理解比较诡异，不得已增加如下处理
        s1.combobox("textbox").outerWidth(s1.combobox("textbox").outerWidth() - 1);
        s2.combobox("textbox").outerWidth(s1.combobox("textbox").outerWidth() - 1);

        if (options.pushValue)
            pushValue(target);


        /*
        specification.combo($.extend({}, options, {
            onHidePanel: function ()
            {
                options.onHidePanel.call(target);
                pushValue(target);
            },
            onShowPanel: function ()
            {
                options.onShowPanel.call(target);
                var s1;
                var s2
                if (!state.select)
                {
                    var panel = specification.combo("panel");
                    var div = $('<div>').css("margin", "4px").appendTo(panel);
                    s1 = $('<input>').appendTo(div);
                    s2 = $('<input>').appendTo(div);

                    state.select = { s1: s1, s2: s2 };
                } else
                {
                    s1 = state.select.s1;
                    s2 = state.select.s2;
                }

                options.opt2.onSelect = function ()
                {
                    s1.combobox("hidePanel");
                    specification.combo("hidePanel");
                };

                s1.combobox(options.opt1).combobox("loadEnum", { action: options.opt1.action, category: options.opt1.category, extendData: options.opt1.otherData, isbool: options.opt1.isbool });
                s2.combobox(options.opt2).combobox("loadEnum", { action: options.opt2.action, category: options.opt2.category, extendData: options.opt2.otherData, isbool: options.opt2.isbool }).combobox('setParentEnum', { parentField: options.opt2.parentField, parentEnum: s1 });
                //IE10显示对宽度的理解比较诡异，不得已增加如下处理
                s1.combobox("textbox").outerWidth(s1.combobox("textbox").outerWidth() - 1);
                s2.combobox("textbox").outerWidth(s1.combobox("textbox").outerWidth() - 1);
            }
        }));
        pushValue(target);
        */
    }

    $.fn.specification = function (options, param)
    {
        if (typeof options == 'string')
        {
            return $.fn.specification.methods[options](this, param);

            //if (options == "getValue" || options == "setValue" || options == "resize" || options == "getProduct")
            //    return $.fn.specification.methods[options](this, param);
            //return;
        }
        options = options || {};
        return this.each(function ()
        {
            var state = $.data(this, 'specification');
            if (state) {
                $.extend(state.options, options);
                setSpecification(this);
            } else {
                $.data(this, 'specification', {
                    options: $.extend(true, {}, $.fn.specification.defaults, options)
                });
                setSpecification(this);
            }
        });
    };

    $.fn.specification.methods = $.extend({}, $.fn.textbox.methods, {
        options: function (jq)
        {
            return options(jq[0]);
        },
        clear: function (jq)
        {
            return jq.each(function ()
            {
                clear(this);
            });
        },
        setValue: function (jq, data)
        {
            return jq.each(function ()
            {
                setValue(this, data);
            });
        },
        getValue: function (jq)
        {
            return getValue(jq[0]);
        },
        getSelectData: function (jq)
        {
            return getSelectData(jq[0]);
        },        
        getSpecitionsName: function (jq)
        {
            return getSpecitionsName(jq[0]);
        },
        getProductName: function (jq)
        {
            return getProductName(jq[0]);
        },
        getProduct: function (jq)
        {
            return getProduct(jq[0]);
        },
        resize: function (jq, width)
        {
            return jq.each(function ()
            {
                resize(this, width);
            });
        }
    });

    $.fn.specification.defaults = $.extend({}, $.fn.textbox.defaults, {
        opt1: {
            action: 'ProductName.Enum.List',
            filterField: "pinyin",
            valueField: 'value',
            textField: 'text',
            initVal: "",
            editable: true,
            feedback: false
        },
        opt2: {
            action: 'Specification.Enum.List',
            filterField: "pinyin",
            valueField: 'value',
            textField: 'text',
            parentField: "parentvalue",
            initVal: "",
            editable: true,
            feedback: false
        },
        pushValue: true,
        hasDownArrow: true,
        editable: false,
        panelWidth: 164,
        panelHeight: 55,
        onSubmit: function (param) { return $(this).form('validate'); },
        success: function (data) { },
        onBeforeLoad: function (param) { },
        onLoadSuccess: function (data) { },
        onLoadError: function () { }
    });
    $.parser.plugins.push('specification');
    $.parser.parse();
})(jQuery);