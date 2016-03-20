using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NSP.Controllers
{
    public class BaseController : Controller
    {
      
        protected override void OnException(ExceptionContext filterContext)
        {
            if (filterContext.ExceptionHandled == true)
            {
                HttpException httpExce = filterContext.Exception as HttpException;
                if (httpExce.GetHttpCode() != 500)//为什么要特别强调500 因为MVC处理HttpException的时候，如果为500 则会自动
                    //将其ExceptionHandled设置为true，那么我们就无法捕获异常
                {
                    return;
                }
            }
            Redirect("~/Views/Shared/Error.cshtml");
            //filterContext.HttpContext.Response.Redirect(" ");

            //写入日志 记录
            filterContext.ExceptionHandled = true;//设置异常已经处理

        }

	}
}