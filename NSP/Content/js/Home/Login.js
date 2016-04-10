var LoginModel = {
    text_LoginName: null,
    text_LoginPwd: null,
    p_errorMessage: null,
    button_LoginSubmit: null,
    hidden_IsRememberPwd: null,
    checkbox_RememberPwd:null,
    messageShow: function (messagestr) {
        $.messager.alert("系统提示", messagestr, "info");
    },
    InitData: function () {
        this.text_LoginName = $("#text_LoginName");
        this.text_LoginPwd = $("#text_LoginPwd");
        this.p_errorMessage = $("#p_errorMessage");
        this.button_LoginSubmit = $("#button_LoginSubmit");
        this.hidden_IsRememberPwd = $("#hidden_IsRememberPwd");
        this.checkbox_RememberPwd = $("#checkbox_RememberPwd");
        this.hidden_IsRememberPwd.val("true");
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
        if ($.trim(this.text_LoginName.val()) === "" || $.trim(this.text_LoginPwd.val()) === "") {
            this.p_errorMessage.html("请填写用户名和密码！");
        } else {
            this.p_errorMessage.html("");
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
    },

    GetIsRememberPwd: function() {
        if (this.checkbox_RememberPwd.attr("checked")) {
            this.hidden_IsRememberPwd.val("true");
        } else {
            this.hidden_IsRememberPwd.val("false");
        }
    }
};

$(document).ready(function () {
    LoginModel.InitData();
    LoginModel.button_LoginSubmit.click(function () {
        GM.UIHelper.waiting(LoginModel.login());

    });
    LoginModel.checkbox_RememberPwd.click(function () {
        GM.UIHelper.waiting(LoginModel.GetIsRememberPwd());
    });
    //回车事件绑定
    LoginModel.text_LoginPwd.bind('keypress', function (event) {
        if (event.keyCode == "13") {
            GM.UIHelper.waiting(LoginModel.login());
        }
    });
});
 //禁止后退
history.forward();
