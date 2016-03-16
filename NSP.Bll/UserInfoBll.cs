using NSP.Dal;
using NSP.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSP.Bll
{
    public class UserInfoBll : BllBase<UserInfoBll>
    {
        public List<UserInfo> GetUserList()
        {
            using (var dc = EFContextHelper.CreateEFContext())
            {
                var result = from a in dc.UserInfo
                             select a;
                return result.ToList();
            }
        }

        public UserInfo GetUserInfoByUserName(string userName) 
        {
            using (var dc = EFContextHelper.CreateEFContext())
            {
                var result = from a in dc.UserInfo
                             select a;

                if (result.Any(m => m.UserName == userName))
                {
                    return result.FirstOrDefault(m => m.UserName==userName);
                }
                else 
                {
                    return null;
                }
            }
        }

        #region 登录
        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="userName">用户名</param>
        /// <param name="password">密码</param>
        /// <param name="userInfo">用户尸体</param>
        /// <returns>成功;1  失败：0  不存在：-1</returns>
        public string UserLogin(string userName, string password, out  UserInfo userInfo)
        {
          
            string retValue = "";
            userInfo = GetUserInfoByUserName(userName);
            if (userInfo != null)
            {
                retValue = string.Equals(password, userInfo.PassWord) ? "1" : "0";
            }
            else
            {
                retValue = "-1";
            }
            return retValue;
        }

        #endregion  
    }
}
