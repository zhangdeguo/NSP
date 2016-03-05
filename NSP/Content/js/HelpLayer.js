  /* 
            <meta content='{"kb":"KByxCS001","version":"001","id":"#txt_name1","align":"right","valign":"top","shade":false,"width":"auto","group":"kb2"}' name="helpMsg" class="helpMsg" />
        */
var HelpLayer = {
    layer: function (contents) {
        var cache_key = "hmcaches";
        var hm = $("<div id='hm-box'></div>");
        var panels = $("<div class='hm-panels'></div>").appendTo(hm);
        var okknow = "<a class='okknow easyui-linkbutton hm-btn'>我知道了</a>";
        for (var i = 0; i < contents.length; i++) {
            var item = $.parseJSON(contents[i]);
            var version = $.valid(item.version) ? item.version : "";
            //$.LS.remove(cache_key + item.kb + version);
            var kb_cache = $.LS.get(cache_key + item.kb + version);
            if (kb_cache == "1")
                continue;
            var panel = $(panel_html(item)).appendTo(panels);
            if (i == 0 && item.shade) {
                hm.css({ "width": "100%", "height": "100%", "position": "absolute" });
                var shade = $("<div class='hm-shade'></div>").appendTo(hm);
            }
            panel.find("a.close").click(function () {
                closePanel(false);
            });
            if (item.width)
                panel.css({ "width": item.width });
            panel.data("options", item);
            panel.attr("kb", item.kb);
            panel.attr("version", version);
            panel.attr("group_kb", item.kb);
            hm.appendTo($(window.document.body)); 
            UIHelper.helpContent(item.kb, function (pa, data) { 
                var hc = hm.find("div.hm-panel[kb='" + pa[0].pageCode + "']").find(".hm-content");
                if (data) {
                    for (var j = 0; j < data.length; j++) {
                        hc.append(data[j].Content);
                    }
                } else { 
                    hc.append("<p>没有帮助提示，请联系客服。</p>");
                }
                closePanel(true);
            });
            if (item.group) {
                panel.attr("group", item.group);
                panel.attr("group_kb", item.kb);
                panel.find(".hm-content-bottom").append("<a class='groupnext hm-btn'>下一步</a>");
            } else {
                $(okknow).appendTo(panel.find(".hm-content-bottom"));
            } 
        }
        var groups = hm.find("div[group]");
        if (groups.length > 0) {
            groups.last().find(".hm-content-bottom").append(okknow);
            groups.last().find(".hm-content-bottom").find("a.groupnext").remove();
        }
        hm.find("a.groupnext").click(function () { 
            var panel = $(this).parents(".hm-panel");
            panel.remove();
            var next = $("div.hm-panel[group=" + panel.attr("group") + "]").first();
            next.attr("group_kb", next.attr("group_kb") + "," + panel.attr("group_kb"));
            next.show();
        });
        hm.find("a.okknow").click(function () { 
            var panel = $(this).parents(".hm-panel");
            var group = panel.attr("group");
            if (group) {
                var group_kbs = panel.attr("group_kb").split(",");
                $.each(group_kbs, function (i) {
                    var kb = group_kbs[i];
                    $.LS.set(cache_key + kb, "1");
                });
            } else {
                var kb = panel.attr("kb") + panel.attr("version");
                $.LS.set(cache_key + kb, "1");
            }
            closePanel(false);
        });
        function closePanel(first) {
            var pa = hm.find(".hm-panel");
            if (pa.length == 1&&!first) {
                hm.remove();
            } else {
                if (first) {
                    hm.show();
                    pa.eq(0).show();
                    edit_panel(pa.eq(0));
                } else {
                    pa.first().remove();
                    pa.eq(1).show();
                    edit_panel(pa.eq(1));
                }
            }
        }
        function panel_html(opt) {
            var path = "M0 0 L50 50 L100 50 Z";
            var svg_height = 50;
            var panel_top = svg_height;
            var panel_left = 20;
            var svg_style = "top:-" + svg_height + "px;"; 
            if ($.valid(opt.id)&&opt.id!="") {
                var elem = getBockEm($(opt.id)); 
                item.align = item.align ? item.align : "right";
                item.valign = item.valign ? item.valign : "bottom"; 
                panel_left = elem.offset().left;
                panel_top = elem.offset().top + elem.height() + svg_height;
                if (item.align == "left" && item.valign == "top") {
                    path = "M100 50 L0 0 L50 0 Z";
                    svg_style = "right:0;";
                } else if (item.align == "left") {
                    path = "M100 0 L0 50 L50 50 Z";
                    svg_style += "right:0;";
                } else if (item.valign == "top") {
                    path = "M0 50 L100 0 L50 0 Z";
                    svg_style = "left:0;";
                }
            }
            return "<div class='hm-panel' optalign='" + item.align + "' optvalign='" + item.valign + "' style='top:" + panel_top + "px;left:" + panel_left + "px' ><svg width='100px' height='" + svg_height + "px' style='" + svg_style + " version='1.1' xmlns='http://www.w3.org/2000/svg'>  <path d='" + path + "' fill='#FFFFCC' /></svg><div class='hm-arrows'></div><a class='close'></a><div class='hm-content'><div class='hm-content-bottom'></div></div></div>";
        }
        function getBockEm(em) {
            if (em.css("display") == "none") {
                em = em.parent();
            }
            return em;
        }
        function edit_panel(panel) {  
            if (panel.attr("optalign") == "left") {
                var left = panel.position().left - panel.width();
                left=left>0?left:0;
                panel.css("left", left);
            }
            if (panel.attr("optvalign") == "top") {
               var top = panel.position().top - panel.height() - 50 - 50 - 25
               top=top>0?top:0;
               panel.css("top", top);
                panel.find("svg").css("top", panel.height());
            }
        }
    }
}


if (window.GM == undefined)
    window.GM = {};
GM.HelpLayer = HelpLayer;