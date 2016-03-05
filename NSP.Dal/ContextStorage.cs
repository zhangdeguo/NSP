using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace NSP.Dal
{
    internal static class ContextStorage
    {
        public static T GetData<T>(string name)
        {
            T obj = (T)CallContext.GetData(name);
            return obj;
        }

        public static void SetData<T>(string name, T data)
        {
            CallContext.SetData(name, data);
        }

        public static void ClearData(string name)
        {
            CallContext.FreeNamedDataSlot(name);
        }
    }
}
