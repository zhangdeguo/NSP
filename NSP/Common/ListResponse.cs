using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NSP.Common
{
    public class ListResponse
    {
        public int total { get; set; }

        public object rows { get; set; }
    }
}