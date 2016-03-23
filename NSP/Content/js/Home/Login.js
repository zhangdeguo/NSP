var LoginModel = {

    messageShow: function (messagestr) {
        $.messager.alert("系统提示", messagestr, "info");
    }, 
    login: function () {
        //GM.Core.CheckAcAuthvdoPostAction("Home/Login", $("#login").serialize(), function (result) {
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
        if ($.trim($("#text_LoginName").val()) === "" || $.trim($("#text_LoginPwd").val()) === "") {
            //alert($("#text_LoginName").val())
            $("#p_errorMessage").html("请填写用户名和密码！");
        } else {
            $("#p_errorMessage").html("");
            $.ajax({
                type: "POST",
                url: "/Home/Login",
                data: $("#login").serialize(),
                error: function (request) {
                    LoginModel.messageShow("服务器发生错误" + request.toString());
                },
                success: function (data) {
                    if (data.Result == "0") {
                        LoginModel.messageShow("密码错误！");
                    }
                    else if (data.Result == "1") {
                        window.location.href = data.ReturnUrl;
                    }
                    else if (data.Result == "-1") {
                        LoginModel.messageShow("用户不存在！");
                    } else {
                        LoginModel.messageShow("登录失败, 请联系您的管理员！");
                    }
                }
            });

           
        }
       

    }
    
};

$(document).ready(function () {
    $("#button_LoginSubmit").click(function () {
        LoginModel.login();
        
    });  
});
