﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using NSP.Bll;
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
        public UserInfo CurrentUser
        {

            get
            {
                if (Session["UserId"] != null)
                {
                     int userid=  int.Parse(Session["UserId"].ToString());
                    
                    return  UserInfoBll.Instance.GetUserInfoByUserID(userid);
                }
                else
                {
                    return null;
                }

            }
        }



        #endregion
    }
}
