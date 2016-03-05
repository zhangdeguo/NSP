(function ($) {
    function options(target) {
        var state = $.data(target, 'my97datebox');
        return state.options;
    }

    function resize(target, width) {
        var state = $.data(target, 'my97datebox');
        var options = state.options;
        if ($.isNumeric(width))
            options.width = width;

        if (options.height) {
            $(target).outerHeight(options.height);
        }
        if (options.width) {
            $(target).outerWidth(options.width);
        }
        $(target).css("line-height", $(target).height() + "px");
    }

    function destroy(target)
    {
        $(target).click(undefined);
        $(target).removeClass("Wdate");
    }
    function setValue(target, value) {
        var state = $.data(target, 'my97datebox');
        var options = state.options;
        var vdate = Date.StringToDate(value);
        if($.valid(vdate))
            $(target).val(vdate.Format(options.dateFmt));
        $(target).validatebox("validate");
    }
    function getValue(target) {
        return $(target).val();
    }

    function clear(target)
    {
        $(target).val('');
        $(target).validatebox("validate");
    }

    function setMy97Datebox(target) {
        var state = $.data(target, 'my97datebox');
        var options = state.options;

        var dom = $(target);
        if ($.valid(options.initVal))
            dom.val(options.initVal);
        else if (options.showCurrentDate) {
            var now = new Date();
            dom.val(now.Format("yyyy-MM-dd"));
        }
        dom.outerHeight(options.height);
        dom.addClass("Wdate").addClass("my97datebox");

        function doChange(newValue, oldValue) {
            var ret = options.onChange.call(dom, newValue, oldValue);
            if (ret == undefined || ret)
                return false;
            return true;
        }

        //options.dchanged = doChange;
        options.onpicking = function (dp) {
            return doChange(
            dp.cal.getNewDateStr(),
            dp.cal.getDateStr());
        };
        options.onclearing = function (dp) {
            return doChange(
            "",
            dp.cal.getDateStr());
        };

        dom.click(function () {
            WdatePicker(options);
        });
        dom.validatebox(options);
        dom.validatebox("validate");

        resize(target, options.width);
    }

    $.fn.my97datebox = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.my97datebox.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'my97datebox');
            if (state) {
                $.extend(state.options, options);
                setMy97Datebox(this);
            } else {
                $.data(this, 'my97datebox', {
                    options: $.extend({}, $.fn.my97datebox.defaults, options)
                });
                setMy97Datebox(this);
            }
        });
    };

    $.fn.my97datebox.methods = $.extend({}, $.fn.combo.methods, {
        resize: function (jq, width) {
            return jq.each(function () {
                resize(this, width);
            });
        },
        destroy: function (jq) {
            return jq.each(function () {
                destroy(this);
            });
        },
        setValue: function (jq, value) {
            return jq.each(function () {
                setValue(this, value);
            });
        },
        options: function (jq) {
            return options(jq[0]);
        },
        getValue: function (jq) {
            return getValue(jq[0]);
        },
        clear: function (jq) {
            return jq.each(function () {
                clear(this);
            });
        }
    });

    $.fn.my97datebox.defaults = $.extend({}, $.fn.combo.defaults, {
        iniValue: new Date(),
        dateFmt: 'yyyy-MM-dd',
        height: 28,
        width: 151,
        showCurrentDate: false,
        doubleCalendar: true,
        addDay: 0,
        onChange: function (newValue, oldValue) {
        }
    });
})(jQuery);