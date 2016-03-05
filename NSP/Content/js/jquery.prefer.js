(function ($) {
    function seri(O) {
        var S = [];
        var J = "";
        if (O != null && typeof (O) != "undefined") {
            var prototype = Object.prototype.toString.apply(O);
            if (prototype === '[object Number]') {
                J = O;
            }
            else if (prototype === '[object Array]') {
                for (var i = 0; i < O.length; i++) {
                    if (O[i])
                        S.push(seri(O[i]));
                }
                J = '[' + S.join(',') + ']';
            }
            else if (prototype === '[object String]') {
                J = '"' + O + '"';
            }
            else if (prototype === '[object Null]') {
                J = '""';
            }
            else if (prototype === '[object Date]') {
                J = "new Date(" + O.getTime() + ")";
            }
            else if (prototype === '[object RegExp]' || prototype === '[object Function]') {
                J = O.toString();
            }
            else if (prototype === '[object Object]') {
                for (var i in O) {
                    if (O[i] != null && typeof (O[i]) != "undefined") {
                        var v = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? seri(O[i]) : O[i]);
                        if (i == "") continue;
                        S.push("\"" + i + "\"" + ':' + v);
                    }
                }
                J = '{' + S.join(',') + '}';
            }
        }
        return J;
    }
    function deseri(str) {
        try {
            return eval("(" + str + ")");
        } catch (e) {
        }
    }
    function get(key)
    {
        return deseri($.LS.get(key));
    }
    function set(key, value)
    {
        $.LS.set(key, seri(value));
    }
    function doanalyze(data, preferItems, preferAnalyze) {
        if (data == undefined)
            return;
        if ($.isArray(data)) {
            for (var i = 0; i < data.length; i++)
                doanalyze(data[i], preferItems, preferAnalyze);
        } else {
            $.each(data, function (index, element) {
                if ($.isPlainObject(element) || $.isArray(element)) {
                    doanalyze(element, preferItems, preferAnalyze);
                }
                else if (element != null && element != undefined && element != NaN) {
                    element = element.toString();
                    for (var key in preferItems) {
                        var val;
                        if (preferItems[key].source[index]) {
                            for (var d in preferItems[key].dest) {
                                val = data[d];
                                if (val != undefined) {
                                    break;
                                }
                            }
                        }
                        if (val != undefined) {
                            for (var s in preferItems[key].source) {
                                var item = preferAnalyze[s];
                                if (!item) {
                                    item = {};
                                    item[element] = [];
                                }
                                if (!item[element])
                                    item[element] = [];

                                var dest = item[element];

                                dest.shift();
                                var find = false;
                                for (var j = 0; j < dest.length; j++) {
                                    if (dest[j].dest == val) {
                                        dest[j].count++;
                                        find = true;
                                        break;
                                    }
                                }

                                if (!find)
                                    dest.push({ dest: val, count: 1 });
                                dest.sort(function (a, b) { return a.count - b.count; });
                                dest.unshift({ dest: val, count: 1 });
                                dest = dest.slice(0, 16);
                                preferAnalyze[s] = item;
                            }
                        }
                    }
                }
            });
        }
    }
    $.prefer = {
        analyze: function (data) {
            try {
                var preferItems = get("preferItems");
                if (!preferItems)
                    preferItems = {};
                var preferAnalyze = get("preferAnalyze");
                if (!preferAnalyze)
                    preferAnalyze = {};
                doanalyze(data, preferItems, preferAnalyze);
                set("preferAnalyze", preferAnalyze);
            } catch (e) {

            }
        },
        getPrefer: function (source, val) {
            if (val != null && val != undefined && val != NaN) {
                var preferAnalyze = get("preferAnalyze");
                if (preferAnalyze && preferAnalyze[source]) {
                    return preferAnalyze[source][val.toString()];
                }
            }
        },
        register: function (key, source, dest) {
            var preferItems = get("preferItems");
            if (!preferItems)
                preferItems = {};
            var item = {};
            item.source = {};
            item.dest = {};
            for (var i = 0; i < source.length; i++)
                item.source[source[i]] = true;

            for (var i = 0; i < dest.length; i++)
                item.dest[dest[i]] = true;

            preferItems[key] = item;
            set("preferItems", preferItems);
        },
        unregister: function (key) {
            var preferItems = get("preferItems");
            if (preferItems && preferItems[key])
                delete preferItems[key];
        }
    };
})(jQuery);