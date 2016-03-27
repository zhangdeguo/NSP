var LogoutModel = {
    Logout: function() {
        window.location.href  = "Logout";
    }
};


$(document).ready(function () {
    $("#btnlogout").click(function () {
        LogoutModel.Logout();

    });
});
history.forward();