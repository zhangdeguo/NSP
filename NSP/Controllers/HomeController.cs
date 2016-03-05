using NSP.Bll;
using NSP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NSP.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Login() 
        {
            return View();
        }

        public string Login1(string userName,string passWord) 
        {
            string strMsg = "";
            UserInfo userInfo = new UserInfoBll().GetUserInfoByUserName(userName);
            if (userInfo == null)
            {
                strMsg="不存在此用户";
            }
            else 
            {
                if (userInfo.PassWord != passWord)
                {
                    strMsg="密码不正确";
                }
                else 
                {
                    strMsg = "success";
                }
            }
            return strMsg;
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}