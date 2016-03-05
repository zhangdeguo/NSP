/**
 * jQuery EasyUI 1.3.6
 * 
 * Copyright (c) 2009-2014 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the GPL license: http://www.gnu.org/licenses/gpl.txt
 * To use it on other terms please contact us at info@jeasyui.com
 *
 */
/**
 * combobox2 - jQuery EasyUI
 * 
 * Dependencies:
 *   combo
 * 
 */
(function ($) {
    var combobox2_SERNO = 0;

    function getRowIndex(target, value) {
        var state = $.data(target, 'combobox2');
        var opts = state.options;
        var data = state.data;
        for (var i = 0; i < data.length; i++) {
            if (data[i][opts.valueField] == value) {
                return i;
            }
        }
        return -1;
    }

    /**
	 * scroll panel to display the specified item
	 */
    function scrollTo(target, value) {
        var opts = $.data(target, 'combobox2').options;
        var panel = $(target).combo2('panel');
        var item = opts.finder.getEl(target, value);
        if (item.length) {
            if (item.position().top <= 0) {
                var h = panel.scrollTop() + item.position().top;
                panel.scrollTop(h);
            } else if (item.position().top + item.outerHeight() > panel.height()) {
                var h = panel.scrollTop() + item.position().top + item.outerHeight() - panel.height();
                panel.scrollTop(h);
            }
        }
    }

    function nav(target, dir) {
        var opts = $.data(target, 'combobox2').options;
        var panel = $(target).combobox2('panel');
        var item = panel.children('div.combobox2-item-hover');
        if (!item.length) {
            item = panel.children('div.combobox2-item-selected');
        }
        item.removeClass('combobox2-item-hover');
        var firstSelector = 'div.combobox2-item:visible:not(.combobox2-item-disabled):first';
        var lastSelector = 'div.combobox2-item:visible:not(.combobox2-item-disabled):last';
        if (!item.length) {
            item = panel.children(dir == 'next' ? firstSelector : lastSelector);
            //			item = panel.children('div.combobox2-item:visible:' + (dir=='next'?'first':'last'));
        } else {
            if (dir == 'next') {
                item = item.nextAll(firstSelector);
                //				item = item.nextAll('div.combobox2-item:visible:first');
                if (!item.length) {
                    item = panel.children(firstSelector);
                    //					item = panel.children('div.combobox2-item:visible:first');
                }
            } else {
                item = item.prevAll(firstSelector);
                //				item = item.prevAll('div.combobox2-item:visible:first');
                if (!item.length) {
                    item = panel.children(lastSelector);
                    //					item = panel.children('div.combobox2-item:visible:last');
                }
            }
        }
        if (item.length) {
            item.addClass('combobox2-item-hover');
            var row = opts.finder.getRow(target, item);
            if (row) {
                scrollTo(target, row[opts.valueField]);
                if (opts.selectOnNavigation) {
                    select(target, row[opts.valueField]);
                }
            }
        }
    }

    /**
	 * select the specified value
	 */
    function select(target, value) {
        var opts = $.data(target, 'combobox2').options;
        var values = $(target).combo2('getValues');
        if ($.inArray(value + '', values) == -1) {
            if (opts.multiple) {
                values.push(value);
            } else {
                values = [value];
            }
            setValues(target, values);
            opts.onSelect.call(target, opts.finder.getRow(target, value));
        }
    }

    /**
	 * unselect the specified value
	 */
    function unselect(target, value) {
        var opts = $.data(target, 'combobox2').options;
        var values = $(target).combo2('getValues');
        var index = $.inArray(value + '', values);
        if (index >= 0) {
            values.splice(index, 1);
            setValues(target, values);
            opts.onUnselect.call(target, opts.finder.getRow(target, value));
        }
    }

    /**
	 * set values
	 */
    function setValues(target, values, remainText) {
        var opts = $.data(target, 'combobox2').options;
        var panel = $(target).combo2('panel');

        panel.find('div.combobox2-item-selected').removeClass('combobox2-item-selected');
        var vv = [], ss = [];
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            var s = v;
            opts.finder.getEl(target, v).addClass('combobox2-item-selected');
            var row = opts.finder.getRow(target, v);
            if (row) {
                s = row[opts.textField];
            }
            vv.push(v);
            ss.push(s);
        }

        $(target).combo2('setValues', vv);
        if (!remainText) {
            $(target).combo2('setText', ss.join(opts.separator));
        }
    }

    /**
	 * load data, the old list items will be removed.
	 */
    function loadData(target, data, remainText) {
        var state = $.data(target, 'combobox2');
        var opts = state.options;
        state.data = opts.loadFilter.call(target, data);
        state.groups = [];
        data = state.data;

        var selected = $(target).combobox2('getValues');
        var dd = [];
        var group = undefined;
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var v = row[opts.valueField] + '';
            var s = row[opts.textField];
            var g = row[opts.groupField];

            if (g) {
                if (group != g) {
                    group = g;
                    state.groups.push(g);
                    dd.push('<div id="' + (state.groupIdPrefix + '_' + (state.groups.length - 1)) + '" class="combobox2-group">');
                    dd.push(opts.groupFormatter ? opts.groupFormatter.call(target, g) : g);
                    dd.push('</div>');
                }
            } else {
                group = undefined;
            }

            var cls = 'combobox2-item' + (row.disabled ? ' combobox2-item-disabled' : '') + (g ? ' combobox2-gitem' : '');
            dd.push('<div id="' + (state.itemIdPrefix + '_' + i) + '" class="' + cls + '">');
            dd.push(opts.formatter ? opts.formatter.call(target, row) : s);
            dd.push('</div>');

            //			if (item['selected']){
            //				(function(){
            //					for(var i=0; i<selected.length; i++){
            //						if (v == selected[i]) return;
            //					}
            //					selected.push(v);
            //				})();
            //			}
            if (row['selected'] && $.inArray(v, selected) == -1) {
                selected.push(v);
            }
        }
        $(target).combo2('panel').html(dd.join(''));

        if (opts.multiple) {
            setValues(target, selected, remainText);
        } else {
            setValues(target, selected.length ? [selected[selected.length - 1]] : [], remainText);
        }

        opts.onLoadSuccess.call(target, data);
    }

    /**
	 * request remote data if the url property is setted.
	 */
    function request(target, url, param, remainText) {
        var opts = $.data(target, 'combobox2').options;
        if (url) {
            opts.url = url;
        }
        //		if (!opts.url) return;
        param = param || {};

        if (opts.onBeforeLoad.call(target, param) == false) return;

        opts.loader.call(target, param, function (data) {
            loadData(target, data, remainText);
        }, function () {
            opts.onLoadError.apply(this, arguments);
        });
    }

    /**
	 * do the query action
	 */
    function doQuery(target, q) {
        var state = $.data(target, 'combobox2');
        var opts = state.options;

        if (opts.multiple && !q) {
            setValues(target, [], true);
        } else {
            setValues(target, [q], true);
        }

        if (opts.mode == 'remote') {
            request(target, null, { q: q }, true);
        } else {
            var panel = $(target).combo2('panel');
            panel.find('div.combobox2-item-selected,div.combobox2-item-hover').removeClass('combobox2-item-selected combobox2-item-hover');
            panel.find('div.combobox2-item,div.combobox2-group').hide();
            var data = state.data;
            var vv = [];
            var qq = opts.multiple ? q.split(opts.separator) : [q];
            $.map(qq, function (q) {
                q = $.trim(q);
                var group = undefined;
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    if (opts.filter.call(target, q, row)) {
                        var v = row[opts.valueField];
                        var s = row[opts.textField];
                        var g = row[opts.groupField];
                        var item = opts.finder.getEl(target, v).show();
                        if (s.toLowerCase() == q.toLowerCase()) {
                            vv.push(v);
                            item.addClass('combobox2-item-selected');
                        }
                        if (opts.groupField && group != g) {
                            $('#' + state.groupIdPrefix + '_' + $.inArray(g, state.groups)).show();
                            group = g;
                        }
                    }
                }
            });
            setValues(target, vv, true);
        }
    }

    function doEnter(target) {
        var t = $(target);
        var opts = t.combobox2('options');
        var panel = t.combobox2('panel');
        var item = panel.children('div.combobox2-item-hover');
        if (item.length) {
            var row = opts.finder.getRow(target, item);
            var value = row[opts.valueField];
            if (opts.multiple) {
                if (item.hasClass('combobox2-item-selected')) {
                    t.combobox2('unselect', value);
                } else {
                    t.combobox2('select', value);
                }
            } else {
                t.combobox2('select', value);
            }
        }
        var vv = [];
        $.map(t.combobox2('getValues'), function (v) {
            if (getRowIndex(target, v) >= 0) {
                vv.push(v);
            }
        });
        t.combobox2('setValues', vv);
        if (!opts.multiple) {
            t.combobox2('hidePanel');
        }
    }

    /**
	 * create the component
	 */
    function create(target) {
        var state = $.data(target, 'combobox2');
        var opts = state.options;

        combobox2_SERNO++;
        state.itemIdPrefix = '_easyui_combobox2_i' + combobox2_SERNO;
        state.groupIdPrefix = '_easyui_combobox2_g' + combobox2_SERNO;

        $(target).addClass('combobox2-f');
        $(target).combo2($.extend({}, opts, {
            onShowPanel: function () {
                $(target).combo2('panel').find('div.combobox2-item,div.combobox2-group').show();
                scrollTo(target, $(target).combobox2('getValue'));
                opts.onShowPanel.call(target);
            }
        }));

        $(target).combo2('panel').unbind().bind('mouseover', function (e) {
            $(this).children('div.combobox2-item-hover').removeClass('combobox2-item-hover');
            var item = $(e.target).closest('div.combobox2-item');
            if (!item.hasClass('combobox2-item-disabled')) {
                item.addClass('combobox2-item-hover');
            }
            e.stopPropagation();
        }).bind('mouseout', function (e) {
            $(e.target).closest('div.combobox2-item').removeClass('combobox2-item-hover');
            e.stopPropagation();
        }).bind('click', function (e) {
            var item = $(e.target).closest('div.combobox2-item');
            if (!item.length || item.hasClass('combobox2-item-disabled')) { return }
            var row = opts.finder.getRow(target, item);
            if (!row) { return }
            var value = row[opts.valueField];
            if (opts.multiple) {
                if (item.hasClass('combobox2-item-selected')) {
                    unselect(target, value);
                } else {
                    select(target, value);
                }
            } else {
                select(target, value);
                $(target).combo2('hidePanel');
            }
            e.stopPropagation();
        });
    }

    $.fn.combobox2 = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.combobox2.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.combo2(options, param);
            }
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'combobox2');
            if (state) {
                $.extend(state.options, options);
                create(this);
            } else {
                state = $.data(this, 'combobox2', {
                    options: $.extend({}, $.fn.combobox2.defaults, $.fn.combobox2.parseOptions(this), options),
                    data: []
                });
                create(this);
                var data = $.fn.combobox2.parseData(this);
                if (data.length) {
                    loadData(this, data);
                }
            }
            if (state.options.data) {
                loadData(this, state.options.data);
            }
            request(this);
        });
    };


    $.fn.combobox2.methods = {
        options: function (jq) {
            var copts = jq.combo2('options');
            return $.extend($.data(jq[0], 'combobox2').options, {
                originalValue: copts.originalValue,
                disabled: copts.disabled,
                readonly: copts.readonly
            });
        },
        getData: function (jq) {
            return $.data(jq[0], 'combobox2').data;
        },
        setValues: function (jq, values) {
            return jq.each(function () {
                setValues(this, values);
            });
        },
        setValue: function (jq, value) {
            return jq.each(function () {
                setValues(this, [value]);
            });
        },
        clear: function (jq) {
            return jq.each(function () {
                $(this).combo2('clear');
                var panel = $(this).combo2('panel');
                panel.find('div.combobox2-item-selected').removeClass('combobox2-item-selected');
            });
        },
        reset: function (jq) {
            return jq.each(function () {
                var opts = $(this).combobox2('options');
                if (opts.multiple) {
                    $(this).combobox2('setValues', opts.originalValue);
                } else {
                    $(this).combobox2('setValue', opts.originalValue);
                }
            });
        },
        loadData: function (jq, data) {
            return jq.each(function () {
                loadData(this, data);
            });
        },
        reload: function (jq, url) {
            return jq.each(function () {
                request(this, url);
            });
        },
        select: function (jq, value) {
            return jq.each(function () {
                select(this, value);
            });
        },
        unselect: function (jq, value) {
            return jq.each(function () {
                unselect(this, value);
            });
        }
    };

    $.fn.combobox2.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.fn.combo2.parseOptions(target), $.parser.parseOptions(target, [
			'valueField', 'textField', 'groupField', 'mode', 'method', 'url'
        ]));
    };

    $.fn.combobox2.parseData = function (target) {
        var data = [];
        var opts = $(target).combobox2('options');
        $(target).children().each(function () {
            if (this.tagName.toLowerCase() == 'optgroup') {
                var group = $(this).attr('label');
                $(this).children().each(function () {
                    _parseItem(this, group);
                });
            } else {
                _parseItem(this);
            }
        });
        return data;

        function _parseItem(el, group) {
            var t = $(el);
            var row = {};
            row[opts.valueField] = t.attr('value') != undefined ? t.attr('value') : t.text();
            row[opts.textField] = t.text();
            row['selected'] = t.is(':selected');
            row['disabled'] = t.is(':disabled');
            if (group) {
                opts.groupField = opts.groupField || 'group';
                row[opts.groupField] = group;
            }
            data.push(row);
        }
    };

    $.fn.combobox2.defaults = $.extend({}, $.fn.combo2.defaults, {
        icourl: null,//扩展图标url
        icohoverurl: null,//扩展图标url
        valueField: 'value',
        textField: 'text',
        groupField: null,
        groupFormatter: function (group) { return group; },
        mode: 'local',	// or 'remote'
        method: 'post',
        url: null,
        data: null,

        keyHandler: {
            up: function (e) { nav(this, 'prev'); e.preventDefault() },
            down: function (e) { nav(this, 'next'); e.preventDefault() },
            left: function (e) { },
            right: function (e) { },
            enter: function (e) { doEnter(this) },
            query: function (q, e) { doQuery(this, q) }
        },
        filter: function (q, row) {
            var opts = $(this).combobox2('options');
            return row[opts.textField].toLowerCase().indexOf(q.toLowerCase()) == 0;
        },
        formatter: function (row) {
            var opts = $(this).combobox2('options');
            return row[opts.textField];
        },
        loader: function (param, success, error) {
            var opts = $(this).combobox2('options');
            if (!opts.url) return false;
            $.ajax({
                type: opts.method,
                url: opts.url,
                data: param,
                dataType: 'json',
                success: function (data) {
                    success(data);
                },
                error: function () {
                    error.apply(this, arguments);
                }
            });
        },
        loadFilter: function (data) {
            return data;
        },
        finder: {
            getEl: function (target, value) {
                var index = getRowIndex(target, value);
                var id = $.data(target, 'combobox2').itemIdPrefix + '_' + index;
                return $('#' + id);
            },
            getRow: function (target, p) {
                var state = $.data(target, 'combobox2');
                var index = (p instanceof jQuery) ? p.attr('id').substr(state.itemIdPrefix.length + 1) : getRowIndex(target, p);
                return state.data[parseInt(index)];
            }
        },

        onBeforeLoad: function (param) { },
        onLoadSuccess: function () { },
        onLoadError: function () { },
        onSelect: function (record) { },
        onUnselect: function (record) { }
    });
})(jQuery);
