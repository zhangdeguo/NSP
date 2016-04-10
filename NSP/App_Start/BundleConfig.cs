using System.Web;
using System.Web.Optimization;

namespace NSP
{
    public class BundleConfig
    {
        // 有关绑定的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                         "~/Content/js/My97DatePicker/WdatePicker.js",
                         "~/Content/js/Date.js",
                         "~/Content/js/storage.js",
                         "~/Content/js/jquery.pinyin.js",
                         "~/Content/js/jquery.prefer.js",
                         "~/Content/js/easyui135/plugins/jquery.menu.js",
                         "~/Content/js/easyui135/datagrid-groupview.js",
                         "~/Content/js/TypeExt.js",
                         "~/Content/js/Tools.js",
                         "~/Content/js/jquery.tags.js",
                         "~/Content/js/jquery.textbox.js",
                         "~/Content/js/jquery.cookie.js",
                          "~/Content/js/jquery.my97datebox.js",
                         "~/Content/js/jquery.dialogselector.js",
                         "~/Content/js/jquery.specification.js",
                         "~/Content/js/EasyuiExtend.js",
                         "~/Content/js/GridCellEditor.js",
                         "~/Content/js/WindowsUtility.js",
                         "~/Content/js/Valide.js",
                         "~/Content/js/Editor.js",
                         "~/Content/js/Core.js",
                         "~/Content/js/UIHelper.js",
                         "~/Content/js/GridFormat.js",
                         "~/Content/js/Comm.js",
                         "~/Content/js/jquery.input.outGrow.js",
                         "~/Content/js/jquery.readonly.js",
                         "~/Content/js/jquery.slidercustom.js",
                         "~/Content/js/jquery.slideViewerPro.1.5.js",
                         "~/Content/js/jquery.expandpic.js",
                         "~/Content/js/easyui135/locale/easyui-lang-zh_CN.js",
                         "~/Content/js/HelpLayer.js",
                         "~/Content/js/easyui-extend/extend/jquery.easyui.combo.extend.js",
                         "~/Content/js/easyui-extend/extend/jquery.easyui.combobox.extend.js",
                         "~/Content/js/easyui-extend/extend/jquery.easyui.validatebox.extend.js",
                         "~/Content/js/Autherity.js",
                         "~/Content/js/dragsort/jquery.dragsort-0.5.2.min.js"
                         ));

            //// 使用要用于开发和学习的 Modernizr 的开发版本。然后，当你做好
            //// 生产准备时，请使用 http://modernizr.com 上的生成工具来仅选择所需的测试。
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            //bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                        "~/Content/js/easyui135/themes/nettech/easyui.css",
                        "~/Content/js/easyui135/themes/icon.css",
                        "~/Content/js/easyui135/themes/nettech/textbox.css",
                        "~/Content/css/main.css",
                        "~/Content/css/SlideViewPro.css",
                        "~/Content/css/ExpandPic.css",
                        "~/Content/js/easyui-extend/extend/themes/easyui.extend.css",
                        "~/Content/js/easyui-extend/extend/themes/icon.css"
                        ));

        }
    }
}
