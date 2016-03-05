/**
 *  标题：文本框
    作者：Iris
    时间：2014-4-10
    描述：基于jQuery EasyUI 1.3.5扩展
 */
(function ($) {
    function _1(_2, options) {
        $(_2).addClass("textbox-f").hide();
        var _3 = $("<span class=\"textbox\"></span>").insertAfter(_2);
        var _4 = $("<input type=\"text\" class=\"textbox-text\">").appendTo(_3);
        if (options.hideTrigger === false && options.triggerClass) {
            $("<span><span class=\"" + options.triggerClass + "\"></span></span>").appendTo(_3);
        }
        var _5 = $(_2).attr("name");
        if (_5) {
            _4.attr("name", _5);
            $(_2).removeAttr("name").attr("textboxName", _5);
        }
        return _3;
    };
    function _6(_7, _8) {
        var _9 = $.data(_7, "textbox").options;
        var sb = $.data(_7, "textbox").textbox;
        if (_8) {
            _9.width = _8;
        }
        sb.appendTo("body");
        if (isNaN(_9.width)) {
            _9.width = sb._outerWidth();
        }
        var triggerWidth = 0;
        if (_9.hideTrigger === false && _9.triggerClass) {
            var _a = sb.find("span." + _9.triggerClass);
            _a._outerHeight(sb.height());
            triggerWidth = _a._outerWidth();
        }
        var _b = sb.find("a.textbox-menu");
        var _c = sb.find("input.textbox-text");
        sb._outerWidth(_9.width)._outerHeight(_9.height);
        _c._outerWidth(sb.width() - _b._outerWidth() - triggerWidth);
        _c.css({ height: sb.height() + "px", lineHeight: sb.height() + "px" });
        _b._outerHeight(sb.height());
        var _d = _b.find("span.l-btn-left");
        _d._outerHeight(sb.height());
        _d.find("span.l-btn-text,span.m-btn-downarrow").css({ height: _d.height() + "px", lineHeight: _d.height() + "px" });
        sb.insertAfter(_7);
    };
    function _e(_f, options) {
        var _10 = $.data(_f, "textbox");
        var _11 = options;
        if (_11.menu) {
            _10.menu = $(_11.menu).menu({
                onClick: function (_12) {
                    _13(_12);
                }
            });
            var _14 = _10.menu.children("div.menu-item:first");
            _10.menu.children("div.menu-item").each(function () {
                var _15 = $.extend({}, $.parser.parseOptions(this), { selected: ($(this).attr("selected") ? true : undefined) });
                if (_15.selected) {
                    _14 = $(this);
                    return false;
                }
            });
            _14.triggerHandler("click");
        } else {
            _10.textbox.find("a.textbox-menu").remove();
            _10.menu = null;
        }
        function _13(_16) {
            _10.textbox.find("a.textbox-menu").remove();
            var mb = $("<a class=\"textbox-menu\" href=\"javascript:void(0)\"></a>").html(_16.text);
            mb.prependTo(_10.textbox).menubutton({ menu: _10.menu, iconCls: _16.iconCls });
            _10.textbox.find("input.textbox-text").attr("name", _16.name || _16.text);
            _6(_f);
        };
    };
    function _17(_18) {
        var _19 = $.data(_18, "textbox");
        var _1a = _19.options;
        var _1b = _19.textbox.find("input.textbox-text");
        _1b.unbind(".textbox").bind("blur.textbox", function (e) {
            var ov = _1a.value;
            _1a.value = $(this).val();
            if (ov !== _1a.value)
                _1a.onChange.call(_18, _1a.value, ov);
            if (_1a.value == "") {
                $(this).val(_1a.prompt);
                $(this).addClass("textbox-prompt");
            } else {
                $(this).removeClass("textbox-prompt");
            }
        }).bind("focus.textbox", function (e) {
            if ($(this).val() != _1a.value) {
                $(this).val(_1a.value);
            }
            $(this).removeClass("textbox-prompt");
        })/*20140919 陆村 此处无意义.bind("keydown.textbox", function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                _1a.value = $(this).val();
                _1a.onTriggerClick.call(_18, _1a.value, _1b._propAttr("name"));
                return false;
            }
        })*/;
        if (_1a.hideTrigger === false && _1a.triggerClass) {
            var _1c = _19.textbox.find("." + _1a.triggerClass);
            _1c.unbind(".textbox").bind("click.textbox", function () {
                _1a.onTriggerClick.call(_18, _1a.value, _1b._propAttr("name"));
            }).bind("mouseenter.textbox", function () {
                $(this).addClass(_1a.triggerClass + "-hover");
            }).bind("mouseleave.textbox", function () {
                $(this).removeClass(_1a.triggerClass + "-hover");
            });
        }
    };
    function _1d(_1e) {
        var _1f = $.data(_1e, "textbox");
        var _20 = _1f.options;
        var _21 = _1f.textbox.find("input.textbox-text");
        if (_20.value == "") {
            _21.val(_20.prompt);
            _21.addClass("textbox-prompt");
        } else {
            _21.val(_20.value);
            _21.removeClass("textbox-prompt");
        }
    };
    $.fn.textbox = function (_22, _23) {
        if (typeof _22 == "string") {
            return $.fn.textbox.methods[_22](this, _23);
        }
        _22 = _22 || {};
        return this.each(function () {
            var _24 = $.data(this, "textbox");
            var options = null;
            if (_24) {
                options = _24.options;
                $.extend(options, _22);
            } else {
                options = $.extend({}, $.fn.textbox.defaults, $.fn.textbox.parseOptions(this), _22);
                _24 = $.data(this, "textbox", { options: options, textbox: _1(this, options) });
            }
            _e(this, options);
            _1d(this);
            _17(this);
            _6(this);
        });
    };
    $.fn.textbox.methods = {
        options: function (jq) {
            return $.data(jq[0], "textbox").options;
        }, menu: function (jq) {
            return $.data(jq[0], "textbox").menu;
        }, textbox: function (jq) {
            return $.data(jq[0], "textbox").textbox.find("input.textbox-text");
        }, getValue: function (jq) {
            return $.data(jq[0], "textbox").options.value;
        }, setValue: function (jq, _25) {
            return jq.each(function () {
                $(this).textbox("options").value = _25;
                $(this).textbox("textbox").val(_25);
                $(this).textbox("textbox").blur();
            });
        }, getName: function (jq) {
            return $.data(jq[0], "textbox").textbox.find("input.textbox-text").attr("name");
        }, selectName: function (jq, _26) {
            return jq.each(function () {
                var _27 = $.data(this, "textbox").menu;
                if (_27) {
                    _27.children("div.menu-item[name=\"" + _26 + "\"]").triggerHandler("click");
                }
            });
        }, destroy: function (jq) {
            return jq.each(function () {
                var _28 = $(this).textbox("menu");
                if (_28) {
                    _28.menu("destroy");
                }
                $.data(this, "textbox").textbox.remove();
                $(this).remove();
            });
        }, resize: function (jq, _29) {
            return jq.each(function () {
                _6(this, _29);
            });
        }, disable: function (jq) {
            return $(jq[0]).textbox("textbox").attr("disabled", "disabled");
        }
    };
    $.fn.textbox.parseOptions = function (_2a) {
        var t = $(_2a);
        return $.extend({}, $.parser.parseOptions(_2a, ["width", "height", "prompt", "menu"]), { value: t.val(), onTriggerClick: (t.attr("onTriggerClick") ? eval(t.attr("onTriggerClick")) : undefined) });
    };
    $.fn.textbox.defaults =
    {
        width: "auto", height: 22, prompt: "", value: "", menu: null,
        onTriggerClick: function (value, selectedMenuValue) {

        },
        hideTrigger: true,
        triggerClass: "searchbox-button",
        onChange: function (newValue, oldValue) {
        }
    };
    $.parser.plugins.push('textbox');
    $.parser.parse();
})(jQuery);

