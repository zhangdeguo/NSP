var WindowsUtility = {
    _topWindow: function () {
        var cw = window;
        var pw = null;
        while (true) {
            try {
                if (cw != pw && cw.GM && cw.GM.WindowsUtility && $.isFunction(cw.GM.WindowsUtility.doOpenUrlWindow)) {
                    pw = cw;
                    cw = cw.parent;
                } else
                    break;
            } catch (er) {
                break;
            }
        }
        if (pw == null)
            pw = cw;
        return pw;
    },
    showMessageViaJson: function (sucmsg, json, sucfuc) {
        if (json.status == 0) {
            WindowsUtility.showMessage(sucmsg);
            if (sucfuc) sucfuc();
        } else
            WindowsUtility.showMessage(json.status + ":" + json.message);
    },
    load: function (url) {
        window.location = url;
    },
    showBizError: function (message, status) {
        WindowsUtility.showMessage('错误[' + status + ']：' + message, 'error');
    },
    showAjaxError: function (XMLHttpRequest, textStatus, errorThrown, url) {
        if (!url)
            url = ''
        else
            url = "<br/>" + url;
        WindowsUtility.showMessage('服务错误[' + errorThrown + ']：' + textStatus + url, 'error');
        return false;
    },
    //type:i,e,w
    showMessage: function (msg, type, waitTime) {
        if (waitTime == undefined)
            waitTime = 5000;

        var margintop = 0;
        var dom = $("#msgbox");
        if (dom.length <= 0) {
            dom = $('<div id="msgbox" class="msgbox"></div>').appendTo($(window.document.body));
            $('<div class="title"></div><div class="msgbody"></div>').appendTo(dom);
        }
        //var scollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        //var scollLeft = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
        dom.offset({ top: margintop });
        dom.find(".msgbody").html(msg);

        dom.removeClass();
        dom.addClass('msgbox');
        if (type)
            dom.addClass(type);

        dom.fadeIn("slow");
        var waiting = false;
        dom.hover(
            function () {
                waiting = true;
            }, function () {
                waiting = false;
            });
        var th = setTimeout(doTimout, waitTime);
        function doTimout() {
            if (!waiting) {
                clearTimeout(th);
                dom.fadeOut("slow");
            } else {
                clearTimeout(th);
                th = setTimeout(doTimout, 1000);
            }
        }
    },
    waitFor: function (msg, action, options) {
        return GM.WindowsUtility._topWindow().GM.WindowsUtility.doWaitFor(msg, action, options);
    },
    doWaitFor: function (msg, action, options) {
        return $.messager.waitFor(msg, action, options);
    },
    progress: function (option) {
        return GM.WindowsUtility._topWindow().GM.WindowsUtility.doProgress(option);
    },
    doProgress: function (option) {
        return $.messager.progress(option);
    },
    alert: function (title, msg, icon, callback) {
        return GM.WindowsUtility._topWindow().GM.WindowsUtility.doAlert(title, msg, icon, callback);
    },
    doAlert: function (title, msg, icon, callback) {
        return $.messager.alert(title, msg, icon, callback);
    },
    notify: function (options) {
        return GM.WindowsUtility._topWindow().GM.WindowsUtility.doShowMessage(options);
    },
    doShowMessage: function (options) {
        $.messager.show($.extend({
            timeout: 2000,
            showType: 'fade',
            style: {
                right: '',
                top: document.body.scrollTop + document.documentElement.scrollTop,
                bottom: ''
            }
        }, options));
    },
    confirm: function (msg, func, title, hide) {
        if (hide)
            func(true);
        else
            GM.WindowsUtility._topWindow().GM.WindowsUtility.doDonfirm(msg, func, title);
    },
    doDonfirm: function (msg, func, title) {
        if ($.isFunction(func)) {
            $.messager.confirm(title, msg, func);
        }
    },
    DialogResult: { OK: 1, Cancel: 2 },
    //打开弹出窗口(全屏)
    winOpenAll: function (url, name, width, height, isscroll) {
        if (url.indexOf("?") > 0) {
            url += "&_rand=" + Math.random();
        }
        else {
            url += "?_rand=" + Math.random();
        }
        if (!width) width = 800;
        if (!height) height = 600;
        if (!isscroll) isscroll = "yes";
        var top = ((screen.availHeight) / 2) - (height / 2) - 35;
        var left = (screen.availWidth / 2) - (width / 2);
        var objNewWin;
        var objNewWin = window.open(url, '_blank', "dialog=yes,modal=yes,fullscreen=0,toolbar=0,location=no,directories=0,status=yes,menubar=0,scrollbars=" + isscroll + ",resizable=yes,width=" + (window.screen.availWidth - 10) + ",height=" +(window.screen.availHeight - 30)+ ",top=0,left=0", false);
    },
    //打开弹出窗口
    winOpen: function (url, name, width, height, isscroll)
    {
        if (url.indexOf("?") > 0) {
            url += "&_rand=" + Math.random();
        }
        else {
            url += "?_rand=" + Math.random();
        }
        if (!width) width = 800;
        if (!height) height = 600;
        if (!isscroll) isscroll = "yes";
        var top = ((screen.availHeight) / 2) - (height / 2)-35;
        var left = (screen.availWidth / 2) - (width / 2);
        var objNewWin;
        var objNewWin = window.open(url, '_blank', "dialog=yes,modal=yes,fullscreen=0,toolbar=0,location=no,directories=0,status=yes,menubar=0,scrollbars=" + isscroll + ",resizable=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left, false);
    },
    //打开新窗口
    openUrlWindow: function (title, url, w, h, ismodal, callback, isLoacl, opts, param) {
        //title = title+"<a class='quickhelp' onclick='alert(1)' title='帮助'></a>";
        if (isLoacl)
            return doOpenUrlWindow(title, url, w, h, ismodal, callback, false, opts, param);
        else
            return GM.WindowsUtility._topWindow().GM.WindowsUtility.doOpenUrlWindow(title, url, w, h, ismodal, callback, false, opts, param);
    },
    doOpenUrlWindow: function (title, url, w, h, ismodal, callback, needHandle, opts, param) {
        var container = $(document.body);
        var winList = container.data("winList");
        if (!$.isArray(winList)) {
            winList = [];
            container.data("winList", winList);
        }
        var curWin = $("<div title='" + title + "'><div>").css("overflow", "hidden").appendTo(container);
        curWin.append($("<iframe frameborder='no' width='100%' scrolling='no' height='100%'></iframe>"));
        winList.push(curWin);
        curWin.data("param", param);
        var sonclose;

        if (opts && opts.onClose) {
            sonclose = opts.onClose;
            delete opts.onClose;
        }
        if (opts && opts.maximized) {
            opts.minimizable = false;
            opts.maximizable = false;
        } 
       
        var win = curWin.window($.extend({ minimizable: false, collapsible: false }, {
            width: w,
            height: h,
            modal: ismodal | true,
            onClose: function () {
                var winList = container.data("winList");
                container.data("winList", winList.toQuerable().where(function (t) { return t !== curWin }).toArray());
                if ($.isFunction(callback)) {
                    var ret = curWin.DialogResult;
                    var data = curWin.DialogData;
                    if (!ret)
                        ret = GM.WindowsUtility.DialogResult.Cancel;
                    callback(data, ret);
                }
                if ($.isFunction(sonclose))
                    sonclose();
            }
        }, opts));
        $(curWin.find("iframe").get(0)).attr("src", url);
        if (needHandle)
            return container.curWin;
    },
    print: function (url) {
        window.open(url, '_blank');
    },
    getCurWindowParam: function (isLoacl, handle)
    {
        if (!handle) {
            if (isLoacl)
                return doGettCurWindowParam(handle)
            else {
                return GM.WindowsUtility._topWindow().GM.WindowsUtility.doGettCurWindowParam(handle);
            }
        } else {
            return doGettCurWindowParam(handle);
        }
    },
    doGettCurWindowParam: function (handle) {
        var param;
        if (!handle) {
            var container = $(document.body);
            var winList = container.data("winList");
            if (winList && winList.length > 0) {
                var curWin = winList.pop();
                if (curWin) {
                    winList.push(curWin);
                    return curWin.data("param");
                }
            }
        } else {
            return handle.data("param");
        }
    },
    //注意：用来关当前窗体里的弹窗，而非关自已
    closeCurWindow: function (data, result, isLoacl, handle) {
        if (!handle) {
            if (isLoacl)
                doCloseCurWindow(data, result)
            else {
                GM.WindowsUtility._topWindow().GM.WindowsUtility.doCloseCurWindow(data, result);
            }
        } else {
            doCloseCurWindow(data, result, handle);
        }
    },
    doCloseCurWindow: function (data, result, handle) {
        if (!result)
            result = GM.WindowsUtility.DialogResult.Cancel;
        if (!handle) {
            var container = $(document.body);
            var winList = container.data("winList");
            if (winList && winList.length > 0) {
                var curWin = winList.pop();
                if (curWin) {
                    winList.push(curWin);
                    curWin.DialogResult = result;
                    curWin.DialogData = data;
                    curWin.window("close");
                }
            }
        } else {
            handle.DialogResult = result;
            handle.DialogData = data;
            handle.window("close");
        }
    },
    addTab: function (name, title, href) {
        window.top.addTab(title, href);
    },
    removeTab: function (name, title, href) {
        window.top.removeTab(title);
    },
    getTab:function(name)
    {
        return window.top.getTab(name);
    },
    getTabWindow: function (name) {
        return window.top.getTabWindow(name);
    },
    _reciverQueue: {
    },
    _doCallReciver: function (message, param) {
        var acts = GM.WindowsUtility._reciverQueue[message];
        if ($.valid(acts)) {
            for (var i = 0; i < acts.length; i++) {
                if ($.isFunction(acts[i]))
                    acts[i](message, param);
            }
        }
    },
    registerReciver: function (message, action) {
        var acts = GM.WindowsUtility._reciverQueue[message];
        if (!$.valid(acts)) {
            acts = [];
            GM.WindowsUtility._reciverQueue[message] = acts;
        }
        acts.push(action);
        return acts.length - 1;
    },
    callReciver: function (name, title, message, param) {
        var win = GM.WindowsUtility.getTabWindow(title);
        if ($.valid(win))
            win.GM.WindowsUtility._doCallReciver(message, param);
    },
    CheckBrowser: function () {
        if ($("#isLowBrowser").length > 0)
        { CheckBrowser = function () { return false; }; }
        else {
            CheckBrowser = function () { return true; };
        }
        return CheckBrowser();
    },
    FrameLoading: function (menucode) {
        if (WindowsUtility.CheckBrowser()) {
            var oTar = document.getElementById(menucode);
            if (!!oTar) {
                var oTarParent = $(oTar.parentNode);
                WindowsUtility.FrameLoadingShow(oTarParent);
                oTar.onload = function () {
                    WindowsUtility.FrameLoadingClose(oTarParent);
                }
            }
        }
    },
    FrameLoadingShow: function (oTarParent) {
        var html = '<div class="frameloading"><div class="frameloadingimg"></div><span style="margin-left:10px;">加载中,请稍候…</span><div></div></div><div class="frameloadingmask"></div>';
        oTarParent.append(html);
        oTarParent.find(".frameloading").css("left", parseInt((document.documentElement.clientWidth - 75) / 2) + "px");
        oTarParent.find(".frameloading").css("top", parseInt((document.documentElement.clientHeight - 75) / 2) + "px");
    },
    FrameLoadingClose: function (oTarParent) {
        oTarParent.find(".frameloading").remove();
        oTarParent.find(".frameloadingmask").remove();
    }
};
(function ($) {
    function changeToMainFrame(msg)
    {
        if (msg) {
            //这个消息是固定的，就是调用xiben.crossdomain.isgmframe()产生的，发现此消息时修改默认的行为
            if (msg.data === "isgmframe") {
                WindowsUtility.addTab = function (name, title, href) {
                    name = $.trim(name);
                    if (!name || name == '') {
                        name = title;
                    }
                    var tip = '/';
                    if (href && href.length > 1 && href.substring(0, 1) == tip)
                        tip = '';
                    xiben.crossdomain.opennewtab({ menucode: name, text: title, url: "http://" + location.host + tip + href });
                };
                WindowsUtility.removeTab = function (name, title, href) {
                    xiben.crossdomain.closecurtab();
                };
                WindowsUtility.callReciver = function (name, title, message, param) {
                    xiben.crossdomain.noticeanotherframe(GM.Core.getCurrentOrderCode() + name, GM.Tools.O2String({ msg: message, param: param }));
                };
            } else {
                var msgObj = GM.Tools.String2O(msg.data);
                if (msgObj)
                    GM.WindowsUtility._doCallReciver(msgObj.msg, msgObj.param);
            }
        }
    }
    //在加载完毕后处理，否则会有问题
    $(function () {
        if (typeof (xiben) != "undefined"&&xiben)
        {
            //注册消息回调，当处于框架内时可以回调
            XD.receiveMessage(changeToMainFrame);
            //触发回调，当不处于框架内时，回调会不成功，从而兼容了在框架内和不在框架内的情况
            xiben.crossdomain.isgmframe()
        }
    });
})(jQuery);

if (window.GM == undefined)
    window.GM = {};
GM.WindowsUtility = WindowsUtility;