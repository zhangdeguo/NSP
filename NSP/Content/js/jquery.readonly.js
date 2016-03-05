(function ($) {
    $.readonly = {
        getQueryString: function (name) {

            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

            var r = window.location.search.substr(1).match(reg);

            if (r != null) return unescape(r[2]); return null;

        },
        processReadonly: function (dom) {
            var isView = parseInt($.readonly.getQueryString("viw"));
            if (isView) {
                if (!dom) {
                    dom = $(document.body);
                } else
                    dom = $(dom);
                var self = $(this);
                $(".datagrid-view", dom).each(function (idx) {
                    var self = $(this);
                    var tb = self.children("table");
                    var copts = tb.datagrid("getColumnOption", "btns");
                    if ($.valid(copts))
                        tb.datagrid("hideColumn", "btns");
                    tb.datagrid("options").clickRowEdit = false;
                    return true;
                });

                $(".easyui-validatebox", dom).validatebox("disableValidation");

                $("input:text", dom).each(function (idx) {
                    var self = $(this);
                    self.attr("readonly", true);
                    if (self.is(".combo-f")) {
                        self.combo("readonly", true);
                    }
                    self.css("cursor", "default");
                    if (self.is(":visible"))
                        self.after($("<span>").text(self.val())).hide();
                });

                $(".combo", dom).css("border-style", "none");

                $(".dialogselector", dom).css("border-style", "none");

                $(".combo-arrow", dom).hide();

                $(".Wdate", dom).css("background", "#fff").click(function () { });

                $("textarea:visible", dom).each(function (idx) {
                    var self = $(this);
                    self.after($("<span>").text(self.val())).hide();
                });

                $(".easyui-linkbutton", dom).hide();

                $(".datagrid-toolbar", dom).hide();

                $(".dialogselector-searcharrow", dom).hide();
            }
            return isView;
        },
        getReadonlyPath: function (path) {
            return path + "&viw=1&ooo=";
        },
        isReadonlyPath: function () {
            var isView = parseInt($.readonly.getQueryString("viw"));
            if (isView)
                return true;
            return false;
        }
    };
})(jQuery);