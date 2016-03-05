
//filter 这个是过滤集合 从上到下 从左到右 
//elms 需要过滤的元素集合 ；
//filterAttr doms 上面的过滤属性 值是多少
//filterName  过滤名字 例如 是 ID  还是 Sid

// stationList  服务站集合
//filter: [doms, filterName,filterAttr]

// 根据 hash 匹配找到行，其实也就是一个索引的关系

/*
hashMaps //暂时只能支持2个哈希表， 因为如果hash表够多的话 那么他的性能可能会受到影响， 你遍历hash表 也是需要时间的 该表在服务器段生成

单个hash 表的表结构 
filterId  根据id过滤 id 的值多少 存放的是过滤的id值
filterIdName  根据哪个列过滤的 名字 如果是根据id 来的那么就是 "id"  如果根据 服务站id 来的那么就是 "CSid" 
hashMap  哈希映射出来的关系表  存放的是下表 例如 0,1,2,3  这种
*/
//var o = {
//    stationList: [],
//    Map: Map,
//    stationAppendLeftDom:stationAppendLeftDom,
//    OnThisClass,OnThisClass
//};

function stationMapInit(o) {

    //地图对象
    this.Map = o.Map;

    this.OuterRight=o.OuterRight || "";
    
    this.OuterLeft=o.OuterLeft||"";
    
    this.OnThisClass=o.OnThisClass;

    //生成过滤之后合作服战html代码 ；需要append给他的dom元素; JQ
    this.stationAppendLeftDom = o.stationAppendLeftDom;
    
    this.Domlis=this.stationAppendLeftDom.children();

    // 当前服务站的下标值 ? 这里应该设置为当前被选中的这个dom对象
    this.currStationElm = this.stationAppendLeftDom.children().eq(0);

    //上一个下标值   ? 这里应该设置为当前被选中的这个dom对象
    this.prevStationElm = null;

    // 服务站列表
    this.stationList = o.stationList;


    //地图标记， 与服务站地图相对应 数量和下表都是一一对应   
    this.baiduObject = [];

    // 百度坐标点 
    this.baiduPoints = [];

    //信息框
    this.baiduImfoWindow = [];

    this.__p=this.stationList.split("|");
    
    this.length =this.__p.length || 0;

    var i = 0, _h = 0;

    for (; i < this.length; i++) {
        var __arr=this.__p[i].split(",");
        
        var point = new BMap.Point( __arr[0], __arr[1]);

        this.baiduPoints.push(point);
    }
    i = 0;
    
    this.initMapBaner();
    
    this.Map.addControl(new BMap.NavigationControl());
        
    this.Map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT }));
        
    this.Map.enableScrollWheelZoom();
        
    this.Map.setZoom(11);
    
    //如果直接传进来的是当前服务站的下表那么就覆盖上面的下标
    //    if (o.currViewIDs instanceof Array) {
    //        this.currViewMap = o.currViewIDs;
    //    }
}
stationMapInit.prototype = {
    initMapBaner: function () {

        //设置地图中心
        this.SetMapViewCenter();
        
        
        //重新生成a标签
        this.RecreateMarker();

        //初始化dom元素鼠标上移事件
        this.initDomMouseOverEvent();
    },
    //重新
    RecreateMarker: function () {

        //清楚覆盖物
        this.Map.clearOverlays();

        var n = 0;
        for (; n < this.baiduPoints.length; n++) {

            var  p = this.baiduPoints[n];

            var marker = new CopStaOverlay(p);

            this.baiduObject.push(marker);

            this.Map.addOverlay(marker);

            this.BindMarkerEvent(marker, p, n);
            // 如果 showAll ==1 那么这里必须将所有的marker 都设置成灰色
        }
    },
    // 创建一个信息框
    CreateInfoWindow: function (n) {
        var size = new BMap.Size(0, -31);
        var html = (this.OuterLeft?this.OuterLeft:"") +  (this.Domlis.eq(n).html())  + (this.OuterRight?this.OuterRight:"");
        return new BMap.InfoWindow(html, { offset: size });
    }
    ,
    // 点击覆盖物打开信息框
    BindMarkerEvent: function (marker, point, index) {
        var iw = this.CreateInfoWindow(index);
        //this.baiduImfoWindow.push(iw);
        var that = this;
        this.BindInfoWindow(iw,marker);
        marker.addEventListener('click', function () {
            that.Map.openInfoWindow(iw, point);
        });
    },
    //对信息窗绑定事件 打开和关闭的事件
    BindInfoWindow: function (iw, marker) {
        var that = this;
        iw.addEventListener('open', function () {
            // 这里就是选中将当前的这个服务站标记为 选中 清除上一次的选中状态
            // that.currStationElm.sttr("calss", "selected");
            //that.prevStationElm.sttr("calss", "");
            marker.setStyle("selected"); // alert("open")
            marker._isOpen = true;
        });
        iw.addEventListener('close', function () {
            //alert("close")
            marker.setStyle();
            marker._isOpen = false;
        });
    }
    , SetMapViewCenter: function () {
        var viewport = this.Map.getViewport(this.baiduPoints);
        
        this.Map.setViewport(viewport);
    }
    ,
    initDomMouseOverEvent: function () {
        var lis = this.Domlis;
        var that = this;
        var map=this.Map;
        //window.nnn=0;
        lis.mouseenter(function (e) {
            
            if(that.Timer){
                clearTimeout(that.Timer);
            }
            if(e.stopPropagation)
                e.stopPropagation();
            else{
                //e.cancleBuble =true;
                 e.returnValue =false;
            }    
            var selfDom=this;
            that.Timer= setTimeout(function(){
                if (that.currStationElm != null) {
                    that.currStationElm.removeClass(that.OnThisClass);
                }
                that.prevStationElm = that.currStationElm;
                
                that.currStationElm= $(selfDom).addClass(that.OnThisClass);
                
               // that.currStationElm  =  $(this);
                //var currMapID = $(this).attr("data-map");
                var currMapID=lis.index($(selfDom));
                if (!that.baiduObject[currMapID]._isOpen) {
                   
                   //var p = that.baiduPoints[currMapID];
                   //that.Map.openInfoWindow(that.baiduImfoWindow[currMapID], p); 
                   
                   var __arr=that.__p[currMapID].split(",");
                   var point = new BMap.Point(__arr[0], __arr[1]); 
                   var iw = that.CreateInfoWindow(currMapID);
                   
                   map.openInfoWindow(iw, point); 
                   
                   //var ss= setTimeout(function(){ 
                   //that.Map.openInfoWindow(iw, point); 
                   //},10);        
                }
            },200);
        });
    }
    ,
    relase:function(){
       this.Map.clearOverlays();
//       for(var n =0 ; n<this.length; n++){
//            this.baiduObject[n].removeEventListener("click");
//            this.baiduObject[n]=null;
//       }
//       for(var n=0; n<this.length; n++){
//            this.baiduPoints[n]=null;
//       }
//       this.baiduPoints=null;
//       this.baiduObject=null;
    }

};

//合作服务站覆盖物
function CopStaOverlay(point) {
    this._point = point; //覆盖物经纬度坐标

    this._isOpen = false; //信息窗打开状态
}

CopStaOverlay.prototype = new BMap.Overlay();

//重写初始化函数
CopStaOverlay.prototype.initialize = function (map) {
    this._map = map;

    //覆盖物主体div      
    var div = this._div = document.createElement("div");
    //设置div静态样式
    div.className = "copStaOverlay";
    //设置div动态样式
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    this.originzIndex = BMap.Overlay.getZIndex(this._point.lat);

    var that = this;

    div.onmouseover = function () {
    }

    div.onmouseout = function () {
    }

    map.getPanes().labelPane.appendChild(div);

    return div;
}
//设置选入样式 蓝色
CopStaOverlay.prototype.setInStyle = function () {
    this._div.className = "copStaOverlayIn";
    this._div.style.zIndex = "10000000";
}
//设置普通样式  橙色
CopStaOverlay.prototype.setNormalStyle = function () {
    this._div.className = "copStaOverlay";
    this._div.style.zIndex = this.originzIndex;
}
//设置选出样式 灰色
CopStaOverlay.prototype.setOutStyle = function () {
    this._div.className = "copStaOverlayOut";
    this._div.style.zIndex = "-10000000";
}
//设置普通样式  橙色
CopStaOverlay.prototype.setGreenStyle = function () {
    this._div.className = "copStaOverlayGreen";
    this._div.style.zIndex = "-1000000000";
}
//
CopStaOverlay.prototype.setDisplayNone = function () {
    this._div.style.display = "none";
}
//
CopStaOverlay.prototype.setDisplayBlock = function () {
    this._div.style.display = "block";
}
//根据传入字符串设置样式
CopStaOverlay.prototype.setStyle = function (status) {
    switch (status) {
        case "selected":
            this.setInStyle();
            break;
        case "unselected":
            this.setOutStyle();
            break;
        default:
            this.setNormalStyle();
            break;
    }
}
//重写绘制函数
CopStaOverlay.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - 10 + "px";
    //这里的30为Magic Number注意！
    this._div.style.top = pixel.y - 31 + "px";
}
//增加事件函数
CopStaOverlay.prototype.addEventListener = function (event, fun) {
    this._div['on' + event] = fun;
}
CopStaOverlay.prototype.removeEventListener = function (event) {
    this._div['on' + event] = null;
}


