//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace NSP.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class ViewUserPower
    {
        public int UserId { get; set; }
        public int MenuId { get; set; }
        public string MenuName { get; set; }
        public string MenuPath { get; set; }
        public string MenuType { get; set; }
        public Nullable<int> ParentId { get; set; }
        public string Description { get; set; }
    }
}