/**
 * slidercustom - jQuery EasyUI
 * 
 * Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL or commercial licenses
 * To use it on other terms please contact us: info@jeasyui.com
 * http://www.gnu.org/licenses/gpl.txt
 * http://www.jeasyui.com/license_commercial.php
 * 
 * Dependencies:
 *  draggable
 * 
 */
(function ($) {
    function init(target) {
        var slidercustom = $('<div class="slidercustom">' +
				'<div class="slidercustom-inner">' +
				'<div><div class="middle"><span class="slidercustom-tip">0--0</span></div><a href="javascript:void(0)" class="slidercustom-handle handle1"> <div class="button"><div></div></div></a><a href="javascript:void(0)" class="slidercustom-handle  handle2"> <div class="button"><div></div></div></a></div>' +
				'' +
				'</div>' +
				'<div class="slidercustom-rule"></div>' +
				'<div class="slidercustom-rulelabel"></div>' +
				'<div style="clear:both"></div>' +
				'<input type="hidden" class="slidercustom-value">' +
				'</div>').insertAfter(target);
        var t = $(target);
        t.addClass('slidercustom-f').hide();
        var name = t.attr('name');
        if (name) {
            slidercustom.find('input.slidercustom-value').attr('name', name);
            t.removeAttr('name').attr('slidercustomName', name);
        }
        return slidercustom;
    }

    /**
	 * set the slidercustom size, for vertical slidercustom, the height property is required
	 */
    function setSize(target, param) {
        var state = $.data(target, 'slidercustom');
        var opts = state.options;
        var slidercustom = state.slidercustom;

        if (param) {
            if (param.width) opts.width = param.width;
            if (param.height) opts.height = param.height;
        }
        if (opts.mode == 'h') {
            slidercustom.css('height', '');
            slidercustom.children('div').css('height', '');
            if (!isNaN(opts.width)) {
                slidercustom.width(opts.width);
            }
        } else {
            slidercustom.css('width', '');
            slidercustom.children('div').css('width', '');
            if (!isNaN(opts.height)) {
                slidercustom.height(opts.height);
                slidercustom.find('div.slidercustom-rule').height(opts.height);
                slidercustom.find('div.slidercustom-rulelabel').height(opts.height);
                slidercustom.find('div.slidercustom-inner')._outerHeight(opts.height);
            }
        }
        initValue(target);
    }

    /**
	 * show slidercustom rule if needed
	 */
    function showRule(target) {
        var state = $.data(target, 'slidercustom');
        var opts = state.options;
        var slidercustom = state.slidercustom;

        var aa = opts.mode == 'h' ? opts.rule : opts.rule.slice(0).reverse();
        if (opts.reversed) {
            aa = aa.slice(0).reverse();
        }
        _build(aa);

        function _build(aa) {
            var rule = slidercustom.find('div.slidercustom-rule');
            var label = slidercustom.find('div.slidercustom-rulelabel');
            rule.empty();
            label.empty();
            for (var i = 0; i < aa.length; i++) {
                var distance = i * 100 / (aa.length - 1) + '%';
                var span = $('<span></span>').appendTo(rule);
                span.css((opts.mode == 'h' ? 'left' : 'top'), distance);

                // show the labels
                if (aa[i] != '|') {
                    span = $('<span></span>').appendTo(label);
                    span.html(aa[i]);
                    if (opts.mode == 'h') {
                        span.css({
                            left: distance,
                            marginLeft: -Math.round(span.outerWidth() / 2-8)
                        });
                    } else {
                        span.css({
                            top: distance,
                            marginTop: -Math.round(span.outerHeight() / 2- 8)
                        });
                    }
                }
            }
        }
    }

    /**
	 * build the slidercustom and set some properties
	 */
    function buildslidercustom(target) {
        var state = $.data(target, 'slidercustom');
        var opts = state.options;
        var slidercustom = state.slidercustom;

        slidercustom.removeClass('slidercustom-h slidercustom-v slidercustom-disabled');
        slidercustom.addClass(opts.mode == 'h' ? 'slidercustom-h' : 'slidercustom-v');
        slidercustom.addClass(opts.disabled ? 'slidercustom-disabled' : '');

        slidercustom.find('a.slidercustom-handle').draggable({
            axis: opts.mode,
            cursor: 'pointer',
            disabled: opts.disabled,
            onDrag: function (e) {
                opts.isLeft = $(this).hasClass("handle1");
                var left = e.data.left;
                var width = slidercustom.width();
                if (opts.mode != 'h') {
                    left = e.data.top;
                    width = slidercustom.height();
                }
                if (left < 0 || left > (width - opts.step)) {
                    return false;
                } else if (opts.isLeft && opts.left + opts.step >= opts.right) {
                    return false;
                } else if (!opts.isLeft && opts.right - opts.step <= opts.left) {
                    return false;
                } else {
                    var value = pos2value(target, left);
                    var value1 = parseInt(slidercustom.find('.handle1').css("left"));
                    var value2 = parseInt(slidercustom.find('.handle2').css("left"));
                    if (opts.isLeft) {
                        value1 = value;
                    } else {
                        value2 = value;
                    }
                    if (value1 > opts.value2) {
                        value1 = opts.value1;
                    }
                    if (value2 < opts.value1) {
                        value2 = opts.value2;
                    }
                    adjustValue(value1, value2);
                    return false;
                }
            },
            onBeforeDrag: function () {
                state.isDragging = true;
            },
            onStartDrag: function () {
                opts.onSlideStart.call(target, opts.value1);
            },
            onStopDrag: function (e) {
                var value = pos2value(target, (opts.mode == 'h' ? e.data.left : e.data.top));
                var value1 = parseInt(slidercustom.find('.handle1').css("left"));
                var value2 = parseInt(slidercustom.find('.handle2').css("left"));
                if (opts.isLeft) {
                    value1 = value;
                } else {
                    value2 = value;
                }
                if (value1 > opts.value2) {
                    value1 = opts.value1;
                }
                if (value2 < opts.value1) {
                    value2 = opts.value2;
                }
                adjustValue(value1, value2);
                opts.onSlideEnd.call(target, opts.value1);
                opts.onComplete.call(target, opts.value1);
                state.isDragging = false;
            }
        });
        slidercustom.find('div.slidercustom-inner').unbind('.slidercustom').bind('mousedown.slidercustom', function (e) {
            if (state.isDragging) { return }
            var pos = $(this).offset();
            var value = pos2value(target, (opts.mode == 'h' ? (e.pageX - pos.left) : (e.pageY - pos.top)));
            var value1 = parseInt(slidercustom.find('.handle1').css("left"));
            var value2 = parseInt(slidercustom.find('.handle2').css("left"));
            var valueint = parseInt(value);
            if (valueint > value1 && valueint < value2) {
                opts.isLeft = false;
                value2 = value;
            } else if (valueint > value2) {
                opts.isLeft = false;
                value2 = value;
            } else if (valueint < value1) {
                opts.isLeft = true;
                value1 = value;
            }
            adjustValue(value1, value2);
            opts.onComplete.call(target, opts.value);
        });

        function adjustValue(value1, value2) {
            var s = Math.abs(value1 % opts.step);
            if (s < opts.step / 2) {
                value1 -= s;
            } else {
                value1 = value1 - s + opts.step;
            }


            s = Math.abs(value2 % opts.step);
            if (s < opts.step / 2) {
                value2 -= s;
            } else {
                value2 = value2 - s + opts.step;
            }
            setValue(target, value1, value2);
        }
    }

    /**
	 * set a specified value to slidercustom
	 */
    function setValue(target, value1, value2) {
        var state = $.data(target, 'slidercustom');
        state.options.isAll = false;
        var opts = state.options;
        var slidercustom = state.slidercustom;
        var oldValue1 = opts.value1;
        var oldValue2 = opts.value2;
        if (value1 < opts.min) value1 = opts.min;
        if (value1 > opts.max - opts.step) value1 = opts.max - opts.step;

        if (value2 < opts.min + opts.step) value2 = opts.min + opts.step;
        if (value2 > opts.max) value2 = opts.max;

        opts.value1 = value1;
        opts.value2 = value2;
        $(target).val(value1 + "," + value2);
        slidercustom.find('input.slidercustom-value').val(value1 + "," + value2);

        var pos1 = value2pos(target, value1);
        var pos2 = value2pos(target, value2);
        var tip = slidercustom.find('.slidercustom-tip');

        if (opts.mode == 'h') {
            slidercustom.find('.handle1').attr('style', 'left:' + pos1 + 'px;');
            slidercustom.find('.handle2').attr('style', 'left:' + pos2 + 'px;');
            opts.value1 = pos1;
            opts.value2 = pos2;
            slidercustom.find('.middle').css({ "left": pos1 + "px", "width": (pos2 - pos1) + "px" });
            tip.attr('style', 'margin-left:' + Math.round(((opts.value2 - opts.value1) - tip.outerWidth()) / 2) + 'px');
        } else {
            var style = 'top:' + pos1 + 'px;';
            slidercustom.find('.slidercustom-handle').attr('style', style);
            tip.attr('style', style + 'margin-left:' + (-Math.round(tip.outerWidth())) + 'px');
        }
        if (opts.showTip) {
            tip.show();
            tip.html(opts.tipFormatter.call(target, (opts.value1 / opts.step + opts.start).toFixed(0), opts.value2 / opts.step + opts.start - 1));
        } else {
            tip.hide();
        }
        if (oldValue1 != value1 || oldValue2 != value2) {
            opts.onChange.call(target, opts.value1 / opts.step + opts.start, opts.value2 / opts.step + opts.start - 1);
        }
        $("div.middle").css("backgroundColor", "#FFB748");
    }

    function initValue(target) {
        var state = $.data(target, 'slidercustom');
        var opts = state.options;
        var fn = opts.onChange;
        opts.onChange = function () { };
        opts.value1 = 11 * opts.step;
        opts.value2 = 12 * opts.step;
        setValue(target, opts.value1, opts.value2);
        var style = 'left:' + opts.value2 + 'px;';
        var slidercustom = state.slidercustom;
        slidercustom.find('.handle2').attr('style', style);
        opts.onChange = fn;
    }

    /**
	 * translate value to slidercustom position
	 */
    function value2pos(target, value) {
        var state = $.data(target, 'slidercustom');
        var opts = state.options;
        var slidercustom = state.slidercustom;
        if (opts.mode == 'h') {
            var pos = (value - opts.min) / (opts.max - opts.min) * slidercustom.width();
            if (opts.reversed) {
                pos = slidercustom.width() - pos;
            }
        } else {
            var pos = slidercustom.height() - (value - opts.min) / (opts.max - opts.min) * slidercustom.height();
            if (opts.reversed) {
                pos = slidercustom.height() - pos;
            }
        }
        return pos.toFixed(0);
    }

    /**
	 * translate slidercustom position to value
	 */
    function pos2value(target, pos) {
        var state = $.data(target, 'slidercustom');
        var opts = state.options;
        var slidercustom = state.slidercustom;
        if (opts.mode == 'h') {
            var value = opts.min + (opts.max - opts.min) * (pos / slidercustom.width());
        } else {
            var value = opts.min + (opts.max - opts.min) * ((slidercustom.height() - pos) / slidercustom.height());
        }
        return opts.reversed ? opts.max - value.toFixed(0) : value.toFixed(0);
    }

    $.fn.slidercustom = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.slidercustom.methods[options](this, param);
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'slidercustom');
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, 'slidercustom', {
                    options: $.extend({}, $.fn.slidercustom.defaults, $.fn.slidercustom.parseOptions(this), options),
                    slidercustom: init(this)
                });
                $(this).removeAttr('disabled');
            }

            var opts = state.options;
            var i = 0;
            var thedate = serviceDate;
            opts.end = thedate.getMonth() + 1;
            opts.start = opts.end == 12 ? 1 : (opts.end + 1);
            var year = thedate.getFullYear();
            if (opts.end > opts.start) {
                for (var j = opts.start; j <= opts.end; j++) {
                    opts.rule[i] = year * 100 + j;
                    i++;
                }
            } else {
                for (var j = opts.start; j <= 12; j++) {
                    opts.rule[i] = (year-1) * 100 + j;
                    i++;
                }
                for (var j = 1; j <= opts.end; j++) {
                    opts.rule[i] = year * 100 + j;
                    i++;
                }
            }
            for (var i = 0; i < opts.rule.length; i++) {
                var str = opts.rule[i] + "";
                opts.rule[i]=str.substring(0, 4) + "." + str.substring(4, 6);
            }
            opts.step = parseFloat(opts.step);
            var width = opts.step * opts.rule.length;

            opts.rule[opts.rule.length] = "";

            opts.min = parseFloat(opts.min);
            opts.max = width;
            opts.width = width;
            opts.value1 = parseFloat(opts.value1);
            opts.value2 = parseFloat(opts.value2);
            opts.originalValue1 = opts.value1;
            opts.originalValue2 = opts.value2;

            buildslidercustom(this);
            showRule(this);
            setSize(this);
        });
    };

    $.fn.slidercustom.methods = {
        options: function (jq) {
            return $.data(jq[0], 'slidercustom').options;
        },
        destroy: function (jq) {
            return jq.each(function () {
                $.data(this, 'slidercustom').slidercustom.remove();
                $(this).remove();
            });
        },
        resize: function (jq, param) {
            return jq.each(function () {
                setSize(this, param);
            });
        },
        getValue: function (jq) {
            var opts = jq.slidercustom('options');
            return [opts.value1, opts.value2];
        },
        getDateValue: function (jq) {
            var opts = jq.slidercustom('options');
            var value1 = opts.value1 / opts.step + opts.start;

            var value2 = opts.value2 / opts.step + opts.start - 1;
            value1 = parseInt(value1) % 12;
            value1 = value1 == 0 ? 12 : value1;
            value2 = parseInt(value2) % 12;
            value2 = value2 == 0 ? 12 : value2;
            var year = serviceDate.getFullYear();
            if (value1 < opts.start||value1<=opts.end) {
                value1 = year * 100 + value1;
            } else {
                value1 = (year - 1) * 100 + value1;
            }
            if (value2 < opts.start || value2 <= opts.end) {
                value2 = year * 100 + value2;
            } else {
                value2 = (year - 1) * 100 + value2;
            }
            if (opts.isAll) {
                return ["",""];
            }
            return [value1, value2];
        },
        setValue: function (jq, param) {
            return jq.each(function () {
                setValue(this, param[0], param[1]); 
            });
        },
        clear: function (jq) {
            return jq.each(function () {
                var opts = $(this).slidercustom('options');
                setValue(this, opts.min, opts.min + opts.step);
            });
        },
        reset: function (jq) {
            return jq.each(function () {
                var opts = $(this).slidercustom('options');
                setValue(this, opts.originalValue1, opts.originalValue2);
            });
        },
        enable: function (jq) {
            return jq.each(function () {
                $.data(this, 'slidercustom').options.disabled = false;
                buildslidercustom(this);
            });
        },
        disable: function (jq) {
            return jq.each(function () {
                $.data(this, 'slidercustom').options.disabled = true;
                buildslidercustom(this);
            });
        },
        reMonth: function (jq) { //当月
            return jq.each(function () {
                setValue(this, 11 * 42, 12 * 42);
                $.data(this, 'slidercustom').options.refreshChange(0, 0);
            });
        },
        reQuarter: function (jq) { //当季
            return jq.each(function () {
                var thedate = serviceDate;
                var startMonth = 11 - thedate.getMonth() % 3;
                setValue(this, startMonth * 42, 12 * 42);
                $.data(this, 'slidercustom').options.refreshChange(0, 0);
            });
        },
        reYear: function (jq) { //当年
            return jq.each(function () {
                var thedate = serviceDate;
                var yearStart = (12 - thedate.getMonth()-1) * 42;
                setValue(this, yearStart, 12 * 42);
                $.data(this, 'slidercustom').options.refreshChange(0, 0);
            });
        },
        reAll: function (jq) { //全部
            return jq.each(function () {
                var thedate = serviceDate;
                var yearStart = 0;
                setValue(this, yearStart, 12 * 42);
                $("div.middle").css("backgroundColor", "transparent");
                $.data(this, 'slidercustom').options.isAll = true;
                $.data(this, 'slidercustom').options.refreshChange(0, 0);
            });
        }
    };

    $.fn.slidercustom.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target, [
			'width', 'height', 'mode', { reversed: 'boolean', showTip: 'boolean', min: 'number', max: 'number', step: 'number' }
        ]), {
            value: (t.val() || undefined),
            disabled: (t.attr('disabled') ? true : undefined),
            rule: (t.attr('rule') ? eval(t.attr('rule')) : undefined)
        });
    };

    $.fn.slidercustom.defaults = {
        isLeft: true,//是否是左边
        left: 0, //左边坐标
        right: 42,//右边坐标
        width: 'auto',
        height: 'auto',
        mode: 'h',	// 'h'(horizontal) or 'v'(vertical)
        reversed: false,
        showTip: false,
        disabled: false,
        value1: 42 * 11,
        value2: 42 * 12,
        min: 0,
        max: 520,
        start: 0,
        end: 12,
        step: 42,
        isAll:true,
        rule: [],	// [0,'|',100]
        tipFormatter: function (value1, value2) { return value1 + "--" + value2; },
        onChange: function (value1, value2) { },
        onSlideStart: function (value) { },
        onSlideEnd: function (value) { },
        onComplete: function (value) { },
        refreshChange: function (value1, value2) { }
    };
})(jQuery);
