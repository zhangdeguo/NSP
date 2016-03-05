var Editor = {
    loadjQueryDom: function (id) {
        if (id) {
            if (Object.prototype.toString.apply(id) === '[object String]' && !id.startWith("#") && !id.startWith("."))
                return $("#" + id);
        }
        return $(id);
    },
    txtToPlainbox: function (id, acc, initVal, min, max, options) {
        var jdom = Editor.loadjQueryDom(id);
        jdom.textbox($.extend({ height: 28, min: min, max: max, precision: acc }, options));
        jdom.val(initVal);
        return jdom;
    },
    txtToNumbox: function (id, acc, initVal, min, max, req, opt) {
        var jdom = Editor.loadjQueryDom(id);
        if (!initVal) {
            initVal = jdom.val();
        } else {
            jdom.val(initVal);
        }
        jdom.numberbox($.extend({ required: req, min: min, max: max, precision: acc }, opt));
        jdom.numberbox("setValue", initVal);
        return jdom;
    },
    txtToSearchbox: function (id, initVal, opt) {
        var opts = {
            height: 28,
            canEdit: false
        };
        var searcher;
        if ($.isFunction(opt.searcher))
            searcher = opt.searcher;
        else
            searcher = function () { };

        opt.searcher = function (value, name) {
            searcher(value, name, function (data) {
                jdom.searchbox("setValue", data);
            });
        };

        var jdom = Editor.loadjQueryDom(id);
        if (!initVal) {
            initVal = jdom.val();
        } else {
            jdom.val(initVal);
        }
        jdom.searchbox($.extend(opts, opt));

        if (!opts.canEdit) {
            $(jdom.searchbox("textbox")).attr('readonly', 'readonly');
        }
        jdom.searchbox("setValue", initVal);

        return jdom;
    },
    /*
    txtToUserComboGrid: function (id, initVal, opts) {

        var $dom = Editor.loadjQueryDom(id);

        $dom.combogrid($.extend({
            //panelWidth: 170,
            panelHeight: 260,
            height: 28,
            idField: 'UNID',
            textField: 'TrueName',
            showFooter: true,
            showHeader: false,
            fitColumns: true,
            rowStyler: function (i, row) { return 'height: 25px;' },
            columns: [[
                //{ field: 'LoginName', title: '登录名', width: 80, align: 'center' },
                { field: 'TrueName', title: '姓名' }
                //,{ field: 'Company', title: '公司', width: 150 }
            ]]
        }, opts));

        var sobj = {
            BusObjs: [{ BusObjName: "VTenantUserTop" }],
            Props: [{ LExp: "UNID" },
                { LExp: "LoginName" },
                { LExp: "TrueName" }
                //,{ LExp: "Company" }
            ]//, pidx: 1, psize: 10
        };

        GM.Core.doPostAction("Tenant.User.Query", sobj, function (json) {

            if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)
                && json.data.rows.length > 0) {

                json.data.footer = [];
                json.data.footer.push({ TrueName: '<a href="javascript:Editor.selectUserDialog($(\'#' + $dom.attr('Id') + '\'));">更多</a>' });

                var $grid = $dom.combogrid('grid');     
                $grid.datagrid("loadData", json.data);

                if (!$.valid(initVal) || initVal == '') {
                    //2017-07-21 陆村 从dom对象中直接取值不是标准的easyui方式，既然已经构造成了easyui对象，那就忘掉dom
                    //initVal = $dom.val();
                    initVal = $dom.combogrid("getValue");
                    if (!$.valid(initVal) || initVal == '') {
                        var sysUser = Tools.String2O(decodeURIComponent($.cookie("SysUser")));
                        if (sysUser && sysUser.UNID && sysUser.UNID != 0) {
                            initVal = sysUser.UNID;
                        } 
                    }
                }
                if (initVal != -1) {
                    $dom.combogrid("setValue", initVal);
                }
                Editor.UserComboObj = $dom;
            }
        });

        return $dom;

    },
    selectUserDialog: function (id) {
        GM.WindowsUtility.openUrlWindow(
              '选择用户',
              '/Base/Dialogs/SelectUserDialog.html',
              550,
              380,
              true,
              function (data, ret) {
                  if (data && data[0]) {
                      var $dom = Editor.loadjQueryDom(id);
                      $dom.combogrid("setValue", data[0].UNID);
                      $dom.combogrid("setText", data[0].TrueName);
                      $dom.combogrid('hidePanel');
                  }
                  return true;
              },
              false,
              {
                  minimizable: false,
                  collapsible: false,
                  resizable: false
              }
         );
    },*/
    txtToUserComboGrid: function (id, initVal, opts) {

        function _loadUserData($dom, rows, initVal) {
            var rows = $.extend(true, [], rows);
            $dom.combobox("loadData", rows, initVal);
            if (!$.valid(initVal) || initVal == '') {
                //2017-07-21 陆村 从dom对象中直接取值不是标准的easyui方式，既然已经构造成了easyui对象，那就忘掉dom
                //initVal = $dom.val();
                initVal = $dom.combobox("getValue");
                if (!$.valid(initVal) || initVal == '') {
                    var sysUser = Tools.String2O(decodeURIComponent($.cookie("SysUser")));
                    if (sysUser && sysUser.UNID && sysUser.UNID != 0) {
                        initVal = sysUser.UNID;
                    }
                    /*upd by lisa:if the contorl is set to be required selected the first non-empty option*/
                    if ((!$.valid(initVal) || initVal == '') && rows.length == 1) {
                        var sopt = $dom.combobox("options");
                        if (sopt.required === true)
                            initVal = rows[0].UNID;
                    }
                }
            }
            if (initVal != -1) {
                $dom.combobox("setValue", initVal);
            }
        }

        var $dom = Editor.loadjQueryDom(id);
        $dom.combobox($.extend({
            height: 28,
            valueField: 'UNID',
            textField: 'TrueName',
            hideReloadButton: true
        }, opts));

        var sobj = {
            BusObjs: [{ BusObjName: "VTenantUserTop" }],
            Props: [{ LExp: "UNID" },
                { LExp: "LoginName" },
                { LExp: "TrueName" }
            ]
        };

        var userData = $(document.body).data("Tenant.User.Query.Cache");
        if (!$.valid(userData)) {
            userData = { doms: [] };
            userData.doms.push($dom);
            $(document.body).data("Tenant.User.Query.Cache", userData);

            GM.Core.getJson("Tenant.User.Query", sobj, function (json) {
                if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)
                    && json.data.rows.length > 0) {

                    json.data.footer = [];
                    json.data.footer.push({ TrueName: '<a href="javascript:Editor.selectUserDialog($(\'#' + $dom.attr('Id') + '\'));">更多</a>' });

                    userData.rows = json.data.rows;
                    var dom = userData.doms.pop();
                    while (dom != undefined) {
                        _loadUserData(dom, userData.rows, initVal);
                        dom = userData.doms.pop();
                    }
                    $(document.body).data("Tenant.User.Query.Cache", userData);
                }
            });
        } else {
            if ($.valid(userData.rows))
                _loadUserData($dom, userData.rows, initVal);
            else
                userData.doms.push($dom);
        }

        Editor.UserComboObj = $dom;

        var panel = $dom.combobox("panel");
        $('<div style="background-color:#eee;height:24px;vertical-align:middle;line-height:24px;text-align:center;"><a href="javascript:Editor.selectUserDialog($(\'#' + $dom.attr('Id') + '\'));">更多</a></div>').insertAfter(panel.panel("body"));
        return $dom;
    },
    selectUserDialog: function (id) {
        GM.WindowsUtility.openUrlWindow(
              '选择用户',
              '/Base/Dialogs/SelectUserDialog.html',
              550,
              380,
              true,
              function (data, ret) {
                  if (data && data[0]) {
                      var $dom = Editor.loadjQueryDom(id);
                      var sdata = $dom.combobox("getData");
                      $dom.combobox("loadData", sdata.toQuerable().union(data[0], function (v1, v2) {
                          return v1.UNID == v2.UNID;
                      }).toArray());
                      $dom.combobox("setValue", data[0].UNID);
                      $dom.combobox('hidePanel');
                  }
                  return true;
              },
              false,
              {
                  minimizable: false,
                  collapsible: false,
                  resizable: false
              }
         );
    },
    txtToDatebox: function (id, initVal, opt) {
        var jdom = Editor.loadjQueryDom(id);

        if (!initVal) {
            initVal = jdom.val();
        } else {
            jdom.val(initVal);
        }
        jdom.my97datebox($.extend({
            height: 28,
            onSelect: function (record) { jdom.val(record.Format("yyyy-MM-dd")); }
        }, opt));

        jdom.my97datebox("setValue", initVal);
        //$.parser.parse(jdom);
        //opt = $.extend({ dateFmt: 'yyyy-MM-dd', height: 28, initVal: initVal }, eval("{"+ jdom.attr("data-options") + "}"), opt);
        //jdom.val(opt.initVal);
        //jdom.outerHeight(opt.height);
        //jdom.addClass("Wdate");
        //jdom.click(function () { WdatePicker(opt); });
        return jdom;
    },
    txtToNumberSpinner: function (id, initVal, opt) {
        var jdom = Editor.loadjQueryDom(id);
        jdom.numberspinner($.extend({
            height: 28,
            onChange: function (newvalue, oldvalue) { jdom.val(newvalue); }
        }, opt));
        if (!initVal) {
            initVal = jdom.val();
        } else {
            jdom.val(initVal);
        }
        jdom.numberspinner("setValue", initVal);
        return jdom;
    },
    txtToEnumCombobox: function (id, em, initVal, edt, attitem, idf, txtf, extOnSelectFunc, opts) {
        var arr = [].toQuerable().unionAll(attitem).unionAll(em);
        var $dom = Editor.loadjQueryDom(id);
        $dom.combobox(
            $.extend(
            {
                valueField: idf,
                textField: txtf,
                height: 28,
                data: arr.toArray(),
                editable: edt,
                onSelect: function (record) {
                    if ($.valid(record)) {
                        $dom.val(record[idf ? idf : "value"]);
                        if (extOnSelectFunc) extOnSelectFunc(record);
                    }
                }
            }
            , opts));

        if ($.valid(initVal)) {
            $dom.val(initVal);
            $dom.combobox("setValue", initVal);
        }
        return $dom;
    },
    txtToRemoteEnumCombobox: function (id, action, category, initVal, editable, extendData, valueField, txtField, extOnSelectFunc, opts) {        
        var $dom = Editor.loadjQueryDom(id);
        var dini = $dom.val(); 
        if (dini !== '') {
            if (!$.valid(initVal) || initVal == '') {
                initVal = dini;
            }
        }
        //尹熊加 刷新连带功能
        if (action) {
            var comboReloadClass = "combo-reload-" + action.replace(/\./gm, '_');
            $dom.addClass(comboReloadClass);
        }

        $dom.combobox($.extend({
            valueField: valueField,
            textField: txtField,
            height: 28,
            comboReloadClass: comboReloadClass,
            editable: editable,
            onSelect: function (record) { 
                if ($.valid(record)) {
                    var value = record[valueField ? valueField : "value"];
                    $dom.val(value);

                    var options = $(this).combobox('options');
                    if (options.ProjectRefTeamId && !options.ProjectTeam) {
                        var reqObj = {
                            BusObjs: [{ BusObjName: "Tags" }],
                            Props: [{ LExp: "Id" }, { LExp: "Value", Aliases: "TeamId" }, { LExp: "RefrenceText", Aliases: "ProjectId" }],
                            Wheres: [{ LExp: "RefrenceName", RExp: "ProjectTeam", Condition: "Equal" }],
                            Orders: [{ PropName: "Id", OrderType: "ASC" }]
                        };
                        GM.Core.doPostAction("Common.Tags.SelectProjectTeam", reqObj, function (json) {
                            if (GM.Core.checkBizResult(json)) {
                                options.ProjectTeam = json.data.rows;
                            }
                            _setTeamValue(options.ProjectTeam, value, options.ProjectRefTeamId);
                        });
                    } else {
                        _setTeamValue(options.ProjectTeam, value, options.ProjectRefTeamId);
                    }

                    if ($.isFunction(extOnSelectFunc)) {
                        extOnSelectFunc(record);
                    }
                }

                function _setTeamValue(pt, pValue, prtId) {
                    if ($.isArray(pt)) {
                        for (var i = (pt.length - 1) ; i >= 0 ; i--) {
                            if (pt[i].ProjectId == pValue) {
                                $('#' + prtId).combobox('setValue', pt[i].TeamId);
                                break;
                            }
                        }
                    }
                }
            } 
        }
        , opts));

        $dom.combobox("setValue", initVal);
        $dom.combobox("loadEnum", { action: action, category: category, extendData: extendData, isbool: opts.isbool, async: opts.async, opts: { ShowEnabled: opts.ShowEnabled, ShowDeleted: opts.ShowAll } });
         
        return $dom;
    },
    txtToEnumComboboxTree: function (id, em, initVal, edt, attitem, idf, txtf, extOnSelectFunc, opts) {
        var arr = [].toQuerable().unionAll(attitem).unionAll(em);
        var $dom = Editor.loadjQueryDom(id);
        $dom.combotree(
            $.extend(
            {
                valueField: idf,
                textField: txtf,
                height: 26,
                data: arr.toArray(),
                editable: edt,
                panelHeight: 'auto',
                panelMinHeight: 100,
                onSelect: function (record) { $dom.val(record[idf ? idf : "value"]); if (extOnSelectFunc) extOnSelectFunc(record); }
            }
            , opts));

        $dom.combotree("setValue", initVal);
        $dom.val(initVal);
        return $dom;
    },
    txtToComboGrid: function (id, idf, txtf, cols, qac, qo, attRow, v, w, h) {
        if (!h)
            h = 200;
        var jdom = Editor.loadjQueryDom(id);
        jdom.val(v);
        jdom.combogrid({
            //value: v,
            panelWidth: w,
            panelHeight: h,
            idField: idf,
            textField: txtf,
            height: 28,
            columns: cols
            ,
            onSelect: function (nv, ov) {
                jdom.val(nv);
            }
        });
        GM.Core.doPostAction(qac, qo, function (json) {
            if (json.status == 0) {
                var g = jdom.combogrid('grid');
                g.datagrid("loadData", json.data);
                if (attRow)
                    g.datagrid("insertRow", { index: 0, row: attRow });

                jdom.combogrid("setValue", v);
            }
            else
                GM.WindowsUtility.showMessage(json.status + ":" + json.message);
        }, false);
        return jdom;
    },
    setEnumCombobox: function (id, ac, opt) {
        var opts = {
            category: "",
            initVal: null,
            canEdt: true,
            attitem: [],
            idField: "value",
            txtField: "text",
            extOnSelectFunc: null,
            filterField: "pinyin",
            valueField: 'value',
            textField: 'text',
            IsIncludeNull: false,
            FinancialLevel:0,
            FinancialLevelType: 0,
            ShowEnabled: false
        };
        $.extend(opts, opt);
        return Editor.txtToRemoteEnumCombobox(id, ac, opts.category, opts.initVal, opts.canEdt,
                                     opts.attitem, opts.idField, opts.txtField, opts.extOnSelectFunc, opts);
    },
    getSettlementRatio: function (sid, pid, callback, type) {
        var sobj = {
            BusObjs: [{ BusObjName: "SettlementProjectRatio" }],
            Props: [{ LExp: "Ratio" }],
            Wheres: [{ LExp: "SettlementId", RExp: sid, Condition: "Equal" },
                     { LExp: "ProjectId", RExp: pid, Condition: "Equal" }]
        };
        if (type) {
            sobj.Wheres.push({ LExp: "Type", RExp: type, Condition: "Equal" });
        }
        GM.Core.doPostAction('Base.SettlementRatio.Get', sobj, function (json) {
            var result;
            if (json.status == 0 && json.data.rows.length > 0) {
                result = Math.AccMul(json.data.rows[0].Ratio, 100);
            }

            if (callback) {
                callback(result);
            }
        });
    },
//    QutantityEditorOption: { precision: (config && config.businessOptions.QuantityPrecision ? config.businessOptions.QuantityPrecision : 4), groupSeparator: ',' },
    CurrencyEditorOption: { precision: 2, groupSeparator: ',', decimalSeparator: '.', prefix: '' },
    CountEditorOption: { precision: 0, decimalSeparator: '.' },
//    UnitWeightEditorOption: { precision: (config && config.businessOptions.UnitWeightPrecision ? config.businessOptions.UnitWeightPrecision : 4), groupSeparator: ',' }
};

if (window.GM == undefined)
    window.GM = {};
GM.Editor = Editor;