using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSP.Common
{
    public class SingleInstanceBase<T> where T : SingleInstanceBase<T>, new()
    {
        private static object _locker = new object();
        private static T _instance;

        protected virtual void IniInstance()
        {
        }

        public static T Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_locker)
                    {
                        if (_instance == null)
                        {
                            T a = new T();
                            a.IniInstance();
                            _instance = a;
                        }
                    }
                }
                return _instance;
            }
        }
    }
}
