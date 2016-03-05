$(document).delegate("input:text:visible", "focus", function () {
    jqObj = $(this);
    setTimeout(function () { jqObj.select(); }, 50);
    var p = $(this).parent("span.combo");
    if (p.length == 0) {
        p = $(this).parent("span.searchbox");
        if (p.length == 0) {
            p = $(this).parent("span.spinner");
            if (p.length == 0) {
                p = $(this).parent("span.dialogselector");
                if (p.length == 0) {
                    p = $(this).parent("span.textbox");
                    if (p.length == 0)
                        if ($(this).attr("readonly") || $(this).attr("nogrow"))
                            return;
                        else
                            p = $(this);
                }
            }
        }
    }
    p.addClass("outerGlow");
}).delegate("input:text:visible", "blur", function () {
    var p = $(this).parent("span.combo");
    if (p.length == 0) {
        p = $(this).parent("span.searchbox");
        if (p.length == 0) {
            p = $(this).parent("span.spinner");
            if (p.length == 0) {
                p = $(this).parent("span.dialogselector");
                if (p.length == 0) {
                    p = $(this).parent("span.textbox");
                    if (p.length == 0)
                        if ($(this).attr("readonly") || $(this).attr("nogrow"))
                            return;
                        else
                            p = $(this);
                }
            }
        }
    }
    p.removeClass("outerGlow");
});
$(document).delegate("textarea:visible", "focus", function () {
    var p = $(this);
    setTimeout(function () { p.select(); }, 0);
    p.addClass("outerGlow");
}).delegate("textarea:visible", "blur", function () {
    var p = $(this);
    p.removeClass("outerGlow");
});

$(document).delegate("input:text:visible", "keypress", function (e) {
    var key = e.which;
    if (key == 13) {
        var self = e.target;
        e.stopPropagation();
        e.preventDefault();
        window.setTimeout(function () {

            var ipts = $("input:text:visible");

            var idx = ipts.index(self);

            if (idx == ipts.length - 1) {
                ipts[0].select()
            } else {
                ipts[idx + 1].focus(); //  handles submit buttons
                ipts[idx + 1].select();
            }
        }, 50);
        return false;
    }
    return true;
})