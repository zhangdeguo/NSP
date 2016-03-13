using NSP.VerifyManager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace NSP.Common
{
    public class NSPBaseController : BaseController
    {
        protected JsonResult ToJson(object data)
        {
            return this.Json(data, null, JsonRequestBehavior.AllowGet);
        }
        protected override JsonResult Json(object data, string contentType, Encoding contentEncoding)
        {
            return new ToJsonResult()
            {
                Data = data,
                ContentEncoding = contentEncoding,
                ContentType = contentType
            };
        }
        protected override JsonResult Json(object data, string contentType, Encoding contentEncoding, JsonRequestBehavior behavior)
        {
            return new ToJsonResult()
            {
                Data = data,
                ContentEncoding = contentEncoding,
                ContentType = contentType,
                JsonRequestBehavior = behavior

            };
        }
    }
}