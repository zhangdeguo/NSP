(function ($) {
    function showDialog(target)
    {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        options.onShowDialog.call(target);
        if ($.isFunction(options.dialog)) {
            options.dialog.call(target, function (data, result) {
                if (result) {
                    state.data = data;
                    data = _getData(data);
                    state.input.val(data[options.textAttribute]);
                    state.value.val(data[options.valueAttribute]);
                    $(target).val(data[options.valueAttribute]);
                    state.input.validatebox("validate");
                }
                options.onDialogClosed.call(target, result, data);
            });
        }
    }
    function options(target)
    {
        var state = $.data(target, 'dialogselector');
        return state.options;
    }

    function setEditable(target, editable) {
        var state = $.data(target, 'dialogselector');
        state.options.editable = editable;
        if (!state.options.editable)
            state.input.attr("readonly", true);
        else
            state.input.removeAttr("readonly");
    }

    function _getData(data) {
        if (data) {
            if ($.isArray(data) && data.length > 0)
                return data[0];
            return data;
        }
        return {};
    }

    function _cheekReadonly(target)
    {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        return options.readonly || $(target).attr("readonly");
    }    

    function _cheekEditabled(target)
    {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        return options.editable;
    }    

    function resize(target, width)
    {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        if ($.isNumeric(width))
            options.width = width;

        if (options.height) {
            state.container.outerHeight(options.height);
        }
        if (options.width) {
            state.container.outerWidth(options.width);
        }
        var arrawWidth = 0;
        if (state.arrow && state.arrow.is(':visible')) {
            state.arrow.outerHeight(state.container.innerHeight());
            arrawWidth = state.arrow.outerWidth();
        }
        if (state.searcharrow && state.searcharrow.is(':visible')) {
            state.searcharrow.outerHeight(state.container.innerHeight());
            arrawWidth = arrawWidth + state.searcharrow.outerWidth();
        }
        state.input.outerWidth(state.container.innerWidth() - arrawWidth);
        state.input.outerHeight(state.container.innerHeight());
        state.input.css("line-height", state.input.height() + "px");
    }

    function destroy(target)
    {
        var state = $.data(target, 'dialogselector');
        state.input.validatebox("destroy");
        state.container.remove();
        $(target).removeClass("dialogselector-f").show();
    }
    function setData(target, data) {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        data = _getData(data);
        state.input.val(data[options.textAttribute]);
        state.value.val(data[options.valueAttribute]);
        $(target).val(data[options.valueAttribute]);
        state.data = data;
    }
    function getData(target) {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        return _getData(state.data);
    }

    function setText(target, text) {
        var state = $.data(target, 'dialogselector');
        state.input.val(text);
        var options = state.options;
        var data = _getData(state.data);
        data[options.textAttribute] = text;
        state.data = data;
        if (options.valueAttribute == options.textAttribute)
            state.value.val(value);
        state.input.validatebox("validate");
    }
    function getText(target) {
        var state = $.data(target, 'dialogselector');
        return state.input.val();
    }

    function setValue(target, value) {
        var state = $.data(target, 'dialogselector');
        state.value.val(value);
        var options = state.options;
        var data = _getData(state.data);
        data[options.valueAttribute] = value;
        $(target).val(data[options.valueAttribute]);
        state.data = data;
        if (options.valueAttribute == options.textAttribute || !state.input.val())
            state.input.val(value);
    }
    function getValue(target) {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        var data = _getData(state.data);
        if (options.valueAttribute == options.textAttribute)
            return getText(target);
        else
            return state.value.val() || getText(target);
    }

    function getAttrbute(target, name) {
        var state = $.data(target, 'dialogselector');
        var data = _getData(state.data)
            return data[name];
    }

    function clear(target)
    {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        var data = state.data;
        delete state.data;
        state.input.val('');
        state.value.val('');
        $(target).val('');
        state.input.validatebox("validate");
        options.onClear.call(target, data);
    }

    function clickInput(target) {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        if (_cheekReadonly(target) || !options.autoShowDialog)
            return;
        showDialog(target);
    }

    function clickArrow(target)
    {
        if (_cheekReadonly(target))
            return;
        $(target).dialogselector('clear');
    }

    function setDialogSelector(target) {
        var state = $.data(target, 'dialogselector');
        var options = state.options;
        var dom = $(target);
        dom.addClass("dialogselector-f").hide();
        if (!state.container) {
            state.container = $("<span>").addClass("dialogselector").insertAfter(dom);
            state.input = $("<input type=\"text\" class=\"dialogselector-text\" autocomplete=\"off\">").css("cursor", "point").appendTo(state.container);

            if (!options.editable)
                state.input.attr("readonly", true);

            state.arrow = $("<span class=\"dialogselector-cleararrow\"></span>").mouseover(function () { $(this).addClass("dialogselector-cleararrow-hover") }).mouseout(function () { $(this).removeClass("dialogselector-cleararrow-hover") }).appendTo($("<span>").appendTo(state.container));

            state.searcharrow = $("<span class=\"dialogselector-searcharrow\"></span>").mouseover(function () { $(this).addClass("dialogselector-searcharrow-hover") }).mouseout(function () { $(this).removeClass("dialogselector-searcharrow-hover") }).appendTo($("<span>").appendTo(state.container));

            state.value = $("<input type=\"hidden\" class=\"dialogselector-value\">").appendTo(state.container);

            //state.input.click(function () { clickInput(target); });
            state.searcharrow.click(function () { clickInput(target); });

            state.arrow.click(function () { clickArrow(target); });
        }

        if (!options.editable)
            state.input.attr("readonly", true);

        if (!options.hideClearArraw)
            state.arrow.show();
        else
            state.arrow.hide();

        if (!options.hideSearchArraw)
            state.searcharrow.show();
        else
            state.searcharrow.hide();
        state.input.validatebox($.extend({}, $.parser.parseOptions(target), options));
        setValue(target, options.value);
        resize(target);
    }

    $.fn.dialogselector = function (options, param) {
        if (typeof options == 'string') {
            if ($.fn.dialogselector.methods[options])
                return $.fn.dialogselector.methods[options](this, param);
            else
                return $.fn.validatebox.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'dialogselector');
            if (state) {
                $.extend(state.options, options);
                setDialogSelector(this);
            } else {
                $.data(this, 'dialogselector', {
                    options: $.extend({}, $.fn.dialogselector.parseOptions(this), $.fn.dialogselector.defaults, options)
                });
                setDialogSelector(this);
            }
        });
    };

    $.fn.dialogselector.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.validatebox.parseOptions(target), $.parser.parseOptions(target, ["hideClearArraw",
            "hideSearchArraw", "textAttribute", "readonly", "editable", "autoShowDialog", "dialog",
            "onShowDialog", "onDialogClosed", "onClear", "value"]), {
                hideSearchArraw: (t.attr("hideSearchArraw") ? true : undefined),
                textAttribute: (t.attr("textAttribute") ? t.attr("textAttribute") : undefined),
                readonly: (t.attr("readonly") ? true : undefined),
                editable: (t.attr("editable") ? true : undefined),
                autoShowDialog: (t.attr("autoShowDialog") ? true : undefined),
                value: (t.val() || undefined)
            });
    };

    $.fn.dialogselector.methods = $.extend({}, $.fn.combo.methods, {
        showDialog:function(jq)
        {
            return jq.each(function () {
                showDialog(this);
            });
        },
        destroy: function (jq) {
            return jq.each(function () {
                destroy(this);
            });
        },
        clear: function (jq) {
            return jq.each(function () {
                clear(this);
            });
        },
        resize: function (jq, width) {
            return jq.each(function () {
                resize(this, width);
            });
        },
        options: function (jq) {
            return options(jq[0]);
        },
        setEditable: function (jq, editable) {
            return jq.each(function () {
                setEditable(this, editable);
            });
        },
        setData: function (jq, data) {
            return jq.each(function () {
                setData(this, data);
            });
        },
        getData: function (jq) {
            return getValue(jq[0]);
        },
        setValue: function (jq, value) {
            return jq.each(function () {
                setValue(this, value);
            });
        },
        getValue: function (jq) {
            return getValue(jq[0]);
        },
        getAttrbute: function (jq, name) {
            return getAttrbute(jq[0], name);
        },
        setText: function (jq, text) {
            return jq.each(function () {
                setText(this, text);
            });
        },
        getText: function (jq) {
            return getText(jq[0]);
        }
    });

    $.fn.dialogselector.defaults = $.extend({}, $.fn.combo.defaults, {
        hideClearArraw: false,
        hideSearchArraw: false,
        textAttribute: 'text',
        valueAttribute: 'value',
        height: 28,
        width: 151,
        readonly: false,
        editable: false,
        autoShowDialog: true,
        dialog: function () { },
        onShowDialog: function () { },
        onDialogClosed: function (data) { },
        onClear: function (data) { },
        onBeforeLoad: function (param) { },
        onLoadSuccess: function (data) { },
        onLoadError: function () { }
    });
})(jQuery);