using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NSP.Models
{
    /// <summary>
    /// 登录ViewModel
    /// </summary>
    public class UserInfoViewModel
    {   
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 密码
        /// </summary>
        public string PassWord { get; set; }
        /// <summary>
        /// 登录后跳转URL
        /// </summary>
        public string ReturnUrl { get; set; }
        /// <summary>
        /// 是否自动登录
        /// </summary>
        public bool IsRemember { get; set; }
    }
}