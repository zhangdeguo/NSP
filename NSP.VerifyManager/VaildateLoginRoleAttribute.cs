using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;

namespace NSP.VerifyManager
{
    /// <summary>
    /// 登录验证
    /// </summary>
    public class VaildateLoginRoleAttribute : AuthorizeAttribute
    {   
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
         
           filterContext.Result = new RedirectResult("Login?ReturnUrl=" + filterContext.HttpContext.Server.UrlEncode(filterContext.HttpContext.Request.Url.AbsoluteUri));
            
        }  
    }

}
