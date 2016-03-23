using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using NSP.Model;

namespace NSP.VerifyManager
{
    public class BaseController : Controller
    {

        #region 方法
 

        #endregion

        #region 页面基础属性
        /// <summary>
        /// 当前登录用户
        /// </summary>
        public UserInfo CurrentUser { get; set; }

        
        #endregion
    }
}
