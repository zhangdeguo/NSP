(function ($) {
    function options(target) {
        var state = $.data(target, 'priceselector');
        return state.options;
    }
    var priceListData = {}, priceListCallBacks = {};
    function loadPriceList(target, param) {
        var state = $.data(target, 'priceselector');
        //var priceselector = $(target);
        var options = state.options;
        //var priceList = options.priceList;

        var paraData = $.extend({}, param.data);
        delete paraData.Price;
        var key = GM.Tools.O2String(paraData);
        if (typeof priceListData[key] == "undefined") {
            if ($.isFunction(param.callback)) {
                if (typeof priceListCallBacks[key] == "undefined") {
                    priceListCallBacks[key] = [];
                }
                priceListCallBacks[key].push(param.callback);
            }
            //param.callback(priceList);

            $.ajax({
                async: false,
                type: 'POST',
                url: options.service,
                data: { para: key },
                dataType: 'jsonp',
                success: function (res) {
                    //options.priceList = res;
                    //if ($.isFunction(param.callback))
                    //    param.callback(res);

                    priceListData[key] = res;
                    for (var i = 0; i < priceListCallBacks[key].length; i++) {
                        priceListCallBacks[key][i](res);
                    }
                }
            });
            priceListData[key] = false;
        }
        else if (!priceListData[key]) {
            if ($.isFunction(param.callback))
                priceListCallBacks[key].push(param.callback);
        }
        else {
            if ($.isFunction(param.callback))
                param.callback(priceListData[key]);
        }

        //if (!$.valid(priceList)) {

        //} else {

        //}
    }
    var areaListIsLoadFlag = undefined, areaListCallbacks = [];
    function loadAreaList(target, param) {
        var state = $.data(target, 'priceselector');
        var options = state.options;
        var areaList = $(document.body).data("priceselector_areaList");
        //var areaList = options.areaList;
        if (!$.valid(areaList)) {
            if ($.isFunction(param.callback))
                areaListCallbacks.push(param.callback);
            if (typeof areaListIsLoadFlag == "undefined") {
                $.ajax({
                    type: 'GET',
                    url: options.service,
                    data: { a: "area" },
                    dataType: 'jsonp',
                    success: function (res) {
                        $(document.body).data("priceselector_areaList", res);
                        //options.areaList = res;
                        for (var i = 0; i < areaListCallbacks.length; i++) {
                            areaListCallbacks[i](res);
                        }
                    }
                });
                areaListIsLoadFlag = true;
            }
        } else {
            if ($.isFunction(param.callback))
                param.callback(areaList);
        }
    }

    function setValue(target, data) {
        var state = $.data(target, 'priceselector');
        var priceselector = $(target);
        priceselector.combo("setValue", data);
        $(priceselector.combo("textbox")).numberbox("setValue", data);
        return priceselector;
    }

    function getValue(target) {
        var state = $.data(target, 'priceselector');
        var priceselector = $(target);
        return $(priceselector.combo("textbox")).numberbox("getValue");
    }

    function clear(target) {
        var state = $.data(target, 'priceselector');
        var priceselector = $(target);
        priceselector.combo("clear");
    }

    var lengthReg = /\*\d+/ig;
    function processSpec(value) {
        if (value) {
            return value.replace(lengthReg, "");
        }
    }

    function setIndexor(target, indexor) {
        var priceIndexor = get("priceIndexor");
        priceIndexor = $.extend({}, priceIndexor, indexor);
        //priceIndexor.specification = processSpec(priceIndexor.specification);
        set("priceIndexor", priceIndexor);
        var state = $.data(target, 'priceselector');
        var options = state.options;
        delete options.priceList;
        refresh(target);
    }
    var currentDate = new Date().Format("yyyy-MM-dd");
    function pushValue(target) {
        var state = $.data(target, 'priceselector');
        var priceselector = $(target);
    }

    function get(key) {
        return GM.Tools.String2O($.LS.get(key));
    }
    function set(key, value) {
        $.LS.set(key, GM.Tools.O2String(value));
    }

    function combineIndexor(para, index) {
        if (!para)
            para = {};
        if (!index)
            index = {};
        if (index.source) {
            var find = false;
            if ($.isArray(para.Source)) {
                for (var i = 0; i < para.Source.length; i++) {
                    if (para.Source[i].Key == index.source) {
                        find = true;
                        break;
                    }
                }
            } else {
                para.Source = [];
            }
            if (!find) {
                if ($.valid(index.sourcepos) && index.sourcepos < 4)
                    para.Source[index.sourcepos] = { Key: index.source };
                else
                    para.Source.unshift({ Key: index.source });
            }
            para.Source = para.Source.slice(0, 4);
        }
        if (index.area) {
            var find = false;
            if ($.isArray(para.Areas)) {
                for (var i = 0; i < para.Areas.length; i++) {
                    if (para.Areas[i].Key == index.area) {
                        find = true;
                        break;
                    }
                }
            } else {
                para.Areas = [];
            }
            if (!find) {
                if ($.valid(index.areapos) && index.areapos < 4)
                    para.Areas[index.areapos] = { Key: index.area };
                else
                    para.Areas.unshift({ Key: index.area });
            }
            para.Areas = para.Areas.slice(0, 4);
        }
        if (index.product) {
            var find = false;
            index.product = index.product.replace("抗震", "").replace("三级", "").replace("二级", "").replace("四级", "");
            if ($.isArray(para.ProductNames)) {
                for (var i = 0; i < para.ProductNames.length; i++) {
                    if (para.ProductNames[i].Key) {
                        para.ProductNames[i].Key = para.ProductNames[i].Key.replace("抗震", "");
                    }
                    if (para.ProductNames[i].Key == index.product) {
                        find = true;
                        if (index.specification) {
                            index.specification = index.specification.replace(/\*\d+/g, "").replace(/\s/g, "").replace("Ф", "φ");
                            var sfind = false;
                            if ($.isArray(para.ProductNames[i].Value)) {
                                for (var j = 0; j < para.ProductNames[i].Value.length; j++) {
                                    if (para.ProductNames[i].Value[j])
                                        para.ProductNames[i].Value[j] = para.ProductNames[i].Value[j].replace(/\*\d+/g, "").replace(/\s/g, "").replace("Ф", "φ");
                                    if (para.ProductNames[i].Value[j] == index.specification) {
                                        sfind = true;
                                        break;
                                    }
                                }
                            } else {
                                para.ProductNames[i].Value = [index.specification];
                            }
                            if (!sfind) {
                                if ($.valid(index.specificationpos) && index.specificationpos < 4)
                                    para.ProductNames[i].Value[index.specificationpos] = index.specification;
                                else
                                    para.ProductNames[i].Value.unshift(index.specification);
                            }
                            para.ProductNames[i].Value = para.ProductNames[i].Value.slice(0, 4);
                        }
                        break;
                    }
                }
            } else {
                para.ProductNames = [];
            }
            if (!find) {
                if ($.valid(index.productpos) && index.productpos < 4)
                    para.ProductNames[index.productpos] = { Key: index.product, Value: [index.specification] };
                else
                    para.ProductNames.unshift({ Key: index.product, Value: [index.specification] });
            }
            para.ProductNames = para.ProductNames.slice(0, 4);
        }
        return para;
    }

    function refresh(target) {
        var state = $.data(target, 'priceselector');
        if (state.select) {
            var priceselector = $(target);
            var options = state.options;
            var priceIndexor = get("priceIndexor");
            if (!priceIndexor) {
                priceIndexor = {};
            }
            var para = get("priceParameters");
            options.onRefresh.call(target, para, priceIndexor);
            para = combineIndexor(para, priceIndexor);
            para.EndDate = currentDate;
            var ed = Date.StringToDate(para.EndDate);
            if (ed)
                para.BeginDate = ed.DateAdd("d", -7).Format("yyyy-MM-dd");
            var fallCtls = state.select.fallCtls;
            var falls = get("fallList");
            if (!$.isArray(falls)) {
                falls = ["0.00", "10.00", "25.00", "35.00"];
            }
            var find = false;
            for (var i = 0; i < Math.min(fallCtls.length, falls.length) ; i++) {

                if (fallCtls[i].is(".edit")) {
                    var v = fallCtls[i].children(".input").numberbox("getValue");
                    fallCtls[i].attr("key", v);
                }
                var kv = fallCtls[i].attr("key");
                if (kv)
                    falls[i] = kv;
                else
                    fallCtls[i].attr("key", falls[i]).children(".text").text(falls[i]);

                if (priceIndexor.fall == falls[i]) {
                    fallCtls[i].addClass("select");
                    find = true;
                } else {
                    fallCtls[i].removeClass("select");
                    fallCtls[i].removeClass("edit");
                    fallCtls[i].children(".input").hide();
                    fallCtls[i].children(".text").text(kv).show();
                }
            }
            if (!find && falls.length > 0) {
                priceIndexor.fall = falls[0];
                fallCtls[0].addClass("select");
            }
            set("fallList", falls);

            loadPriceList(target, {
                data: para, callback: function (price) {
                    if (price) {
                        var find = false;
                        var sourceCtls = state.select.sourceCtls;
                        if ($.isArray(price.Source)) {
                            for (var i = 0; i < Math.min(sourceCtls.length, price.Source.length) ; i++) {
                                sourceCtls[i].attr("key", price.Source[i].Key).show().children(".text").text(price.Source[i].Value);
                                if (priceIndexor.source == price.Source[i].Key) {
                                    sourceCtls[i].addClass("select");
                                    find = true;
                                } else
                                    sourceCtls[i].removeClass("select");
                            }
                            if (!find && price.Source.length > 0) {
                                priceIndexor.source = price.Source[0].Key;
                                sourceCtls[0].addClass("select");
                            }
                            find = false;
                        } else
                            price.Source = [];

                        for (var i = Math.min(sourceCtls.length, price.Source.length) ; i < sourceCtls.length; i++) {
                            sourceCtls[i].removeClass("select").hide();
                        }

                        var areaCtls = state.select.areaCtls;
                        if ($.isArray(price.Areas)) {
                            var aks = {};
                            for (var j = 0; j < areaCtls.length; j++) {
                                aks[areaCtls[j].attr("key")] = j;
                            }

                            var aas = [];

                            for (var j = 0; j < Math.min(areaCtls.length, price.Areas.length) ; j++) {
                                aas[j] = price.Areas[j];
                            }
                            for (var i = 0; i < price.Areas.length ; i++) {
                                var j = aks[price.Areas[i].Key];
                                if ($.isNumeric(j) && i != j) {
                                    var p = aas[j];
                                    aas[j] = price.Areas[i]
                                    if (i < aas.length)
                                        aas[i] = p;
                                }
                            }

                            price.Areas = aas;
                            for (var i = 0; i < Math.min(areaCtls.length, price.Areas.length) ; i++) {
                                areaCtls[i].attr("key", price.Areas[i].Key).show().children(".text").text(price.Areas[i].Value);
                                if (priceIndexor.area == price.Areas[i].Key) {
                                    areaCtls[i].addClass("select").attr("title", "点击选择其他城市");
                                    find = true;
                                } else
                                    areaCtls[i].removeClass("select").removeAttr("title");
                            }
                            if (!find && price.Areas.length > 0) {
                                priceIndexor.area = price.Areas[0].Key;
                                areaCtls[0].addClass("select");
                            }
                            find = false;
                        } else
                            price.Areas = [];
                        for (var i = Math.min(areaCtls.length, price.Areas.length) ; i < areaCtls.length; i++) {
                            areaCtls[i].removeClass("select").hide();
                        }

                        var productCtls = state.select.productCtls;
                        var specifactionCtls = state.select.specifactionCtls;
                        if ($.isArray(price.ProductNames)) {
                            var specs;
                            for (var i = 0; i < Math.min(productCtls.length, price.ProductNames.length) ; i++) {
                                productCtls[i].attr("key", price.ProductNames[i].Key).show().children(".text").text(price.ProductNames[i].Key);
                                if (priceIndexor.product == price.ProductNames[i].Key) {
                                    productCtls[i].addClass("select");
                                    specs = price.ProductNames[i].Value;
                                    find = true;
                                } else
                                    productCtls[i].removeClass("select");
                            }
                            if (!find && price.ProductNames.length > 0) {
                                priceIndexor.product = price.ProductNames[0].Key;
                                productCtls[0].addClass("select");
                                specs = price.ProductNames[0].Value;
                            }
                            find = false;
                            if ($.isArray(specs)) {
                                for (var i = 0; i < Math.min(specs.length, specifactionCtls.length) ; i++) {
                                    specifactionCtls[i].attr("key", specs[i]).show().children(".text").text(specs[i]);
                                    if (priceIndexor.specification == specs[i]) {
                                        specifactionCtls[i].addClass("select");
                                        find = true;
                                    } else
                                        specifactionCtls[i].removeClass("select");
                                }
                                if (!find && specs.length > 0) {
                                    priceIndexor.specification = specs[0];
                                    specifactionCtls[0].addClass("select");
                                }
                                find = false;
                            }
                            for (var i = Math.min(specifactionCtls.length, specs.length) ; i < specifactionCtls.length; i++) {
                                specifactionCtls[i].removeClass("select").hide();
                            }
                        } else {
                            price.ProductNames = [];
                            for (var i = 1 ; i < specifactionCtls.length; i++) {
                                specifactionCtls[i].removeClass("select").hide();
                            }
                        }

                        for (var i = Math.min(productCtls.length, productCtls.length) ; i < productCtls.length; i++) {
                            productCtls[i].removeClass("select").hide();
                        }


                        if ($.isArray(price.Price) && price.Price.length > 0) {
                            for (var i = 0; i < price.Price.length; i++) {
                                if (priceIndexor.source == price.Price[i].Source &&
                                    priceIndexor.area == price.Price[i].Area &&
                                    priceIndexor.product == price.Price[i].ProductName &&
                                    priceIndexor.specification == price.Price[i].Specifactions) {
                                    var fallValue = 0;
                                    var idx = priceIndexor.fall.lastIndexOf("%");
                                    if (idx > 0) {
                                        fallValue = Math.AccMul(Math.AccDiv(parseFloat($.trim(priceIndexor.fall.substring(0, idx))), 100), price.Price[i].Value);
                                    }
                                    else
                                        fallValue = parseFloat($.trim(priceIndexor.fall));

                                    if (isNaN(fallValue))
                                        fallValue = 0;

                                    var v = GM.GridFormat.CurrencyFormatter(Math.AccAdd(price.Price[i].Value, fallValue), 0, 0, "");
                                    state.select.priceCtl.text(v).attr("key", Math.AccAdd(price.Price[i].Value, fallValue));
                                    state.select.showCtl.text("西本指导价上浮" + priceIndexor.fall);
                                    find = true;
                                    break;
                                }
                            }
                            if (!find) {
                                state.select.priceCtl.text(GM.GridFormat.CurrencyFormatter("未找到有效报价", 0, 0, "")).attr("key", "");
                                state.select.showCtl.text("");
                            }
                        }
                        else {
                            state.select.showCtl.text("");
                            state.select.priceCtl.text(GM.GridFormat.CurrencyFormatter("未找到有效报价", 0, 0, "")).attr("key", "");
                        }
                        set("priceParameters", price);
                        set("priceIndexor", priceIndexor);
                    }
                }
            });
        }
    }
    function setPriceSelector(target) {
        var state = $.data(target, 'priceselector');
        var options = state.options;
        var priceselector = $(target);
        var panels = [];

        function doClick(key) {
            var priceIndexor = get("priceIndexor");
            if (!priceIndexor) {
                priceIndexor = {};
            }

            priceIndexor[key] = $(this).attr("key");
            set("priceIndexor", priceIndexor);
            refresh(target);
        }

        function doComboClick(comboctrl, panel, key) {
            if ($(this).is(".select")) {
                if (panel) {
                    if (panel.is(":visible")) {
                        $(this).removeClass("edit");
                    } else {
                        for (var i = 0; i < panels.length; i++) {
                            if (panels[i] !== panel)
                                panels[i].combo("hidePanel");
                        }
                        $(this).focus();
                        $(this).addClass("edit");
                        comboctrl.combo("showPanel");
                    }
                }
            } else {
                for (var i = 0; i < panels.length; i++) {
                    panels[i].combo("hidePanel");
                }
                doClick.call(this, key);
            }
        }

        function doFallClick(key) {
            if ($(this).is(".select") && !$(this).is(".edit")) {
                $(this).addClass("edit");
                $(this).children(".input").outerWidth($(this).innerWidth()).show().numberbox("setValue", $(this).attr("key"));
                $(this).children(".text").hide();
            } else {
                doClick.call(this, key);
            }
        }

        function createComboBtn(div, cate, idx) {
            function selectCombo() {
                var key = $(this).attr("key");
                var dkey = ctrl.attr("key");
                if (key != dkey) {
                    comboPanel.panel("close");
                    var priceIndexor = get("priceIndexor");
                    if (!priceIndexor) {
                        priceIndexor = {};
                    }
                    priceIndexor.area = key;
                    priceIndexor.areapos = idx;
                    set("priceIndexor", priceIndexor);

                    var state = $.data(target, 'priceselector');
                    var options = state.options;
                    delete options.priceList;
                    refresh(target);
                }
            }

            if (cate == "area") {
                var comboctrl = $("<input type='text' />").appendTo(div).hide();
                comboctrl.combo(
                    {
                        panelMaxHeight: 'auto',
                        hideReloadButton: true,
                        panelHeight: 280,
                        panelWidth: 320,
                        width: 56,
                        height: 28,
                        hasDownArrow: false,
                        editable: false
                    });
                var comboPanel = comboctrl.combo("panel").addClass("priceselector");
                panels.push(comboctrl);
                var dv1 = $("<div></div>").css("margin", "8px 8px 2px 8px").appendTo(comboPanel.panel("body"));
                var ctrl = comboctrl.combo("textbox").hide().parent().addClass("button").click(function () {
                    doComboClick.call(this, comboctrl, comboPanel, cate)
                });
                $("<span class='text'></span>").appendTo(ctrl);

                loadAreaList(target, {
                    callback: function (areas) {
                        if ($.isArray(areas)) {
                            for (var i = 0; i < areas.length; i++) {
                                var key = areas[i].Key;
                                var val = areas[i].Value;
                                var btn = $("<div></div>").appendTo($("<a></a>").appendTo(dv1)).addClass("button").click(function () {
                                    selectCombo.call(this);
                                });
                                btn.attr("key", key);
                                $("<span class='text'></span>").text(val).appendTo(btn);
                            }
                        }
                    }
                });
            } else {
                var ctrl = $("<div></div>").appendTo($("<a></a>").appendTo(div)).addClass("button").click(function () {
                    doComboClick.call(this, ctrl, undefined, cate)
                });
                $("<span class='text'></span>").appendTo(ctrl);
            }
            return ctrl;
        }

        function createFallBtn(div, cate) {
            var ctrl = $("<div></div>").appendTo($("<a></a>").appendTo(div)).addClass("button").addClass("fall").click(function () { doFallClick.call(this, cate) });
            $("<span class='text'></span>").appendTo(ctrl);
            $("<input class='input' nogrow='1' type='text' />").appendTo(ctrl).hide().numberbox({ precision: 2 });
            return ctrl;
        }

        function selectPrice() {
            var key = $(this).attr("key");
            if (key) {
                $(priceselector.combo("textbox")).numberbox("setValue", key);
                priceselector.combo("setValue", key);
                priceselector.combo("setText", key);
                priceselector.combo("hidePanel");
                $(priceselector.combo("textbox")).focus();
            }
        }

        priceselector.addClass("priceselector");
        var optionsOnShowPanel = options.onShowPanel;
        options.onShowPanel = function () {
            if (!state.select) {
                var panel = priceselector.combo("panel");
                panel.addClass("priceselector");
                var div = $('<div></div>').addClass("line").css("margin", "4px").appendTo(panel);
                //$("<span class='title'>参考报价：</span>").appendTo(div);
                var priceCtl = $('<span></span>').addClass("price").text("").appendTo(div).click(selectPrice);
                var showCtl = $('<span></span>').css("margin-left", "10px").text("").appendTo(div);

                div = $('<div></div>').addClass("line").css("margin", "4px").appendTo(panel);
                $("<span class='title'>时间：</span>").appendTo(div);
                var rnd = new Date().getTime();
                div = $("<input type='text' id='txt_DateSource" + rnd + "'  class='easyui-validatebox' />").appendTo(div);
                var DataSourceCtls = [];
                DataSourceCtls.push(createComboBtn(div, "DataSource", 0));
                GM.Editor.txtToDatebox("txt_DateSource" + rnd, new Date().Format("yyyy-MM-dd"), {
                    onChange: function (newDate) {
                        var state = $.data(target, 'priceselector');
                        var options = state.options;
                        delete options.priceList;
                        currentDate = newDate;
                        refresh(target);
                    }
                });

                div = $('<div></div>').addClass("line").css("margin", "4px").appendTo(panel);
                $("<span class='title'>价格来源：</span>").appendTo(div);
                div = $('<div class="content"></div>').appendTo(div);
                var sourceCtls = [];
                sourceCtls.push(createComboBtn(div, "source", 0));
                sourceCtls.push(createComboBtn(div, "source", 1));
                sourceCtls.push(createComboBtn(div, "source", 2));
                sourceCtls.push(createComboBtn(div, "source", 3));

                div = $('<div></div>').addClass("line").css("margin", "4px").appendTo(panel);
                $("<span class='title'>销售区域：</span>").appendTo(div);
                div = $('<div class="content"></div>').appendTo(div);
                var areaCtls = []
                areaCtls.push(createComboBtn(div, "area", 0));
                areaCtls.push(createComboBtn(div, "area", 1));
                areaCtls.push(createComboBtn(div, "area", 2));
                areaCtls.push(createComboBtn(div, "area", 3));

                div = $('<div></div>').addClass("line").css("margin", "4px").appendTo(panel);
                $("<span class='title'>品名：</span>").appendTo(div);
                div = $('<div class="content"></div>').appendTo(div);
                var productCtls = []
                productCtls.push(createComboBtn(div, "product", 0));
                productCtls.push(createComboBtn(div, "product", 1));
                productCtls.push(createComboBtn(div, "product", 2));
                productCtls.push(createComboBtn(div, "product", 3));

                div = $('<div></div>').addClass("line").css("margin", "4px").appendTo(panel);
                $("<span class='title'>规格：</span>").appendTo(div);
                div = $('<div class="content"></div>').appendTo(div);
                var specifactionCtls = []
                specifactionCtls.push(createComboBtn(div, "specification", 0));
                specifactionCtls.push(createComboBtn(div, "specification", 1));
                specifactionCtls.push(createComboBtn(div, "specification", 2));
                specifactionCtls.push(createComboBtn(div, "specification", 3));

                div = $('<div></div>').addClass("line").css("margin", "4px").appendTo(panel);
                $("<span class='title'>浮动价格：</span>").appendTo(div);
                div = $('<div class="content"></div>').appendTo(div);
                var fallCtls = []
                fallCtls.push(createFallBtn(div, 'fall', 0));
                fallCtls.push(createFallBtn(div, 'fall', 1));
                fallCtls.push(createFallBtn(div, 'fall', 2));
                fallCtls.push(createFallBtn(div, 'fall', 3));

                state.select = {
                    priceCtl: priceCtl, showCtl: showCtl, sourceCtls: sourceCtls, areaCtls: areaCtls, productCtls: productCtls, specifactionCtls: specifactionCtls, fallCtls: fallCtls, DataSourceCtls: DataSourceCtls
                };
                refresh(target);
            }
            if (optionsOnShowPanel)
                optionsOnShowPanel.call(target);
        };
        options = $.extend({
            panelMaxHeight: 'auto',
            hideReloadButton: true
        }, options);
        priceselector.combo(options);
        $(priceselector.combo("textbox")).numberbox(options);
    }

    $.fn.priceselector = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.priceselector.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'priceselector');
            if (state) {
                $.extend(state.options, options);
                setPriceSelector(this);
            } else {
                $.data(this, 'priceselector', {
                    options: $.extend({}, $.fn.priceselector.defaults, options)
                });
                setPriceSelector(this);
            }
        });
    };

    $.fn.priceselector.methods = $.extend({}, $.fn.combo.methods, {
        options: function (jq) {
            return options(jq[0]);
        },
        setIndexor: function (jq, index) {
            return jq.each(function () {
                setIndexor(this, index);
            });
        },
        clear: function (jq) {
            return jq.each(function () {
                clear(this);
            });
        },
        setValue: function (jq, data) {
            return jq.each(function () {
                setValue(this, data);
            });
        },
        getValue: function (jq) {
            return getValue(jq[0]);
        }
    });

    $.fn.priceselector.defaults = $.extend({}, $.fn.combo.defaults, {
        service: config.businessOptions.ListPricePath,// "http://govgmhl.i56yunbeta.net/LoadPriceList.ashx",
        hasDownArrow: false,
        precision: 2,
        editable: true,
        panelWidth: 360,
        panelHeight: 270,
        onSubmit: function (param) { return $(this).form('validate'); },
        success: function (data) { },
        onBeforeLoad: function (param) { },
        onLoadSuccess: function (data) { },
        onLoadError: function () { },
        onRefresh: function () { }
    });
    $.parser.plugins.push('priceselector');
    $.parser.parse();
})(jQuery);