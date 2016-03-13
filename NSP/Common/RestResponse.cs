using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NSP.Common
{
    public class RestResponse
    {
        public int Result { get; set; }
        public string ErrorCode { get; set; }
        public string ErrorMsg { get; set; }
    }
}