(function ($) {
    function tagsCache(key, value) {
        var item = $(document.body).data("tagsCache");
        if (!$.valid(item)) {
            item = {};
        }

        if (value != undefined) {
            item[key] = value;
            $(document.body).data("tagsCache", item);
        } else {
            return item[key];
        }
    }
    function removeTagsCache(key) {
        var item = $(document.body).data("tagsCache");
        if ($.valid(item)) {
            item[key] = null;
            delete item[key];
            $(document.body).data("tagsCache", item);
        }
    }
    function tagNamesCache(key, value) {
        var item = $(document.body).data("tagNamesCache");
        if (!$.valid(item)) {
            item = {};
        }

        if (value != undefined) {
            item[key] = value;
            $(document.body).data("tagNamesCache", item);
        } else {
            return item[key];
        }
    }
    function removeTagNamesCache(key) {
        var item = $(document.body).data("tagNamesCache");
        if ($.valid(item)) {
            item[key] = null;
            delete item[key];
            $(document.body).data("tagNamesCache", item);
        }
    }
    function options(target) {
        var state = $.data(target, 'tags');
        return state.options;
    }
    function setValue(target, data) {
        var state = $.data(target, 'tags');
        var options = state.options;
        var tags = $(target);
        var tag = {};

        if (data != undefined) {
            if (data.Value != undefined)
                tag.Value = data.Value;
            if (data.Text != undefined)
                tag.Text = data.Text;
            else {
                if (tag.Value == undefined)
                    tag.Value = data;
                tag.Text = getText(target);
            }
        }

        callSetTag(target, tag, function () {
            doSetTag(target, tag);
        });

        if (options.onTagChanged)
            options.onTagChanged.call(target, tag);

        return tags;
    }
    /*2014-11-04 add by cxp*/
    function getFlagNoByValue(items, value) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].Value == value) {
                return ((i + 1) % 8);
            }
        }
        return 0;
    }

    function getValue(target) {
        return $(target).data('Value');
    }

    function getText(target) {
        var tags = $(target);
        return tags.attr('title');
    }

    function setText(target, text) {
        var tags = $(target);
        return tags.attr('title', text);
    }

    function resetText(target) {
        var tags = $(target);
        return tags.removeAttr('title');
    }
    
    function clearCache(target) {
        var key = options.refrenceName + '$' + options.category;
        removeTagsCache(key);
        removeTagNamesCache(key);
    }

    function callSetTag(target, tag, callback) {
        if (tag) {
            var state = $.data(target, 'tags');
            var options = state.options;

            tag.RefrenceName = options.refrenceName;
            tag.Category = options.category;
            tag.RefrenceId = options.refrenceId,
            tag.RefrenceText = options.refrenceText;
            if (options.remoteTag) {
                Core.doPostAction("Common.Tags.Set", tag, function (json) {

                    if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)) {
                        var key = options.refrenceName + '$' + options.category;
                        removeTagsCache(key);

                        var zdata = $.extend(true, {}, json);
                        if ($.isFunction(callback)) {
                            callback(tag);
                        }
                    }
                });
            }else
            {
                if ($.isFunction(callback)) {
                    callback(tag);
                }
            }
        }
    }

    function loadTagNames(target, callback) {
        var state = $.data(target, 'tags');
        var options = state.options;

        var key = options.refrenceName + '$' + options.category;
        var data = tagNamesCache(key);

        if (!data) {
            Core.getJson("Common.Tags.Query", {
                RefrenceName: options.refrenceName,
                Category: options.category
            }, function (json) {
                if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)) {
                    var zdata = $.extend(true, {}, json);
                    tagNamesCache(key, zdata);
                    if (!$.isArray(zdata.data)) {
                        zdata.data = [];
                    }
                    if ($.isFunction(callback)) {
                        callback(zdata);
                    }
                }
            });
        } else {
            if ($.isFunction(callback)) {
                callback(data);
            }
        }
    }

    function doSetTag(target, tag) {
        var state = $.data(target, 'tags');
        var options = state.options;
        var tags = $(target);
        var items = options.items;

        if (!tag.Value)
            tag.Value = 0;

        for (var i = 0; i <= 8; i++) {
            tags.removeClass('icon-flag' + i);
        }
        tags.addClass('icon-flag' + getFlagNoByValue(options.items, tag.Value)).data('Value', tag.Value);
        if (tag.Value)
            setText(target, tag.Text);
        else
            resetText(target);
    }

    var menuCache = {};

    function setTags(target) {
        var state = $.data(target, 'tags');
        var options = state.options;
        var tags = $(target);
        var menuName = options.menuName;
        if (!menuName)
            menuName = 'default';

        if (!options.refrenceText)
            options.refrenceText = '';

        state.menu = menuCache[menuName];
        if (!state.menu) {

            var items = options.items;

            options.onClick = function (item) {
                var tag = {
                    Value: item.name,
                    Text: item.text
                };
                var targetDom = $(this).data("current");
                if (options.onMenuClick) {
                    options.onMenuClick.call(targetDom, tag);
                }
                setValue(targetDom, tag);
            };

            var menu = '<div data-options="iconCls:\'icon-flag0\', name:0">清除</div>';
            for (var i = 0; i < items.length; i++) {
                var v = 1;
                if ($.isNumeric(items[i].Value))
                    v = items[i].Value;
                menu += '<div data-options="iconCls:\'icon-flag' + ((i+1)%8) + '\', name:' + v + '">' + items[i].Text + '</div>';
            }
            state.menu = $('<div></div>').html(menu).menu(options);
            menuCache[menuName] = state.menu;
        }

        tags.click(function (e) {
            state.menu.data("current", target);
            state.menu.menu("show", {
                left: e.pageX,
                top: e.pageY
            });
        });

        getTags(target, function (tag) {
            doSetTag(target, tag);
        });
    }

    function loadTags(target, callback) {
        var state = $.data(target, 'tags');
        var options = state.options;

        var key = options.refrenceName + '$' + options.category;
        var data = tagsCache(key);
        if (!data) {
            Core.getJson("Common.Tags.Select", {
                RefrenceName: options.refrenceName,
                Category: options.category
            }, function (json) {
                if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)) {
                    var zdata = $.extend(true, {}, json);
                    tagsCache(key, zdata);
                    if (!$.isArray(zdata.data)) {
                        zdata.data = [];
                    }
                    if ($.isFunction(callback)) {
                        callback.call(target, zdata);
                    }
                }
            }, false);
        } else {
            if ($.isFunction(callback)) {
                callback.call(target, data);
            }
        }
    }

    function getTags(target, callback) {
        var state = $.data(target, 'tags');
        var options = state.options;
        if (options.remoteTag) {
            loadTags(target, function (json) {
                if ($.isFunction(callback)) {
                    if ($.isArray(json.data)) {
                        for (var i = 0; i < json.data.length; i++) {
                            var tag = json.data[i];
                            if (tag &&
                                (($.valid(tag.RefrenceId) && tag.RefrenceId == options.refrenceId) || ($.valid(tag.RefrenceText) && tag.RefrenceText == options.refrenceText))) {
                                callback.call(target, tag);
                                return;
                            }
                        }
                    }
                    callback.call(target, {
                        Value: 0,
                        Text: '',
                        Category: options.category,
                        RefrenceId: options.refrenceId,
                        RefrenceName: options.refrenceName,
                        RefrenceText: options.refrenceText
                    });
                }
            });
        } else {
            callback.call(target, {
                Value: 0,
                Text: '',
                Category: options.category,
                RefrenceId: options.refrenceId,
                RefrenceName: options.refrenceName,
                RefrenceText: options.refrenceText
            });
        }
    }

    $.fn.tags = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.tags.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'tags');
            if (state) {
                $.extend(state.options, options);
                setTags(this);
            } else {
                $.data(this, 'tags', {
                    options: $.extend({}, $.fn.tags.defaults, options)
                });
                setTags(this);
            }
        });
    };

    $.tags = {
        showTagFilterMenu: function (items, menuName) {
        }
    };

    $.fn.tags.methods = $.extend({}, $.fn.combo.methods, {
        options: function (jq) {
            return options(jq[0]);
        },
        clearCache: function (jq) {
            return jq.each(function () {
                clearCache(this);
            });
        },
        setValue: function (jq, data) {
            return jq.each(function () {
                setValue(this, data);
            });
        },
        getValue: function (jq) {
            return getValue(jq[0]);
        },
        setText: function (jq, data) {
            return jq.each(function () {
                setText(this, data);
            });
        },
        getText: function (jq) {
            return getText(jq[0]);
        }
    });

    $.fn.tags.defaults = $.extend({}, $.fn.menu.defaults, {
        hideOnUnhover: true,
        items: [
            { Value: 1, Text: '标记1' },
            { Value: 2, Text: '标记2' },
            { Value: 3, Text: '标记3' },
            { Value: 4, Text: '标记4' },
            { Value: 5, Text: '标记5' },
            { Value: 6, Text: '标记6' },
            { Value: 7, Text: '标记7' },
            { Value: 8, Text: '标记8' }
        ],
        onTagChanged: function (tag) { },
        remoteTag:true
    });
    $.parser.plugins.push('tags');
    $.parser.parse();
})(jQuery);