var UIHelper = {
    waitingList: new Array(),
    waiting: function (handler) {
        if ($.isFunction(handler)) {
            UIHelper.waitingList.push(handler);
            if (UIHelper.waitingList.length == 1) {
                $(document).ajaxStop(function () {
                    for (var i = 0; i < UIHelper.waitingList.length; i++) {
                        UIHelper.waitingList[i]();
                    }
                    UIHelper.waitingList = new Array();
                });
            }
        }
    },
    createApproveHref: function (submitAction, approveBillId, approveState) {
        var _href = $("<a/>").attr({
            submitAction: submitAction,
            approveBillId: approveBillId,
            approveState: approveState
        }); 
        return _href[0].outerHTML;
    },
    loadjQueryDom: function (id) {
        if (id) {
            if (Object.prototype.toString.apply(id) === '[object String]' && !id.startWith("#") && !id.startWith("."))
                return $("#" + id);
        }
        return $(id);
    },
    //从查询条件设定，生成查询界面
    renderSearchBar: function (searchConditions) {
        var sbox = UIHelper.loadjQueryDom(searchConditions.searchboxid).addClass("searchPanel");
        var form = $("<form method='post'></form>").appendTo(sbox);
        var mrow = $("<tr></tr>").appendTo($("<table width='99%'></table>").appendTo(form));
        var mtd1 = $("<td></td>").appendTo(mrow);
        var mtd2 = $("<td style='width:30px;'></td>").appendTo(mrow);
        var firstLine = true;
        var hasExtPenel = false;

        var fieldsPanelExt = $("<div></div>").attr('id', sbox.attr('id') + '_ext').appendTo($(document.body));
        fieldsPanelExt.panel(
        {
            doSize: false,
            closed: true,
            noheader: true,
            border: true,
            cls: "combo-p searchPanel searchExtPanel",
            style: { position: "absolute" }
        });
        var fieldsPanelExtBody = fieldsPanelExt.panel("body").addClass("combo-panel");

        var extBtnCell;
        var fieldsPanel = $("<table></table>").addClass("fieldArea").appendTo(mtd1);
        var fieldPanel = $("<tr></tr>").addClass("fieldSection").appendTo(fieldsPanel);

        var fastoptions = searchConditions.fastsearchoptions;
        if (typeof (fastoptions) != "undefined") {
            var fsdiv = $("#FastSearchDiv");
            fsdiv.empty();
            fsdiv.data('searchConditions', searchConditions);
            var ulo = $("<ul></ul>").appendTo(fsdiv);
            var lio = $("<li></li>").appendTo(ulo);
            for (var i = 0; i < fastoptions.length; i++) {
                var item = fastoptions[i];
                var lio = $("<li></li>").appendTo(ulo);
                var ao = $("<a id='" + item.id + "' class='fastquery-leave' href='javascript:void(0);' >" + item.title + "</a>").appendTo(lio);

                $('#' + item.id).data('item', item).mouseleave(function () {
                    var me = $(this);
                    if (me.attr('isclick') != '1') {
                        me.removeClass('fastquery-over').addClass('fastquery-leave');
                    }
                }).mouseover(function () {
                    $(this).removeClass('fastquery-leave').addClass('fastquery-over');
                }).click(function () {
                    var me = $(this);
                    var searchConditions = $("#FastSearchDiv").data('searchConditions');
                    if (searchConditions) {
                        var item = $(this).data('item');
                        if (me.attr('isclick') == '1') {
                            if ((typeof item.cancleClickedFun).toUpperCase() == 'FUNCTION') {
                                item.cancleClickedFun();
                            }
                        }
                        else {
                            if ((typeof item.clickedFun).toUpperCase() == 'FUNCTION') {
                                item.clickedFun();
                            }
                        }

                        for (var i = 0; i < searchConditions.items.length; i++) {
                            var sitem = searchConditions.items[i];

                            if (!sitem.separated) {
                                var edirorObj = $('#' + sitem.id);
                                var initVal = sitem.editor.options.initVal;
                                if (me.attr('isclick') != '1') {
                                    for (var j = 0; j < item.fileds.length; j++) {
                                        if (item.fileds[j].filed == sitem.filed) {
                                            initVal = item.fileds[j].initVal;
                                        }
                                    }
                                }
                                if (sitem.editor.type.toUpperCase() == "NUMBERBOX") {
                                    edirorObj.numberbox("setValue", initVal);
                                }
                                else if (sitem.editor.type.toUpperCase() == "COMBOGRID") {
                                    edirorObj.combogrid("setValue", initVal);
                                }
                                else if (sitem.editor.type.toUpperCase() == "DATE") {
                                    edirorObj.my97datebox("setValue", initVal);
                                }
                                else if (sitem.editor.type.toUpperCase() == "SELECT") {
                                    edirorObj.combobox("setValue", initVal);
                                }
                                else if (sitem.editor.type.toUpperCase() == "SELECTENUM") {
                                    edirorObj.combobox("setValue", initVal);
                                }
                                else if (sitem.editor.type.toUpperCase() == "SELECTTREE") {
                                    edirorObj.combotree("setValue", initVal);
                                }
                                else if (sitem.editor.type.toUpperCase() == "SELECTUSER") {
                                    edirorObj.combobox("setValue", initVal);
                                }
                                else if (sitem.editor.type.toUpperCase() != "LABEL") {
                                    edirorObj.textbox("setValue", initVal);
                                }
                            }
                        }
                    }

                    for (var h = 0; h < fastoptions.length; h++) {
                        if (me.attr('isclick') == '1' || me.attr('id') != fastoptions[h].id) {
                            $('#' + fastoptions[h].id).attr('isclick', '0').removeClass('fastquery-over').addClass('fastquery-leave');
                        } else {
                            me.attr('isclick', '1').removeClass('fastquery-leave').addClass('fastquery-over');
                        }
                    }

                    searchConditions.searchfun();
                });
            }
        }

        for (var i = 0; i < searchConditions.items.length; i++) {
            var sitem = searchConditions.items[i];
            if (sitem == undefined) continue;
            //  if (sitem.id == "fastitem") continue;
            //插入自定义查询条件
            var ii = sbox.find(".ii[idx='" + i + "']");
            if (ii.length > 0) {
                fieldPanel.append(ii);
                ii.attr("idx", "");
            }
            var colspan = 1;
            var cell;
            if (sitem.separated) {
                if (firstLine) {
                    extBtnCell = $("<td></td>").addClass("editor").appendTo(fieldPanel);
                    fieldsPanel = $("<table style='width:100%;'></table>").addClass("fieldArea").appendTo(fieldsPanelExtBody);
                    firstLine = false;
                }
                fieldPanel = $("<tr></tr>").addClass("fieldSection").appendTo(fieldsPanel);
                colspan = 1;
            } else {
                if (!firstLine)
                    hasExtPenel = true;

                if (!sitem.id)
                    sitem.id = searchConditions.searchboxid + "_" + sitem.filed.replace('.', '_') + i;
                if (!sitem.name)
                    sitem.name = sitem.id;

                var relay = sitem.relay;


                if (sitem.title) {
                    if (!relay || !$.valid(cell))
                        cell = $("<td></td>").addClass("label").appendTo(fieldPanel);
                    var lab = $("<span for='" + sitem.id + "'>" + sitem.title + "</span>").width(sitem.labelWidth).appendTo(cell);

                    colspan = 1;
                } else
                    colspan++;

                if (!relay || !$.valid(cell))
                    cell = $("<td></td>").attr("colspan", colspan).addClass("editor").appendTo(fieldPanel);

                var eo = $.extend({}, sitem.editor.options);
                var $ipt;
                if (sitem.editor.type.toUpperCase() == "LABEL") {
                    $ipt = $("<span>" + eo.initVal + "</span>");
                } else {
                    $ipt = $("<input type='text' />");
                    $ipt.attr("col", sitem.filed);
                    $ipt.attr("name", sitem.id);
                    $ipt.attr("id", sitem.id);
                    $ipt.attr("oper", sitem.oper);
                    $ipt.val(eo.initVal);
                    if (sitem.onGetValue)
                        $ipt.data("onGetValue", sitem.onGetValue);
                }
                $ipt.outerWidth(eo.width);
                $ipt.outerHeight(eo.height);
                $ipt.appendTo(cell);

                colspan = 1;

                if (sitem.editor.type.toUpperCase() == "NUMBERBOX") {
                    Editor.txtToNumbox($ipt, null, eo.initVal, null, null, null, eo);
                }
                else if (sitem.editor.type.toUpperCase() == "COMBOGRID") {
                    Editor.txtToComboGrid($ipt, eo.idField, eo.textField, eo.columns, eo.action, eo.qo, eo.addrow, eo.initVal, eo.width, eo.height);
                }
                else if (sitem.editor.type.toUpperCase() == "DATE") {
                    Editor.txtToDatebox($ipt, eo.initVal, eo);
                }
                else if (sitem.editor.type.toUpperCase() == "SELECT") {
                    var iptSource = eo.data;
                    if ($.isFunction(eo.data))
                        iptSource = eo.data();

                    var ctrl = Editor.txtToEnumCombobox($ipt, iptSource, eo.initVal, eo.canEdit, eo.otherData, null, null, null, eo);
                    if (eo.parentEnum) {
                        ctrl.combobox("setParentEnum", { parentEnum: eo.parentEnum, parentField: eo.parentField });
                    }
                }
                else if (sitem.editor.type.toUpperCase() == "SELECTENUM") {
                    if (eo.refresh) {
                        eo.action = eo.action + "&t=" + Date.parse(new Date());
                    }
                    eo.IsIncludeNull = true;
                    if (sitem.editor.options.IsIncludeNull != undefined)
                        eo.IsIncludeNull = sitem.editor.options.IsIncludeNull;
                    if (eo.ShowEnabled == undefined) {
                        eo.ShowEnabled = true;
                    }
                    var ctrl = Editor.txtToRemoteEnumCombobox($ipt, eo.action, eo.category, eo.initVal, eo.canEdit, eo.otherData, null,null, eo.extOnSelectFunc, eo);
                    if (eo.parentEnum) {
                        ctrl.combobox("setParentEnum", { parentEnum: eo.parentEnum, parentField: eo.parentField });
                    }
                }
                else if (sitem.editor.type.toUpperCase() == "SELECTTREE") {
                    var iptSource = eo.data;
                    if (typeof (eo.data) == "function")
                        iptSource = eo.data();

                    Editor.txtToEnumComboboxTree($ipt, iptSource, eo.initVal, eo.canEdit, eo.otherData, null, null, null, eo);
                } else if (sitem.editor.type.toUpperCase() == "SELECTUSER") {
                    var initVal = -1;
                    if ($.valid(eo.initVal)) {
                        initVal = eo.initVal;
                    }
                    Editor.txtToUserComboGrid(sitem.id, initVal, eo);
                }
                else if (sitem.editor.type.toUpperCase() != "LABEL") {
                    Editor.txtToPlainbox($ipt, null, eo.initVal, null, null, eo);
                }
            }

        }
        ///////set



        function createExtBtn(container) {
            function showSearchExt() {
                var p = fieldsPanelExt.panel("panel");
                var pos = $.extend({}, moreBtn.offset());
                var spos = sbox.offset();
                pos.top = spos.top + sbox.outerHeight();
                pos.left = spos.left;
                fieldsPanelExt.panel("move", pos);

                fieldsPanelExt.panel("panel").slideDown(160);
            }

            function hideSearchExt() {
                fieldsPanelExt.panel("panel").slideUp(160);
            }

            var moreBtn = $("<a href='javascript:void(0)' style='background:transparent;width:38px; margin:0px;' title='更多查询条件'></a>");
            var sbtn = $("<span class='combo searchMoreButton'></span>").appendTo(container);
            moreBtn.appendTo(sbtn);
            moreBtn.click(
                function () {
                    var p = fieldsPanelExt.closest("div.combo-panel");
                    $("div.combo-panel:visible").not(fieldsPanelExt).not(p).panel("close");
                    if (fieldsPanelExt.is(":visible")) {
                        hideSearchExt();
                    } else {
                        showSearchExt();
                    }
                }).addClass("searchExtButton");

            moreBtn.tooltip();
            moreBtn.linkbutton({
                id: 'defaultSearchMorebtn',
                iconCls: 'icon-search_more',
                plain: true,
                width: 40
            });
        }

        //插入自定义查询条件,idx不对的，都在后面
        fieldPanel.append(sbox.find(".ii[idx]"));


        if (hasExtPenel) {
            createExtBtn(extBtnCell);
        }

        var sbox_btns = $("<div></div>").addClass("buttonArea").appendTo(mtd2);
        if (!searchConditions.hideSeachButton) {
            var searchBtn = $("<a href='###' class='button' id='link_search'>查询</a>").linkbutton({ plain: true });
            searchBtn.click(function () { searchConditions.searchfun(); });
            sbox_btns.append(searchBtn);
        }
        if ($.isArray(searchConditions.btns)) {
            for (var i = 0; i < searchConditions.btns.length; i++) {
                if (searchConditions.btns[i].separated) {
                    sbox_btns = $("<div></div>").addClass("buttonArea").addClass("newLine").appendTo(mtd2);
                } else {
                    var btn = $("<a href='###' class='button' id='" + searchConditions.btns[i].id + "'>" + searchConditions.btns[i].text + "</a>").linkbutton({ plain: true });
                    if ($.isFunction(searchConditions.btns[i].onClick))
                        btn.click(searchConditions.btns[i].onClick);
                    sbox_btns.append(btn);
                }
            }
        }
        //$.parser.parse(sbox);
    }
,
    //从表格中获取需要查询的字段列表
    getQueryObjFieldsFromTable: function (maintableid, includes, excludes) {
        if (!excludes)
            excludes = ["btns", "tags"];
        if (!$.isArray(excludes))
            excludes = [excludes];
        var es = {};
        for (var i = 0; i < excludes.length; i++) {
            es[excludes[i]] = true;
        }

        var is = {};
        if ($.isArray(includes)) {
            for (var i = 0; i < includes.length; i++) {
                is[includes[i]] = true;
            }
        } else {
            includes = [];
        }

        var dom = UIHelper.loadjQueryDom(maintableid);
        var fcols = dom.datagrid('getColumnFields', true);
        var cols = dom.datagrid('getColumnFields');
        var ret = [];
        var idx = 0;
        if (fcols) {
            for (var i = 0; i < fcols.length; i++) {
                if (!es[fcols[i]])
                    ret[idx++] = { LExp: fcols[i] };
            }
        }
        if (cols) {
            for (var i = 0; i < cols.length; i++) {
                if (!es[cols[i]])
                    ret[idx++] = { LExp: cols[i] };
            }
        }

        for (var i = 0; i < ret.length; i++) {
            if (is[ret[i].LExp])
                is[ret[i].LExp] = false;
        }

        for (var i = 0; i < includes.length; i++) {
            if (is[includes[i]])
                ret[idx++] = { LExp: includes[i] };
        }
        return ret;
    }
,
    //--------------主表初始化 start--------------//
    initMainTable: function (maintableid, opt, datafilter) {
        var _config =
        {
            colWidth:
            {
                def: 75,
                custom: {
                    "件数": 60,
                    "产地": 80
                }
            }
        }

        var cmenu;
        _initOptions(opt);
        var dom = UIHelper.loadjQueryDom(maintableid);
        var hiddenColums = getHideColumn();
        //---去掉无权限的toolbar项---start//
        if (opt.toolbar) {
            var acArr = [];
            for (var i = 0; i < opt.toolbar.length; i++) {
                if (opt.toolbar[i].ac)
                    acArr.push(opt.toolbar[i].ac);
            }
            //Core.ACAuth(acArr, function (json) {
            //    for (var i = opt.toolbar.length - 1; i >= 0; i--) {
            //        if (!Core.CheckAcAuth(json, opt.toolbar[i].ac))
            //            opt.toolbar.removeAt(i);
            //    }
            //});
        }

        //private:初始化设置
        function _initOptions(opt) {
            if (opt.columns && opt.columns.length == 1)
                _resetColumnsWidth(opt.columns[0]);
            if (opt.frozenColumns && opt.frozenColumns.length == 1)
                _resetColumnsWidth(opt.frozenColumns[0]);
        }
        //private:重置列宽
        function _resetColumnsWidth(cols) {
            if ($.isArray(cols)) {
                for (var num = 0; num < cols.length; num++) {
                    var col = cols[num];
                    if (col) {
                        if (!col.width) {
                            var curWidth = _config.colWidth.custom[cols[num].title];
                            if (typeof (curWidth) == "undefined")
                                curWidth = _config.colWidth.def;
                            col.width = curWidth;
                        }
                    }
                }
            }
        }

        function getPagePath() {
            if (!window.pagePath) {
                //var a = document.createElement('a');
                //a.href = window.location.pathname;
                window.pagePath = window.location.pathname;
            }
            return window.pagePath;
        }

        function getHideColumn() {
            var ikey = window.location.href + "@" + dom.attr("id");
            var ret = GM.Tools.String2O($.LS.get(ikey));

            var key = getPagePath() + "@" + dom.attr("id");
            if (!ret)
                ret = GM.Tools.String2O($.LS.get(key));
            else
                $.LS.remove(ikey);
            if (!ret)
                ret = {};
            return ret;
        }

        function setHideColumn(column) {
            key = getPagePath() + "@" + dom.attr("id");
            $.LS.set(key, GM.Tools.O2String(column));
        }

        function getPageSetting() {
            var ikey = window.location.href + "@" + dom.attr("id") + "pagesetting";
            var ret = GM.Tools.String2O($.LS.get(ikey));
            var key = getPagePath() + "@" + dom.attr("id") + "pagesetting";
            if (!ret)
                ret = GM.Tools.String2O($.LS.get(key));
            else
                $.LS.remove(ikey);
            if (!ret)
                ret = {};
            return ret;
        }

        function setPageSetting(pagesetting) {
            var key = getPagePath() + "@" + dom.attr("id") + "pagesetting";
            $.LS.set(key, GM.Tools.O2String(pagesetting));
        }


        //---去掉无权限的toolbar项---end//
        function createColumnMenu() {
            var items = "";
            var fields = dom.datagrid('getColumnFields');
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var col = dom.datagrid('getColumnOption', field);
                var menuItemId = "popitem_" + i;
                if (hiddenColums[field]) {
                    items += '<div data-options="id:\'' + menuItemId + '\',iconCls:\'icon-empty\',name:\'' + field + '\',text:\'' + col.title + '\'"><span>' + col.title + '</span></div>';//<span style="right:20px;left:auto;" class="menu-icon icon-up"></span><span style="right:2px;left:auto;" class="menu-icon icon-down"></span>
                } else {
                    items += '<div data-options="id:\'' + menuItemId + '\',iconCls:\'icon-ok\',name:\'' + field + '\',text:\'' + col.title + '\'"><span>' + col.title + '</span></div>';
                }
            }

            cmenu = $('<div>' + items + '</div>').appendTo($(document.body));
            cmenu.menu({
                maxLines: 16,
                manualHide: true,
                onClick: function (item) {
                    var column = getHideColumn();
                    if (!column)
                        column = {};
                    if (item.iconCls == 'icon-ok') {
                        dom.datagrid('hideColumn', item.name);
                        column[item.name] = 1;
                        cmenu.menu('setIcon', {
                            target: item.target,
                            iconCls: 'icon-empty'
                        });
                    } else {
                        dom.datagrid('showColumn', item.name);
                        delete column[item.name];
                        cmenu.menu('setIcon', {
                            target: item.target,
                            iconCls: 'icon-ok'
                        });
                    }
                    setHideColumn(column);
                }
            });
            cmenu.find(".menu-item");
        }

        var action = opt.listAction;
        var defaultOption = {
            autoRowHeight: false,
            nowrap: true,
            striped: true,
            fitColumns: false,
            freezeRow: 1,
            rownumbers: true,
            halign: 'center',
            //pageSize: config.businessOptions.DefaultPageSize,
            singleSelect: true,
            multiSort: true,
            onLoadError: function () {
                dom.datagrid("loaded");
                showMessage("加载数据异常");
            },
            onSortColumn: function (sort, order) {
                function listOrders(sort, order) {
                    var ret = [];
                    if (sort && order) {
                        var as = sort.split(',');
                        var ao = order.split(',');
                        for (var i = 0; i < Math.min(as.length, ao.length) ; i++) {
                            ret.push({ PropName: as[i], OrderType: ao[i].toUpperCase() });
                        }
                    }
                    return ret;
                }
                var so = $(this).datagrid("getSearchObj"); //GM.getCurCommSearchParams();

                if ($.valid(so)) {
                    so.Orders = listOrders(sort, order);
                    $(this).datagrid("setSearchObj", so);
                    //注意不要再使用Hidden的方式来保存表的查询结构，一个页面可能会有多个表的！请去掉所有使用这种方式的地方
                    //GM.setCurCommSearchParams(so);
                    var pgOpt;
                    var opts = dom.datagrid("options");
                    if (opts.pagination)
                        pgOpt = dom.datagrid("getPager").pagination("options");
                    else
                        pgOpt = { pageNumber: -1, pageSize: 0 };
                    UIHelper.loadGridPageWithActoin(dom, so, action, pgOpt.pageNumber, pgOpt.pageSize, datafilter);
                }
            },
            onClickRow: function (index) {
                //这样修改，便于通过option控制是否允许编辑
                if (dom.datagrid("isEditing", index))
                    return;
                if (UIHelper.endDatagridEdit(dom)) {
                    var opts = dom.datagrid("options");
                    if (opts.clickRowEdit) {
                        dom.datagrid('selectRow', index).datagrid('beginEdit', index);
                    }
                }
            },
            //onClickCell:function(index, field){
            //    if (UIHelper.endDatagridEdit(dom)){
            //        dom.datagrid('selectRow', index)
            //                .datagrid('editCell', {index:index,field:field});
            //    }
            //},
            onHeaderContextMenu: function (e, field) {
                e.preventDefault();
                if (!cmenu) {
                    createColumnMenu();
                }
                cmenu.menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            }
            //,
            //onLoadSuccess: function (data) {
            //    GM.Core.ctrlACAuth();
            //}
        }
        if (!$.valid(opt.pagination))
            opt.pagination = !opt.nopage;
        delete opt.nopage;
        delete opt.listAction;
        //delete opt.clickRowEdit;
        //if ($.isFunction(opt.onLoadSuccess)) {
        //    var setOnLoadSuccess = opt.onLoadSuccess;
        //    opt.onLoadSuccess = function (data) {
        //        setOnLoadSuccess.call(this, data);
        //        defaultOption.onLoadSuccess.call(this, data);
        //    }
        //}
        var opt = $.extend({}, defaultOption, opt);

        //创建标识列
        if (opt.showTags) {
            if (!opt.tagCategory)
                opt.tagCategory = 'default';

            if (!$.isArray(opt.frozenColumns))
                opt.frozenColumns = [[]];
            opt.frozenColumns[0].unshift({
                title: "<a class='easyui-tags icon-flag0 icon' rtxt='" + ($.isFunction(opt.tagIdField) ? opt.tagIdField() : opt.tagIdField) + "'></a>", colspan: 1, field: 'tags', width: 24, formatter: function (value, row, index) {
                    if (!$.isFunction(opt.onshowtags) || opt.onshowtags(row, index)) {
                        if ($.isFunction(opt.tagIdField)) {
                            return "<a class='easyui-tags icon-flag0 icon' rtxt='" + opt.tagIdField(row, index) + "' style='cursor:pointer'></a>";
                        } else {
                            return "<a class='easyui-tags icon-flag0 icon' rtxt='" + row[opt.tagIdField] + "' style='cursor:pointer'></a>";
                        }
                    }
                }
            });
        }

        dom.datagrid(opt);
        var fields = dom.datagrid("getColumnFields").toQuerable();
        $.each(hiddenColums, function (name, value) {
            if (name && value && fields.where(function (t) { return t == name }).any())
                dom.datagrid("hideColumn", name);
        });
        function refresh() {
            dom.datagrid("refreshData", { action: action, datafilter: datafilter });
        }

        //创建默认刷新button、创建默认筛选button
        var tb = dom.datagrid("getPanel").children(".datagrid-toolbar");
        if (tb.length > 0) {
            var ctb = tb.children();
            var tbl = $("<table cellspacing='0' cellpadding='0' width='100%'></table>").appendTo(tb);
            var row = $("<tr></tr>").appendTo(tbl);
            ctb.appendTo($("<td></td>").appendTo(row));
            var td = $("<td></td>").appendTo(row);

            $("<a href='javascript:void(0)' title='刷新'></a>").click(refresh).addClass("reload").tooltip().linkbutton({
                id: 'defaultReloadbtn',
                iconCls: 'icon-whitereload',
                plain: true
            }).appendTo(td);

            if (opt.showFilter) {
                //var filterPanelShadow = $("<div class=\"menu-shadow\"></div>").addClass("combo-panel").appendTo($(document.body));
                var filterPanel = $("<div></div>").appendTo($(document.body));
                filterPanel.panel(
                    {
                        doSize: false,
                        closed: true,
                        cls: "combo-p filterPanel",
                        style: { position: "absolute" }
                    });
                var dv1 = $("<div></div>").css("margin", "8px 8px 2px 8px").appendTo(filterPanel.panel("body").addClass("combo-panel"));
                var ftbl = $("<table cellspacing='0' cellpadding='0' width='100%'></table>").appendTo(dv1);
                var frow = $("<tr></tr>").appendTo(ftbl);
                var ftd = $("<td></td>").appendTo(frow);
                $("<span>创建人</span>").appendTo(ftd);
                ftd = $("<td></td>").appendTo(frow);
                var iptCreatBy = $("<input id='txt_filter_CreatBy' />").appendTo(ftd);
                GM.Editor.txtToUserComboGrid(iptCreatBy);
                frow = $("<tr></tr>").appendTo(ftbl);
                ftd = $("<td></td>").appendTo(frow);
                $("<span>创建时间</span>").appendTo(ftd);
                ftd = $("<td></td>").appendTo(frow);
                var iptCreatTime = $("<input id='txt_filter_CreatTime' />").appendTo(ftd);
                GM.Editor.txtToDatebox(iptCreatTime);
                frow = $("<tr></tr>").appendTo(ftbl);
                ftd = $("<td></td>").appendTo(frow);
                $("<span>修改人</span>").appendTo(ftd);
                ftd = $("<td></td>").appendTo(frow);
                var iptModifyBy = $("<input id='txt_filter_ModifyBy' />").appendTo(ftd);
                GM.Editor.txtToUserComboGrid(iptModifyBy);
                frow = $("<tr></tr>").appendTo(ftbl);
                ftd = $("<td></td>").appendTo(frow);
                $("<span>修改时间</span>").appendTo(ftd);
                ftd = $("<td></td>").appendTo(frow);
                var iptModifyTime = $("<input id='txt_filter_ModifyTime' />").appendTo(ftd);
                GM.Editor.txtToDatebox(iptModifyTime);
                var dv2 = $("<div></div>").css("text-align", "right").css("margin", "8px 8px 2px 8px").outerHeight(32).appendTo(filterPanel.panel("body"));

                function showFilter() {
                    var p = filterPanel.panel("panel");
                    var pos = $.extend({}, filterBtn.offset());
                    pos.top = pos.top + filterBtn.outerHeight();
                    pos.left = pos.left - p.outerWidth() + filterBtn.outerWidth();
                    filterPanel.panel("move", pos);

                    filterPanel.panel("open");

                    //filterPanelShadow.outerWidth(filterPanel.outerWidth());
                    //filterPanelShadow.outerHeight(filterPanel.outerHeight());
                    //filterPanelShadow.css(pos);
                    //filterPanelShadow.show();
                }

                function hideFilter() {
                    filterPanel.panel("close");
                    //filterPanelShadow.hide();
                }

                function setfilter() {
                    var wheres = {};
                    wheres.SubSqlWhere = [];
                    var val = iptCreatBy.combogrid("getValue");
                    if (val && val.length > 0)
                        wheres.SubSqlWhere.push({ LExp: "CreateBy", RExp: val });
                    val = iptCreatTime.my97datebox("getValue");
                    if (val && val.length > 0) {
                        wheres.SubSqlWhere.push({ LExp: "CreateTime", RExp: val, Condition: "BiggerOrEqual" });
                        wheres.SubSqlWhere.push({ LExp: "CreateTime", RExp: GM.Tools.DateSmaller(val), Condition: "Smaller" });
                    }
                    val = iptModifyBy.combogrid("getValue");
                    if (val && val.length > 0)
                        wheres.SubSqlWhere.push({ LExp: "LastModifyBy", RExp: val });
                    val = iptModifyTime.my97datebox("getValue");
                    if (val && val.length > 0) {
                        wheres.SubSqlWhere.push({ LExp: "LastModifyTime", RExp: val, Condition: "BiggerOrEqual" });
                        wheres.SubSqlWhere.push({ LExp: "LastModifyTime", RExp: GM.Tools.DateSmaller(val), Condition: "Smaller" });
                    }

                    if (wheres.SubSqlWhere.length > 0) {
                        filterBtn.linkbutton({
                            id: 'defaultFilterbtn',
                            iconCls: 'icon-whitefilter_full',
                            plain: true
                        });
                    }
                    else {
                        filterBtn.linkbutton({
                            id: 'defaultFilterbtn',
                            iconCls: 'icon-whitefilter',
                            plain: true
                        })
                    }

                    var options = dom.datagrid("options");
                    options.wheres = wheres;
                    refresh();
                }

                $("<a>确定</a>").appendTo(dv2).click(
                    function () {
                        setfilter();
                        hideFilter();
                    }
                ).linkbutton({
                    plain: true
                });
                $("<a>清空</a>").appendTo(dv2).click(
                    function () {
                        iptCreatTime.my97datebox("clear");
                        iptModifyTime.my97datebox("clear");
                        iptCreatBy.combobox("clear");
                        iptModifyBy.combobox("clear");
                        setfilter();
                        hideFilter();
                    }
                ).linkbutton({
                    plain: true
                });

                var filterBtn = $("<a href='javascript:void(0)' title='筛选'></a>").click(
                function () {
                    var p = filterPanel.closest("div.combo-panel");
                    $("div.combo-panel:visible").not(filterPanel).not(p).panel("close");
                    if (filterPanel.is(":visible")) {
                        hideFilter();
                    } else {
                        showFilter();
                    }
                    return true;
                }).addClass("filter").tooltip().appendTo($("<span class='combo filterBtn'></span>").appendTo(td));
                filterBtn.linkbutton({
                    id: 'defaultFilterbtn',
                    iconCls: 'icon-whitefilter',
                    plain: true
                });
            }
        }

        if (opt.pagination) {
            var pagesettings = getPageSetting();
            if (!pagesettings.pageSize)
                pagesettings.pageSize = 20;
            if (pagesettings.pageSize != 20 && pagesettings.pageSize != 50 && pagesettings.pageSize != 80 && pagesettings.pageSize != 100)
                pagesettings.pageSize = 20;
            dom.datagrid("getPager").pagination({
                layout: ['list', 'sep', 'first', 'prev', 'sep', 'links', 'sep', 'next', 'last', 'sep', 'manual', 'refresh'],
                pageList: [20, 50, 80, 100],
                pageSize: pagesettings.pageSize,
                onSelectPage: function (pidx, psize) {
                    UIHelper.loadGridPageWithActoin(dom, null/*GM.getCurCommSearchParams()*/, action, pidx, psize, datafilter);
                },
                onChangePageSize: function (pageSize) {
                    var pagesettings = getPageSetting();
                    pagesettings.pageSize = pageSize;
                    setPageSetting(pagesettings);
                }
            });
        }

        var pnl = $(dom).datagrid("getPanel");
        var sonBeforeDeleteRow = dom.datagrid("options").onBeforeDeleteRow;
        dom.datagrid("options").onBeforeDeleteRow = function (index, row) {
            pnl.find("tr[datagrid-row-index='" + index + "']").find("td[field=btns]").find(".icon[title].tooltip-f").tooltip("destroy");
            return sonBeforeDeleteRow.call(this, index, row);
        };
        var sonBeforeEndEdit = dom.datagrid("options").onBeforeEndEdit;
        dom.datagrid("options").onBeforeEndEdit = function (index, row) {
            pnl.find("tr[datagrid-row-index='" + index + "']").find("td[field=btns]").find(".icon[title].tooltip-f").tooltip("destroy");
            return sonBeforeEndEdit.call(this, index, row);
        };
        var sonBeforeCancelEdit = dom.datagrid("options").onBeforeCancelEdit;
        dom.datagrid("options").onBeforeCancelEdit = function (index, row) {
            pnl.find("tr[datagrid-row-index='" + index + "']").find("td[field=btns]").find(".icon[title].tooltip-f").tooltip("destroy");
            return sonBeforeCancelEdit.call(this, index, row);
        };
        var sonEndEdit = dom.datagrid("options").onEndEdit;
        dom.datagrid("options").onEndEdit = function (index, row) {
            pnl.find("tr[datagrid-row-index='" + index + "']").find("td[field=btns]").find(".icon[title]").not(".tooltip-f").tooltip();
            sonEndEdit.call(this, index, row);
        };
        var sonCancelEdit = dom.datagrid("options").onCancelEdit;
        dom.datagrid("options").onCancelEdit = function (index, row) {
            pnl.find("tr[datagrid-row-index='" + index + "']").find("td[field=btns]").find(".icon[title]").not(".tooltip-f").tooltip();
            sonCancelEdit.call(this, index, row);
        };
        var sonBeforeRender = dom.datagrid("options").view.onBeforeRender;
        dom.datagrid("options").view.onBeforeRender = function () {
            var rows = pnl.find("tr.datagrid-row").find("td[field=btns]");
            $(".icon[title]", rows).tooltip("destroy");
            return sonBeforeRender.call(this);
        }

        function showBtnsPanel(btnsPanel, btn) {
            var p = btnsPanel.panel("panel");
            var pos = $.extend({}, btn.offset());
            pos.top = pos.top + btn.outerHeight();
            pos.left = pos.left - (p.outerWidth() - btn.outerWidth()) / 2;
            btnsPanel.panel("move", pos);

            btnsPanel.panel("open");
        }

        function hideBtnsPanel(btnsPanel) {
            btnsPanel.panel("close");
        }
         
        var tagHeaderValue = [];
        /*2014-11-04 add by cxp*/
        if (!$.isArray(opt.tags)) {
            //opt.tags = [];
            //var json = GM.Core.loadEnumData("Common.Tags.SelectSource", opt.tagCategory, undefined, false);
            //if (GM.Core.checkBizResult(json)) {
            //    opt.tags = json.data;
            //}
        }
        dom.datagrid("options").view.onAfterRender = getSubmitAction;
        function getSubmitAction() { 
            if (isDoApprove()) {  
                GM.UIHelper.doApproveFun.getApproveData(_onAfterRender); 
            } else { 
                _onAfterRender(null);
            }
        }
        function isDoApprove() {
            var row = $("tr.datagrid-row", pnl).first();
            if (row.length > 0) {
                var td = $("td[field=btns]", row);
                var appbtns = $("[submitAction]", td);
                if (appbtns.length > 0)
                    return true;
            }
            return false;
        }
        function doApproveCallBack() { 
            GM.UIHelper.loadGridPageWithActoin("mainTable", null, action, 1);
        }
        function _onAfterRender(subObj) { 
            subObj = GM.UIHelper.doApproveFun.approveData;
            var headrows = $("tr.datagrid-header-row", pnl);
            var cnt = 0; 
            headrows.each(function () {
                var tagtd = $("td[field=tags]", $(this));
                $(".easyui-tags", tagtd).each(function () {
                    $(this).tags("clearCache");
                    var rtxt = $(this).attr("rtxt");
                    $(this).tags({
                        refrenceName: opt.tagName,
                        category: opt.tagCategory,
                        items: opt.tags,
                        menuName: "head",
                        remoteTag: false,
                        onMenuClick: function (item) {
                            var sobj = dom.datagrid("getSearchObj");
                            if (!sobj)
                                sobj = {};
                            if (item.Value)
                                sobj.Tags = [{ Category: opt.tagCategory, RefrenceName: opt.tagName, RExp: item.Value, LExp: rtxt }];
                            else
                                delete sobj.Tags;
                            var index = $(this).data("tagsIndex");
                            tagHeaderValue[index] = item.Value;
                            dom.datagrid("setSearchObj", sobj);
                            $(this).tags("clearCache");
                            refresh();
                        }
                    }).data("tagsIndex", cnt);
                    $(this).tags("setValue", tagHeaderValue[cnt]);
                    cnt++;
                });
            });

            var rows = $("tr.datagrid-row", pnl);  
            rows.each(function () {
                var oldtd = $("td[field=btns]", $(this));
                if (oldtd.length > 0) {
                    //审批按钮 
                    var appbtns = $("[submitAction]", oldtd);
                    appbtns.each(function () {
                        var approveBillId = $(this).attr("approveBillId");
                        var approveState = $(this).attr("approveState");
                        var approveSubmitAction = $(this).attr("submitAction");

                        if (approveBillId && approveState && approveSubmitAction && subObj) {
                            var _obj = subObj[approveSubmitAction];
                            if (_obj) {
                                var approveUrl = GM.UIHelper.doApproveFun.getApproveUrl(_obj, approveBillId, approveState, doApproveCallBack, doApproveCallBack, doApproveCallBack);
                                if ($.isArray(approveUrl) && $(".icon[title]", oldtd).length > 0) {
                                    for (var i = 0; i < approveUrl.length; i++) {
                                        approveUrl[i].insertAfter($(this));
                                    }
                                }
                            }
                        }
                    });
                }
                //GM.Core.ctrlACAuth($(this));

                var tagtd = $("td[field=tags]", $(this));
                $(".easyui-tags", tagtd).each(function () {
                    $(this).tags("clearCache");
                    $(this).tags({
                        refrenceName: opt.tagName,
                        category: opt.tagCategory,
                        refrenceText: $(this).attr("rtxt"),
                        items: opt.tags
                    });
                });
                 
                var td = $("td[field=btns]", $(this)); 

                if (td.length > 0) {
                    var btnCt = $(".datagrid-cell", td);
                    btnCt.contents().filter(function () {
                        return this.nodeType === 3;
                    }).remove(); 
                    
                    var btns = $(".icon[title]", td); 
                     
                    //处理多余按钮
                    if (btns.length > 4) {
                        for (var i = 0; i < 3; i++) {
                            var btn = $(btns[i]).not(".tooltip-f");
                            if (btn.attr("title"))
                                btn.tooltip();
                        }
                        for (var i = 3; i < btns.length; i++) {
                            $(btns[i]).hide();
                        }
                        var btnsPanel = function () {
                            var ret = $("<div></div>").appendTo($(document.body));
                            ret.panel(
                                {
                                    doSize: false,
                                    closed: true,
                                    cls: "combo-p",
                                    style: { position: "absolute" }
                                });
                            var dv1 = $("<div></div>").css("margin", "4px 4px 2px 4px").appendTo(ret.panel("body").addClass("combo-panel"));

                            for (var i = 3; i < btns.length; i++) {
                                if (i > 3 && (i - 3) % 6 == 0)
                                    $("<br/>").appendTo(dv1);
                                var btn = $(btns[i]);
                                btn.show().appendTo(dv1);
                                btn = btn.not(".tooltip-f");
                                if (btn.attr("title"))
                                    btn.tooltip();
                            }
                            return ret;
                        }

                        var moreBtn = $("<a class='icon-more' style='width:22px;height:22px;display:inline-block;' href='javascript:void(0)'></a>").click(
                            function () {
                                var panel = $(this).data("btnsPanel");
                                if (!panel) {
                                    panel = btnsPanel();
                                    $(this).data("btnsPanel", panel);
                                }
                                var p = panel.closest("div.combo-panel");
                                $("div.combo-panel:visible").not(panel).not(p).panel("close");
                                if (panel.is(":visible")) {
                                    hideBtnsPanel(panel);
                                } else {
                                    $(this).closest("div.combo-panel");
                                    showBtnsPanel(panel, $(this));
                                }
                            }).appendTo(btnCt);
                    } else {
                        for (var i = 0; i < btns.length; i++) {
                            var btn = $(btns[i]).not(".tooltip-f");;
                            if (btn.attr("title"))
                                btn.tooltip();
                        }
                    }
                }
                var tdPurchase = $("td[field=btnsPurchase]", $(this));
                if (tdPurchase.length > 0) {
                    var btnCtPurchase = $(".datagrid-cell", tdPurchase);
                    btnCtPurchase.contents().filter(function () {
                        return this.nodeType === 3;
                    }).remove();
                    var btnsPurchase = $(".icon[title]", tdPurchase);
                    if (btnsPurchase.length > 4) {
                        for (var i = 0; i < 3; i++) {
                            var btnPurchase = $(btnsPurchase[i]).not(".tooltip-f");
                            if (btnPurchase.attr("title"))
                                btnPurchase.tooltip();
                        }
                        for (var i = 3; i < btnsPurchase.length; i++) {
                            $(btnsPurchase[i]).hide();
                        }
                        var btnsPurchasePanel = function () {
                            var ret = $("<div></div>").appendTo($(document.body));
                            ret.panel(
                                {
                                    doSize: false,
                                    closed: true,
                                    cls: "combo-p",
                                    style: { position: "absolute" }
                                });
                            var dv1 = $("<div></div>").css("margin", "4px 4px 2px 4px").appendTo(ret.panel("body").addClass("combo-panel"));

                            for (var i = 3; i < btnsPurchase.length; i++) {
                                if (i > 3 && (i - 3) % 6 == 0)
                                    $("<br/>").appendTo(dv1);
                                var btnPurchase = $(btnsPurchase[i]);
                                btnPurchase.show().appendTo(dv1);
                                btnPurchase = btnPurchase.not(".tooltip-f");
                                if (btnPurchase.attr("title"))
                                    btnPurchase.tooltip();
                            }
                            return ret;
                        }

                        var morePurchaseBtn = $("<a class='icon-more' style='width:22px;height:22px;display:inline-block;' href='javascript:void(0)'></a>").click(
                            function () {
                                var panel = $(this).data("btnsPanel");
                                if (!panel) {
                                    panel = btnsPurchasePanel();
                                    $(this).data("btnsPanel", panel);
                                }
                                var p = panel.closest("div.combo-panel");
                                $("div.combo-panel:visible").not(panel).not(p).panel("close");
                                if (panel.is(":visible")) {
                                    hideBtnsPanel(panel);
                                } else {
                                    $(this).closest("div.combo-panel");
                                    showBtnsPanel(panel, $(this));
                                }
                            }).appendTo(btnCtPurchase);
                    } else {
                        for (var i = 0; i < btns.length; i++) {
                            var btnPurchase = $(btnsPurchase[i]).not(".tooltip-f");;
                            if (btnPurchase.attr("title"))
                                btnPurchase.tooltip();
                        }
                    }
                }
            });
        }

        return dom;
    },
    addRowToDatagrid: function (tableid, isCloseEdit, InsertData,noActFiledName) {
        var dom = UIHelper.loadjQueryDom(tableid);
        if (isCloseEdit != false) {
            if (!GM.UIHelper.endDatagridEdit(tableid)) {
                return;
            }
        }
        var editIndex = dom.datagrid('getRows').length;
        var row = {};
        if (InsertData) {
            if (editIndex >= 1) {
                var obj = dom.datagrid("getRows")[editIndex - 1];
                $.each(obj, function (name, value) {
                    var option = dom.datagrid('getColumnOption', name);
                    if (!option)
                        return;
                    if (option.InsertData == false)
                        return;
                    var isAct = true;
                    if (noActFiledName != null && noActFiledName.length > 0) {
                        for (var j = 0; j < noActFiledName.length; j++) {
                            if (name == noActFiledName[j]) {
                                isAct = false;
                                break;
                            }
                        }
                    }
                    if (isAct) {
                        row[name] = value;
                    }
                });
                obj = dom.datagrid("getEditorsWithIndex", editIndex - 1);
                $.each(obj, function (name, value) {
                    var option = dom.datagrid('getColumnOption', name);
                    if (!option)
                        return;
                    if (option.InsertData == false)
                        return;
                    //如果Name在noActFiledName数组中 就不带入数据
                    var isAct = true;
                    if (noActFiledName != null && noActFiledName.length > 0)
                    {
                        for (var j = 0; j < noActFiledName.length; j++)
                        {
                            if (name == noActFiledName[j])
                            {
                                isAct = false;
                                break;
                            }
                        }
                    }
                    if (isAct) {
                        row[name] = value.actions.getValue(value.target);
                    }
                });
            }
        }
        dom.datagrid('appendRow', row);
        dom.datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);
    },
    /*是否是新的方式*/
    addRowsToDatagrid: function (tableid, row, isNewWay, num, check, InsertData) {
        var count = 8;
        if (!row) 
            row = {};
        var dom = UIHelper.loadjQueryDom(tableid);
        if (arguments.length >= 3 && isNewWay) {
            count = arguments.length >= 4 ? num : 3;
            //, loading = $(".icon-add:first").parent().parent().parent()
            //loading.append("<span style=\"\" class=\"muleditloading\"></span>");
            var rows = dom.datagrid("getRows");
            var totalCount = rows.length, offsetCount = count - (totalCount % count);//, tempI = totalCount, anflag

            for (var i = 0; i < offsetCount; i++) {

                if (InsertData) {
                    if (totalCount >= 1) {
                        var obj = dom.datagrid("getRows")[totalCount - 1];
                        $.each(obj, function (name, value) {
                            var option = dom.datagrid('getColumnOption', name);
                            if (!option)
                                return;
                            if (option.InsertData == false)
                                return;
                            row[name] = value;
                        });
                        obj = dom.datagrid("getEditorsWithIndex", totalCount - 1);
                        $.each(obj, function (name, value) {
                            var option = dom.datagrid('getColumnOption', name);
                            if (!option)
                                return;
                            if (option.InsertData == false)
                                return;
                            row[name] = value.actions.getValue(value.target);
                        });
                    }
                }

                dom.datagrid("appendRow", $.extend(true, {}, row));
                if (check) {
                    dom.datagrid('checkRow', i + totalCount);
                }
            }
            setTimeout(function () {
                dom.datagrid('beginEdit');
                //loading.find(".muleditloading").remove();
            }, 16);

            //让所有的列处于可编辑状态
            //anflag = setTimeout(function () {
            //    //alert(tempI);
            //    dom.datagrid('beginEdit', tempI);
            //    if (++tempI >= totalCount + offsetCount) {
            //        clearTimeout(anflag);
            //    }
            //    else {
            //        anflag = setTimeout(arguments.callee, 16);
            //    }
            //}, 16);
            //setTimeout(function () {
            //    for (var i = totalCount; i < totalCount + offsetCount; i++) {
            //        dom.datagrid('beginEdit', i);
            //    }
            //    $(".datagrid-view2 .datagrid-row:eq(" + totalCount + ") input:visible:first").focus();
            //}, 16);
        }
        else {
            if (UIHelper.endDatagridEdit(tableid)) {
                count = arguments.length >= 4 ? num : 8;
                var rows = dom.datagrid("getRows");
                var totalCount = rows.length;
                var emptyRowCount = 0;
                for (var i = 0; i < rows.length; i++) {
                    var index = dom.datagrid("getRowIndex", rows[i]);
                    if (!dom.datagrid("validateRow", index))
                        emptyRowCount++;
                }
                if (emptyRowCount == 0) {
                    for (var i = 0; i < count - (totalCount % count) ; i++) {

                        var row = {};
                        if (InsertData) {
                            if (totalCount >= 1) {
                                var obj = dom.datagrid("getRows")[totalCount - 1];
                                $.each(obj, function (name, value) {
                                    var option = dom.datagrid('getColumnOption', name);
                                    if (!option)
                                        return;
                                    if (option.InsertData == false)
                                        return;
                                    row[name] = value;
                                });
                                obj = dom.datagrid("getEditorsWithIndex", totalCount - 1);
                                $.each(obj, function (name, value) {
                                    var option = dom.datagrid('getColumnOption', name);
                                    if (!option)
                                        return;
                                    if (option.InsertData == false)
                                        return;
                                    row[name] = value.actions.getValue(value.target);
                                });
                            }
                        }


                        dom.datagrid("appendRow", row);
                    }
                }
            }
        }
    },
    //将所有列都处于编辑状态
    beginEditDatagridAll: function (tableid) {
        var dom = UIHelper.loadjQueryDom(tableid);
        dom.datagrid('beginEdit');
    },
    beginEditDatagrid: function (tableid, ridx) {
        var dom = UIHelper.loadjQueryDom(tableid);
        dom.datagrid('selectRow', ridx).datagrid('beginEdit', ridx);
    },
    endDatagridEdit: function (tableid, idx) {
        var dom = UIHelper.loadjQueryDom(tableid);
        if ($.valid(idx)) {
            if (!dom.datagrid("isEditing", idx)) {
                if (dom.datagrid('validateRow', idx)) {
                    dom.datagrid('endEdit', idx);
                    dom.datagrid('unselectRow', idx);
                    return true;
                }
            }
            return false;
        } else {
            var idxs = dom.datagrid("getEditingRowIndex");
            for (var i = 0; i < idxs.length; i++) {
                if (dom.datagrid('validateRow', idxs[i])) {
                    dom.datagrid('endEdit', idxs[i]);
                    dom.datagrid('unselectRow', idxs[i]);
                } else
                    return false;
            }
            return true;
        }
    },
    /*只要有一个有效即返回True*/
    getValidRows: function (tableid) {
        var dom = UIHelper.loadjQueryDom(tableid), idxs = dom.datagrid("getEditingRowIndex"), count = 0;
        for (var i = 0; i < idxs.length; i++) {
            if (!dom.datagrid('validateRow', idxs[i])) {
                //dom.datagrid('endEdit', idxs[i]);
                count++;
            }
        }
        return count;
    },
    exportDataToFile: function (options) {
        function check(para) {
            if ($.isFunction(para))
                para = para();
            if ($.valid(para))
                return para;
            return '';
        }
        if (options) {
            GM.WindowsUtility.waitFor(options.msg, function (complete) {
                GM.Core.doPostAction(check(options.action), check(options.searchObj), function (json) {
                    complete();
                    if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)) {
                        window.open(encodeURI('/pages/common/export.ashx?key=' + check(json.data.key) + '&fname=' + check(options.filename) + '&filter=' + check(options.filter) + '&tp=' + check(options.namespace)), '_self');
                    }
                },
                true,
                function (XMLHttpRequest, textStatus, errorThrown) {
                    complete();
                    if ($.isFunction(options.error))
                        options.error.call(self, XMLHttpRequest, textStatus, errorThrown);
                    else
                        GM.WindowsUtility.showAjaxError(XMLHttpRequest, textStatus, errorThrown);
                });
            },
            options);
        }
    },
    getSqlDataOfGrid: function (tableid) {
        var dom = UIHelper.loadjQueryDom(tableid);
        UIHelper.endDatagridEdit(tableid);
        var rows = dom.datagrid("getData").rows;
        tablesqlobjs = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var cols = [];
            var ps = [];
            for (var p in row) {
                if (p != "Id") {
                    cols.push({ LExp: p, RExp: "@" + p });
                    ps.push({ LExp: "@" + p, RExp: (row[p] + "").replace(/\\/g, "\\\\") });
                }
            }
            tablesqlobjs.push({ id: row.Id, cols: cols, params: ps });
        }

        return tablesqlobjs;
    },
    getQueryParamsOfRegion: function (regionID) {
        return GM.Tools.getCommQueryParams({ searchboxid: regionID });
    },
    getSqlObjOfRegion: function (parentId) {
        var inputs = $("*[col]", UIHelper.loadjQueryDom(parentId));

        var data = {};
        data.params = [];
        data.cols = [];
        var ele;
        inputs.each(function () {
            ele = $(this);
            var pname = ele.attr("id");
            var col = ele.attr("col");
            if (typeof (col) != "undefined" && col != null && col.length > 0) {
                data.cols.push({ LExp: col, RExp: "@" + col });
                switch (ele.attr("type")) {
                    case "checkbox":
                        data.params.push({ LExp: "@" + col, RExp: ($("*[name='" + pname + "']:checked").val() + '').replace(/\\/g, "\\\\") });
                        break;
                    case "radio":
                        data.params.push({ LExp: "@" + col, RExp: ($("*[name='" + pname + "']:checked").val() + '').replace(/\\/g, "\\\\") });
                        break;
                    default:
                        data.params.push({ LExp: "@" + col, RExp: ($("*[name='" + pname + "']").val() + '').replace(/\\/g, "\\\\") });

                }
            }
        });

        return data;
    },
    GetDataByPostTag: function (parentId, tag) {
        var inputs;
        if (parentId == null || typeof (parentId) == 'undefined') {
            if (tag == "ALL") {
                inputs = $(":input");
            }
            else if (tag == null || typeof (tag) == 'undefined') {
                inputs = $("[posttag]");
            } else {
                inputs = $("[posttag='" + tag + "']");
            }
        } else {
            inputs = $("#" + parentId + " :input,#" + parentId + " textarea,#" + parentId + " select");
        }
        var data = {};
        var ele;
        inputs.each(function () {
            ele = $(this); var pname = ele.attr("name");
            if (pname != null && pname.length > 0 && pname != "__EVENTVALIDATION" && pname != "__VIEWSTATE") {
                if (this.tagName.toLowerCase() == "input") {
                    switch (ele.attr("type")) {
                        case "checkbox":
                            if (data[pname])
                                data[pname][data[pname].length] = ele.val();
                            else
                                data[pname] = [ele.val()];
                            break;
                        case "radio":
                            data[pname] = $("input[name='" + ele.attr("name") + "']:checked").val();
                            break;
                        default:
                            data[pname] = escape($("input[name='" + ele.attr("name") + "']").val());
                    }
                } else if (this.tagName.toLowerCase() == "select") {
                    data[pname] = escape(ele.val());
                }
                else if (this.tagName.toLowerCase() == "textarea") {
                    data[pname] = escape(ele.val());
                }
            }
        });
        return data;
    },

    //帮助界面binddatagrid与handler返回的json
    bindDatagrid: function (gdID, json, pidx, datafilter) {
        var dom = UIHelper.loadjQueryDom(gdID);
        if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)) {
            if ($.isFunction(datafilter)) {
                if ($.isArray(json.data.rows)) {
                    for (var i = 0; i < json.data.rows.length; i++) {
                        datafilter(json.data.rows[i], i, json.data.rows, 0);
                    }
                }
                if ($.isArray(json.data.footer)) {
                    for (var i = 0; i < json.data.footer.length; i++) {
                        datafilter(json.data.footer[i], i, json.data.footer, 1);
                    }
                }
            }
            dom.datagrid("loadData", json.data);
            if (pidx > 0) {
                var paging = dom.datagrid("options").pagination;
                if (paging) {
                    var pager = dom.datagrid('getPager');
                    var po = pager.pagination("options");
                    po.total = json.data.total;
                    po.pageNumber = pidx;
                    pager.pagination('refresh');
                }
            }
        }
        dom.datagrid("loaded");
    },
    //调用action来绑grid，并指定页码和页大小随grid设定
    loadGridPageWithActoin: function (gdID, searchObj, action, pidx, psize, datafilter, doloaded) {
        var dom = UIHelper.loadjQueryDom(gdID);
        if (!$.valid(searchObj)) {
            searchObj = dom.datagrid("getSearchObj");
        }
        if ($.valid(searchObj)) {
            searchObj.pidx = pidx;
            searchObj.psize = psize;
            var paging = dom.datagrid("options").pagination;
            var pager;
            if (paging)
                pager = dom.datagrid('getPager');

            if (typeof (pidx) == "undefined") {
                if (pager) {
                    psize = pager.pagination("options").pageSize;
                    searchObj.psize = psize;
                    pidx = pager.pagination("options").pageNumber;
                    searchObj.pidx = pidx;
                } else {
                    psize = 0;
                    pidx = 0;
                }
            }
            if (pidx > 0) {
                if (pager) {
                    psize = pager.pagination("options").pageSize;
                } else {
                    psize = 0;
                }
                searchObj.psize = psize;
            }
            if (pidx == 0 && !searchObj.psize)
                searchObj.psize = 0;

            dom.datagrid("setSearchObj", searchObj);

            dom.datagrid('loading');
            GM.Core.doPostAction(action,/*添加默认排序,默认过滤*/dom.datagrid("processSearchObj", searchObj), function (json) {
                UIHelper.bindDatagrid(gdID, json, pidx, datafilter);
                if ($.isFunction(doloaded))
                    doloaded(dom);
            });
        }
    }
    //加载打印分页绑定
    , loadPrintGridPageWithAction: function (gdID, searchObj, action, pidx, psize, datafilter, gdtemp, gdopt, doloaded) {
        var dom = UIHelper.loadjQueryDom(gdID);
        if (!$.valid(searchObj)) {
            searchObj = dom.datagrid("getSearchObj");
        }
        if ($.valid(searchObj)) {
            searchObj.pidx = pidx;
            searchObj.psize = 0;


            dom.datagrid("setSearchObj", searchObj);

            //dom.datagrid('loading');

            GM.Core.doPostAction(action, searchObj, function (json) {
                if (json.status == 0) {
                    var pageCount = json.data.rows.length;
                    pageCount = pageCount > 0 ? pageCount / psize : 1;
                    for (var i = 0; i < pageCount; i++) {
                        var tempDom = $(gdtemp);
                        var tempId = "maintable" + i;
                        var maintables = tempDom.find(".maintable")
                        maintables.attr("id", tempId);
                        maintables.html("1111111");
                        dom.append(tempDom);
                        var jsonOne = json.data.rows.slice(i * psize, i * psize + psize);
                        var ttt = $("#maintable0").html();
                        UIHelper.initMainTable(tempId, gdopt);
                        UIHelper.bindDatagrid("#" + tempId, { "data": { "rows": jsonOne }, "status": json.status }, pidx, datafilter);
                    }
                    if ($.isFunction(doloaded))
                        doloaded(dom);
                }
            });
        }
    }
, bindForm: function (formid, json) {

    $("#" + formid + " input[col],textarea[col],span[col]").each(function () {
        var self = $(this);
        if (self.attr("canEdit") == 0) {
            self.attr("readonly", true);
            self.css("border", "none");
            if (self.hasClass("combobox-f"))
                self.combobox('readonly', true);
            if (self.hasClass("combogrid-f"))
                self.combogrid('readonly', true);
        }
        if (self.hasClass("combobox-f")) {
            self.combobox("setValue", json[self.attr("col")]);
            //return true;
        }
        if (self.hasClass("combogrid-f")) {
            self.combogrid("setValue", json[self.attr("col")]);
            //return true;
        }

        if (self.get(0).tagName == 'SPAN') {
            self.html(json[self.attr("col")]);
            if (self.hasClass('money')) {
                var formatVal = GM.GridFormat.CurrencyFormatter($(this).html());
                self.html(formatVal);
            }
        }
        else if (self.get(0).tagName == 'INPUT' && self.attr('type').toLowerCase() == 'checkbox') {

            self.attr('checked', json[self.attr("col")]);
        } else {
            self.val(json[self.attr("col")]);
            if (self.hasClass('money')) {
                var formatVal = GM.GridFormat.CurrencyFormatter(self.val());
                self.val(formatVal);
            }
        }
    });
}
,
    loadEnumData: function (action, category, callback, error) {
        if (!action)
            action = "Base.Enum.List";
        GM.Core.doPostAction(action, { Category: category }, callback, true, error);
    },
    toggleHelp: function (kbid, name, formatKBUrl, appCode) {
        if (!appCode)
            appCode = "Gmhl";
        $.XibenHelp.toggleHelp([{ appCode: appCode, pageCode: kbid, pageUrl: window.location.href, name: name }]);
    },
    helpContent: function (kbid,callback,appCode,name) {
        if (!appCode)
            appCode = "Gmhl";
        $.XibenHelp.helpContent([{ appCode: appCode, pageCode: kbid, pageUrl: window.location.href, name: name }], callback);
    },
    //是否第一行数据
    //val: 数据值
    isFirstRow: function (val, key, ind, sequence) {
        if (ind == 0) {
            tempIndex = -1;
            tempKey = '';
            tempBool = false;
        }
        if (tempIndex != ind) {
            tempIndex = ind;
            if (sequence == 1 || ind == 0 || key != tempKey) {
                tempKey = key;
                tempBool = true;
            }
            else {
                tempBool = false;
            }
        }
        return tempBool;
    },
    pageCurrencyFormatter: function () {
        $('.money').each(function (ind) {

            var me = $(this);
            var val = me.val();
            val = (val ? val : me.html());
            var formatVal = GM.GridFormat.CurrencyFormatter(val);
            $(this).val(formatVal).html(formatVal);
        });
    },
    //显示、隐藏代理
    showHideProxyColumn: function (isShowProxy, $mainTable, columns) {
        for (var i = 0; i < columns.length; i++) {
            $mainTable.datagrid((isShowProxy ? 'showColumn' : 'hideColumn'), columns[i]);
        }
    },
    //审批
    toApprove: function (tip, id, state, submitAC, localAC, callBack) {
        GM.WindowsUtility.confirm(tip, function (r) {
            if (r) {
                var apporveObj = {
                    BizId: id, ApproveState: state, ActionCode: submitAC
                }
                GM.Core.doPostAction(localAC, apporveObj, function (json) {
                    if (json.status != 0)
                        GM.WindowsUtility.showMessage(json.message);
                    else {
                        if (callBack && (typeof callBack == "function")) {
                            callBack();
                        }
                        else {
                            GM.WindowsUtility.showMessage("审批成功！");
                            GM.UIHelper.loadGridPageWithActoin("mainTable", null, listAction);
                        }
                    }
                });
            }
        });
    },
    //审批
    doApproveFun: {
        resetAClass: "icon-reset icon",
        localAClass: "icon-approve icon",
        localBClass: "icon-reject icon",
        localAInnerHtml: "",
        localBInnerHtml: "",
        approveData: null,
        getApproveData: function (callback) {
            if(callback && $.isFunction(callback)){
                if (GM.UIHelper.doApproveFun.approveData != null) { 
                    callback(GM.UIHelper.doApproveFun.approveData);
                } else {
                    GM.UIHelper.doApproveFun.approveData = {};
                    GM.Core.loadEnumData("Common.SubmitAction.List", "approvecode", function (_data) {
                        if (_data && _data.data && _data.data.length > 0) {
                            for (var _i = 0; _i < _data.data.length; _i++) {
                                GM.UIHelper.doApproveFun.approveData[_data.data[_i].ActionCode] = _data.data[_i];
                            }
                            if (callback && $.isFunction(callback))
                                callback(GM.UIHelper.doApproveFun.approveData);
                        } else {
                            if (callback && $.isFunction(callback))
                                callback(null);
                        }
                    }, null, null, null, null, null, null);
                }
            } 
        },
        getApproveUrl: function (subObj, approveBillId, approveState, callResetA, callLocalA, callLocalB) {
            approveUrl = [];
            if (subObj) {
                var _ResetA = $("<a/>").attr({
                    ac: subObj.ResetCode == null ? "" : subObj.ResetCode,
                    title: approveState == 1 ? "未提交审批,不能取消" : "取消审批",
                    href: "#"
                }).addClass(GM.UIHelper.doApproveFun.resetAClass).bind("click", function () {
                    if (approveState == 1) return;
                    GM.UIHelper.doApproveFun.resetApprove(approveBillId, subObj, callResetA);
                }).html("");
                var _LocalA = $("<a/>").attr({
                    ac: subObj.LocalCode == null ? "" : subObj.LocalCode,
                    title: "同意审批",
                    href: "#"
                }).addClass(GM.UIHelper.doApproveFun.localAClass).bind("click", function () {
                    GM.UIHelper.doApproveFun.localApprove(approveBillId, subObj, 3, callLocalA);
                }).html(GM.UIHelper.doApproveFun.localAInnerHtml);
                var _LocalB = $("<a/>").attr({
                    ac: subObj.LocalCode == null ? "" : subObj.LocalCode,
                    title: "拒绝审批",
                    href: "#"
                }).addClass(GM.UIHelper.doApproveFun.localBClass).bind("click", function () {
                    GM.UIHelper.doApproveFun.localApprove(approveBillId, subObj, 1, callLocalB);
                }).html(GM.UIHelper.doApproveFun.localBInnerHtml);
                //审批中 
                if (approveState == 2 && subObj.LocalCode != null && subObj.LocalCode != "" && subObj.IsLocal) {
                    approveUrl.push(_LocalB);
                    approveUrl.push(_LocalA);
                }
                if (subObj.ResetCode != null && subObj.ResetCode != "")
                    approveUrl.push(_ResetA);
            }
            return approveUrl;
    },
    resetApprove : function (approveBillId,subObj,callBack) {
        GM.WindowsUtility.confirm("确定【取消审批】此单据？", function (r) {
            if (r) {
                var apporveObj = {
                    approveObj: { ApproveBillIds: [approveBillId], ActionCode: subObj.ActionCode }
                } 
                GM.Core.doPostAction(subObj.ResetCode, apporveObj, function (data) {
                    if (GM.Core.checkBizResult(data, GM.WindowsUtility.showBizError)) {
                        GM.WindowsUtility.showMessage("取消审批成功！");  
                        if (callBack && $.isFunction(callBack))
                            callBack();
                    }
                });
            }
        });
    },
    localApprove: function (approveBillId, subObj, type, callBack) {
        var tip = type == 1 ? "确定【拒绝】审批此单据？" : "确定【同意】审批此单据？";
        GM.WindowsUtility.confirm(tip, function (r) {
            if (r) {
                var apporveObj = {
                    BizId: approveBillId, ApproveState: type
                } 
                GM.Core.doPostAction(subObj.LocalCode, apporveObj, function (data) {
                    if (GM.Core.checkBizResult(data, GM.WindowsUtility.showBizError)) {
                        GM.WindowsUtility.showMessage(type == 1 ? "拒绝成功！" : "审批成功！");
                        if (callBack && $.isFunction(callBack))
                            callBack();
                    }
                }); 
            }
        }); 
    }
    },
    //模式对话框页审批
    doOperateApproveFun: {
        //默认回调
        localACallBack: function () { 
            GM.WindowsUtility.closeCurWindow("localSuccess", GM.WindowsUtility.DialogResult.OK);
        },
        localBCallBack: function () {
            GM.WindowsUtility.closeCurWindow("localCancelSuccess", GM.WindowsUtility.DialogResult.OK);
        },
        //默认样式
        localAClass: "easyui-linkbutton sucess l-btn l-btn-plain",
        localBClass: "easyui-linkbutton l-btn l-btn-plain",
        localAInnerHtml: "<span class='l-btn-left'><span class='l-btn-text'>同意审批</span></span>",
        localBInnerHtml: "<span class='l-btn-left'><span class='l-btn-text'>拒绝审批</span></span>",
        doApprove: function (callback) { 
            var appbtn = $("[submitAction]", $(".bottomToolBar")).first();
            if (appbtn.length > 0) { 
                GM.UIHelper.doApproveFun.localAClass = GM.UIHelper.doOperateApproveFun.localAClass;
                GM.UIHelper.doApproveFun.localBClass = GM.UIHelper.doOperateApproveFun.localBClass;

                GM.UIHelper.doApproveFun.localAInnerHtml = GM.UIHelper.doOperateApproveFun.localAInnerHtml;
                GM.UIHelper.doApproveFun.localBInnerHtml = GM.UIHelper.doOperateApproveFun.localBInnerHtml;

                var approveBillId = appbtn.attr("approveBillId");
                var approveState = appbtn.attr("approveState");
                var approveSubmitAction = appbtn.attr("submitAction");
                 
                if (approveBillId && approveSubmitAction) {
                    GM.UIHelper.doApproveFun.getApproveData(
                        function (subObj) {
                            if (subObj) {
                                var _obj = subObj[approveSubmitAction];
                                if (_obj) {
                                    _obj.ResetCode = null;
                                    var approveUrl = GM.UIHelper.doApproveFun.getApproveUrl(_obj, approveBillId, approveState, null, GM.UIHelper.doOperateApproveFun.localACallBack, GM.UIHelper.doOperateApproveFun.localBCallBack);
                                    if ($.isArray(approveUrl)) {
                                        for (var i = 0; i < approveUrl.length; i++) {
                                            approveUrl[i].insertAfter(appbtn);
                                        }
                                    }
                                    GM.Core.ctrlACAuth($(".bottomToolBar"));
                                }
                            }
                            if (callback && $.isFunction(callback))
                                callback();
                        }
                    );
                }
            }
        }   
    },
    //从查询条件设定，生成查询界面
    initrenderSearchBar: function (searchConditions) {
        //serchobj = searchConditions;

        var sbox = UIHelper.loadjQueryDom(searchConditions.searchboxid).addClass("searchPanel");
        var form = $("<form method='post'></form>").appendTo(sbox);
        var mrow = $("<tr></tr>").appendTo($("<table width='99%'></table>").appendTo(form));
        var mtd1 = $("<td></td>").appendTo(mrow);
        var mtd2 = $("<td style='width:30px;'></td>").appendTo(mrow);
        var firstLine = true;
        var hasExtPenel = false;

        var fieldsPanelExt = $("<div></div>").attr('id', sbox.attr('id') + '_ext').appendTo($(document.body));
        fieldsPanelExt.panel(
        {
            doSize: false,
            closed: true,
            noheader: true,
            border: true,
            cls: "combo-p searchPanel searchExtPanel",
            style: { position: "absolute" }
        });
        var fieldsPanelExtBody = fieldsPanelExt.panel("body").addClass("combo-panel");

        var extBtnCell;
        var fieldsPanel = $("<table></table>").addClass("fieldArea").appendTo(mtd1);
        var fieldPanel = $("<tr></tr>").addClass("fieldSection").appendTo(fieldsPanel);



        for (var i = 0; i < searchConditions.items.length; i++) {
            var sitem = searchConditions.items[i];
            if (sitem == undefined) continue;
            //  if (sitem.id == "fastitem") continue;
            //插入自定义查询条件
            var ii = sbox.find(".ii[idx='" + i + "']");
            if (ii.length > 0) {
                fieldPanel.append(ii);
                ii.attr("idx", "");
            }
            var colspan = 1;
            var cell;
            if (sitem.separated) {
                if (firstLine) {
                    extBtnCell = $("<td></td>").addClass("editor").appendTo(fieldPanel);
                    fieldsPanel = $("<table style='width:100%;'></table>").addClass("fieldArea").appendTo(fieldsPanelExtBody);
                    firstLine = false;
                }
                fieldPanel = $("<tr></tr>").addClass("fieldSection").appendTo(fieldsPanel);
                colspan = 1;
            } else {
                if (!firstLine)
                    hasExtPenel = true;

                if (!sitem.id)
                    sitem.id = searchConditions.searchboxid + "_" + sitem.filed.replace('.', '_') + i;
                if (!sitem.name)
                    sitem.name = sitem.id;

                var relay = sitem.relay;


                if (sitem.title) {
                    if (!relay || !$.valid(cell))
                        cell = $("<td></td>").addClass("label").appendTo(fieldPanel);
                    var lab = $("<span for='" + sitem.id + "'>" + sitem.title + "</span>").width(sitem.labelWidth).appendTo(cell);

                    colspan = 1;
                } else
                    colspan++;


                if (!relay || !$.valid(cell))
                    cell = $("<td></td>").attr("colspan", colspan).addClass("editor").appendTo(fieldPanel);

                var eo = $.extend({}, sitem.editor.options);
                var $ipt;
                if (sitem.editor.type.toUpperCase() == "LABEL") {
                    $ipt = $("<span>" + eo.initVal + "</span>");
                } else {
                    $ipt = $("<input type='text' />");
                    $ipt.attr("col", sitem.filed);
                    $ipt.attr("name", sitem.id);
                    $ipt.attr("id", sitem.id);
                    $ipt.attr("oper", sitem.oper);
                    $ipt.val(eo.initVal);
                    if (sitem.onGetValue)
                        $ipt.data("onGetValue", sitem.onGetValue);
                }
                $ipt.outerWidth(eo.width);
                $ipt.outerHeight(eo.height);
                $ipt.appendTo(cell);

                colspan = 1;

                if (sitem.editor.type.toUpperCase() == "NUMBERBOX") {
                    Editor.txtToNumbox($ipt, null, eo.initVal, null, null, null, eo);
                }
                else if (sitem.editor.type.toUpperCase() == "COMBOGRID") {
                    Editor.txtToComboGrid($ipt, eo.idField, eo.textField, eo.columns, eo.action, eo.qo, eo.addrow, eo.initVal, eo.width, eo.height);
                }
                else if (sitem.editor.type.toUpperCase() == "DATE") {
                    Editor.txtToDatebox($ipt, eo.initVal, eo);
                }
                else if (sitem.editor.type.toUpperCase() == "SELECT") {
                    var iptSource = eo.data;
                    if ($.isFunction(eo.data))
                        iptSource = eo.data();

                    var ctrl = Editor.txtToEnumCombobox($ipt, iptSource, eo.initVal, eo.canEdit, eo.otherData, null, null, null, eo);
                    if (eo.parentEnum) {
                        ctrl.combobox("setParentEnum", { parentEnum: eo.parentEnum, parentField: eo.parentField });
                    }
                }
                else if (sitem.editor.type.toUpperCase() == "SELECTENUM") {
                    if (eo.refresh) {
                        eo.action = eo.action + "&t=" + Date.parse(new Date());
                    }
                    eo.IsIncludeNull = true;
                    var ctrl = Editor.txtToRemoteEnumCombobox($ipt, eo.action, eo.category, eo.initVal, eo.canEdit, eo.otherData, null, null, eo.extOnSelectFunc, eo);
                    if (eo.parentEnum) {
                        ctrl.combobox("setParentEnum", { parentEnum: eo.parentEnum, parentField: eo.parentField });
                    }
                }
                else if (sitem.editor.type.toUpperCase() == "SELECTTREE") {
                    var iptSource = eo.data;
                    if (typeof (eo.data) == "function")
                        iptSource = eo.data();

                    Editor.txtToEnumComboboxTree($ipt, iptSource, eo.initVal, eo.canEdit, eo.otherData, null, null, null, eo);
                } else if (sitem.editor.type.toUpperCase() == "SELECTUSER") {
                    var initVal = -1;
                    if ($.valid(eo.initVal)) {
                        initVal = eo.initVal;
                    }
                    Editor.txtToUserComboGrid(sitem.id, initVal, eo);
                }
                else if (sitem.editor.type.toUpperCase() != "LABEL") {
                    Editor.txtToPlainbox($ipt, null, eo.initVal, null, null, eo);
                }
            }

        }
        ///////set



        function createExtBtn(container) {
            function showSearchExt() {
                var p = fieldsPanelExt.panel("panel");
                var pos = $.extend({}, moreBtn.offset());
                var spos = sbox.offset();
                pos.top = spos.top + sbox.outerHeight();
                pos.left = spos.left;
                fieldsPanelExt.panel("move", pos);

                fieldsPanelExt.panel("panel").slideDown(160);
            }

            function hideSearchExt() {
                fieldsPanelExt.panel("panel").slideUp(160);
            }

            var moreBtn = $("<a href='javascript:void(0)' style='background:transparent;width:38px; margin:0px;' title='更多查询条件'></a>");
            var sbtn = $("<span class='combo searchMoreButton'></span>").appendTo(container);
            moreBtn.appendTo(sbtn);
            moreBtn.click(
                function () {
                    var p = fieldsPanelExt.closest("div.combo-panel");
                    $("div.combo-panel:visible").not(fieldsPanelExt).not(p).panel("close");
                    if (fieldsPanelExt.is(":visible")) {
                        hideSearchExt();
                    } else {
                        showSearchExt();
                    }
                }).addClass("searchExtButton");

            moreBtn.tooltip();
            moreBtn.linkbutton({
                id: 'defaultSearchMorebtn',
                iconCls: 'icon-search_more',
                plain: true,
                width: 40
            });
        }

        //插入自定义查询条件,idx不对的，都在后面
        fieldPanel.append(sbox.find(".ii[idx]"));


        if (hasExtPenel) {
            createExtBtn(extBtnCell);
        }

        var sbox_btns = $("<div></div>").addClass("buttonArea").appendTo(mtd2);
        if (!searchConditions.hideSeachButton) {
            var searchBtn = $("<a href='###' class='button' id='link_search'>查询</a>").linkbutton({ plain: true });
            searchBtn.click(function () { searchConditions.searchfun(); });
            sbox_btns.append(searchBtn);
        }
        if ($.isArray(searchConditions.btns)) {
            for (var i = 0; i < searchConditions.btns.length; i++) {
                if (searchConditions.btns[i].separated) {
                    sbox_btns = $("<div></div>").addClass("buttonArea").addClass("newLine").appendTo(mtd2);
                } else {
                    var btn = $("<a href='###' class='button' id='" + searchConditions.btns[i].id + "'>" + searchConditions.btns[i].text + "</a>").linkbutton({ plain: true });
                    if ($.isFunction(searchConditions.btns[i].onClick))
                        btn.click(searchConditions.btns[i].onClick);
                    sbox_btns.append(btn);
                }
            }
        }
        //$.parser.parse(sbox);
    }
};
if (window.GM == undefined)
    window.GM = {};
GM.UIHelper = UIHelper;