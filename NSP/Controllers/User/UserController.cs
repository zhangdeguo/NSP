using NSP.Bll;
using NSP.Common;
using NSP.Model.Extend;
using NSP.VerifyManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace NSP.Controllers.User
{
    public class UserController : BaseController
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
	}
}