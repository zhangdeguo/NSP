var LoginModel = {
    login: function () {

        //GM.Core.doPostAction("Home/Login", $("#login").serialize(), function (result) {
        //    if (result.Result == "0") {
        //        alert(result.Result);
        //        }
        //    else if (result.Result == "1") {
        //            window.location.href = "Home/Index";
        //        }
        //        else {
        //        alert(result.Result);
        //        }
        //});
        $.ajax({
            type: "POST",
            url: "/Home/Login",
            data: $("#login").serialize(),
            error: function (request) {
                // alert(request);
            },
            success: function (data) {
                if (data.Result == "0") {
                    alert(data.Result);
                }
                else if (data.Result == "1") {
                    window.location.href = "/Home/Index?userId=" + data.UserInfo.UserId;
                }
                else {
                    alert(data.Result);
                }
            }
        });

    }
};

$(document).ready(function () {
    $("#button_LoginSubmit").click(function () {
        LoginModel.login();
    });
});