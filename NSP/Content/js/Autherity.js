$(function () {
    $("*[ac]").each(function () {
        var ac = $(this).attr("ac");
        var btn = $(this);
        GM.Core.getJson("/pages/Auth/CheckAuth?acStr=" + ac, function (json) {
            if (json.length == 0)
            {
                btn.remove();
            }
        }, true);
    });
})

var Auth = {
    renderToolBar: function (toolBar)
    {
            var acArr = [];
            for (var i = 0; i < toolBar.length; i++) {
                var ac = toolBar[i].ac;
                if (ac) {
                    acArr.push(ac);
                }
            }
            if (acArr.length > 0) {
                var acStr = acArr.join(",");
                GM.Core.getJson("/pages/Auth/CheckAuth?acStr=" + acStr, function (json) {
                    for (var i = 0; i < toolBar.length; i++) {
                        var ac = toolBar[i].ac;
                        if (ac) {
                            if ($.inArray(ac, json) < 0)
                            {
                                toolBar.removeAt(i);
                                i--;
                            }
                        }
                    }
                },true);
            }
    },
    renderGridBtn: function (gridBtn)
    {
        var acArr = [];
        for (var i = 0; i < gridBtn.length; i++) {
            var ac = $(gridBtn[i]).attr("ac");
            if (ac) {
                acArr.push(ac);
            }
        }
        if (acArr.length > 0) {
            var acStr = acArr.join(",");
            GM.Core.getJson("/pages/Auth/CheckAuth?acStr=" + acStr, function (json) {
                for (var i = 0; i < gridBtn.length; i++) {
                    var ac = $(gridBtn[i]).attr("ac");
                    if (ac) {
                        if ($.inArray(ac, json) < 0) {
                            gridBtn.removeAt(i);
                            i--;
                        }
                    }
                }
            }, true);
        }
    }
};
if (window.GM == undefined)
    window.GM = {};
GM.Auth = Auth;