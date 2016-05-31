using NSP.Bll;
using NSP.Common;
using NSP.Common.Utility;
using NSP.Model;
using NSP.Model.Extend;
using NSP.Model.Public;
using NSP.VerifyManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NSP.Controllers.User
{
    public class UserController : NSPBaseController
    {
        //
        // GET: /User/
        public ActionResult Index()
        {
            return View();
        }

        public string GetUserGroupList(string json)
        {
            var searchModel = JsonUtility.GetObjectFromJson<UserGroupSearchModel>(json);
            var pageInfo = new PageInfo() { PageIndex = Convert.ToInt32(Request["page"]), PageSize = Convert.ToInt32(Request["rows"]) };
            int totalCount = 0;
            var list = UserInfoBll.Instance.SearchUserGroupList(searchModel, pageInfo, out totalCount);
            var jsonResponse = new ListResponse() { rows = list, total = totalCount };
            //return Json(jsonResponse);
            return JsonUtility.ToJson(jsonResponse);
        }

        public ActionResult GetUserGroupListView()
        {
            return View("UserGroupListView");
        }

        public ActionResult EditUserGroup()
        {
            return View("EditUserGroup");
        }

        public ActionResult SetGroupPower() 
        {
            return View("SetGroupPower");
        }
        public JsonResult GetUserGroup(int GroupId)
        {
            var model = UserInfoBll.Instance.GetUserGroupById(GroupId);
            return ToJson(model);
        }

        //添加用户/编辑用户
        [HttpPost]
        public JsonResult AddUserGroup(string json)
        {
            UserGroup model = JsonUtility.GetObjectFromJson<UserGroup>(json);
            model.CreateTime = DateTime.Now;
            model.LastEditTime = DateTime.Now;
            model.CreateUserName = CurrentUser.UserName;
            model.LastEditUser = CurrentUser.UserName;
            int num = UserInfoBll.Instance.AddUserGroup(model);
            var restResponse = new RestResponse() { Result = 1 };
            if (num > 0)
            {
                restResponse = new RestResponse() { Result = 1 };
            }
            else if (num == -2)
            {
                restResponse = new RestResponse() { Result = -2 };
            }
            else
            {
                restResponse = new RestResponse() { Result = -1 };
            }
            return ToJson(restResponse);
        }


        //编辑用户
        [HttpPost]
        public JsonResult EditUserGroup(string json)
        {
            UserGroup model = JsonUtility.GetObjectFromJson<UserGroup>(json);
            model.CreateTime = DateTime.Now;
            model.LastEditTime = DateTime.Now;
            model.CreateUserName = CurrentUser.UserName;
            model.LastEditUser = CurrentUser.UserName;
            int num = 0;
            num = UserInfoBll.Instance.UpdateUserGroup(model);
            var restResponse = new RestResponse() { Result = 1 };
            if (num > 0)
            {
                restResponse = new RestResponse() { Result = 1 };
            }
            else if (num == -2)
            {
                restResponse = new RestResponse() { Result = -2 };
            }
            else
            {
                restResponse = new RestResponse() { Result = -1 };
            }
            return ToJson(restResponse);
        }

        /// <summary>
        /// 获取树节点JSon
        /// </summary>
        /// <returns></returns>
        public JsonResult GetTree()
        {
            List<SystemMenu> menus = Bll.UserInfoBll.Instance.GetAllMenus();
            List<SystemMenu> parents = menus.Where(m => m.ParentId == 0 || m.ParentId == null).OrderBy(m => m.MenuId).ToList();
            List<EasyUITree> treeNodes = new List<EasyUITree>();
            if(parents.Any())
            {
                foreach(var model in parents)
                {
                    treeNodes.Add(getEasyTree(model, menus));
                }
            }
            return ToJson(treeNodes);
        }

        // <summary>
        /// 递归获取数据
        /// </summary>
        /// <param name="dep"></param>
        /// <returns></returns>
        public EasyUITree getEasyTree(SystemMenu menu, List<SystemMenu> allMenus)
        {
            //转换成Easyui数据
            EasyUITree model = new EasyUITree()
            {
                id = menu.MenuId,
                ischecked = true,
                state = "open",
                text = menu.MenuName
            };
            var list = allMenus.Where(m => m.ParentId == menu.MenuId).ToList();
            if (list.Count > 0)
            {
                model.children = new List<EasyUITree>();
                foreach (var item in list)
                {
                    //递归子节点
                    model.children.Add(getEasyTree(item, allMenus));
                }
            }

            return model;
        }


        //保存角色权限
        [HttpPost]
        public JsonResult SaveGroupPower(string json)
        {
            List<GroupPower> modelList = JsonUtility.GetObjectFromJson<List<GroupPower>>(json);
            UserInfoBll.Instance.SaveGroupPower(modelList);
            var restResponse = new RestResponse() { Result = 1 };
            return ToJson(restResponse);
        }

    }
}