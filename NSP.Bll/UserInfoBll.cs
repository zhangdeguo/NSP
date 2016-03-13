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

        /// <summary>
        /// 根据userId获取该用户系统权限
        /// </summary>
        /// <param name="userId">用户Id</param>
        /// <returns>系统权限集合</returns>
        public List<ViewUserPower> GetUserPowerByUserId(int userId)
        {
            using(var dc=EFContextHelper.CreateEFContext())
            {
                var result = from a in dc.ViewUserPower
                             where a.UserId == userId
                             select a;
                return result.ToList();
            }
        }
    }
}
