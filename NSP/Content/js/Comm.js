if (window.GM == undefined)
    window.GM = {};

GM.setCurSearchParams = function (obj) {
    $("#curSearchParams").val(Tools.O2String(obj));
};
GM.getCurSearchParams= function () {
    return eval("(" + $("#curSearchParams").val() + ")");
};
GM.setCurCommSearchParams = function (obj) {
    $("#curCommSearchParams").val(Tools.O2String(obj));
};
GM.getCurCommSearchParams = function () {
    return eval("(" + $("#curCommSearchParams").val() + ")");
};




    

    
    