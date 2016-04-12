using NSP.Bll;
using NSP.Common;
using NSP.Common.Utility;
using NSP.Model;
using NSP.Model.Public;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NSP.Controllers
{
    public class UserInfoController : NSPBaseController
    {
        //
        // GET: /UserInfo/
        public ActionResult List()
        {
            return View();
        }

        public ActionResult Edit(int userId)
        {
            if (userId > 0)
                ViewBag.Title = "修改用户";
            else
                ViewBag.Title = "添加用户";

            return View();
        }

        /// <summary>
        /// 获取用户列表
        /// </summary>
        /// <param name="json"></param>
        /// <returns></returns>
        public JsonResult GetList(string json)
        {
            var searchModel = JsonUtility.GetObjectFromJson<UserInfo>(json);
            var pageInfo = new PageInfo() { PageIndex = Convert.ToInt32(Request["page"]), PageSize = Convert.ToInt32(Request["rows"]) };
            int totalCount = 0;

            var list = UserInfoBll.Instance.Search(searchModel, pageInfo, out totalCount);
            var jsonResponse = new ListResponse() { rows = list, total = totalCount };
            return ToJson(jsonResponse);
        }

        //获取用户
        [HttpPost]
        public JsonResult GetUser(int userId)
        {
            var model = UserInfoBll.Instance.GetUser(userId);
            return ToJson(model);
        }

        //添加用户
        [HttpPost]
        public JsonResult AddUser(string json)
        {
            List<UserInfo> models = JsonUtility.GetObjectFromJson<List<Model.UserInfo>>(json);
            models[0].CreateTime = DateTime.Now;
            models[0].IsDelete = 0;
            models[0].LastModifyTime = DateTime.Now;

            int num = UserInfoBll.Instance.AddUser(models[0]);

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

        //修改用户
        [HttpPost]
        public JsonResult UpdateUser(string json)
        {
            List<UserInfo> modelList = JsonUtility.GetObjectFromJson<List<UserInfo>>(json);

            modelList[0].LastModifyTime = DateTime.Now;

            int num = UserInfoBll.Instance.UpdateUser(modelList[0]);

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

        //删除用户
        [HttpPost]
        public JsonResult DeleteUser(string userId)
        {
            int num = UserInfoBll.Instance.DeleteUser(Convert.ToInt32(userId));
            var restResponse = new RestResponse() { Result = 1 };

            if (num > 0)
                restResponse = new RestResponse() { Result = 1 };
            else
                restResponse = new RestResponse() { Result = -1 };
            return ToJson(restResponse);
        }
    }
}