var LogoutModel = {
    Logout: function() {
        window.location.href  = "/Home/Logout";
    }
};


$(document).ready(function () {
    $("#btnlogout").click(function () {
        LogoutModel.Logout();

    });
});
history.forward();