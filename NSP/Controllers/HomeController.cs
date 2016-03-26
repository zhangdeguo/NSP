using NSP.Bll;
using NSP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using NSP.Models;
using NSP.VerifyManager;

namespace NSP.Controllers
{
    public class HomeController : BaseController
    {
        [VaildateLoginRoleAttribute]
        public ActionResult Index()
        {
            ViewData["CurrentUser"] = CurrentUser;
            return View();
        }

        /// <summary>
        /// 登录View
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Login()
        {
            ViewData["ReturnUrl"] = String.Empty;
            //如果是跳转过来的，则返回上一页面ReturnUrl
            if (!string.IsNullOrEmpty(Request["ReturnUrl"]))
            {
                string returnUrl = Request["ReturnUrl"];
                ViewData["ReturnUrl"] = returnUrl;  //如果存在返回，则存在隐藏标签中
            }
            // 若选择自动登录
            if (Session["IsRemember"] != null)
            {
                return RedirectToAction("Index");
            }
            else
            {
                return View();
            }
        }

        /// <summary>
        /// 登录方法
        /// </summary>
        /// <param name="userinfo"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult Login(UserInfoViewModel userinfo)
        {
            string result = String.Empty;
            string returnUrl = String.Empty;
            if (userinfo != null)
            {

                var user = new UserInfo();
                result = UserInfoBll.Instance.UserLogin(userinfo.UserName, userinfo.PassWord, out user);
                if (user != null && result == "1")
                {
                    //创建身份验证票据
                    FormsAuthentication.SetAuthCookie(user.UserName, false);
                    //判断是否自动登录
                    if (userinfo.IsRemember)
                    {
                        Session["IsRemember"] = true;
                    }
                    Session["UserId"] = user.UserId;
                    //如果是跳转过来的，则返回上一页面ReturnUrl
                    returnUrl = userinfo.ReturnUrl.Trim().Length >1 ? userinfo.ReturnUrl : "/Home/Index";
                }

            }
            return Json(new { Result = result, ReturnUrl = returnUrl });

        }

        /// <summary>
        /// 退出
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Logout()
        {
            //取消Session会话
            Session.Abandon();

            //删除Forms验证票证
            FormsAuthentication.SignOut();

            return RedirectToAction("Login");
        }




    }
}