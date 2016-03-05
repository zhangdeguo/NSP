using NSP.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NSP.Bll
{
    public class BllBase<T> : SingleInstanceBase<T>
                where T : SingleInstanceBase<T>, new()
    {
    }
}
