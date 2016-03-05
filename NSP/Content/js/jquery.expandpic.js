var expandPicI = 0;
(function ($) {
    $.fn.expandpic = function (options) {
        var opts = $.extend({
            width: 440,
            height: 300,
            autoSize: true,
            erorrSrc: "/Content/css/icons/errorImg.jpg",
            isBody: true, //放大在body中
            src: null,
            isSave:null
        }, options);
        expandPicI++;
        var simg = $(this);
        var container = simg.parent();
        if (opts.isBody)
            container = $("<div id='expandPicPanel" + expandPicI + "' class='expandPicPanel'></div>").appendTo($("body"));
        var imgSrc = opts.src == null ? simg.attr("src") : opts.src;
        var Id = opts.Id == null ? simg.attr("rowID") : opts.Id;
        var isSave = opts.isSave;
        if (imgSrc == null)
            return;
        var img = new Image();
        img.src = imgSrc;
        img.Id = Id;
        img.isSave = opts.isSave;
        var Angle = parseInt(simg.attr("Angle"));
        img.Angle = 0;
        img.param = Angle;
        if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
            show(simg, img, container, opts);
            return; // 直接返回，不用再处理onload事件
        }
        container.css("position", "relative").append("<div class=\"W_loading upImgLoding\"><span></span></div>");
        img.onload = function () { //图片下载完毕时异步调用doShow函数。 
            show(simg, img, container, opts);
            img.onload = null;
        }
        
    }
    
    function show(sm, img, container, opts) {
        if (opts.autoSize) {
            opts.width = img.width;
            opts.height = img.height;
        }
        var bimgPanel = $("<div class='bimgPanel'></div>").appendTo(container);
        //bimgPanel.width($(window).width());
        //bimgPanel.height($(window).height());
        var bimg = $("<img class=\"expandBImg\" onerror=\"this.src='" + opts.erorrSrc + "'\" src='" + img.src + "?r=" + img.param + "' mwidth=\"" + opts.width + "\" mheight=\"" + opts.height + "\"  />").appendTo(bimgPanel);
        var htmlStr = "<div class=\"expandBtns\"><p><a class=\"UpPicLeft\" href=\"###\">向左转 </a><span class=\"web_line_l\">| </span><a class=\"UpPicRight\" href=\"###\">向右转 </a><span class=\"web_line_l\">| </span><a target=\"_blank\" href=\"###\" class=\"UpPicLook\">查看原图</a><span class=\"web_line_l\"> |</span><a class=\"UpPicCut\" href=\"###\">关闭 </a><span class=\"web_line_l\">";
        if (img.isSave)
        {
            htmlStr = htmlStr+"|<a class=\"SavePic\" href=\"###\">保存 </a> </span></p></div>";
        }
        var expandpanel = $(htmlStr).appendTo(container);
        var Angle = img.Angle;
        if (Angle == 90)
        {
            $.fn.expandpic.Rotate("cw", bimg, opts);
        }
        if (Angle == 180) {
            $.fn.expandpic.Rotate("cw", bimg, opts);
            $.fn.expandpic.Rotate("cw", bimg, opts);
        }
        if (Angle == 270) {
            $.fn.expandpic.Rotate("cw", bimg, opts);
            $.fn.expandpic.Rotate("cw", bimg, opts);
            $.fn.expandpic.Rotate("cw", bimg, opts);
        }
        expandpanel.find(".UpPicLook").attr("href", img.src);
        expandpanel.find(".UpPicCut").click(function () { container.remove(); });
        expandpanel.find(".UpPicLeft").click(function () { $.fn.expandpic.Rotate("ccw", bimg, opts); Angle=(Angle <= 0 ? 360 : Angle) - 90 });
        expandpanel.find(".UpPicRight").click(function () { $.fn.expandpic.Rotate("cw", bimg, opts); Angle=(Angle >= 360 ? 0 : Angle) + 90 });
        expandpanel.find(".SavePic").click(function () {
            if (Angle<0)
            {
                Angle = 0;
            }
            if (Angle >=360) {
                Angle = 0;
            }
            var formobj = {};
            formobj.imgUrl = img.src;
            formobj.Angle = Angle;
            formobj.Id = img.Id;
            GM.Core.doPostAction("Attach.Attachment.RotateImg", formobj, function (json) {
                if (GM.Core.checkBizResult(json, GM.WindowsUtility.showBizError)) {
                    if (json.data > 0) {
                        
                        container.remove();
                        imgRe(Angle);
                    }
                }
            });
        });
    }
    $.fn.expandpic.Rotate = function (p, imgP, opts) {
        var $img = imgP;
        var n = $img.attr('step');
        if (n == null) n = 0;
        if (p == 'cw') {
            (n == 3) ? n = 0 : n++;
        } else if (p == 'ccw') {
            (n == 0) ? n = 3 : n--;
        }
        $img.attr('step', n);
        var cwidth = opts.width;
        var cheight = opts.width;
        if (n % 2 == 0) {
            cwidth = $img.attr("mwidth") > opts.width ? opts.width : $img.attr("mwidth");
            cheight = parseInt($img.attr("mheight") / $img.attr("mwidth") * cwidth);
        } else {
            cwidth = $img.attr("mheight") > opts.width ? opts.width : $img.attr("height");
            cheight = parseInt($img.attr("mwidth") / $img.attr("mheight") * cwidth);
        }
        //MSIE
        if (!$.support.leadingWhitespace) {
            var mwidth = $img.attr("mwidth");
            var mheight = $img.attr("mheight");
            var strFilter = "";
            switch (n) {
                default:
                case 0:
                    strFilter = "progid:DXImageTransform.Microsoft.Matrix(M11=1,M12=0,M21=0,M22=1,SizingMethod='auto expand')";
                    break;
                case 1:
                    strFilter = "progid:DXImageTransform.Microsoft.Matrix(M11=-1.8369701987210297e-16,M12=1,M21=-1,M22=-1.8369701987210297e-16,SizingMethod='auto expand')";
                    break;
                case 2:
                    strFilter = "progid:DXImageTransform.Microsoft.Matrix(M11=-1,M12=-1.2246467991473532e-16,M21=1.2246467991473532e-16,M22=-1,SizingMethod='auto expand')";
                    break;
                case 3:
                    strFilter = "progid:DXImageTransform.Microsoft.Matrix(M11=6.123233995736766e-17,M12=-1,M21=1,M22=6.123233995736766e-17,SizingMethod='auto expand')";
                    break;
            }
            //strFilter="progid:DXImageTransform.Microsoft.BasicImage(rotation=" + n + ");";
            $img.parent().css("text-align", "left");
            $img.css({
                'filter': strFilter,
                '-ms-filter': strFilter, "margin-left": (opts.width - cwidth) / 2 + "px"
            });
            //$img.parent().css({ "width": "440px", "height": cheight + "px" });
            //if (n % 2 == 1) {
            //    $img.attr("height", cwidth).attr("width", cheight);
            //} else {
            //    $img.attr("height", mheight).attr("width", mwidth);
            //}
            $img.attr("mwidth", mwidth).attr("mheight", mheight);
            //MSIE 8.0
            //if($.browser.version == 8.0){
            //					if(!$img.parent('div').hasClass('wrapImg')){
            //						$img.wrap('<div class="wrapImg"></div>');
            //					}
            //					$img.parent('div.wrapImg').height($img.height());
            //				}
            //DOM
        } else {
            if (!$img.siblings('canvas').hasClass('imgCanvas')) {
                $img.css({ 'position': 'absolute', 'visibility': 'hidden' }).after('<canvas class="imgCanvas"></canvas>');
            }
            var c = $img.siblings('canvas.imgCanvas')[0], img = $img[0];
            var canvasContext = c.getContext('2d');
            switch (n) {
                default:
                case 0:
                    c.setAttribute('width', img.width);
                    c.setAttribute('height', img.height);
                    canvasContext.rotate(0 * Math.PI / 180);
                    canvasContext.drawImage(img, 0, 0);
                    break;
                case 1:
                    c.setAttribute('width', img.height);
                    c.setAttribute('height', img.width);
                    canvasContext.rotate(90 * Math.PI / 180);
                    canvasContext.drawImage(img, 0, -img.height);
                    break;
                case 2:
                    c.setAttribute('width', img.width);
                    c.setAttribute('height', img.height);
                    canvasContext.rotate(180 * Math.PI / 180);
                    canvasContext.drawImage(img, -img.width, -img.height);
                    break;
                case 3:
                    c.setAttribute('width', img.height);
                    c.setAttribute('height', img.width);
                    canvasContext.rotate(270 * Math.PI / 180);
                    canvasContext.drawImage(img, -img.width, 0);
                    break;
            };
            //c.style.width = cwidth + "px";
        }
    }
    $.imgOnError = function (img) {
        var imgErrorPic = "/Content/css/icons/errorImg.jpg";
        if (img.src && img.src.indexOf(imgErrorPic) >= 0) {
            return;
        }
        img.src = imgErrorPic;
    }
})(jQuery);
