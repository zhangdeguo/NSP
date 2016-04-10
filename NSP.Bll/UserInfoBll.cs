using NSP.Dal;
using NSP.Model;
using NSP.Model.Public;
using System;
using System.Collections.Generic;
using System.Linq;

namespace NSP.Bll
{
    public class UserInfoBll : BllBase<UserInfoBll>
    {
        /// <summary>
        /// 添加用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public int AddUser(UserInfo user)
        {
            int result = 0;
            using (var dc = EFContextHelper.CreateEFContext())
            {
                var model = dc.UserInfo.FirstOrDefault(m => m.UserName == user.UserName && m.IsDelete == 0);
                if (model != null)
                {
                    result = -2;
                }
                else
                {
                    dc.UserInfo.Add(user);
                    result = dc.SaveChanges();
                }
            }
            return result;
        }

        /// <summary>
        /// 修改用户
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public int UpdateUser(UserInfo user)
        {
            int result = 0;
            using (var dc = EFContextHelper.CreateEFContext())
            {
                var model = dc.UserInfo.FirstOrDefault(m => m.UserId == user.UserId);
                if(model.UserName!=user.UserName)
                {
                    var validmodel = dc.UserInfo.FirstOrDefault(m => m.UserName == user.UserName && m.IsDelete == 0);
                    if (validmodel != null)
                        return -2;
                }
                if (model != null)
                {
                    model.DeptId = user.DeptId;
                    model.Description = user.Description;
                    model.Email = user.Email;
                    model.LastModifyTime = DateTime.Now;
                    model.PassWord = user.PassWord;
                    model.PhoneNo = user.PhoneNo;
                    model.RealName = user.RealName;
                    model.UserName = user.UserName;
                    model.UserType = user.UserType;
                    result = dc.SaveChanges();
                }
            }
            return result;
        }

        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public int DeleteUser(int userId)
        {
            int result = 0;
            using (var dc = EFContextHelper.CreateEFContext())
            {
                var model = dc.UserInfo.FirstOrDefault(m => m.UserId == userId);
                if (model != null)
                {
                    model.IsDelete = 1;
                    result = dc.SaveChanges();
                }
            }
            return result;
        }

        /// <summary>
        /// 获取用户
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public ViewUserInfo GetUser(int userId)
        {
            using(var dc=EFContextHelper.CreateEFContext())
            {
                var user = dc.ViewUserInfo.FirstOrDefault(m => m.UserId == userId);
                return user;
            }
        }

        /// <summary>
        /// 用户信息查询
        /// </summary>
        /// <param name="searchModel"></param>
        /// <param name="pageInfo"></param>
        /// <param name="totalCount"></param>
        /// <returns></returns>
        public List<ViewUserInfo> Search(UserInfo searchModel, PageInfo pageInfo, out int totalCount)
        {
            List<ViewUserInfo> list = new List<ViewUserInfo>();
            using (var dc = EFContextHelper.CreateEFContext())
            {
                var result = from a in dc.ViewUserInfo select a;

                if (searchModel.DeptId > 0)
                    result = result.Where(m => m.DeptId == searchModel.DeptId);

                if (!String.IsNullOrEmpty(searchModel.RealName))
                    result = result.Where(m => m.RealName.Contains(searchModel.RealName));

                if (!String.IsNullOrEmpty(searchModel.UserName))
                    result = result.Where(m => m.UserName.Contains(searchModel.UserName));

                list = result.OrderBy(m => m.Sort).ToList();
            }

            totalCount = list.Count();
            return list.Skip((pageInfo.PageIndex - 1) * pageInfo.PageSize).Take(pageInfo.PageSize).ToList();
        }

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
                    return result.FirstOrDefault(m => m.UserName == userName);
                }
                else
                {
                    return null;
                }
            }
        }

        public UserInfo GetUserInfoByUserID(int userId)
        {

            using (var data = EFContextHelper.CreateEFContext())
            {
                var user = from a in data.UserInfo
                           select a;
                return user.Any(m => m.UserId == userId) ? user.FirstOrDefault(m => m.UserId == userId) : null;
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

        /// <summary>
        /// 根据userId获取该用户系统权限
        /// </summary>
        /// <param name="userId">用户Id</param>
        /// <returns>系统权限集合</returns>
        public List<ViewUserPower> GetUserPowerByUserId(int userId)
        {
            using (var dc = EFContextHelper.CreateEFContext())
            {
                var result = from a in dc.ViewUserPower
                             where a.UserId == userId
                             select a;
                return result.ToList();
            }
        }
    }
}
