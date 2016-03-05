var Valid = {
    isValidRegion: function (regionID, msg) {
        var region = $("#" + regionID);
        if (region.hasClass("easyui-validatebox")) return $("#" + regionID).validatebox("isValid");
        else {
            var regionChildren = region.find(".easyui-validatebox");
            for (var i = 0; i < regionChildren.size() ; i++) {
                if ($("#" + $(regionChildren[i]).attr("id")).validatebox("isValid") == false) {
                    $("#" + $(regionChildren[i]).attr("id")).focus();
                    if (msg)
                        GM.WindowsUtility.showMessage(msg, "w");
                    return false;
                }
            }
            return true;
        }
    }
};
if (window.GM == undefined)
    window.GM = {};
GM.Valid = Valid;