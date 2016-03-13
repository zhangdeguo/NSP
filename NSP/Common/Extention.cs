using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;

namespace NSP.Common
{
    public static class Extention
    {
        public static HttpResponseMessage ToJson(this object obj)
        {
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            HttpResponseMessage result = new HttpResponseMessage { Content = new StringContent(json, Encoding.GetEncoding("UTF-8"), "application/json") };
            return result;
        }

        public static string JoinBy(this IEnumerable<string> list, string SplitStr)
        {
            StringBuilder builder = new StringBuilder();
            if (list == null)
            {
                return "";
            }
            foreach (string str in list)
            {
                builder.Append(str + SplitStr);
            }
            if (builder.Length > 1)
            {
                builder.Length -= SplitStr.Length;
            }
            return builder.ToString();
        }
    }
}