using NSP.Bll;
using NSP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using NSP.Models;

namespace NSP.Controllers
{
    public class HomeController : BaseController
    {
        public ActionResult Index(int userId)
        {
            ViewBag.UserPowers = new UserInfoBll().GetUserPowerByUserId(userId);
            return View();
        }

        public ActionResult Login()
        {

            return View();

        }

        [HttpPost]
        public ActionResult Login(UserInfo userinfo)
        {
            //string strmd5 = FormsAuthentication.HashPasswordForStoringInConfigFile(passWord, "md5"); //口令
            var user = new UserInfo();
            //if (user != null)
            //{

            //}
            //throw  new Exception("sds");
            return Json(new { Result = new UserInfoBll().UserLogin(userinfo.UserName, userinfo.PassWord, out user), UserInfo = user });

            //http://www.cnblogs.com/fish-li/archive/2012/04/15/2450571.html
            //http://www.cnblogs.com/ylbtech/archive/2012/08/29/2660799.html
            //http://www.cnblogs.com/bomo/p/3309766.html
        }

        public JsonResult GetUserPowers(int userId)
        {
            List<Model.ViewUserPower> powers = new UserInfoBll().GetUserPowerByUserId(userId);
            return Json(powers);
        }
    }
}