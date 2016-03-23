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

            // 如果是登录状态，则条转到个人主页
            if (Session["Username"] != null)
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
            string returnUrl=String.Empty;
            if (userinfo == null)
            {

            }
            else
            {
                var user = new UserInfo();
                result = new UserInfoBll().UserLogin(userinfo.UserName, userinfo.PassWord, out user);
                if (user != null)
                {
                    this.CurrentUser = user;

                    //创建身份验证票证，即转换为“已登录状态”
                    FormsAuthentication.SetAuthCookie(user.UserName, false);
                    //存入Session
                    Session["Username"] = user.UserName;

                    ////如果是跳转过来的，则返回上一页面ReturnUrl
                    if (userinfo.ReturnUrl.Trim().Length != 0)
                    {
                        returnUrl =userinfo.ReturnUrl;
                    }
                    else
                    {
                        returnUrl = "Home/Index";
                    }
                }

                /*登出
                  [HttpGet]
         public ActionResult Logout()
         {
             //取消Session会话
             Session.Abandon();
 
             //删除Forms验证票证
             FormsAuthentication.SignOut();
 
             return RedirectToAction("Index", "Home");
         }
                 */



            }
            return Json(new { Result = result, ReturnUrl = returnUrl });

        }

    }
}